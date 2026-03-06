'use client';

import { useState } from 'react';
import {
  Users,
  Mail,
  MousePointer,
  MessageSquare,
} from 'lucide-react';

// Empty analytics data - will be populated from real data
const weeklyData = [
  { day: 'Mon', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Tue', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Wed', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Thu', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Fri', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Sat', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
  { day: 'Sun', leads: 0, emails: 0, opens: 0, clicks: 0, replies: 0 },
];

const sourceData = [
  { source: 'LinkedIn', leads: 0, percentage: 0 },
  { source: 'Google Maps', leads: 0, percentage: 0 },
  { source: 'Website', leads: 0, percentage: 0 },
  { source: 'Instagram', leads: 0, percentage: 0 },
  { source: 'Manual', leads: 0, percentage: 0 },
];

const topPerformingEmails = [
  { template: 'Welcome Email', sent: 0, openRate: 0, clickRate: 0, replyRate: 0 },
  { template: 'Portfolio Showcase', sent: 0, openRate: 0, clickRate: 0, replyRate: 0 },
  { template: 'Special Offer', sent: 0, openRate: 0, clickRate: 0, replyRate: 0 },
  { template: 'Follow-up #1', sent: 0, openRate: 0, clickRate: 0, replyRate: 0 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const maxLeads = Math.max(...weeklyData.map((d) => d.leads));
  const maxEmails = Math.max(...weeklyData.map((d) => d.emails));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your marketing performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base w-full sm:w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
          <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
          <p className="text-xs sm:text-sm text-gray-500">Emails Sent</p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <MousePointer className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">0%</p>
          <p className="text-xs sm:text-sm text-gray-500">Open Rate</p>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">0%</p>
          <p className="text-xs sm:text-sm text-gray-500">Reply Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Weekly Leads Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Weekly Leads</h2>
          <div className="flex items-end gap-2 sm:gap-4 h-36 sm:h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-secondary rounded-t-lg transition-all hover:bg-opacity-80"
                  style={{ height: `${(day.leads / maxLeads) * 100}%`, minHeight: '8px' }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{day.day}</p>
                <p className="text-xs sm:text-sm font-semibold">{day.leads}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Emails Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Weekly Emails</h2>
          <div className="flex items-end gap-2 sm:gap-4 h-36 sm:h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-t-lg transition-all hover:bg-opacity-80"
                  style={{ height: `${(day.emails / maxEmails) * 100}%`, minHeight: '8px' }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{day.day}</p>
                <p className="text-xs sm:text-sm font-semibold">{day.emails}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Lead Sources</h2>
          <div className="space-y-4">
            {sourceData.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-xs sm:text-sm text-gray-500">{source.leads} leads ({source.percentage}%)</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-secondary rounded-full h-2 transition-all"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Emails */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Top Performing Emails</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-3">Template</th>
                  <th className="pb-3">Sent</th>
                  <th className="pb-3">Open %</th>
                  <th className="pb-3">Click %</th>
                  <th className="pb-3">Reply %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPerformingEmails.map((email) => (
                  <tr key={email.template} className="text-xs sm:text-sm">
                    <td className="py-3 font-medium text-gray-900">{email.template}</td>
                    <td className="py-3 text-gray-600">{email.sent}</td>
                    <td className="py-3">
                      <span className={email.openRate > 40 ? 'text-green-600' : 'text-gray-600'}>
                        {email.openRate}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={email.clickRate > 15 ? 'text-green-600' : 'text-gray-600'}>
                        {email.clickRate}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={email.replyRate > 5 ? 'text-green-600' : 'text-gray-600'}>
                        {email.replyRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="mt-6 lg:mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Conversion Funnel</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center w-full">
            <div className="bg-blue-100 rounded-lg p-4 sm:p-6 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-blue-800">0</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Emails Sent</p>
            <p className="text-xs text-gray-400">0%</p>
          </div>
          <div className="text-2xl text-gray-300 rotate-90 sm:rotate-0">→</div>
          <div className="flex-1 text-center w-full">
            <div className="bg-green-100 rounded-lg p-4 sm:p-6 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-green-800">0</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Opened</p>
            <p className="text-xs text-gray-400">0%</p>
          </div>
          <div className="text-2xl text-gray-300 rotate-90 sm:rotate-0">→</div>
          <div className="flex-1 text-center w-full">
            <div className="bg-purple-100 rounded-lg p-4 sm:p-6 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-purple-800">0</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Clicked</p>
            <p className="text-xs text-gray-400">0%</p>
          </div>
          <div className="text-2xl text-gray-300 rotate-90 sm:rotate-0">→</div>
          <div className="flex-1 text-center w-full">
            <div className="bg-secondary/20 rounded-lg p-4 sm:p-6 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-primary">0</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Replied</p>
            <p className="text-xs text-gray-400">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
