import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@geldgeregeld.nl';
    const toEmail = process.env.CONTACT_EMAIL || 'info@geldgeregeld.nl';
    
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: formData.email,
        subject: `Contactformulier: ${formData.subject}`,
        html: `
          <h2>Nieuw contactformulier bericht</h2>
          <p><strong>Van:</strong> ${formData.name}</p>
          <p><strong>E-mail:</strong> ${formData.email}</p>
          ${formData.phone ? `<p><strong>Telefoon:</strong> ${formData.phone}</p>` : ''}
          <p><strong>Onderwerp:</strong> ${formData.subject}</p>
          <hr>
          <p><strong>Bericht:</strong></p>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        `,
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
        await resend.emails.send({
          from: fromEmail,
          to: [formData.email],
          subject: 'Bedankt voor uw bericht - GeldGeregeld',
          html: `
            <h2>Bedankt voor uw bericht</h2>
            <p>Beste ${formData.name},</p>
            <p>We hebben uw bericht ontvangen en nemen zo spoedig mogelijk contact met u op.</p>
            <p>Met vriendelijke groet,<br>Het team van GeldGeregeld</p>
          `,
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

