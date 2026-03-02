'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  Search,
  Mail,
  Trash2,
  Eye,
  RefreshCw,
  Users,
} from 'lucide-react';
import type { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'manual' as Lead['source'],
    notes: '',
  });

  // Fetch leads from API (Supabase)
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
    setLoading(false);
  };

  // Load leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length < 2) continue;

        const leadData = {
          name: values[headers.indexOf('name')] || values[0] || 'Unknown',
          email: values[headers.indexOf('email')] || values[1] || '',
          phone: values[headers.indexOf('phone')] || values[2] || '',
          company: values[headers.indexOf('company')] || values[3] || '',
          source: 'linkedin',
        };

        if (leadData.email) {
          try {
            await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(leadData),
            });
            importedCount++;
          } catch (error) {
            console.error('Error importing lead:', error);
          }
        }
      }

      alert(`Imported ${importedCount} leads successfully!`);
      fetchLeads(); // Refresh the list
    };
    reader.readAsText(file);
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      alert('Name and email are required');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      const data = await response.json();
      if (data.success) {
        setNewLead({ name: '', email: '', phone: '', company: '', source: 'manual', notes: '' });
        setShowAddModal(false);
        fetchLeads(); // Refresh the list
      } else {
        alert('Error adding lead: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead');
    }
  };

  const handleSendEmail = (leadIds: string[]) => {
    alert(`Email campaign started for ${leadIds.length} lead(s)`);
  };

  const handleDeleteLeads = async (leadIds: string[]) => {
    if (!confirm(`Delete ${leadIds.length} lead(s)?`)) return;

    for (const id of leadIds) {
      try {
        await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }

    setSelectedLeads([]);
    fetchLeads(); // Refresh the list
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage your marketing leads</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="opened">Opened</option>
            <option value="clicked">Clicked</option>
            <option value="replied">Replied</option>
            <option value="cold">Cold</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">All Sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="google_maps">Google Maps</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="bg-primary text-white rounded-lg p-4 mb-6 flex items-center justify-between">
          <span>{selectedLeads.length} lead(s) selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSendEmail(selectedLeads)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-opacity-90"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
            <button
              onClick={() => handleDeleteLeads(selectedLeads)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-secondary animate-spin" />
          <p className="text-gray-500">Loading leads from database...</p>
        </div>
      )}

      {/* Leads Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(filteredLeads.map((l) => l.id));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Lead</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Company</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Source</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Emails</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads((prev) => [...prev, lead.id]);
                        } else {
                          setSelectedLeads((prev) => prev.filter((id) => id !== lead.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.company || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="text-lg" title={lead.source}>
                      {getSourceIcon(lead.source)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.email_count}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendEmail([lead.id])}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteLeads([lead.id])}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No leads yet</p>
              <p className="text-sm mt-1">Run scrapers or import CSV to add leads</p>
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href="/scraping"
                  className="px-4 py-2 bg-secondary text-primary rounded-lg font-medium hover:bg-opacity-90"
                >
                  Run Scrapers
                </a>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Import CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="+971501234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, source: e.target.value as Lead['source'] }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="manual">Manual</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="google_maps">Google Maps</option>
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  rows={3}
                  placeholder="Any notes about this lead..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
