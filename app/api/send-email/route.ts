import { NextRequest, NextResponse } from 'next/server';
import { defaultTemplates } from '@/lib/templates';

// Demo email sending (replace with Resend in production)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, leadEmail, leadName, leadCompany, templateId, campaignId } = body;

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

    // In demo mode, just log the email
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', leadEmail);
    console.log('Subject:', template.subject);
    console.log('Template:', template.name);
    console.log('===========================');

    // In production, use Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL,
    //   to: leadEmail,
    //   subject: template.subject,
    //   html: html,
    // });

    return NextResponse.json({
      success: true,
      message: 'Email queued (demo mode)',
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
