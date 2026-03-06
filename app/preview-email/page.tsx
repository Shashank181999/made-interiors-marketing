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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Email Preview</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">See how your emails will look to recipients</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 lg:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const template = defaultTemplates.find(t => t.id === e.target.value);
                if (template) setSelectedTemplate(template);
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              placeholder="Enter name"
            />
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="bg-gray-100 rounded-t-xl p-3 sm:p-4 border border-gray-200 border-b-0">
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-20 text-gray-500 font-medium">From:</span>
            <span className="font-medium truncate">Made Interiors &lt;marketing@madeinteriors.ae&gt;</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-20 text-gray-500 font-medium">To:</span>
            <span className="font-medium truncate">{leadName.toLowerCase()}@company.ae</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-20 text-gray-500 font-medium">Subject:</span>
            <span className="font-medium">{selectedTemplate.subject}</span>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-gray-200 rounded-b-xl shadow-sm border border-gray-200 overflow-hidden p-2 sm:p-4">
        <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-lg" style={{ maxWidth: '600px' }}>
          <iframe
            srcDoc={getPreviewHtml()}
            className="w-full border-0"
            style={{ height: '600px' }}
            title="Email Preview"
          />
        </div>
      </div>

      {/* Template Info */}
      <div className="mt-6 lg:mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">When is this email sent?</h2>
        <div className="space-y-3 text-sm sm:text-base">
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
