'use client';

import { useState } from 'react';
import { Plus, Edit, Eye, Copy, Trash2, Mail } from 'lucide-react';
import { defaultTemplates } from '@/lib/templates';
import type { EmailTemplate } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof defaultTemplates[0] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      welcome: 'bg-blue-100 text-blue-800',
      portfolio: 'bg-purple-100 text-purple-800',
      follow_up: 'bg-yellow-100 text-yellow-800',
      case_study: 'bg-green-100 text-green-800',
      offer: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Preview thumbnail */}
            <div className="h-32 sm:h-40 bg-gradient-to-br from-primary to-accent p-4 flex items-center justify-center">
              <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-secondary opacity-50" />
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{template.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeColor(template.type)}`}>
                  {template.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">{template.subject}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  className="p-2 bg-zinc-700 rounded-lg"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
                <button
                  className="p-2 bg-zinc-700 rounded-lg"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedTemplate.name}</h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Subject: {selectedTemplate.subject}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 bg-zinc-700 rounded-lg text-white flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="p-3 sm:p-4 overflow-auto max-h-[60vh]">
              <div
                className="border border-gray-200 rounded-lg"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
              />
            </div>
            <div className="p-3 sm:p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-white bg-zinc-700 rounded-lg text-sm w-full sm:w-auto"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg text-sm w-full sm:w-auto">
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
