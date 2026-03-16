import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Track link clicks in emails
// This endpoint is intentionally public for email tracking to work
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('lid');
  const campaignId = searchParams.get('cid');
  const targetUrl = searchParams.get('url');

  // Validate lead ID format (basic UUID check)
  if (leadId && !/^[a-zA-Z0-9-]+$/.test(leadId)) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL || 'https://madeinteriors.ae');
  }

  if (leadId) {
    console.log('Link clicked:', { leadId, campaignId, timestamp: new Date().toISOString() });

    // Update database if configured
    if (isSupabaseConfigured()) {
      try {
        // Update email log
        if (campaignId) {
          await supabaseAdmin
            .from('email_logs')
            .update({
              clicked_at: new Date().toISOString(),
              status: 'clicked',
            })
            .match({ lead_id: leadId, campaign_id: campaignId });
        }

        // Update lead status
        await supabaseAdmin
          .from('leads')
          .update({
            status: 'clicked',
            updated_at: new Date().toISOString(),
          })
          .eq('id', leadId);
      } catch (error) {
        console.error('Track click error:', error);
      }
    }
  }

  // Validate and redirect to target URL
  if (targetUrl) {
    try {
      const url = new URL(targetUrl);
      // Only allow http/https protocols
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return NextResponse.redirect(targetUrl);
      }
    } catch {
      // Invalid URL, fall through to default
    }
  }

  // Fallback to website
  return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL || 'https://madeinteriors.ae');
}
