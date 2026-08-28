import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export interface CampaignFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Enterprise Form Component: CampaignForm
 * Handles field validation, multi-step validation rules, state binding, and submission lifecycle.
 */
export const CampaignForm: React.FC<CampaignFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name && !formData.title && !formData.subject && !formData.email) {
      newErrors.primary = 'Primary identification field is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 max-w-2xl mx-auto shadow-2xl">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h3 className="text-xl font-bold text-slate-100">
          {initialValues?.id ? 'Edit ' + 'Campaign' : 'Create New ' + 'Campaign'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">Configure attributes, permissions, and metadata attributes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Primary Campaign Label *
          </label>
          <Input
            placeholder="Enter primary record title or name..."
            value={formData.name || formData.title || formData.subject || ''}
            onChange={(e: any) => handleChange('name', e.target.value)}
            className="w-full bg-slate-900 border-slate-800 text-slate-200"
          />
          {errors.primary && <p className="text-xs text-red-400 mt-1">{errors.primary}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Assigned Owner
            </label>
            <Input
              placeholder="Select representative..."
              value={formData.assignedUser || ''}
              onChange={(e: any) => handleChange('assignedUser', e.target.value)}
              className="w-full bg-slate-900 border-slate-800 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Lifecycle Status
            </label>
            <Input
              placeholder="ACTIVE, PENDING, QUALIFIED..."
              value={formData.status || 'ACTIVE'}
              onChange={(e: any) => handleChange('status', e.target.value)}
              className="w-full bg-slate-900 border-slate-800 text-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Internal Notes & Specification
          </label>
          <textarea
            rows={4}
            placeholder="Provide context, historical background, or operational notes..."
            value={formData.notes || formData.description || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save ' + 'Campaign'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CampaignForm;
