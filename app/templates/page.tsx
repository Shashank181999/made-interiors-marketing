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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Pre-built email templates for your campaigns</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Preview thumbnail */}
            <div className="h-40 bg-gradient-to-br from-primary to-accent p-4 flex items-center justify-center">
              <Mail className="w-16 h-16 text-secondary opacity-50" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                  {template.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.subject}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
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
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedTemplate.name}</h2>
                <p className="text-sm text-gray-500">Subject: {selectedTemplate.subject}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <div
                className="border border-gray-200 rounded-lg"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
              />
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90">
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
