'use client';

import { useState } from 'react';
import { Zap, Play, Pause, Plus, Clock, Mail, Bell, Trash2 } from 'lucide-react';
import type { AutomationRule } from '@/types';

const initialRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Welcome New Leads',
    trigger: 'new_lead',
    action: 'send_email',
    template_id: 'welcome',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Follow-up After 3 Days',
    trigger: 'no_open_3_days',
    action: 'send_email',
    template_id: 'follow_up_1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Portfolio for Interested Leads',
    trigger: 'opened_no_click',
    action: 'send_email',
    template_id: 'portfolio',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Final Follow-up',
    trigger: 'no_reply_5_days',
    action: 'send_email',
    template_id: 'follow_up_2',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Mark Cold After No Response',
    trigger: 'no_reply_5_days',
    action: 'mark_cold',
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
  },
];

const triggerDescriptions: Record<string, { label: string; description: string; icon: any }> = {
  new_lead: {
    label: 'New Lead Added',
    description: 'When a new lead is added to the system',
    icon: Plus,
  },
  no_open_3_days: {
    label: 'No Open in 3 Days',
    description: 'When a lead hasn\'t opened an email in 3 days',
    icon: Clock,
  },
  opened_no_click: {
    label: 'Opened but No Click',
    description: 'When a lead opened email but didn\'t click',
    icon: Mail,
  },
  no_reply_5_days: {
    label: 'No Reply in 5 Days',
    description: 'When a lead hasn\'t replied in 5 days',
    icon: Clock,
  },
};

const actionDescriptions: Record<string, { label: string; color: string }> = {
  send_email: { label: 'Send Email', color: 'bg-blue-100 text-blue-800' },
  notify: { label: 'Send Notification', color: 'bg-purple-100 text-purple-800' },
  mark_cold: { label: 'Mark as Cold', color: 'bg-gray-100 text-gray-800' },
};

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: 'new_lead' as AutomationRule['trigger'],
    action: 'send_email' as AutomationRule['action'],
    template_id: 'welcome',
  });

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, is_active: !rule.is_active } : rule
      )
    );
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Delete this automation rule?')) {
      setRules((prev) => prev.filter((rule) => rule.id !== id));
    }
  };

  const handleCreateRule = () => {
    if (!newRule.name) {
      alert('Rule name is required');
      return;
    }

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      ...newRule,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setRules((prev) => [...prev, rule]);
    setNewRule({ name: '', trigger: 'new_lead', action: 'send_email', template_id: 'welcome' });
    setShowCreateModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1">Set up automatic email sequences and actions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {/* Automation Flow Diagram */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-secondary" />
          Automation Flow
        </h2>
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">New Lead</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Welcome Email</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Wait 3 Days</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Follow-up #1</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Wait 5 Days</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Final Follow-up</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Reply / Cold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const trigger = triggerDescriptions[rule.trigger];
          const action = actionDescriptions[rule.action];
          const TriggerIcon = trigger?.icon || Zap;

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all ${
                rule.is_active ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      rule.is_active ? 'bg-secondary text-primary' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <TriggerIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-500">{trigger?.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Action</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${action?.color}`}>
                      {action?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={rule.is_active ? 'Pause' : 'Activate'}
                    >
                      {rule.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cron Status */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Automation Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Email Check</p>
            <p className="font-semibold">Every 6 hours</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Follow-up Check</p>
            <p className="font-semibold">Daily at 6:00 AM GST</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Lead Scraping</p>
            <p className="font-semibold">Weekly on Monday</p>
          </div>
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Automation Rule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="E.g., Welcome new leads"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                <select
                  value={newRule.trigger}
                  onChange={(e) =>
                    setNewRule((prev) => ({ ...prev, trigger: e.target.value as AutomationRule['trigger'] }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="new_lead">New Lead Added</option>
                  <option value="no_open_3_days">No Open in 3 Days</option>
                  <option value="opened_no_click">Opened but No Click</option>
                  <option value="no_reply_5_days">No Reply in 5 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={newRule.action}
                  onChange={(e) =>
                    setNewRule((prev) => ({ ...prev, action: e.target.value as AutomationRule['action'] }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="send_email">Send Email</option>
                  <option value="notify">Send Notification</option>
                  <option value="mark_cold">Mark as Cold</option>
                </select>
              </div>
              {newRule.action === 'send_email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Template</label>
                  <select
                    value={newRule.template_id}
                    onChange={(e) => setNewRule((prev) => ({ ...prev, template_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="welcome">Welcome Email</option>
                    <option value="portfolio">Portfolio Showcase</option>
                    <option value="follow_up_1">Follow-up #1</option>
                    <option value="follow_up_2">Follow-up #2 (Final)</option>
                    <option value="special_offer">Special Offer</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                className="px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90"
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
