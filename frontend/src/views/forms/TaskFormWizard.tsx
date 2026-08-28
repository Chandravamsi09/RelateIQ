import React, { useState } from 'react';

export interface TaskFormWizardProps {
  tenantId?: string;
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

export const TaskFormWizard: React.FC<TaskFormWizardProps> = ({ tenantId = 'tenant-acme-corp', initialValues = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialValues.name || '',
    status: initialValues.status || 'ACTIVE',
    notes: initialValues.notes || '',
    priority: initialValues.priority || 'MEDIUM'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...formData, tenantId, submittedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <h3 className="text-base font-bold text-slate-100">Task Configuration Wizard</h3>
        <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">SOC2 Secure</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-400 mb-1">Task Identifier / Title *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Enter Task name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Lifecycle Status</label>
            <select
              value={formData.status}
              onChange={e => handleChange('status', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Priority Classification</label>
            <select
              value={formData.priority}
              onChange={e => handleChange('priority', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-400 mb-1">Internal Notes & Context</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="Optional context or audit notes..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold">
              Cancel
            </button>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow">
            Save Task ➔
          </button>
        </div>
      </form>
    </div>
  );
};
