import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isBackofficeAuthed, getStrapiConfig } from '@/lib/backoffice-auth';
import { buildConfirmationEmailHtml } from '@/lib/email-templates';
import { getSiteContactInfo } from '@/lib/get-site-contact-info';

type RouteContext = { params: Promise<{ documentId: string }> };

const STATUS_EMAIL_CONFIG: Record<
  string,
  { subject: string; bodyFn: (lead: any, contact: any) => string }
> = {
  in_behandeling: {
    subject: 'Je aanvraag is in behandeling',
    bodyFn: (lead, contact) => `
      <p style="margin:0 0 16px;">Goed nieuws! We zijn begonnen met het beoordelen van je financieringsaanvraag${lead.amount_requested_eur ? ` van <strong>€${Number(lead.amount_requested_eur).toLocaleString('nl-NL')}</strong>` : ''}.</p>
      <p style="margin:0 0 16px;">We streven ernaar je binnen <strong>2 werkdagen</strong> een eerste terugkoppeling te geven.</p>
      <p style="margin:0 0 16px;">Heb je in de tussentijd vragen? Neem gerust contact met ons op via <a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" style="color:#00c800;">${contact.phone}</a> of <a href="mailto:${contact.email}" style="color:#00c800;">${contact.email}</a>.</p>
    `,
  },
  afgekeurd: {
    subject: 'Update over je financieringsaanvraag',
    bodyFn: (lead, contact) => `
      <p style="margin:0 0 16px;">Bedankt voor je interesse in financiering via GeldGeregeld.</p>
      <p style="margin:0 0 16px;">Na zorgvuldige beoordeling van je aanvraag moeten we je helaas laten weten dat we op dit moment geen passende financieringsoplossing kunnen bieden.</p>
      <p style="margin:0 0 16px;">Dit kan te maken hebben met verschillende factoren. Mocht je situatie veranderen, dan ben je altijd welkom om opnieuw een aanvraag in te dienen.</p>
      <p style="margin:0 0 16px;">Heb je vragen over deze beslissing? Neem gerust contact met ons op via <a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" style="color:#00c800;">${contact.phone}</a> of <a href="mailto:${contact.email}" style="color:#00c800;">${contact.email}</a>.</p>
    `,
  },
  meer_info_nodig: {
    subject: 'Aanvullende informatie nodig voor je aanvraag',
    bodyFn: (lead, contact) => `
      <p style="margin:0 0 16px;">We zijn bezig met de beoordeling van je financieringsaanvraag en hebben aanvullende informatie nodig om verder te kunnen.</p>
      <p style="margin:0 0 16px;">Kun je de gevraagde documenten of informatie zo spoedig mogelijk naar ons mailen? Hoe sneller we alles hebben, hoe sneller we je aanvraag kunnen afhandelen.</p>
      <p style="margin:0 0 16px;">Stuur je reactie naar <a href="mailto:${contact.email}" style="color:#00c800;">${contact.email}</a> of bel ons op <a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" style="color:#00c800;">${contact.phone}</a>.</p>
    `,
  },
  contact_opnemen: {
    subject: 'We nemen binnenkort telefonisch contact op',
    bodyFn: (lead, contact) => `
      <p style="margin:0 0 16px;">We willen graag je financieringsaanvraag persoonlijk met je bespreken.</p>
      <p style="margin:0 0 16px;">Een van onze adviseurs neemt <strong>binnenkort telefonisch contact</strong> met je op${lead.phone ? ` op het nummer dat je hebt opgegeven` : ''}. Houd je telefoon in de gaten!</p>
      <p style="margin:0 0 16px;">Komt het even niet uit? Laat het ons weten via <a href="mailto:${contact.email}" style="color:#00c800;">${contact.email}</a> en we plannen een ander moment.</p>
    `,
  },
  afgehandeld: {
    subject: 'Je aanvraag is afgerond',
    bodyFn: (lead, contact) => `
      <p style="margin:0 0 16px;">Je financieringsaanvraag is volledig afgehandeld.</p>
      <p style="margin:0 0 16px;">Bedankt voor het vertrouwen in GeldGeregeld. Mocht je in de toekomst opnieuw financiering nodig hebben, dan staan we altijd voor je klaar.</p>
      <p style="margin:0 0 16px;">Vragen? Neem contact op via <a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" style="color:#00c800;">${contact.phone}</a> of <a href="mailto:${contact.email}" style="color:#00c800;">${contact.email}</a>.</p>
    `,
  },
};

export async function POST(request: NextRequest, context: RouteContext) {
  if (!(await isBackofficeAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentId } = await context.params;
  const body = await request.json();
  const { status, customMessage } = body as { status: string; customMessage?: string };

  const config = STATUS_EMAIL_CONFIG[status];
  if (!config) {
    return NextResponse.json({ error: `No email template for status: ${status}` }, { status: 400 });
  }

  const { url, token } = getStrapiConfig();
  if (!url) {
    return NextResponse.json({ error: 'Strapi not configured' }, { status: 500 });
  }

  // Fetch the lead from Strapi
  try {
    const leadRes = await fetch(`${url}/api/leads/${documentId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (!leadRes.ok) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const leadData = await leadRes.json();
    const lead = leadData.data;
    const email = lead.email;

    if (!email) {
      return NextResponse.json({ error: 'Lead has no email address' }, { status: 400 });
    }

    const contact = await getSiteContactInfo().catch(() => ({
      email: 'info@geldgeregeld.nl',
      phone: '085-0480881',
    }));

    const firstName = lead.firstName || lead.company_name?.split(' ')[0] || '';
    const greeting = firstName ? `Beste ${firstName},` : 'Beste,';

    let emailBody = config.bodyFn(lead, contact);
    if (customMessage) {
      emailBody += `<p style="margin:16px 0;padding:16px;background:#f9fafb;border-left:3px solid #00c800;border-radius:4px;">${customMessage.replace(/\n/g, '<br>')}</p>`;
    }

    const html = buildConfirmationEmailHtml({
      greeting,
      body: emailBody,
      heroImage: false,
    });

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const fromEmail = (process.env.RESEND_FROM_EMAIL || 'noreply@geldgeregeld.nl').trim();

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: config.subject,
      html,
    });

    // Try to update the lead status in Strapi (may fail if field doesn't exist yet)
    try {
      await fetch(`${url}/api/leads/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data: { status } }),
      });
    } catch {
      // Status field may not exist in Strapi Cloud yet — that's OK
    }

    return NextResponse.json({ success: true, emailSent: email });
  } catch (error) {
    console.error('Error sending status email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
