'use client';

import { useState } from 'react';
import { defaultTemplates } from '@/lib/templates';

export default function PreviewEmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplates[0]);
  const [leadName, setLeadName] = useState('Ahmed');

  // Replace placeholders with sample data
  const getPreviewHtml = () => {
    return selectedTemplate.body
      .replace(/\{\{name\}\}/g, leadName)
      .replace(/\{\{full_name\}\}/g, leadName + ' Hassan')
      .replace(/\{\{company\}\}/g, 'Golden Properties');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Preview</h1>
        <p className="text-gray-600 mt-1">See how your emails will look to recipients</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const template = defaultTemplates.find(t => t.id === e.target.value);
                if (template) setSelectedTemplate(template);
              }}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Name (Preview)</label>
            <input
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter name"
            />
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="bg-gray-100 rounded-t-xl p-4 border border-gray-200 border-b-0">
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-20 text-gray-500">From:</span>
            <span className="font-medium">Made Interiors &lt;marketing@madeinteriors.ae&gt;</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-500">To:</span>
            <span className="font-medium">{leadName.toLowerCase()}@company.ae</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-500">Subject:</span>
            <span className="font-medium">{selectedTemplate.subject}</span>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
        <iframe
          srcDoc={getPreviewHtml()}
          className="w-full h-[600px] border-0"
          title="Email Preview"
        />
      </div>

      {/* Template Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">When is this email sent?</h2>
        <div className="space-y-3">
          {selectedTemplate.id === 'welcome' && (
            <p className="text-gray-600">✅ Sent automatically when a <strong>new lead is added</strong> to the system.</p>
          )}
          {selectedTemplate.id === 'portfolio' && (
            <p className="text-gray-600">✅ Sent to leads who <strong>opened the welcome email</strong> but didn't reply.</p>
          )}
          {selectedTemplate.id === 'follow_up_1' && (
            <p className="text-gray-600">✅ Sent <strong>3 days after</strong> the first email if no response.</p>
          )}
          {selectedTemplate.id === 'follow_up_2' && (
            <p className="text-gray-600">✅ <strong>Final follow-up</strong> sent 5 days after follow-up #1.</p>
          )}
          {selectedTemplate.id === 'special_offer' && (
            <p className="text-gray-600">✅ Sent as part of a <strong>special campaign</strong> (manual trigger).</p>
          )}
        </div>
      </div>
    </div>
  );
}
