'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { cn } from '@/utils/helpers';

/**
 * Sub-account data structure
 */
export interface SubAccountData {
  /** Account ID */
  id?: string;
  /** Username */
  username: string;
  /** Email */
  email: string;
  /** Role */
  role: string;
  /** Status */
  status: 'active' | 'inactive' | 'pending';
  /** Notes */
  note?: string;
}

/**
 * Role options
 */
export const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'operator', label: 'Operator' },
  { value: 'finance', label: 'Finance' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'viewer', label: 'Read Only' },
];

/**
 * SubAccountForm component Props interface
 */
export interface SubAccountFormProps {
  /** Initial data */
  initialData?: Partial<SubAccountData>;
  /** Save callback */
  onSubmit?: (data: SubAccountData) => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Custom styles */
  className?: string;
  /** Whether to show password fields (shown when creating new) */
  showPasswordField?: boolean;
}

/**
 * Sub-account Form Component
 * @description Used for adding and editing sub-accounts
 */
export const SubAccountForm: React.FC<SubAccountFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  className,
  showPasswordField = true,
}) => {
  const [formData, setFormData] = React.useState<SubAccountData & { password?: string; confirmPassword?: string }>({
    username: initialData.username || '',
    email: initialData.email || '',
    role: initialData.role || 'operator',
    status: initialData.status || 'active',
    note: initialData.note || '',
    password: '',
    confirmPassword: '',
    id: initialData.id,
  });

  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>({});

  // Handle field change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Please enter username';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (showPasswordField) {
      if (!formData.password) {
        newErrors.password = 'Please enter password';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      const { password, confirmPassword, ...accountData } = formData;
      onSubmit(accountData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {/* Username and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Username"
          placeholder="Enter username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>

      {/* Password Fields (only shown when creating) */}
      {showPasswordField && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Enter password again"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />
        </div>
      )}

      {/* Role and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Role"
          options={roleOptions}
          value={formData.role}
          onChange={(value) => handleChange('role', value)}
        />

        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending Activation' },
          ]}
          value={formData.status}
          onChange={(value) => handleChange('status', value)}
        />
      </div>

      {/* Notes */}
      <Input
        label="Notes"
        placeholder="Optional notes"
        value={formData.note}
        onChange={(e) => handleChange('note', e.target.value)}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          {initialData.id ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default SubAccountForm;
