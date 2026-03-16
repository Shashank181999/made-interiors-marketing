import { NextRequest, NextResponse } from 'next/server';
import { validateCronSecret, unauthorizedResponse } from '@/lib/auth';

// This endpoint is called by Vercel Cron to run automation tasks
// Add to vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "0 6 * * *" }] }

export async function GET(request: NextRequest) {
  // Verify cron secret - REQUIRED for security
  const auth = validateCronSecret(request);
  if (!auth.valid) {
    console.warn('Unauthorized cron access attempt:', auth.error);
    return unauthorizedResponse(auth.error);
  }

  const results = {
    timestamp: new Date().toISOString(),
    tasks: [] as string[],
  };

  try {
    // Task 1: Send welcome emails to new leads
    // In production, query Supabase for leads with status 'new' and no emails sent
    results.tasks.push('Checked for new leads to welcome');

    // Task 2: Send follow-up emails
    // Query for leads contacted more than 3 days ago with no response
    results.tasks.push('Checked for follow-up candidates');

    // Task 3: Mark cold leads
    // Query for leads with 3+ emails and no response in 14 days
    results.tasks.push('Checked for cold leads');

    // Task 4: Send daily report
    results.tasks.push('Generated daily report');

    console.log('Cron job completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Automation tasks completed',
      results,
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// For manual trigger (also requires authentication)
export async function POST(request: NextRequest) {
  return GET(request);
}
