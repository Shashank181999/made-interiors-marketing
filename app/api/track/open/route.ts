import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Tracking pixel for email opens
// This endpoint is intentionally public for email tracking to work
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('lid');
  const campaignId = searchParams.get('cid');

  // Validate lead ID format (basic alphanumeric/UUID check)
  if (leadId && !/^[a-zA-Z0-9-]+$/.test(leadId)) {
    // Invalid lead ID - just return pixel without tracking
    return returnTrackingPixel();
  }

  if (leadId) {
    console.log('Email opened:', { leadId, campaignId, timestamp: new Date().toISOString() });

    // Update database if configured
    if (isSupabaseConfigured()) {
      try {
        // Update email log
        if (campaignId) {
          await supabaseAdmin
            .from('email_logs')
            .update({
              opened_at: new Date().toISOString(),
              status: 'opened',
            })
            .match({ lead_id: leadId, campaign_id: campaignId });
        }

        // Update lead status (only if not already clicked/replied)
        const { data: lead } = await supabaseAdmin
          .from('leads')
          .select('status')
          .eq('id', leadId)
          .single();

        if (lead && !['clicked', 'replied', 'converted'].includes(lead.status)) {
          await supabaseAdmin
            .from('leads')
            .update({
              status: 'opened',
              updated_at: new Date().toISOString(),
            })
            .eq('id', leadId);
        }
      } catch (error) {
        console.error('Track open error:', error);
      }
    }
  }

  return returnTrackingPixel();
}

// Return 1x1 transparent GIF
function returnTrackingPixel(): NextResponse {
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
