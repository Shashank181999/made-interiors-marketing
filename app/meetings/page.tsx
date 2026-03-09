'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Filter,
} from 'lucide-react';
import type { Meeting } from '@/lib/meetings';
import { formatTime, formatDate } from '@/lib/meetings';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/meetings');
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const updateMeetingStatus = async (id: string, status: Meeting['status']) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        fetchMeetings();
        setSelectedMeeting(null);
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const response = await fetch(`/api/meetings?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMeetings();
        setSelectedMeeting(null);
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    if (filterStatus === 'all') return true;
    return meeting.status === filterStatus;
  });

  // Group meetings by date
  const groupedMeetings = filteredMeetings.reduce((acc, meeting) => {
    const date = meeting.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedMeetings).sort();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Stats
  const stats = {
    total: meetings.length,
    pending: meetings.filter((m) => m.status === 'pending').length,
    confirmed: meetings.filter((m) => m.status === 'confirmed').length,
    upcoming: meetings.filter((m) => {
      const meetingDate = new Date(m.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return meetingDate >= today && m.status !== 'cancelled';
    }).length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage consultation bookings</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchMeetings}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="/book"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Booking Page
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Meetings</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Pending Confirmation</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-red-500 animate-spin" />
          <p className="text-gray-500">Loading meetings...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && meetings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-500 mb-4">Share your booking page to start receiving consultations</p>
          <a
            href="/book"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Booking Page
          </a>
        </div>
      )}

      {/* Meetings List */}
      {!loading && meetings.length > 0 && (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {groupedMeetings[date].map((meeting) => (
                  <div
                    key={meeting.id}
                    onClick={() => setSelectedMeeting(meeting)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatTime(meeting.time)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">{meeting.name}</p>
                        <p className="text-sm text-gray-500">{meeting.email}</p>
                        {meeting.company && (
                          <p className="text-sm text-gray-400">{meeting.company}</p>
                        )}
                        {meeting.project_type && (
                          <p className="text-sm text-red-500 mt-1">{meeting.project_type}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateMeetingStatus(meeting.id, 'confirmed');
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMeetingStatus(meeting.id, 'cancelled');
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Cancel"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Meeting Details</h2>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{formatDate(selectedMeeting.date)}</p>
                  <p className="text-sm text-gray-500">{formatTime(selectedMeeting.time)} ({selectedMeeting.duration} min)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <p className="font-medium">{selectedMeeting.name}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${selectedMeeting.email}`} className="text-red-500 hover:underline">
                  {selectedMeeting.email}
                </a>
              </div>

              {selectedMeeting.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${selectedMeeting.phone}`} className="text-red-500 hover:underline">
                    {selectedMeeting.phone}
                  </a>
                </div>
              )}

              {selectedMeeting.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <p>{selectedMeeting.company}</p>
                </div>
              )}

              {selectedMeeting.project_type && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Project Type</p>
                  <p className="font-medium">{selectedMeeting.project_type}</p>
                </div>
              )}

              {selectedMeeting.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{selectedMeeting.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMeeting.status)}`}>
                  {selectedMeeting.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {selectedMeeting.status === 'pending' && (
                <button
                  onClick={() => updateMeetingStatus(selectedMeeting.id, 'confirmed')}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Confirm
                </button>
              )}
              {selectedMeeting.status === 'confirmed' && (
                <button
                  onClick={() => updateMeetingStatus(selectedMeeting.id, 'completed')}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Mark Completed
                </button>
              )}
              {selectedMeeting.status !== 'cancelled' && (
                <button
                  onClick={() => updateMeetingStatus(selectedMeeting.id, 'cancelled')}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => deleteMeeting(selectedMeeting.id)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
