'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Users,
  Mail,
  MousePointer,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Demo analytics data
const weeklyData = [
  { day: 'Mon', leads: 5, emails: 20, opens: 8, clicks: 3, replies: 1 },
  { day: 'Tue', leads: 8, emails: 25, opens: 10, clicks: 4, replies: 2 },
  { day: 'Wed', leads: 3, emails: 15, opens: 6, clicks: 2, replies: 0 },
  { day: 'Thu', leads: 10, emails: 30, opens: 12, clicks: 5, replies: 2 },
  { day: 'Fri', leads: 7, emails: 22, opens: 9, clicks: 3, replies: 1 },
  { day: 'Sat', leads: 2, emails: 8, opens: 3, clicks: 1, replies: 0 },
  { day: 'Sun', leads: 1, emails: 5, opens: 2, clicks: 0, replies: 0 },
];

const sourceData = [
  { source: 'LinkedIn', leads: 45, percentage: 35 },
  { source: 'Google Maps', leads: 32, percentage: 25 },
  { source: 'Website', leads: 28, percentage: 22 },
  { source: 'Instagram', leads: 15, percentage: 12 },
  { source: 'Manual', leads: 8, percentage: 6 },
];

const topPerformingEmails = [
  { template: 'Welcome Email', sent: 150, openRate: 45, clickRate: 18, replyRate: 6 },
  { template: 'Portfolio Showcase', sent: 120, openRate: 38, clickRate: 15, replyRate: 4 },
  { template: 'Special Offer', sent: 100, openRate: 52, clickRate: 22, replyRate: 8 },
  { template: 'Follow-up #1', sent: 80, openRate: 28, clickRate: 10, replyRate: 3 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const maxLeads = Math.max(...weeklyData.map((d) => d.leads));
  const maxEmails = Math.max(...weeklyData.map((d) => d.emails));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your marketing performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <span className="text-xs flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">127</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-8 h-8 text-purple-500" />
            <span className="text-xs flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">458</p>
          <p className="text-sm text-gray-500">Emails Sent</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <MousePointer className="w-8 h-8 text-green-500" />
            <span className="text-xs flex items-center text-red-600">
              <ArrowDownRight className="w-3 h-3" />
              -2%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">32.5%</p>
          <p className="text-sm text-gray-500">Open Rate</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-secondary" />
            <span className="text-xs flex items-center text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.2%</p>
          <p className="text-sm text-gray-500">Reply Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Leads Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Leads</h2>
          <div className="flex items-end gap-4 h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-secondary rounded-t-lg transition-all hover:bg-opacity-80"
                  style={{ height: `${(day.leads / maxLeads) * 100}%`, minHeight: '8px' }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{day.day}</p>
                <p className="text-sm font-semibold">{day.leads}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Emails Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Emails</h2>
          <div className="flex items-end gap-4 h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-t-lg transition-all hover:bg-opacity-80"
                  style={{ height: `${(day.emails / maxEmails) * 100}%`, minHeight: '8px' }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{day.day}</p>
                <p className="text-sm font-semibold">{day.emails}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Lead Sources</h2>
          <div className="space-y-4">
            {sourceData.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">{source.leads} leads ({source.percentage}%)</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Emails</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                  <tr key={email.template} className="text-sm">
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
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-2">
              <p className="text-3xl font-bold text-blue-800">458</p>
            </div>
            <p className="text-sm text-gray-600">Emails Sent</p>
            <p className="text-xs text-gray-400">100%</p>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div className="flex-1 text-center">
            <div className="bg-green-100 rounded-lg p-6 mb-2">
              <p className="text-3xl font-bold text-green-800">149</p>
            </div>
            <p className="text-sm text-gray-600">Opened</p>
            <p className="text-xs text-gray-400">32.5%</p>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div className="flex-1 text-center">
            <div className="bg-purple-100 rounded-lg p-6 mb-2">
              <p className="text-3xl font-bold text-purple-800">59</p>
            </div>
            <p className="text-sm text-gray-600">Clicked</p>
            <p className="text-xs text-gray-400">12.9%</p>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div className="flex-1 text-center">
            <div className="bg-secondary/20 rounded-lg p-6 mb-2">
              <p className="text-3xl font-bold text-primary">19</p>
            </div>
            <p className="text-sm text-gray-600">Replied</p>
            <p className="text-xs text-gray-400">4.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
