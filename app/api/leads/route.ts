import { NextRequest, NextResponse } from 'next/server';
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
  { id: '11', name: 'Layla Hassan', email: 'layla@arabianstyle.ae', phone: '+971511234567', company: 'Arabian Style Decor', source: 'linkedin', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '12', name: 'Michael Brown', email: 'michael@urbanspaces.ae', phone: '+971512345678', company: 'Urban Spaces Design', source: 'website', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 4 },
  { id: '13', name: 'Noura Al Falasi', email: 'noura@eleganthomes.ae', phone: '+971513456789', company: 'Elegant Homes UAE', source: 'instagram', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '14', name: 'William Taylor', email: 'william@timelessdesign.ae', phone: '+971514567890', company: 'Timeless Design Studio', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '15', name: 'Huda Mohammed', email: 'huda@royalinteriors.ae', phone: '+971515678901', company: 'Royal Interiors Dubai', source: 'linkedin', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '16', name: 'Christopher Lee', email: 'chris@minimalstudio.ae', phone: '+971516789012', company: 'Minimal Studio', source: 'manual', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 6 },
  { id: '17', name: 'Salma Al Qasimi', email: 'salma@palatehomes.ae', phone: '+971517890123', company: 'Palate Homes', source: 'website', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '18', name: 'Daniel Martinez', email: 'daniel@mediterraneandesign.ae', phone: '+971518901234', company: 'Mediterranean Design Co', source: 'instagram', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '19', name: 'Reem Al Shamsi', email: 'reem@gulfinteriors.ae', phone: '+971519012345', company: 'Gulf Interiors', source: 'linkedin', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 5 },
  { id: '20', name: 'Andrew Johnson', email: 'andrew@contemporaryliving.ae', phone: '+971520123456', company: 'Contemporary Living', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '21', name: 'Maha Al Mansouri', email: 'maha@arabesque.ae', phone: '+971521234567', company: 'Arabesque Designs', source: 'instagram', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '22', name: 'Thomas Wright', email: 'thomas@scandinavianstyle.ae', phone: '+971522345678', company: 'Scandinavian Style UAE', source: 'website', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '23', name: 'Fatma Al Zaabi', email: 'fatma@opulentliving.ae', phone: '+971523456789', company: 'Opulent Living', source: 'linkedin', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '24', name: 'George Davis', email: 'george@industrialchic.ae', phone: '+971524567890', company: 'Industrial Chic Designs', source: 'manual', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 4 },
  { id: '25', name: 'Sheikha Al Nuaimi', email: 'sheikha@heritagehomes.ae', phone: '+971525678901', company: 'Heritage Homes Dubai', source: 'google_maps', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '26', name: 'Kevin Moore', email: 'kevin@boutiqueinteriors.ae', phone: '+971526789012', company: 'Boutique Interiors', source: 'instagram', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 6 },
  { id: '27', name: 'Amna Al Ketbi', email: 'amna@desertrose.ae', phone: '+971527890123', company: 'Desert Rose Designs', source: 'linkedin', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '28', name: 'Steven Clark', email: 'steven@artdecointeriors.ae', phone: '+971528901234', company: 'Art Deco Interiors', source: 'website', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '29', name: 'Mouza Al Dhaheri', email: 'mouza@pearlhomes.ae', phone: '+971529012345', company: 'Pearl Homes UAE', source: 'google_maps', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '30', name: 'Brian White', email: 'brian@luxeliving.ae', phone: '+971530123456', company: 'Luxe Living Dubai', source: 'manual', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '31', name: 'Asma Al Kaabi', email: 'asma@goldensands.ae', phone: '+971531234567', company: 'Golden Sands Interiors', source: 'instagram', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 5 },
  { id: '32', name: 'Mark Robinson', email: 'mark@classicelegance.ae', phone: '+971532345678', company: 'Classic Elegance', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '33', name: 'Hessa Al Marri', email: 'hessa@sunsetdesigns.ae', phone: '+971533456789', company: 'Sunset Designs', source: 'website', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 4 },
  { id: '34', name: 'Paul Garcia', email: 'paul@tropicalinteriors.ae', phone: '+971534567890', company: 'Tropical Interiors', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '35', name: 'Maitha Al Rumaithi', email: 'maitha@oasisdesign.ae', phone: '+971535678901', company: 'Oasis Design Studio', source: 'instagram', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '36', name: 'Jason Hill', email: 'jason@modernmansions.ae', phone: '+971536789012', company: 'Modern Mansions', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '37', name: 'Shamsa Al Ali', email: 'shamsa@velvetinteriors.ae', phone: '+971537890123', company: 'Velvet Interiors', source: 'manual', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '38', name: 'Eric Young', email: 'eric@zenspaces.ae', phone: '+971538901234', company: 'Zen Spaces Dubai', source: 'website', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 6 },
  { id: '39', name: 'Latifa Al Balooshi', email: 'latifa@majlisdesign.ae', phone: '+971539012345', company: 'Majlis Design House', source: 'google_maps', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '40', name: 'Ryan King', email: 'ryan@primehomes.ae', phone: '+971540123456', company: 'Prime Homes Interior', source: 'instagram', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 5 },
  { id: '41', name: 'Ayesha Al Qubaisi', email: 'ayesha@diamondinteriors.ae', phone: '+971541234567', company: 'Diamond Interiors', source: 'linkedin', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '42', name: 'Justin Scott', email: 'justin@urbanelegance.ae', phone: '+971542345678', company: 'Urban Elegance', source: 'website', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '43', name: 'Shamma Al Mazrouei', email: 'shamma@crescentdesign.ae', phone: '+971543456789', company: 'Crescent Design Co', source: 'google_maps', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '44', name: 'Brandon Lewis', email: 'brandon@infinityinteriors.ae', phone: '+971544567890', company: 'Infinity Interiors', source: 'manual', status: 'clicked', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 3 },
  { id: '45', name: 'Maryam Al Hosani', email: 'maryam@skylinedesign.ae', phone: '+971545678901', company: 'Skyline Design Studio', source: 'instagram', status: 'cold', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 4 },
  { id: '46', name: 'Adam Walker', email: 'adam@harborliving.ae', phone: '+971546789012', company: 'Harbor Living Designs', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
  { id: '47', name: 'Khawla Al Mheiri', email: 'khawla@palacestyles.ae', phone: '+971547890123', company: 'Palace Styles', source: 'website', status: 'replied', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 5 },
  { id: '48', name: 'Nathan Harris', email: 'nathan@granddesigns.ae', phone: '+971548901234', company: 'Grand Designs UAE', source: 'google_maps', status: 'contacted', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 1 },
  { id: '49', name: 'Sara Al Tayer', email: 'sara@emirateselite.ae', phone: '+971549012345', company: 'Emirates Elite Interiors', source: 'instagram', status: 'opened', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 2 },
  { id: '50', name: 'Oliver Martin', email: 'oliver@dubaipremium.ae', phone: '+971550123456', company: 'Dubai Premium Homes', source: 'linkedin', status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), email_count: 0 },
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
