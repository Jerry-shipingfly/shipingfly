'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Address data structure
 */
export interface AddressData {
  /** Address ID */
  id?: string;
  /** Recipient name */
  name: string;
  /** Phone number */
  phone: string;
  /** Country/Region */
  country: string;
  /** Province/State */
  province: string;
  /** City */
  city: string;
  /** Detailed address */
  address: string;
  /** Postal code */
  zipCode: string;
  /** Whether it's the default address */
  isDefault: boolean;
}

/**
 * AddressForm component Props interface
 */
export interface AddressFormProps {
  /** Initial data */
  initialData?: Partial<AddressData>;
  /** Save callback */
  onSubmit?: (data: AddressData) => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Custom styles */
  className?: string;
}

/**
 * Address Form Component
 * @description Used for adding and editing shipping addresses
 */
export const AddressForm: React.FC<AddressFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  className,
}) => {
  const { t } = useTranslation();

  /**
   * Country options
   */
  const countryOptions = [
    { value: 'CN', label: t('countries.china') },
    { value: 'US', label: t('countries.unitedStates') },
    { value: 'UK', label: t('countries.unitedKingdom') },
    { value: 'JP', label: t('countries.japan') },
    { value: 'KR', label: t('countries.southKorea') },
    { value: 'DE', label: t('countries.germany') },
    { value: 'FR', label: t('countries.france') },
    { value: 'AU', label: t('countries.australia') },
  ];

  const [formData, setFormData] = React.useState<AddressData>({
    name: initialData.name || '',
    phone: initialData.phone || '',
    country: initialData.country || 'CN',
    province: initialData.province || '',
    city: initialData.city || '',
    address: initialData.address || '',
    zipCode: initialData.zipCode || '',
    isDefault: initialData.isDefault || false,
    id: initialData.id,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof AddressData, string>>>({});

  // Handle field change
  const handleChange = (field: keyof AddressData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('settings.validation.enterRecipientName');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('settings.validation.enterPhone');
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = t('settings.validation.invalidPhone');
    }

    if (!formData.province.trim()) {
      newErrors.province = t('settings.validation.enterProvince');
    }

    if (!formData.city.trim()) {
      newErrors.city = t('settings.validation.enterCity');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('settings.validation.enterAddress');
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = t('settings.validation.enterPostalCode');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {/* Recipient and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('settings.recipient')}
          placeholder={t('settings.enterRecipientName')}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label={t('settings.phone')}
          placeholder={t('settings.enterPhoneNumber')}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          required
        />
      </div>

      {/* Country and Province */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t('settings.countryRegion')}
          options={countryOptions}
          value={formData.country}
          onChange={(value) => handleChange('country', value)}
        />

        <Input
          label={t('settings.provinceState')}
          placeholder={t('settings.enterProvinceState')}
          value={formData.province}
          onChange={(e) => handleChange('province', e.target.value)}
          error={errors.province}
          required
        />
      </div>

      {/* City and Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('settings.city')}
          placeholder={t('settings.enterCity')}
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          error={errors.city}
          required
        />

        <Input
          label={t('settings.postalCode')}
          placeholder={t('settings.enterPostalCode')}
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          error={errors.zipCode}
          required
        />
      </div>

      {/* Detailed Address */}
      <Input
        label={t('settings.detailedAddress')}
        placeholder={t('settings.enterDetailedAddress')}
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
        required
      />

      {/* Set as Default */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          {t('settings.setAsDefault')}
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
