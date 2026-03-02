import { NextRequest, NextResponse } from 'next/server';

// API endpoint for website contact form submissions
// Embed this on your Made Interiors website

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, source } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create lead from form submission
    const lead = {
      id: `website-${Date.now()}`,
      name,
      email,
      phone,
      company: '',
      source: 'website',
      status: 'new',
      notes: message || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_count: 0,
    };

    console.log('New lead from website form:', lead);

    // In production, save to Supabase:
    // await supabase.from('leads').insert(lead);

    // Auto-send welcome email:
    // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     leadEmail: email,
    //     leadName: name,
    //     templateId: 'welcome',
    //   }),
    // });

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will contact you shortly.',
      lead,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// CORS headers for cross-origin requests from your website
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
