import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Demo data for when Supabase is not configured
const demoLeads = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@goldenprop.ae', phone: '+971501234567', company: 'Golden Properties', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '2', name: 'Sarah Miller', email: 'sarah@designstudio.com', phone: '+971502345678', company: 'Design Studio Dubai', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '3', name: 'Mohammed Al Rashid', email: 'mohammed@luxuryspaces.ae', phone: '+971503456789', company: 'Luxury Spaces LLC', source: 'linkedin', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '4', name: 'Emma Thompson', email: 'emma@interiorsdxb.com', phone: '+971504567890', company: 'Interiors DXB', source: 'website', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '5', name: 'Fatima Al Maktoum', email: 'fatima@emirateshomes.ae', phone: '+971505678901', company: 'Emirates Homes', source: 'instagram', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 4 },
  { id: '6', name: 'James Wilson', email: 'james@modernliving.ae', phone: '+971506789012', company: 'Modern Living Designs', source: 'google_maps', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '7', name: 'Aisha Khan', email: 'aisha@premiuminteriors.com', phone: '+971507890123', company: 'Premium Interiors', source: 'linkedin', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '8', name: 'David Chen', email: 'david@asianelegance.ae', phone: '+971508901234', company: 'Asian Elegance Interiors', source: 'manual', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 5 },
  { id: '9', name: 'Mariam Al Suwaidi', email: 'mariam@dubaidesign.ae', phone: '+971509012345', company: 'Dubai Design House', source: 'instagram', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '10', name: 'Robert Anderson', email: 'robert@coastalliving.ae', phone: '+971510123456', company: 'Coastal Living Interiors', source: 'google_maps', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
];

export async function GET(request: NextRequest) {
  // Validate API key for all methods
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ leads: data || [], source: 'supabase' });
    }

    return NextResponse.json({ leads: demoLeads, source: 'demo' });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json({ leads: demoLeads, source: 'demo', error: error.message });
  }
}

export async function POST(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .insert({
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          company: body.company || null,
          source: body.source || 'manual',
          status: 'new',
          notes: body.notes || null,
          email_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, lead: data });
    }

    // Demo mode
    const newLead = {
      id: `lead-${Date.now()}`,
      ...body,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_count: 0,
    };

    return NextResponse.json({ success: true, lead: newLead, source: 'demo' });
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, lead: data });
    }

    return NextResponse.json({ success: true, source: 'demo' });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, source: 'demo' });
  } catch (error: any) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
