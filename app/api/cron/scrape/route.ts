import { NextRequest, NextResponse } from 'next/server';
import { runAllScrapers } from '@/lib/scraper';

// Cron job endpoint - runs weekly to scrape new leads
// Vercel Cron: "0 2 * * 1" (Every Monday at 2 AM UTC = 6 AM Dubai)

export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  console.log('=== WEEKLY LEAD SCRAPING CRON JOB ===');
  console.log('Started at:', new Date().toISOString());

  try {
    // Run all scrapers
    const results = await runAllScrapers();

    // Combine all leads
    const allLeads = [
      ...results.google_maps,
      ...results.instagram,
      ...results.property_sites,
    ];

    // In production, save to Supabase and trigger welcome emails
    // for (const lead of allLeads) {
    //   if (lead.email) {
    //     // Check if lead already exists
    //     const existing = await supabase.from('leads').select('id').eq('email', lead.email).single();
    //     if (!existing.data) {
    //       // Insert new lead
    //       await supabase.from('leads').insert({
    //         name: lead.name,
    //         email: lead.email,
    //         phone: lead.phone,
    //         company: lead.company,
    //         source: lead.source,
    //         status: 'new',
    //       });
    //       // Trigger welcome email
    //       await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //           leadEmail: lead.email,
    //           leadName: lead.name,
    //           templateId: 'welcome',
    //         }),
    //       });
    //     }
    //   }
    // }

    console.log('=== SCRAPING COMPLETE ===');
    console.log('Google Maps:', results.google_maps.length);
    console.log('Instagram:', results.instagram.length);
    console.log('Property Sites:', results.property_sites.length);
    console.log('Total:', results.total);

    return NextResponse.json({
      success: true,
      message: 'Weekly scraping completed',
      results: {
        google_maps: results.google_maps.length,
        instagram: results.instagram.length,
        property_sites: results.property_sites.length,
        total: results.total,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron scraping error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
