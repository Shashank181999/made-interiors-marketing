import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, checkRateLimit, getClientIp, isOriginAllowed } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// API endpoint for website contact form submissions
// Embed this on your Made Interiors website

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  // Check origin
  const origin = request.headers.get('origin');
  if (origin && !isOriginAllowed(origin)) {
    console.warn('Blocked request from unauthorized origin:', origin);
    return NextResponse.json(
      { success: false, error: 'Origin not allowed' },
      { status: 403, headers: corsHeaders }
    );
  }

  // Rate limit by IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`contact:${clientIp}`, 5, 300000); // 5 submissions per 5 minutes

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many submissions. Please try again later.' },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 100 characters' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim();

    const lead = {
      name: sanitize(name),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitize(phone) : null,
      company: null,
      source: 'website',
      status: 'new',
      notes: message ? sanitize(message) : null,
      email_count: 0,
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('leads')
          .insert(lead)
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          // Continue anyway - don't fail the form submission
        } else {
          console.log('New lead from website form saved:', data.id);

          // Trigger welcome email asynchronously
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const apiKey = process.env.API_SECRET_KEY;

          fetch(`${appUrl}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify({
              leadId: data.id,
              leadEmail: email,
              leadName: name,
              templateId: 'welcome',
            }),
          }).catch((err) => console.log('Welcome email trigger failed:', err));

          return NextResponse.json(
            {
              success: true,
              message: 'Thank you! We will contact you shortly.',
            },
            { headers: corsHeaders }
          );
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Demo mode or fallback
    console.log('New lead from website form (demo):', lead);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We will contact you shortly.',
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// CORS preflight handler
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
