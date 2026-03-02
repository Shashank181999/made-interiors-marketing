'use client';

import { useState } from 'react';
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Mail,
  Users,
  MousePointer,
  MessageSquare,
  Eye,
} from 'lucide-react';
import type { Campaign } from '@/types';
import { defaultTemplates } from '@/lib/templates';

// Demo campaigns
const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'LinkedIn Outreach Q1 2024',
    subject: 'Transform Your Space with Made Interiors Dubai',
    template_id: 'welcome',
    status: 'active',
    leads_count: 50,
    sent_count: 45,
    opened_count: 15,
    clicked_count: 5,
    replied_count: 2,
    created_at: '2024-01-01T00:00:00Z',
    scheduled_at: '2024-01-15T06:00:00Z',
  },
  {
    id: '2',
    name: 'Portfolio Showcase Campaign',
    subject: 'See Our Latest Interior Design Projects in Dubai',
    template_id: 'portfolio',
    status: 'active',
    leads_count: 35,
    sent_count: 30,
    opened_count: 12,
    clicked_count: 4,
    replied_count: 1,
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '3',
    name: 'Follow-up Sequence',
    subject: 'Quick question about your interior project',
    template_id: 'follow_up_1',
    status: 'paused',
    leads_count: 25,
    sent_count: 20,
    opened_count: 8,
    clicked_count: 2,
    replied_count: 0,
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'New Year Special Offer',
    subject: 'Exclusive: 15% Off Interior Design Services',
    template_id: 'special_offer',
    status: 'completed',
    leads_count: 100,
    sent_count: 100,
    opened_count: 35,
    clicked_count: 12,
    replied_count: 5,
    created_at: '2024-01-01T00:00:00Z',
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template_id: 'welcome',
    leads_filter: 'all', // all, new, contacted, opened
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name) {
      alert('Campaign name is required');
      return;
    }

    const template = defaultTemplates.find((t) => t.id === newCampaign.template_id);
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: newCampaign.name,
      subject: template?.subject || 'No Subject',
      template_id: newCampaign.template_id,
      status: 'draft',
      leads_count: 0,
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
      replied_count: 0,
      created_at: new Date().toISOString(),
    };

    setCampaigns((prev) => [campaign, ...prev]);
    setNewCampaign({ name: '', template_id: 'welcome', leads_filter: 'all' });
    setShowCreateModal(false);
  };

  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
          : c
      )
    );
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Delete this campaign?')) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateRate = (count: number, total: number) => {
    if (total === 0) return '0%';
    return `${((count / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage email campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6 text-secondary" />
            <span className="text-sm text-gray-500">Total Campaigns</span>
          </div>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6 text-green-500" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold">{campaigns.filter((c) => c.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-gray-500">Total Sent</span>
          </div>
          <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.sent_count, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-purple-500" />
            <span className="text-sm text-gray-500">Total Replies</span>
          </div>
          <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.replied_count, 0)}</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Subject: {campaign.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                {campaign.status !== 'completed' && (
                  <button
                    onClick={() => handleToggleCampaign(campaign.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      campaign.status === 'active'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title={campaign.status === 'active' ? 'Pause' : 'Start'}
                  >
                    {campaign.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Leads</p>
                <p className="text-lg font-semibold">{campaign.leads_count}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Sent</p>
                <p className="text-lg font-semibold">{campaign.sent_count}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Opened</p>
                <p className="text-lg font-semibold">
                  {campaign.opened_count}
                  <span className="text-xs text-gray-400 ml-1">
                    ({calculateRate(campaign.opened_count, campaign.sent_count)})
                  </span>
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Clicked</p>
                <p className="text-lg font-semibold">
                  {campaign.clicked_count}
                  <span className="text-xs text-gray-400 ml-1">
                    ({calculateRate(campaign.clicked_count, campaign.sent_count)})
                  </span>
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Replied</p>
                <p className="text-lg font-semibold">
                  {campaign.replied_count}
                  <span className="text-xs text-gray-400 ml-1">
                    ({calculateRate(campaign.replied_count, campaign.sent_count)})
                  </span>
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{calculateRate(campaign.sent_count, campaign.leads_count)} complete</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary rounded-full h-2 transition-all"
                  style={{ width: `${(campaign.sent_count / campaign.leads_count) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Q1 LinkedIn Outreach"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Template</label>
                <select
                  value={newCampaign.template_id}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, template_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {defaultTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Leads</label>
                <select
                  value={newCampaign.leads_filter}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, leads_filter: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="all">All Leads</option>
                  <option value="new">New Leads Only</option>
                  <option value="contacted">Contacted (no response)</option>
                  <option value="opened">Opened Email</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
