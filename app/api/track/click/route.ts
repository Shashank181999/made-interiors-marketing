import { NextRequest, NextResponse } from 'next/server';

// Track link clicks in emails
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('lid');
  const campaignId = searchParams.get('cid');
  const targetUrl = searchParams.get('url');

  if (leadId) {
    console.log('Link clicked:', { leadId, campaignId, targetUrl, timestamp: new Date().toISOString() });

    // In production, update the database:
    // await supabase.from('email_logs').update({
    //   clicked_at: new Date().toISOString(),
    //   status: 'clicked'
    // }).match({ lead_id: leadId, campaign_id: campaignId });
    //
    // await supabase.from('leads').update({
    //   status: 'clicked',
    //   updated_at: new Date().toISOString()
    // }).match({ id: leadId });
  }

  // Redirect to target URL
  if (targetUrl) {
    return NextResponse.redirect(targetUrl);
  }

  // Fallback to website
  return NextResponse.redirect('https://madeinteriorsdemo.web.app');
}
