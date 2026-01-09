import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
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
    const hasCompanyOrName = !!(normalizedData.companyName || (normalizedData.firstName && normalizedData.lastName));
    
    if (!hasEmail || !hasCompanyOrName) {
      return NextResponse.json(
        { error: 'Missing required fields', 
          details: !hasEmail ? 'Email is required' : 'Company name or full name is required' },
        { status: 400 }
      );
    }
    
    // Format the lead data for Strapi and email
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
      
      // Metadata
      submittedAt: new Date().toISOString(),
      source: formData.source || 'interactive_form',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    };
    
    // Send to Strapi CMS
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_TOKEN;
    
    if (strapiUrl && strapiToken) {
      try {
        const strapiResponse = await fetch(`${strapiUrl}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${strapiToken}`
          },
          body: JSON.stringify({ data: leadData })
        });
        
        if (!strapiResponse.ok) {
          console.error('Strapi submission failed:', await strapiResponse.text());
        }
      } catch (error) {
        console.error('Error submitting to Strapi:', error);
      }
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
      purpose: leadData.purpose
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
    console.warn('Resend not configured, skipping email notification');
    return;
  }

  // Get contact email from Strapi
  const { getSiteContactInfo } = await import('@/lib/get-site-contact-info');
  const contactInfo = await getSiteContactInfo();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@geldgeregeld.nl';
  const toEmails = [contactInfo.email, 'jan.dijkerman@icloud.com'];
  
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
    
    <hr>
    <p style="color: #666; font-size: 12px;">
      <strong>Metadata:</strong><br>
      Verzonden op: ${new Date().toLocaleString('nl-NL')}<br>
      Bron: ${leadData.source || 'interactive_form'}<br>
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
Metadata:
Verzonden op: ${new Date().toLocaleString('nl-NL')}
Bron: ${leadData.source || 'interactive_form'}
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
  } catch (error) {
    console.error('Error sending lead notification emails:', error);
    throw error;
  }
}
