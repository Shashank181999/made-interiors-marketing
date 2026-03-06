'use client';

import { useState } from 'react';
import { Plus, Edit, Eye, Copy, X, Mail } from 'lucide-react';
import { defaultTemplates } from '@/lib/templates';
import type { EmailTemplate } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof defaultTemplates[0] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      welcome: 'bg-blue-500 text-white',
      portfolio: 'bg-purple-500 text-white',
      follow_up: 'bg-yellow-500 text-black',
      case_study: 'bg-green-500 text-white',
      offer: 'bg-red-500 text-white',
    };
    return colors[type] || 'bg-gray-500 text-white';
  };

  const handlePreview = (template: typeof defaultTemplates[0]) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleDuplicate = (template: typeof defaultTemplates[0]) => {
    const newTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Pre-built email templates for your campaigns</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white font-medium rounded-lg w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            {/* Preview thumbnail */}
            <div className="h-32 sm:h-40 bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 flex items-center justify-center relative">
              <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 opacity-60" />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                  {template.type.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{template.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">{template.subject}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-medium active:bg-red-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  className="p-2.5 bg-zinc-100 rounded-lg active:bg-zinc-200 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-zinc-600" />
                </button>
                <button
                  className="p-2.5 bg-zinc-100 rounded-lg active:bg-zinc-200 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 flex items-start sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-xl w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between gap-2 bg-white sticky top-0 z-10">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedTemplate.name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Subject: {selectedTemplate.subject}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 bg-zinc-100 rounded-lg text-zinc-600 active:bg-zinc-200 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-[600px] mx-auto">
                <iframe
                  srcDoc={selectedTemplate.body.replace(/\{\{name\}\}/g, 'Ahmed')}
                  className="w-full border-0"
                  style={{ height: '600px' }}
                  title="Email Preview"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 bg-white">
              <button
                onClick={() => setShowPreview(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-zinc-600 bg-zinc-100 rounded-lg text-sm font-medium active:bg-zinc-200 transition-colors"
              >
                Close
              </button>
              <button className="w-full sm:w-auto px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg text-sm active:bg-red-600 transition-colors">
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
