import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  leadId?: string;
  campaignId?: string;
}

export async function sendEmail({ to, subject, html, leadId, campaignId }: SendEmailParams) {
  try {
    // Add tracking pixel for open tracking
    const trackingPixel = leadId
      ? `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/track/open?lid=${leadId}&cid=${campaignId || ''}" width="1" height="1" style="display:none" />`
      : '';

    // Add click tracking to links
    const trackedHtml = html.replace(
      /href="([^"]+)"/g,
      (match, url) => {
        if (leadId && !url.includes('/api/track')) {
          const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/track/click?lid=${leadId}&cid=${campaignId || ''}&url=${encodeURIComponent(url)}`;
          return `href="${trackUrl}"`;
        }
        return match;
      }
    );

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Made Interiors <marketing@madeinteriors.ae>',
      to: [to],
      subject: subject,
      html: trackedHtml + trackingPixel,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Email send exception:', error);
    return { success: false, error: error.message };
  }
}

export function personalizeTemplate(template: string, lead: { name: string; company?: string }) {
  return template
    .replace(/\{\{name\}\}/g, lead.name.split(' ')[0])
    .replace(/\{\{full_name\}\}/g, lead.name)
    .replace(/\{\{company\}\}/g, lead.company || 'your company');
}
