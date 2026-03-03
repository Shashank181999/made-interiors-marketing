import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const results: Record<string, any> = {};

    // 1. Delete old email logs (older than 90 days)
    if (action === 'all' || action === 'email_logs') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data, error } = await supabaseAdmin
        .from('email_logs')
        .delete()
        .lt('sent_at', ninetyDaysAgo.toISOString())
        .select('id');

      results.email_logs_deleted = data?.length || 0;
      if (error) results.email_logs_error = error.message;
    }

    // 2. Remove duplicate leads (same email, keep newest)
    if (action === 'all' || action === 'duplicates') {
      const { data: allLeads } = await supabaseAdmin
        .from('leads')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (allLeads) {
        const seenEmails = new Set<string>();
        const duplicateIds: string[] = [];

        for (const lead of allLeads) {
          const emailLower = lead.email.toLowerCase();
          if (seenEmails.has(emailLower)) {
            duplicateIds.push(lead.id);
          } else {
            seenEmails.add(emailLower);
          }
        }

        if (duplicateIds.length > 0) {
          await supabaseAdmin
            .from('leads')
            .delete()
            .in('id', duplicateIds);
        }

        results.duplicates_removed = duplicateIds.length;
      }
    }

    // 3. Delete cold leads older than 180 days (6 months)
    if (action === 'all' || action === 'cold_leads') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

      const { data, error } = await supabaseAdmin
        .from('leads')
        .delete()
        .eq('status', 'cold')
        .lt('updated_at', sixMonthsAgo.toISOString())
        .select('id');

      results.cold_leads_deleted = data?.length || 0;
      if (error) results.cold_leads_error = error.message;
    }

    // 4. Clean up failed/bounced email logs older than 30 days
    if (action === 'all' || action === 'failed_emails') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabaseAdmin
        .from('email_logs')
        .delete()
        .in('status', ['failed', 'bounced'])
        .lt('sent_at', thirtyDaysAgo.toISOString())
        .select('id');

      results.failed_emails_deleted = data?.length || 0;
      if (error) results.failed_emails_error = error.message;
    }

    // 5. Delete completed campaigns older than 1 year
    if (action === 'all' || action === 'old_campaigns') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabaseAdmin
        .from('campaigns')
        .delete()
        .eq('status', 'completed')
        .lt('created_at', oneYearAgo.toISOString())
        .select('id');

      results.old_campaigns_deleted = data?.length || 0;
      if (error) results.old_campaigns_error = error.message;
    }

    return NextResponse.json({
      success: true,
      message: 'Data optimization completed',
      results
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Check current data usage
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    // Get counts for each table
    const [leads, emailLogs, campaigns] = await Promise.all([
      supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('email_logs').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('campaigns').select('id', { count: 'exact', head: true }),
    ]);

    // Get cold leads count
    const coldLeads = await supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'cold');

    // Get duplicate email count
    const { data: allLeads } = await supabaseAdmin
      .from('leads')
      .select('email');

    const emails = allLeads?.map(l => l.email.toLowerCase()) || [];
    const duplicateCount = emails.length - new Set(emails).size;

    // Estimate storage (rough calculation)
    const estimatedBytes =
      (leads.count || 0) * 500 +      // ~500 bytes per lead
      (emailLogs.count || 0) * 300 +  // ~300 bytes per email log
      (campaigns.count || 0) * 400;   // ~400 bytes per campaign

    const estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(2);

    return NextResponse.json({
      counts: {
        leads: leads.count || 0,
        email_logs: emailLogs.count || 0,
        campaigns: campaigns.count || 0,
        cold_leads: coldLeads.count || 0,
        duplicate_leads: duplicateCount,
      },
      estimated_storage_mb: estimatedMB,
      free_limit_mb: 500,
      usage_percent: ((parseFloat(estimatedMB) / 500) * 100).toFixed(2) + '%'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
