import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = ['amount', 'businessType', 'purpose', 'companyName', 'kvkNumber', 'firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }
    
    // Format the lead data
    const leadData = {
      // Basic info
      amount: formData.amount === 'custom' ? formData.amountRange : formData.amount,
      businessType: formData.businessType,
      businessSize: formData.businessSize,
      purpose: formData.purpose,
      urgency: formData.urgency,
      
      // Company details
      companyName: formData.companyName,
      kvkNumber: formData.kvkNumber,
      revenue: formData.revenue,
      
      // Contact info
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      
      // Additional info
      existingFinancing: formData.existingFinancing,
      additionalInfo: formData.additionalInfo,
      
      // Metadata
      submittedAt: new Date().toISOString(),
      source: 'interactive_form',
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
  // Integrate with your email service (SendGrid, Mailgun, etc.)
  // For now, just log the data
  console.log('Email notification would be sent for lead:', leadData.email);
  
  // Example email content
  const emailContent = `
    Nieuwe lead aanvraag ontvangen!
    
    Bedrijf: ${leadData.companyName}
    Contact: ${leadData.firstName} ${leadData.lastName}
    Email: ${leadData.email}
    Telefoon: ${leadData.phone}
    
    Financiering:
    - Bedrag: €${leadData.amount}
    - Doel: ${leadData.purpose}
    - Urgentie: ${leadData.urgency}
    
    Bedrijfsgegevens:
    - Type: ${leadData.businessType}
    - Grootte: ${leadData.businessSize}
    - KvK: ${leadData.kvkNumber}
    - Omzet: ${leadData.revenue}
    
    ${leadData.additionalInfo ? `Aanvullende info: ${leadData.additionalInfo}` : ''}
  `;
  
  // Here you would send the actual email
  // await emailService.send({
  //   to: 'leads@yourcompany.com',
  //   subject: `Nieuwe lead: ${leadData.companyName}`,
  //   text: emailContent
  // });
}
