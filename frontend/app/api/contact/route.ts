import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildConfirmationEmailHtml, buildInternalEmailHtml } from '@/lib/email-templates';

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
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Send email using Resend
    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }
    
    // IMPORTANT: The domain must be verified in Resend at https://resend.com/domains
    // Go to https://resend.com/domains and add geldgeregeld.nl, then add the required DNS records
    const fromEmail = (process.env.RESEND_FROM_EMAIL || 'noreply@geldgeregeld.nl').trim();
    
    // Always send to info@geldgeregeld.nl as the primary business email
    const toEmail = (process.env.CONTACT_EMAIL || 'info@geldgeregeld.nl').trim();
    
    try {
      const contactBodyHtml = `
        <h2 style="margin:0 0 20px;font-size:20px;color:#1e2021;">Nieuw contactformulier bericht</h2>
        <p style="margin:0 0 16px;"><strong>Van:</strong> ${formData.name}</p>
        <p style="margin:0 0 16px;"><strong>E-mail:</strong> <a href="mailto:${formData.email}" style="color:#00c800;text-decoration:underline;">${formData.email}</a></p>
        ${formData.phone ? `<p style="margin:0 0 16px;"><strong>Telefoon:</strong> ${formData.phone}</p>` : ''}
        <p style="margin:0 0 16px;"><strong>Onderwerp:</strong> ${formData.subject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Bericht:</strong></p>
        <p style="margin:0;">${formData.message.replace(/\n/g, '<br>')}</p>
      `;
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: formData.email,
        subject: `Contactformulier: ${formData.subject}`,
        html: buildInternalEmailHtml({ body: contactBodyHtml }),
        text: `
Nieuw contactformulier bericht

Van: ${formData.name}
E-mail: ${formData.email}
${formData.phone ? `Telefoon: ${formData.phone}` : ''}
Onderwerp: ${formData.subject}

Bericht:
${formData.message}
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }

      // Optionally send a confirmation email to the user
      try {
        const html = buildConfirmationEmailHtml({
          greeting: `Beste ${formData.name},`,
          body: '<p style="margin:0 0 16px;">We hebben uw bericht ontvangen en nemen zo spoedig mogelijk contact met u op.</p>',
          footerNote: 'Dit is een automatische bevestiging. U hoeft niet te reageren.',
        });
        await resend.emails.send({
          from: fromEmail,
          to: [formData.email],
          subject: 'Bedankt voor uw bericht - GeldGeregeld',
          html,
          text: `
Bedankt voor uw bericht

Beste ${formData.name},

We hebben uw bericht ontvangen en nemen zo spoedig mogelijk contact met u op.

Met vriendelijke groet,
Het team van GeldGeregeld
          `,
        });
      } catch (confirmationError) {
        // Log but don't fail the request if confirmation email fails
        console.error('Failed to send confirmation email:', confirmationError);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        emailId: data?.id
      });
      
    } catch (resendError: any) {
      console.error('Resend API error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send email', details: resendError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

