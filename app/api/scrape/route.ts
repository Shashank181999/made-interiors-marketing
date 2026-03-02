import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { runAllScrapers, scrapeGoogleMaps, scrapeInstagram, getAllLeads, getLeadsCount, SEARCH_CATEGORIES } from '@/lib/scraper';

// API endpoint to trigger lead scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { source, query, location, saveToDatabase = true } = body;

    let leads: any[] = [];
    let message = '';

    if (source === 'google_maps') {
      leads = await scrapeGoogleMaps(query || 'interior', location || 'Dubai');
      message = `Found ${leads.length} leads from Google Maps`;
    } else if (source === 'instagram') {
      leads = await scrapeInstagram(body.hashtags || []);
      message = `Found ${leads.length} leads from Instagram`;
    } else {
      // Run all scrapers - get all leads
      leads = getAllLeads();
      message = `Found ${leads.length} total leads from all sources`;
    }

    // Save leads to Supabase if configured
    let savedCount = 0;
    let skippedCount = 0;

    if (saveToDatabase && isSupabaseConfigured()) {
      for (const lead of leads) {
        if (lead.email) {
          // Check if lead already exists
          const { data: existing } = await supabase
            .from('leads')
            .select('id')
            .eq('email', lead.email)
            .single();

          if (!existing) {
            const { error } = await supabase.from('leads').insert({
              name: lead.name || lead.company,
              email: lead.email,
              phone: lead.phone || null,
              company: lead.company || null,
              source: lead.source,
              status: 'new',
              notes: lead.category ? `Category: ${lead.category}` : null,
              email_count: 0,
            });

            if (!error) {
              savedCount++;
            }
          } else {
            skippedCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message,
      totalFound: leads.length,
      savedToDatabase: savedCount,
      skipped: skippedCount,
      leads: leads.slice(0, 20), // Return first 20 for preview
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check scraper status
export async function GET() {
  const totalLeads = getLeadsCount();

  return NextResponse.json({
    status: 'ready',
    supabaseConnected: isSupabaseConfigured(),
    totalAvailableLeads: totalLeads,
    categories: SEARCH_CATEGORIES.map(c => c.category),
    sources: [
      { name: 'Google Maps', enabled: true, leads: totalLeads - 10, description: 'Real Dubai businesses - Interior, Hotels, Real Estate' },
      { name: 'Instagram', enabled: true, leads: 10, description: 'Interior design accounts in Dubai' },
    ],
    schedule: 'Every Monday at 6:00 AM GST',
  });
}
