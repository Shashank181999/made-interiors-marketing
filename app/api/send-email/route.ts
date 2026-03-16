import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/auth';
import { defaultTemplates } from '@/lib/templates';

// Email sending endpoint (requires authentication)
export async function POST(request: NextRequest) {
  // Validate API key - email sending requires authentication
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    const body = await request.json();
    const { leadId, leadEmail, leadName, leadCompany, templateId, campaignId } = body;

    // Validate required fields
    if (!leadEmail) {
      return NextResponse.json(
        { success: false, error: 'Lead email is required' },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find template
    const template = defaultTemplates.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 400 });
    }

    // Personalize template
    let html = template.body
      .replace(/\{\{name\}\}/g, leadName?.split(' ')[0] || 'there')
      .replace(/\{\{full_name\}\}/g, leadName || 'there')
      .replace(/\{\{company\}\}/g, leadCompany || 'your company');

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (resendApiKey && fromEmail) {
      // Production mode - send real email via Resend
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: leadEmail,
          subject: template.subject,
          html: html,
        });

        if (error) {
          console.error('Resend error:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to send email' },
            { status: 500 }
          );
        }

        console.log('Email sent successfully:', { to: leadEmail, messageId: data?.id });

        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          details: {
            to: leadEmail,
            subject: template.subject,
            template: template.name,
            messageId: data?.id,
          },
        });
      } catch (sendError: any) {
        console.error('Email send error:', sendError);
        return NextResponse.json(
          { success: false, error: sendError.message },
          { status: 500 }
        );
      }
    }

    // Demo mode - just log the email
    console.log('=== EMAIL WOULD BE SENT (Demo Mode) ===');
    console.log('To:', leadEmail);
    console.log('Subject:', template.subject);
    console.log('Template:', template.name);
    console.log('=====================================');

    return NextResponse.json({
      success: true,
      message: 'Email queued (demo mode - configure RESEND_API_KEY for real sending)',
      details: {
        to: leadEmail,
        subject: template.subject,
        template: template.name,
      },
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
