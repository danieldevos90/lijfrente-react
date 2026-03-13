import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHash } from 'crypto';
import { getSiteContactInfo } from '@/lib/get-site-contact-info';

type RateState = { count: number; resetAt: number };
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // best-effort (serverless warm state only)
const rateLimitState = new Map<string, RateState>();

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for') || '';
  const first = xff.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip') || 'unknown';
}

function getCookieFromHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  const kv = parts.find((p) => p.startsWith(name + '='));
  if (!kv) return null;
  const v = kv.split('=').slice(1).join('=');
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function normalizeAndHashEmail(email: string | undefined): string | undefined {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
}

function normalizeAndHashPhone(phone: string | undefined): string | undefined {
  const normalized = String(phone || '').replace(/[^\d]/g, '');
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
}

function normalizeAndHashExternalId(id: string | undefined): string | undefined {
  const normalized = String(id || '').trim();
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
}

function getMetaPixelIds(): string[] {
  const value = process.env.META_PIXEL_IDS || process.env.NEXT_PUBLIC_META_PIXEL_IDS || '';
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function sendMetaConversionsLeadEvent(
  request: NextRequest,
  payload: {
    eventId?: string;
    eventName?: string;
    email?: string;
    phone?: string;
    amount?: string;
    source?: string;
    leadQuality?: 'warm' | 'koud';
    ip: string;
    attribution?: any;
  }
): Promise<void> {
  const accessToken = process.env.META_PIXEL?.trim();
  const pixelIds = getMetaPixelIds();
  if (!accessToken || pixelIds.length === 0) return;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.geldgeregeld.nl').trim();

  const fbp = getCookieFromHeader(request.headers.get('cookie'), '_fbp') || undefined;
  const cookieFbc = getCookieFromHeader(request.headers.get('cookie'), '_fbc') || undefined;
  const fbclid = payload.attribution?.last?.fbclid || payload.attribution?.first?.fbclid || undefined;
  const sessionId = getCookieFromHeader(request.headers.get('cookie'), 'gg_session_id') || undefined;
  const fbc = cookieFbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
  const userAgent = request.headers.get('user-agent') || 'server-side-unknown';
  const referer = request.headers.get('referer') || baseUrl;

  const rawValue = Number(payload.amount);
  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = payload.eventId || `lead_${Date.now()}`;
  const eventName = payload.eventName || 'Lead';
  const isWarm = payload.leadQuality === 'warm';

  const userData = {
    em: normalizeAndHashEmail(payload.email),
    ph: normalizeAndHashPhone(payload.phone),
    client_ip_address: payload.ip !== 'unknown' ? payload.ip : undefined,
    client_user_agent: userAgent,
    fbp,
    fbc,
    external_id: normalizeAndHashExternalId(sessionId || undefined),
  };

  const events: Array<Record<string, any>> = [
    {
      event_name: eventName,
      event_time: eventTime,
      event_id: eventId,
      action_source: 'website',
      event_source_url: referer,
      user_data: userData,
      custom_data: {
        currency: 'EUR',
        value: Number.isFinite(rawValue) ? rawValue : undefined,
        content_name: payload.source || 'lead_submission',
        lead_quality: payload.leadQuality || 'onbekend',
      },
    },
  ];

  // Fire a second QualifiedLead event for warm leads so Meta can optimize campaigns on it
  if (isWarm) {
    events.push({
      event_name: 'QualifiedLead',
      event_time: eventTime,
      event_id: `${eventId}_qualified`,
      action_source: 'website',
      event_source_url: referer,
      user_data: userData,
      custom_data: {
        currency: 'EUR',
        value: Number.isFinite(rawValue) ? rawValue : undefined,
        content_name: payload.source || 'lead_submission',
        lead_quality: 'warm',
      },
    });
  }

  const body = {
    data: events,
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  await Promise.all(
    pixelIds.map(async (pixelId) => {
      const response = await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`Meta CAPI lead event failed for pixel ${pixelId}:`, response.status, errorText);
      }
    })
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const existing = rateLimitState.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitState.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  rateLimitState.set(key, existing);
  return existing.count > RATE_LIMIT_MAX;
}

// Initialize Resend only if API key is available
// Note: Trim to handle any whitespace/newline issues from env vars
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const sessionId = getCookieFromHeader(request.headers.get('cookie'), 'gg_session_id');
    const limiterKey = `${ip}:${sessionId || request.headers.get('user-agent') || 'ua'}`;
    if (isRateLimited(limiterKey)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await request.json();
    const attribution = formData?.attribution;
    const partner =
      formData?.partner ||
      attribution?.last?.partner ||
      attribution?.first?.partner ||
      undefined;

    // Honeypot field: if present, treat as bot and short-circuit with success
    // (avoid giving bots an oracle, and avoid spamming inbox/CRM).
    if (typeof formData?.website === 'string' && formData.website.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'OK' }, { status: 200 });
    }
    
    // Normalize form data - handle both DrawerWidget format (Dutch) and InteractiveLeadForm format (English)
    const normalizedData = {
      // Contact info - handle both formats
      firstName: formData.firstName || formData.voornaam || '',
      lastName: formData.lastName || formData.achternaam || '',
      email: formData.email || '',
      phone: formData.phone || formData.telefoonnummer || '',
      
      // Company details - handle both formats
      companyName: formData.companyName || formData.bedrijfsnaam || '',
      kvkNumber: formData.kvkNumber || formData.kvkNummer || '',
      businessType: formData.businessType || '',
      businessSize: formData.businessSize || '',
      businessActivities: formData.bedrijfsactiviteiten || '',
      
      // Financial info
      amount: formData.amount === 'custom' ? formData.amountRange : (formData.amount || formData.gewenstBedrag || ''),
      purpose: formData.purpose || formData.bestedingsdoel || '',
      urgency: formData.urgency || '',
      revenue: formData.revenue || '',
      
      // Qualifying fields (Floryn criteria)
      businessAge: formData.businessAge || '',
      isProfitable: formData.isProfitable || '',
      existingFinancing: formData.existingFinancing || '',
      
      // Address info (from DrawerWidget)
      address: formData.adres || formData.address || '',
      postalCode: formData.postcode || formData.postalCode || '',
      city: formData.woonplaats || formData.city || '',
      
      // Additional info
      additionalInfo: formData.additionalInfo || '',
    };
    
    // Validate required fields (at minimum we need email and company name or name)
    const hasEmail = !!normalizedData.email;
    const hasPhone = !!normalizedData.phone;
    const hasCompanyOrName = !!(normalizedData.companyName || (normalizedData.firstName && normalizedData.lastName));
    
    if ((!hasEmail && !hasPhone) || !hasCompanyOrName) {
      return NextResponse.json(
        { error: 'Missing required fields', 
          details: (!hasEmail && !hasPhone) ? 'Email or phone is required' : 'Company name or full name is required' },
        { status: 400 }
      );
    }
    
    // Map purpose to Strapi use_of_funds enum
    const purposeToUseOfFunds: Record<string, string> = {
      'werkkapitaal': 'werkkapitaal',
      'uitbreiding': 'voorraden_en_crediteuren',
      'inventaris': 'inventaris_en_software',
      'vastgoed': 'bedrijfspand_financieren',
      'vastgoed_krediet': 'vastgoed_krediet',
      'tweede_rang': 'tweede_rang',
      'voorraad': 'voorraden_en_crediteuren',
      'overbrugging': 'werkkapitaal',
      'personeel': 'meer_personeel',
      'voertuigen': 'voertuigen_en_machines',
      'machines': 'voertuigen_en_machines',
      'software': 'inventaris_en_software',
      'overname': 'overnamefinanciering',
      'herfinanciering': 'herfinanciering',
      'factoring': 'factoring',
    };
    
    // Map monthly revenue string to annualized number for Strapi
    const revenueToNumber = (revenue: string): number => {
      const revenueMap: Record<string, number> = {
        // New monthly ranges (annualized: monthly * 12)
        '0-10k': 60000,
        '10k-25k': 210000,
        '25k-50k': 450000,
        '50k-100k': 900000,
        '100k-250k': 2100000,
        '250k+': 3600000,
        // Legacy annual ranges (backward compat, non-overlapping keys only)
        '0-50k': 25000,
        '250k-500k': 375000,
        '500k-1m': 750000,
        '1m+': 1500000,
      };
      return revenueMap[revenue] || 100000;
    };

    // Compute lead quality based on Floryn qualifying criteria
    const computeLeadQuality = (): 'warm' | 'koud' => {
      let score = 0;
      const age = normalizedData.businessAge;
      if (age === '2_5' || age === '5_10' || age === '10_plus') score++;
      if (normalizedData.isProfitable === 'ja') score++;
      const rev = normalizedData.revenue;
      if (rev && rev !== '0-10k' && rev !== '0-50k') score++;
      const amt = parseFloat(normalizedData.amount) || 0;
      if (amt >= 10000 && amt <= 2500000) score++;
      return score >= 3 ? 'warm' : 'koud';
    };
    const leadQuality = computeLeadQuality();

    // Format the lead data for email notifications (full data)
    const leadData = {
      // Basic info
      amount: normalizedData.amount,
      businessType: normalizedData.businessType,
      businessSize: normalizedData.businessSize,
      purpose: normalizedData.purpose,
      urgency: normalizedData.urgency,
      
      // Company details
      companyName: normalizedData.companyName,
      kvkNumber: normalizedData.kvkNumber,
      revenue: normalizedData.revenue,
      businessActivities: normalizedData.businessActivities,
      
      // Qualifying fields
      businessAge: normalizedData.businessAge,
      isProfitable: normalizedData.isProfitable,
      existingFinancing: normalizedData.existingFinancing,
      leadQuality,
      
      // Contact info
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
      phone: normalizedData.phone,
      
      // Address
      address: normalizedData.address,
      postalCode: normalizedData.postalCode,
      city: normalizedData.city,
      
      // Additional info
      additionalInfo: normalizedData.additionalInfo,

      // Attribution (non-PII): utm/gclid/partner + landing/referrer
      partner: partner,
      attribution: attribution || undefined,
      
      // Metadata
      submittedAt: new Date().toISOString(),
      source: formData.source || 'interactive_form',
      userAgent: request.headers.get('user-agent'),
      ip: ip,
      referer: request.headers.get('referer') || undefined,
      country: request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || undefined,
    };
    
    // Format data for Strapi (matching the expanded schema)
    const strapiLeadData = {
      siteId: 'geldgeregeld',
      amount_requested_eur: parseFloat(normalizedData.amount) || 50000,
      expected_revenue_next_12m_eur: revenueToNumber(normalizedData.revenue),
      kvk_number: normalizedData.kvkNumber || undefined,
      company_name: normalizedData.companyName || `${normalizedData.firstName} ${normalizedData.lastName}`,
      use_of_funds: purposeToUseOfFunds[normalizedData.purpose] || 'overig',
      email: normalizedData.email || undefined,
      firstName: normalizedData.firstName || undefined,
      lastName: normalizedData.lastName || undefined,
      phone: normalizedData.phone || undefined,
      business_type: normalizedData.businessType || undefined,
      business_age_years: normalizedData.businessAge || undefined,
      is_profitable: normalizedData.isProfitable === 'ja' ? true : normalizedData.isProfitable === 'nee' ? false : undefined,
      has_existing_financing: normalizedData.existingFinancing || undefined,
      urgency: normalizedData.urgency || undefined,
      lead_quality: leadQuality,
      source: formData.source || 'interactive_form',
      sector: formData.sector || undefined,
      partner: partner || undefined,
    };
    
    // Send to Strapi CMS (trim to handle any whitespace/newline issues)
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
    
    if (strapiUrl) {
      try {
        console.log('Submitting lead to Strapi:', { url: `${strapiUrl}/api/leads`, data: strapiLeadData });
        
        // Leads endpoint has public create enabled in Strapi - no auth token needed
        const strapiResponse = await fetch(`${strapiUrl}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: strapiLeadData })
        });
        
        if (!strapiResponse.ok) {
          const errorText = await strapiResponse.text();
          console.error('Strapi lead submission failed:', strapiResponse.status, errorText);
        } else {
          console.log('Strapi lead submission successful');
        }
      } catch (error) {
        console.error('Error submitting to Strapi:', error);
      }
    } else {
      console.warn('Strapi URL not configured');
    }
    
    // Send email notification (you can integrate with your email service)
    try {
      await sendEmailNotification(leadData);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
    
    // Track conversion event
    console.log('Lead submitted:', {
      email: leadData.email,
      amount: leadData.amount,
      company: leadData.companyName,
      purpose: leadData.purpose,
      source: leadData.source,
      partner: leadData.partner,
    });

    await sendMetaConversionsLeadEvent(request, {
      eventId: String(formData?.meta_event_id || ''),
      eventName: 'Lead',
      email: normalizedData.email || undefined,
      phone: normalizedData.phone || undefined,
      amount: normalizedData.amount || undefined,
      source: String(formData?.source || 'interactive_form'),
      leadQuality,
      ip,
      attribution,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      leadId: `lead_${Date.now()}`,
      leadQuality,
    });
    
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(leadData: any) {
  const resend = getResend();
  if (!resend) {
    console.warn('Resend not configured (RESEND_API_KEY missing), skipping email notification');
    return;
  }
  console.log('Sending lead notification email via Resend...');

  const attr = leadData?.attribution;
  const first = attr?.first;
  const last = attr?.last;
  const partner = leadData?.partner || last?.partner || first?.partner;

  const formatTouchHtml = (label: string, touch: any) => {
    if (!touch) return '';
    const parts: string[] = [];
    if (touch.path) parts.push(`<strong>${label} pagina:</strong> ${touch.path}`);
    if (touch.referrer) parts.push(`<strong>${label} referrer:</strong> ${touch.referrer}`);
    const utm = [
      touch.utm_source && `utm_source=${touch.utm_source}`,
      touch.utm_medium && `utm_medium=${touch.utm_medium}`,
      touch.utm_campaign && `utm_campaign=${touch.utm_campaign}`,
      touch.utm_term && `utm_term=${touch.utm_term}`,
      touch.utm_content && `utm_content=${touch.utm_content}`,
    ].filter(Boolean);
    if (utm.length) parts.push(`<strong>${label} UTM:</strong> ${utm.join(' · ')}`);
    const clicks = [
      touch.gclid && `gclid=${touch.gclid}`,
      touch.msclkid && `msclkid=${touch.msclkid}`,
      touch.fbclid && `fbclid=${touch.fbclid}`,
      touch.partner && `partner=${touch.partner}`,
    ].filter(Boolean);
    if (clicks.length) parts.push(`<strong>${label} click:</strong> ${clicks.join(' · ')}`);
    return parts.map((p) => `<p>${p}</p>`).join('');
  };

  const formatTouchText = (label: string, touch: any) => {
    if (!touch) return '';
    const lines: string[] = [];
    if (touch.path) lines.push(`${label} pagina: ${touch.path}`);
    if (touch.referrer) lines.push(`${label} referrer: ${touch.referrer}`);
    const utm = [
      touch.utm_source && `utm_source=${touch.utm_source}`,
      touch.utm_medium && `utm_medium=${touch.utm_medium}`,
      touch.utm_campaign && `utm_campaign=${touch.utm_campaign}`,
      touch.utm_term && `utm_term=${touch.utm_term}`,
      touch.utm_content && `utm_content=${touch.utm_content}`,
    ].filter(Boolean);
    if (utm.length) lines.push(`${label} UTM: ${utm.join(' · ')}`);
    const clicks = [
      touch.gclid && `gclid=${touch.gclid}`,
      touch.msclkid && `msclkid=${touch.msclkid}`,
      touch.fbclid && `fbclid=${touch.fbclid}`,
      touch.partner && `partner=${touch.partner}`,
    ].filter(Boolean);
    if (clicks.length) lines.push(`${label} click: ${clicks.join(' · ')}`);
    return lines.join('\n');
  };

  // IMPORTANT: The domain must be verified in Resend at https://resend.com/domains
  // Go to https://resend.com/domains and add geldgeregeld.nl, then add the required DNS records
  const fromEmail = (process.env.RESEND_FROM_EMAIL || 'noreply@geldgeregeld.nl').trim();
  
  // Always send to info@geldgeregeld.nl as the primary business email
  const toEmails = ['info@geldgeregeld.nl', 'jan.dijkerman@icloud.com'];
  
  const qualityTag = leadData.leadQuality === 'warm' ? '[WARM]' : '[KOUD]';
  const emailSubject = `${qualityTag} Financieringsaanvraag: ${leadData.companyName || 'Onbekend bedrijf'} · €${leadData.amount || '?'}`;

  const businessAgeLabels: Record<string, string> = { '0_2': '0-2 jaar', '2_5': '2-5 jaar', '5_10': '5-10 jaar', '10_plus': '10+ jaar' };
  
  const emailHtml = `
    <h2>${qualityTag} Nieuwe financieringsaanvraag ontvangen</h2>

    <div style="background: ${leadData.leadQuality === 'warm' ? '#e8f5e9' : '#fff3e0'}; border-left: 4px solid ${leadData.leadQuality === 'warm' ? '#4caf50' : '#ff9800'}; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
      <strong>Lead kwaliteit: ${leadData.leadQuality.toUpperCase()}</strong><br>
      ${leadData.isProfitable === 'ja' ? '✅' : '❌'} Winstgevend ·
      ${leadData.businessAge && leadData.businessAge !== '0_2' ? '✅' : '❌'} Bestaand bedrijf (${businessAgeLabels[leadData.businessAge] || '?'}) ·
      ${leadData.revenue && leadData.revenue !== '0-10k' && leadData.revenue !== '0-50k' ? '✅' : '❌'} Omzet past ·
      ${(parseFloat(leadData.amount) || 0) >= 10000 && (parseFloat(leadData.amount) || 0) <= 2500000 ? '✅' : '❌'} Bedrag in range
    </div>
    
    <h3>Contactgegevens</h3>
    <p><strong>Naam:</strong> ${leadData.firstName || ''} ${leadData.lastName || ''}</p>
    <p><strong>E-mail:</strong> ${leadData.email || 'Niet opgegeven'}</p>
    <p><strong>Telefoon:</strong> ${leadData.phone || 'Niet opgegeven'}</p>
    
    <h3>Bedrijfsgegevens</h3>
    <p><strong>Bedrijfsnaam:</strong> ${leadData.companyName || 'Niet opgegeven'}</p>
    <p><strong>KvK nummer:</strong> ${leadData.kvkNumber || 'Niet opgegeven'}</p>
    <p><strong>Rechtsvorm:</strong> ${leadData.businessType || 'Niet opgegeven'}</p>
    <p><strong>Bedrijfsgrootte:</strong> ${leadData.businessSize || 'Niet opgegeven'}</p>
    <p><strong>Leeftijd bedrijf:</strong> ${businessAgeLabels[leadData.businessAge] || 'Niet opgegeven'}</p>
    <p><strong>Winstgevend:</strong> ${leadData.isProfitable || 'Niet opgegeven'}</p>
    <p><strong>Maandelijkse omzet:</strong> ${leadData.revenue || 'Niet opgegeven'}</p>
    
    <h3>Financiering</h3>
    <p><strong>Gewenst bedrag:</strong> €${leadData.amount || 'Niet opgegeven'}</p>
    <p><strong>Bestedingsdoel:</strong> ${leadData.purpose || 'Niet opgegeven'}</p>
    <p><strong>Urgentie:</strong> ${leadData.urgency || 'Niet opgegeven'}</p>
    ${leadData.existingFinancing ? `<p><strong>Bestaande financiering:</strong> ${leadData.existingFinancing}</p>` : ''}
    
    ${leadData.additionalInfo ? `
    <h3>Aanvullende informatie</h3>
    <p>${leadData.additionalInfo.replace(/\n/g, '<br>')}</p>
    ` : ''}

    <h3>Attributie</h3>
    ${partner ? `<p><strong>Partner:</strong> ${partner}</p>` : '<p><em>Geen partner/tag</em></p>'}
    ${formatTouchHtml('First touch', first)}
    ${formatTouchHtml('Last touch', last)}
    
    <hr>
    <p style="color: #6c737a; font-size: 12px;">
      <strong>Metadata:</strong><br>
      Verzonden op: ${new Date().toLocaleString('nl-NL')}<br>
      Bron: ${leadData.source || 'interactive_form'}<br>
      ${leadData.country ? `Land: ${leadData.country}<br>` : ''}
      ${leadData.ip ? `IP-adres: ${leadData.ip}` : ''}
    </p>
  `;
  
  const emailText = `
${qualityTag} Nieuwe financieringsaanvraag ontvangen

LEAD KWALITEIT: ${leadData.leadQuality.toUpperCase()}
Winstgevend: ${leadData.isProfitable || '?'} | Bedrijfsleeftijd: ${businessAgeLabels[leadData.businessAge] || '?'} | Omzet: ${leadData.revenue || '?'}

CONTACTGEGEVENS
Naam: ${leadData.firstName || ''} ${leadData.lastName || ''}
E-mail: ${leadData.email || 'Niet opgegeven'}
Telefoon: ${leadData.phone || 'Niet opgegeven'}

BEDRIJFSGEGEVENS
Bedrijfsnaam: ${leadData.companyName || 'Niet opgegeven'}
KvK nummer: ${leadData.kvkNumber || 'Niet opgegeven'}
Rechtsvorm: ${leadData.businessType || 'Niet opgegeven'}
Bedrijfsgrootte: ${leadData.businessSize || 'Niet opgegeven'}
Leeftijd bedrijf: ${businessAgeLabels[leadData.businessAge] || 'Niet opgegeven'}
Winstgevend: ${leadData.isProfitable || 'Niet opgegeven'}
Maandelijkse omzet: ${leadData.revenue || 'Niet opgegeven'}

FINANCIERING
Gewenst bedrag: €${leadData.amount || 'Niet opgegeven'}
Bestedingsdoel: ${leadData.purpose || 'Niet opgegeven'}
Urgentie: ${leadData.urgency || 'Niet opgegeven'}
${leadData.existingFinancing ? `Bestaande financiering: ${leadData.existingFinancing}` : ''}

${leadData.additionalInfo ? `Aanvullende informatie:\n${leadData.additionalInfo}` : ''}

---
ATTRIBUTIE
Partner: ${partner || '-'}
${formatTouchText('First touch', first)}
${first ? '\n' : ''}${formatTouchText('Last touch', last)}

---
Metadata:
Verzonden op: ${new Date().toLocaleString('nl-NL')}
Bron: ${leadData.source || 'interactive_form'}
${leadData.country ? `Land: ${leadData.country}` : ''}
${leadData.ip ? `IP-adres: ${leadData.ip}` : ''}
  `;

  try {
    // Send to both email addresses
    const emailPromises = toEmails.map(toEmail => 
      resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: leadData.email || fromEmail,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      })
    );

    await Promise.all(emailPromises);
    console.log('Lead notification emails sent successfully');

    // Send a short confirmation email to the lead (best-effort).
    const leadEmail = String(leadData?.email || '').trim();
    if (leadEmail && leadEmail.includes('@')) {
      const contact = await getSiteContactInfo().catch(() => null);
      const businessPhone = String(contact?.phone || '085-0480881');
      const businessEmail = String(contact?.email || 'info@geldgeregeld.nl');
      const telHref = 'tel:' + businessPhone.replace(/[^0-9+]/g, '');

      await resend.emails.send({
        from: fromEmail,
        to: [leadEmail],
        subject: 'We hebben je aanvraag ontvangen (GeldGeregeld)',
        html: `
          <h2>Bedankt voor je aanvraag</h2>
          <p>We hebben je aanvraag ontvangen en nemen doorgaans binnen 24 uur contact met je op.</p>
          <p><strong>Sneller schakelen?</strong> Bel ons op <a href="${telHref}">${businessPhone}</a> of mail naar <a href="mailto:${businessEmail}">${businessEmail}</a>.</p>
          <hr/>
          <p style="color:#6c737a;font-size:12px">Dit is een automatische bevestiging. Je hoeft niet te reageren.</p>
        `,
        text: `Bedankt voor je aanvraag. We nemen binnen 24 uur contact met je op. Sneller schakelen? Bel ${businessPhone} of mail ${businessEmail}.`,
      });
    }
  } catch (error) {
    console.error('Error sending lead notification emails:', error);
    throw error;
  }
}
