'use client';

import { useState } from 'react';
import { Save, Mail, Database, Key, Globe, Bell, Clock } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Made Interiors',
    companyEmail: 'marketing@madeinteriors.ae',
    website: 'https://madeinteriorsdemo.web.app',
    timezone: 'Asia/Dubai',
    supabaseUrl: '',
    supabaseKey: '',
    resendKey: '',
    dailyEmailLimit: 100,
    followUpDays: 3,
    markColdAfterDays: 14,
    enableNotifications: true,
    notificationEmail: '',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real app, this would save to backend
    localStorage.setItem('marketingSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your marketing automation</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            Company Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, companyEmail: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p className="text-xs text-gray-500 mt-1">Emails will be sent from this address</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => setSettings((prev) => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-secondary" />
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
              <input
                type="text"
                value={settings.supabaseUrl}
                onChange={(e) => setSettings((prev) => ({ ...prev, supabaseUrl: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="https://xxx.supabase.co"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supabase Anon Key</label>
              <input
                type="password"
                value={settings.supabaseKey}
                onChange={(e) => setSettings((prev) => ({ ...prev, supabaseKey: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="eyJhbGc..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resend API Key</label>
              <input
                type="password"
                value={settings.resendKey}
                onChange={(e) => setSettings((prev) => ({ ...prev, resendKey: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="re_xxx..."
              />
              <p className="text-xs text-gray-500 mt-1">Get free API key at resend.com</p>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Automation Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Email Limit</label>
              <input
                type="number"
                value={settings.dailyEmailLimit}
                onChange={(e) => setSettings((prev) => ({ ...prev, dailyEmailLimit: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                min="1"
                max="500"
              />
              <p className="text-xs text-gray-500 mt-1">Resend free tier: 100 emails/day</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up After (days)</label>
              <input
                type="number"
                value={settings.followUpDays}
                onChange={(e) => setSettings((prev) => ({ ...prev, followUpDays: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                min="1"
                max="14"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mark Cold After (days)</label>
              <input
                type="number"
                value={settings.markColdAfterDays}
                onChange={(e) => setSettings((prev) => ({ ...prev, markColdAfterDays: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                min="7"
                max="30"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Get notified when leads reply</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings((prev) => ({ ...prev, enableNotifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            {settings.enableNotifications && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
                <input
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings((prev) => ({ ...prev, notificationEmail: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="your@email.com"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Schema Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-secondary" />
          Database Setup (Supabase)
        </h2>
        <p className="text-gray-600 mb-4">Run this SQL in your Supabase SQL editor to create the required tables:</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_contacted TIMESTAMP,
  email_count INT DEFAULT 0
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_id TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  leads_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  replied_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  scheduled_at TIMESTAMP
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  campaign_id UUID REFERENCES campaigns(id),
  template_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Automation rules table
CREATE TABLE automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  template_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);`}
        </pre>
      </div>
    </div>
  );
}
