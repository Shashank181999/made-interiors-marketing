'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  MousePointer,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import type { Lead } from '@/types';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Calculate stats from real data
  const stats = {
    total_leads: leads.length,
    new_leads: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    opened: leads.filter((l) => l.status === 'opened').length,
    clicked: leads.filter((l) => l.status === 'clicked').length,
    replied: leads.filter((l) => l.status === 'replied').length,
  };

  const recentLeads = leads.slice(0, 5);

  const statCards = [
    { name: 'Total Leads', value: stats.total_leads, icon: Users, color: 'text-blue-500' },
    { name: 'New', value: stats.new_leads, icon: TrendingUp, color: 'text-green-500' },
    { name: 'Contacted', value: stats.contacted, icon: Mail, color: 'text-yellow-500' },
    { name: 'Opened', value: stats.opened, icon: MousePointer, color: 'text-purple-500' },
    { name: 'Clicked', value: stats.clicked, icon: MousePointer, color: 'text-pink-500' },
    { name: 'Replied', value: stats.replied, icon: MessageSquare, color: 'text-emerald-500' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      opened: 'bg-green-100 text-green-800',
      clicked: 'bg-purple-100 text-purple-800',
      replied: 'bg-emerald-100 text-emerald-800',
      cold: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source: string) => {
    const icons: Record<string, string> = {
      linkedin: '💼',
      google_maps: '📍',
      website: '🌐',
      instagram: '📸',
      manual: '✏️',
    };
    return icons[source] || '📋';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Your marketing overview</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <a href="/leads" className="text-secondary hover:underline text-sm font-medium">
              View all →
            </a>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 text-secondary animate-spin" />
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : recentLeads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSourceIcon(lead.source)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.company || lead.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No leads yet</p>
              <p className="text-sm mt-1">Run scrapers or add leads manually</p>
              <a
                href="/scraping"
                className="inline-block mt-4 px-4 py-2 bg-secondary text-primary rounded-lg font-medium hover:bg-opacity-90"
              >
                Run Scrapers
              </a>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/scraping"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-secondary text-primary rounded-lg">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Run Lead Scrapers</p>
                <p className="text-sm text-gray-500">Find new leads from Google Maps, Instagram</p>
              </div>
            </a>

            <a
              href="/leads"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Leads</p>
                <p className="text-sm text-gray-500">Add, import, or edit your leads</p>
              </div>
            </a>

            <a
              href="/campaigns"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-purple-500 text-white rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Campaigns</p>
                <p className="text-sm text-gray-500">Create and manage campaigns</p>
              </div>
            </a>

            <a
              href="/templates"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Templates</p>
                <p className="text-sm text-gray-500">Customize your email templates</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Automation Status */}
      <div className="mt-8 bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">System Status</h3>
            <p className="text-gray-300">Your marketing automation is connected to Supabase.</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span>Database Connected</span>
            </div>
            <p className="text-sm text-gray-300">Emails paused (testing mode)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
