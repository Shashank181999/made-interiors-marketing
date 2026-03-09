'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { defaultAvailability, generateTimeSlots, isDateAvailable, formatTime, projectTypes } from '@/lib/meetings';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    notes: '',
  });

  // Fetch booked times when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchBookedTimes(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookedTimes = async (date: Date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/meetings?availability=true&date=${dateStr}`);
      const data = await response.json();
      setBookedTimes(data.bookedTimes || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setBookedTimes([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to book meeting');
      }
    } catch (error) {
      console.error('Error booking meeting:', error);
      alert('Failed to book meeting. Please try again.');
    }
    setLoading(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const timeSlots = selectedDate
    ? generateTimeSlots(defaultAvailability, bookedTimes)
    : [];

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Booked!</h1>
          <p className="text-gray-600 mb-6">
            Your consultation has been scheduled. We&apos;ve sent a confirmation email to <strong>{formData.email}</strong>
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-2">Meeting Details</p>
            <p className="font-medium text-gray-900">
              {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-600">{selectedTime && formatTime(selectedTime)} (GST)</p>
            {formData.project_type && (
              <p className="text-gray-600 mt-2">{formData.project_type}</p>
            )}
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/made-CPWcAThC.svg"
              alt="Made Interiors"
              width={140}
              height={50}
              priority
            />
          </div>
          <p className="text-zinc-400 text-sm hidden sm:block">Book a Free Consultation</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {s}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s ? 'text-white' : 'text-zinc-500'}`}>
                {s === 1 ? 'Select Date' : s === 2 ? 'Choose Time' : 'Your Details'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-zinc-700 hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Select Date */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Date</h2>
              <p className="text-gray-600 mb-6">Choose a convenient date for your consultation</p>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="p-2" />;
                  }

                  const isAvailable = isDateAvailable(date, defaultAvailability);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => isAvailable && setSelectedDate(date)}
                      disabled={!isAvailable}
                      className={`p-2 sm:p-3 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-red-500 text-white'
                          : isAvailable
                          ? 'hover:bg-gray-100 text-gray-900'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                <Calendar className="w-4 h-4 inline mr-1" />
                Available: Sunday - Thursday (Dubai business hours)
              </p>

              <button
                onClick={() => selectedDate && setStep(2)}
                disabled={!selectedDate}
                className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Time</h2>
              <p className="text-gray-600 mb-6">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No available slots for this date</p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-red-500 hover:underline"
                  >
                    Choose another date
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    <Clock className="w-4 h-4 inline mr-1" />
                    All times are in Gulf Standard Time (GST)
                  </p>

                  <button
                    onClick={() => selectedTime && setStep(3)}
                    disabled={!selectedTime}
                    className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
              <p className="text-gray-600 mb-6">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {selectedTime && formatTime(selectedTime)}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+971 50 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="w-4 h-4 inline mr-1" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Company name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                  </label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Tell us about your project..."
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.email}
                className="w-full mt-6 py-3 bg-red-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By booking, you agree to receive confirmation and reminder emails
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
