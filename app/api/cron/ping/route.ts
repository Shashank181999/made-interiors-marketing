import { NextRequest, NextResponse } from 'next/server';
import { validateCronSecret, unauthorizedResponse } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Daily ping to keep Supabase free tier active
// Runs every day - prevents 7-day inactivity pause

export async function GET(request: NextRequest) {
  // Verify cron secret - REQUIRED for security
  const auth = validateCronSecret(request);
  if (!auth.valid) {
    console.warn('Unauthorized ping access attempt:', auth.error);
    return unauthorizedResponse(auth.error);
  }

  console.log('=== DAILY PING - KEEPING SUPABASE ALIVE ===');
  console.log('Time:', new Date().toISOString());

  try {
    if (isSupabaseConfigured()) {
      // Make a simple query to Supabase - this counts as "activity"
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Ping query error:', error);
        return NextResponse.json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }

      console.log('Ping successful. Lead count:', count);

      return NextResponse.json({
        success: true,
        message: 'Ping successful - database active',
        leadCount: count,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase not configured - demo mode',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
