import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
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
      
      // Address info (from DrawerWidget)
      address: formData.adres || formData.address || '',
      postalCode: formData.postcode || formData.postalCode || '',
      city: formData.woonplaats || formData.city || '',
      
      // Additional info
      existingFinancing: formData.existingFinancing || '',
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
    
    // Map revenue string to number
    const revenueToNumber = (revenue: string): number => {
      const revenueMap: Record<string, number> = {
        '0-50k': 25000,
        '50k-100k': 75000,
        '100k-250k': 175000,
        '250k-500k': 375000,
        '500k-1m': 750000,
        '1m+': 1500000,
      };
      return revenueMap[revenue] || 100000;
    };

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
      existingFinancing: normalizedData.existingFinancing,
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
    
    // Format data for Strapi (matching the schema)
    const strapiLeadData = {
      siteId: 'geldgeregeld',
      amount_requested_eur: parseFloat(normalizedData.amount) || 50000,
      expected_revenue_next_12m_eur: revenueToNumber(normalizedData.revenue),
      kvk_number: normalizedData.kvkNumber || undefined,
      company_name: normalizedData.companyName || `${normalizedData.firstName} ${normalizedData.lastName}`,
      use_of_funds: purposeToUseOfFunds[normalizedData.purpose] || 'overig',
      email: normalizedData.email || undefined,
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
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      leadId: `lead_${Date.now()}`
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
  
  const emailSubject = `Nieuwe financieringsaanvraag: ${leadData.companyName || 'Onbekend bedrijf'}`;
  
  const emailHtml = `
    <h2>Nieuwe financieringsaanvraag ontvangen</h2>
    
    <h3>Contactgegevens</h3>
    <p><strong>Naam:</strong> ${leadData.firstName || ''} ${leadData.lastName || ''}</p>
    <p><strong>E-mail:</strong> ${leadData.email || 'Niet opgegeven'}</p>
    <p><strong>Telefoon:</strong> ${leadData.phone || 'Niet opgegeven'}</p>
    
    <h3>Bedrijfsgegevens</h3>
    <p><strong>Bedrijfsnaam:</strong> ${leadData.companyName || 'Niet opgegeven'}</p>
    <p><strong>KvK nummer:</strong> ${leadData.kvkNumber || 'Niet opgegeven'}</p>
    <p><strong>Bedrijfstype:</strong> ${leadData.businessType || 'Niet opgegeven'}</p>
    <p><strong>Bedrijfsgrootte:</strong> ${leadData.businessSize || 'Niet opgegeven'}</p>
    <p><strong>Omzet:</strong> ${leadData.revenue || 'Niet opgegeven'}</p>
    
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
Nieuwe financieringsaanvraag ontvangen

CONTACTGEGEVENS
Naam: ${leadData.firstName || ''} ${leadData.lastName || ''}
E-mail: ${leadData.email || 'Niet opgegeven'}
Telefoon: ${leadData.phone || 'Niet opgegeven'}

BEDRIJFSGEGEVENS
Bedrijfsnaam: ${leadData.companyName || 'Niet opgegeven'}
KvK nummer: ${leadData.kvkNumber || 'Niet opgegeven'}
Bedrijfstype: ${leadData.businessType || 'Niet opgegeven'}
Bedrijfsgrootte: ${leadData.businessSize || 'Niet opgegeven'}
Omzet: ${leadData.revenue || 'Niet opgegeven'}

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
