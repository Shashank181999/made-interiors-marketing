import { NextRequest, NextResponse } from 'next/server';

// Tracking pixel for email opens
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('lid');
  const campaignId = searchParams.get('cid');

  if (leadId) {
    console.log('Email opened:', { leadId, campaignId, timestamp: new Date().toISOString() });

    // In production, update the database:
    // await supabase.from('email_logs').update({
    //   opened_at: new Date().toISOString(),
    //   status: 'opened'
    // }).match({ lead_id: leadId, campaign_id: campaignId });
    //
    // await supabase.from('leads').update({
    //   status: 'opened',
    //   updated_at: new Date().toISOString()
    // }).match({ id: leadId });
  }

  // Return 1x1 transparent pixel
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
