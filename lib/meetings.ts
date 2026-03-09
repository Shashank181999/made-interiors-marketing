// Meeting types and utilities

export interface Meeting {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  project_type?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  lead_id?: string;
}

export interface Availability {
  days: number[]; // 0=Sunday, 1=Monday, etc.
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  slot_duration: number; // minutes
  blocked_dates: string[]; // YYYY-MM-DD
}

// Default availability: Sunday-Thursday, 9AM-6PM GST
export const defaultAvailability: Availability = {
  days: [0, 1, 2, 3, 4], // Sun-Thu (Dubai work week)
  start_time: '09:00',
  end_time: '18:00',
  slot_duration: 60, // 1 hour meetings
  blocked_dates: [],
};

// Generate time slots for a given day
export function generateTimeSlots(
  availability: Availability,
  bookedTimes: string[] = []
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = availability.start_time.split(':').map(Number);
  const [endHour, endMin] = availability.end_time.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    // Only add if not booked
    if (!bookedTimes.includes(timeStr)) {
      slots.push(timeStr);
    }

    // Add slot duration
    currentMin += availability.slot_duration;
    while (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }

  return slots;
}

// Check if a date is available
export function isDateAvailable(
  date: Date,
  availability: Availability
): boolean {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];

  // Check if day of week is available
  if (!availability.days.includes(dayOfWeek)) {
    return false;
  }

  // Check if date is blocked
  if (availability.blocked_dates.includes(dateStr)) {
    return false;
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return false;
  }

  return true;
}

// Format time for display (12-hour format)
export function formatTime(time: string): string {
  const [hour, min] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Project types for interior design consultations
export const projectTypes = [
  'Residential - Villa',
  'Residential - Apartment',
  'Residential - Penthouse',
  'Commercial - Office',
  'Commercial - Retail',
  'Commercial - Restaurant',
  'Hospitality - Hotel',
  'Hospitality - Spa',
  'Other',
];

// Demo meetings for when Supabase is not configured
export const demoMeetings: Meeting[] = [
  {
    id: '1',
    name: 'Ahmed Al Maktoum',
    email: 'ahmed@emirates.ae',
    phone: '+971501234567',
    company: 'Emirates Group',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    project_type: 'Commercial - Office',
    notes: 'Looking to redesign executive floor',
    status: 'confirmed',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@luxuryproperties.ae',
    phone: '+971509876543',
    company: 'Luxury Properties',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    project_type: 'Residential - Penthouse',
    notes: 'Palm Jumeirah penthouse renovation',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];
