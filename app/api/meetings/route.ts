import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse, checkRateLimit, getClientIp } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Meeting, demoMeetings, defaultAvailability } from '@/lib/meetings';

// In-memory storage for demo mode
let localMeetings: Meeting[] = [...demoMeetings];

// GET - Fetch all meetings or check availability
export async function GET(request: NextRequest) {
  // Validate API key for listing meetings
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const checkAvailability = searchParams.get('availability');

  // If checking availability for a specific date
  if (checkAvailability && date) {
    const bookedTimes = await getBookedTimesForDate(date);
    return NextResponse.json({
      date,
      bookedTimes,
      availability: defaultAvailability,
    });
  }

  // Fetch all meetings
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return NextResponse.json({ meetings: data || [] });
    } catch (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ meetings: localMeetings });
    }
  }

  return NextResponse.json({ meetings: localMeetings });
}

// POST - Create a new meeting (public booking - rate limited)
export async function POST(request: NextRequest) {
  // Rate limit public booking endpoint
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`meeting:${clientIp}`, 5, 3600000); // 5 bookings per hour

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many booking attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, date, time, project_type, notes, lead_id } = body;

    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Name, email, date, and time are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format. Use HH:MM' },
        { status: 400 }
      );
    }

    // Check if slot is already booked
    const bookedTimes = await getBookedTimesForDate(date);
    if (bookedTimes.includes(time)) {
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || '',
      company: company || '',
      date,
      time,
      duration: defaultAvailability.slot_duration,
      project_type: project_type || '',
      notes: notes || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      lead_id: lead_id || null,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('meetings')
          .insert([newMeeting])
          .select()
          .single();

        if (error) throw error;

        // Send confirmation email (using existing email system)
        await sendConfirmationEmail(newMeeting);

        return NextResponse.json({ success: true, meeting: data });
      } catch (error) {
        console.error('Supabase error:', error);
        // Fall back to local storage
      }
    }

    // Demo mode - store locally
    localMeetings.push(newMeeting);
    console.log('Meeting booked (demo mode):', newMeeting);

    return NextResponse.json({ success: true, meeting: newMeeting });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}

// PATCH - Update meeting status (requires authentication)
export async function PATCH(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Valid values: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('meetings')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, meeting: data });
      } catch (error) {
        console.error('Supabase error:', error);
      }
    }

    // Demo mode
    const meeting = localMeetings.find((m) => m.id === id);
    if (meeting) {
      meeting.status = status;
      return NextResponse.json({ success: true, meeting });
    }

    return NextResponse.json(
      { success: false, error: 'Meeting not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete a meeting (requires authentication)
export async function DELETE(request: NextRequest) {
  // Validate API key
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return unauthorizedResponse(auth.error);
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Meeting ID is required' },
      { status: 400 }
    );
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Supabase error:', error);
    }
  }

  // Demo mode
  localMeetings = localMeetings.filter((m) => m.id !== id);
  return NextResponse.json({ success: true });
}

// Helper: Get booked times for a specific date
async function getBookedTimesForDate(date: string): Promise<string[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('time')
        .eq('date', date)
        .neq('status', 'cancelled');

      if (error) throw error;
      return (data || []).map((m: { time: string }) => m.time);
    } catch (error) {
      console.error('Error fetching booked times:', error);
    }
  }

  // Demo mode
  return localMeetings
    .filter((m) => m.date === date && m.status !== 'cancelled')
    .map((m) => m.time);
}

// Helper: Send confirmation emails (to lead AND admin)
async function sendConfirmationEmail(meeting: Meeting) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiKey = process.env.API_SECRET_KEY;

  // 1. Send confirmation to the LEAD
  try {
    await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        to: meeting.email,
        subject: `Meeting Confirmed - Made Interiors Dubai`,
        html: generateConfirmationEmailHtml(meeting),
      }),
    });
    console.log('Confirmation email sent to lead:', meeting.email);
  } catch (error) {
    console.log('Lead email notification skipped:', error);
  }

  // 2. Send notification to ADMIN (you)
  const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL;
  if (adminEmail) {
    try {
      await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          to: adminEmail,
          subject: `New Meeting Booked: ${meeting.name}`,
          html: generateAdminNotificationHtml(meeting),
        }),
      });
      console.log('Notification email sent to admin:', adminEmail);
    } catch (error) {
      console.log('Admin email notification skipped:', error);
    }
  }
}

function generateConfirmationEmailHtml(meeting: Meeting): string {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [hour, min] = meeting.time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const formattedTime = `${displayHour}:${String(min).padStart(2, '0')} ${period}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Made Interiors</h1>
                  <p style="color: #ea1515; margin: 5px 0 0 0; font-size: 14px;">Luxury Interior Design</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0;">Meeting Confirmed!</h2>
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Dear ${meeting.name},
                  </p>
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Your consultation with Made Interiors Dubai has been scheduled. We look forward to discussing your project!
                  </p>
                  <!-- Meeting Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #999999; text-transform: uppercase;">Meeting Details</p>
                        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333;">
                          <strong>Date:</strong> ${formattedDate}
                        </p>
                        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333;">
                          <strong>Time:</strong> ${formattedTime} (GST)
                        </p>
                        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333;">
                          <strong>Duration:</strong> ${meeting.duration} minutes
                        </p>
                        ${meeting.project_type ? `
                        <p style="margin: 0; font-size: 16px; color: #333333;">
                          <strong>Project Type:</strong> ${meeting.project_type}
                        </p>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                    If you need to reschedule or have any questions, please reply to this email or call us at +971 4 XXX XXXX.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    Made Interiors Dubai | Luxury Interior Design
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Generate admin notification email
function generateAdminNotificationHtml(meeting: Meeting): string {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [hour, min] = meeting.time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const formattedTime = `${displayHour}:${String(min).padStart(2, '0')} ${period}`;

  const meetingsUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/meetings`
    : 'http://localhost:3000/meetings';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #ea1515; padding: 25px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Meeting Booked!</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    A new consultation has been booked:
                  </p>

                  <!-- Client Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #999999; text-transform: uppercase;">Client</p>
                        <p style="margin: 0 0 5px 0; font-size: 18px; color: #333333; font-weight: bold;">${meeting.name}</p>
                        <p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;">
                          <a href="mailto:${meeting.email}" style="color: #ea1515;">${meeting.email}</a>
                        </p>
                        ${meeting.phone ? `<p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;"><a href="tel:${meeting.phone}" style="color: #ea1515;">${meeting.phone}</a></p>` : ''}
                        ${meeting.company ? `<p style="margin: 0; font-size: 14px; color: #666666;">${meeting.company}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <!-- Meeting Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #888888; text-transform: uppercase;">Meeting Details</p>
                        <p style="margin: 0 0 8px 0; font-size: 16px; color: #ffffff;">
                          <strong>Date:</strong> ${formattedDate}
                        </p>
                        <p style="margin: 0 0 8px 0; font-size: 16px; color: #ffffff;">
                          <strong>Time:</strong> ${formattedTime} (GST)
                        </p>
                        ${meeting.project_type ? `
                        <p style="margin: 0; font-size: 16px; color: #ffffff;">
                          <strong>Project:</strong> ${meeting.project_type}
                        </p>
                        ` : ''}
                      </td>
                    </tr>
                  </table>

                  ${meeting.notes ? `
                  <!-- Notes -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border-radius: 8px; border: 1px solid #fbbf24; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; text-transform: uppercase;">Client Notes</p>
                        <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">${meeting.notes}</p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- CTA -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <a href="${meetingsUrl}" style="display: inline-block; background-color: #ea1515; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 14px; font-weight: bold;">
                          View All Meetings
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    Made Interiors Marketing Automation
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
