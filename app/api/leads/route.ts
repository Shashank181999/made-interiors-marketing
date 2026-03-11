import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Demo data for when Supabase is not configured
const demoLeads = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@goldenprop.ae', phone: '+971501234567', company: 'Golden Properties', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '2', name: 'Sarah Miller', email: 'sarah@designstudio.com', phone: '+971502345678', company: 'Design Studio Dubai', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
];

export async function GET() {
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
  try {
    const body = await request.json();

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
  try {
    const body = await request.json();
    const { id, ...updates } = body;

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
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (isSupabaseConfigured() && id) {
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
