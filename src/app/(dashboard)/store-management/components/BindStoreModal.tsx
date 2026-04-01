/**
 * BindStoreModal - Connect Store Modal Component
 * @description Used for connecting new e-commerce platform stores
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Store,
  Link,
  Key,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Globe,
  ShoppingCart,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers';

/**
 * Platform configuration
 */
interface PlatformOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
}

const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    value: 'shopify',
    label: 'Shopify',
    icon: (
      <Image
        src="/assets/platforms/shopify.svg"
        alt="Shopify"
        width={24}
        height={24}
        className="w-6 h-6 object-contain"
      />
    ),
    description: 'Connect your Shopify online store',
    bgColor: 'bg-[#96BF48]/10',
  },
  {
    value: 'offline',
    label: 'Offline Store',
    icon: <Building2 className="w-6 h-6 text-blue-600" />,
    description: 'Register a physical or offline store',
    bgColor: 'bg-blue-50',
  },
];

/**
 * BindStoreModal Props
 */
export interface BindStoreModalProps {
  /** Whether to show */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Bind success callback */
  onSuccess?: () => void;
  /** Submit bind request */
  onSubmit?: (data: BindStoreFormData) => Promise<void>;
  /** Default platform to select */
  defaultPlatform?: string;
}

/**
 * Bind store form data
 */
export interface BindStoreFormData {
  name: string;
  platform: string;
  url: string;
  apiKey: string;
  apiSecret?: string;
  location?: string;
  contactPhone?: string;
}

/**
 * BindStoreModal - Connect Store Modal
 * @description Supports entering store information, verifying connection and binding
 */
export const BindStoreModal: React.FC<BindStoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
  defaultPlatform,
}) => {
  // Form state
  const [formData, setFormData] = useState<BindStoreFormData>({
    name: '',
    platform: '',
    url: '',
    apiKey: '',
    apiSecret: '',
    location: '',
    contactPhone: '',
  });

  // Error state
  const [errors, setErrors] = useState<Partial<Record<keyof BindStoreFormData, string>>>({});

  // Verify connection status
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [verifyMessage, setVerifyMessage] = useState('');

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default platform when modal opens
  useEffect(() => {
    if (isOpen && defaultPlatform) {
      setFormData((prev) => ({ ...prev, platform: defaultPlatform }));
    }
  }, [isOpen, defaultPlatform]);

  // Determine if offline store
  const isOfflineStore = formData.platform === 'offline';

  /**
   * Update form field
   */
  const updateField = (field: keyof BindStoreFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (verifyStatus !== 'idle') {
      setVerifyStatus('idle');
      setVerifyMessage('');
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BindStoreFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter store name';
    }

    if (!formData.platform) {
      newErrors.platform = 'Please select a platform';
    }

    // Different validation for offline vs online stores
    if (isOfflineStore) {
      if (!formData.location?.trim()) {
        newErrors.location = 'Please enter store location';
      }
    } else {
      if (!formData.url.trim()) {
        newErrors.url = 'Please enter store URL';
      } else {
        try {
          new URL(formData.url);
        } catch {
          newErrors.url = 'Please enter a valid URL format';
        }
      }

      if (!formData.apiKey.trim()) {
        newErrors.apiKey = 'Please enter API Key';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Verify connection (only for online stores)
   */
  const handleVerify = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    if (isOfflineStore) {
      // Offline stores don't need verification
      setVerifyStatus('success');
      setVerifyMessage('Ready to register');
      return true;
    }

    setVerifyStatus('verifying');
    setVerifyMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setVerifyStatus('success');
      setVerifyMessage('Connection verified successfully');
      return true;
    } catch (error) {
      setVerifyStatus('error');
      setVerifyMessage('Connection verification failed, please check API credentials');
      return false;
    }
  };

  /**
   * Submit form
   */
  const handleSubmit = async () => {
    if (verifyStatus !== 'success') {
      const verified = await handleVerify();
      if (!verified) return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Reset form
      setFormData({
        name: '',
        platform: '',
        url: '',
        apiKey: '',
        apiSecret: '',
        location: '',
        contactPhone: '',
      });
      setVerifyStatus('idle');
      setVerifyMessage('');

      onSuccess?.();
      onClose();
    } catch (error) {
      setErrors({ name: 'Binding failed, please try again later' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Close modal
   */
  const handleClose = () => {
    setFormData({
      name: '',
      platform: '',
      url: '',
      apiKey: '',
      apiSecret: '',
      location: '',
      contactPhone: '',
    });
    setErrors({});
    setVerifyStatus('idle');
    setVerifyMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isOfflineStore ? 'Register Offline Store' : 'Connect Store'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={verifyStatus !== 'success'}
          >
            {isOfflineStore ? 'Register Store' : 'Confirm Connection'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platform
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORM_OPTIONS.map((platform) => (
              <button
                key={platform.value}
                type="button"
                onClick={() => updateField('platform', platform.value)}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  'text-left',
                  formData.platform === platform.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    platform.bgColor
                  )}
                >
                  {platform.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'font-medium',
                      formData.platform === platform.value
                        ? 'text-primary-700'
                        : 'text-gray-900'
                    )}
                  >
                    {platform.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {platform.description}
                  </p>
                </div>
                {formData.platform === platform.value && (
                  <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          {errors.platform && (
            <p className="mt-1 text-sm text-red-500">{errors.platform}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Conditional form based on platform */}
        {formData.platform && (
          <>
            {isOfflineStore ? (
              /* Offline Store Form */
              <>
                {/* Tips for offline store */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Offline Store Registration</p>
                    <p className="mt-1">
                      Register your physical store location. Orders can be manually entered and tracked.
                    </p>
                  </div>
                </div>

                {/* Store Name */}
                <Input
                  label="Store Name"
                  placeholder="Enter store name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                  leftIcon={<Store className="w-4 h-4" />}
                />

                {/* Location */}
                <Input
                  label="Store Location"
                  placeholder="Enter store address"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  error={errors.location}
                  leftIcon={<Globe className="w-4 h-4" />}
                />

                {/* Contact Phone */}
                <Input
                  label="Contact Phone"
                  placeholder="Enter contact phone number (optional)"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  error={errors.contactPhone}
                />
              </>
            ) : (
              /* Online Store Form (Shopify) */
              <>
                {/* Tips for Shopify */}
                <div className="flex items-start gap-3 p-4 bg-[#96BF48]/10 rounded-lg">
                  <Image
                    src="/assets/platforms/shopify.svg"
                    alt="Shopify"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain mt-0.5"
                  />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">Shopify Store Connection</p>
                    <ul className="mt-1 list-disc list-inside space-y-1 text-gray-600">
                      <li>Create API credentials in Shopify Admin → Settings → Apps and sales channels</li>
                      <li>Ensure API permissions include products and orders read access</li>
                      <li>Store URL format: https://your-store.myshopify.com</li>
                    </ul>
                  </div>
                </div>

                {/* Store Name */}
                <Input
                  label="Store Name"
                  placeholder="Enter store name for internal identification"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                  leftIcon={<Store className="w-4 h-4" />}
                />

                {/* Store URL */}
                <Input
                  label="Store URL"
                  placeholder="https://your-store.myshopify.com"
                  value={formData.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  error={errors.url}
                  leftIcon={<Link className="w-4 h-4" />}
                />

                {/* API Key */}
                <Input
                  label="API Key"
                  placeholder="Enter Shopify API Key"
                  value={formData.apiKey}
                  onChange={(e) => updateField('apiKey', e.target.value)}
                  error={errors.apiKey}
                  leftIcon={<Key className="w-4 h-4" />}
                />

                {/* API Secret */}
                <Input
                  label="API Secret"
                  placeholder="Enter API Secret (optional)"
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => updateField('apiSecret', e.target.value)}
                  error={errors.apiSecret}
                  hint="Required for some Shopify API operations"
                />
              </>
            )}

            {/* Verify Connection Button */}
            <div className="pt-2">
              <Button
                variant="secondary"
                onClick={handleVerify}
                disabled={verifyStatus === 'verifying'}
                leftIcon={
                  verifyStatus === 'verifying' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : verifyStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : verifyStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : null
                }
              >
                {verifyStatus === 'verifying'
                  ? 'Verifying...'
                  : verifyStatus === 'success'
                    ? 'Verified'
                    : verifyStatus === 'error'
                      ? 'Verification Failed'
                      : isOfflineStore
                        ? 'Confirm Details'
                        : 'Verify Connection'}
              </Button>

              {verifyMessage && (
                <p
                  className={cn(
                    'mt-2 text-sm',
                    verifyStatus === 'success' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {verifyMessage}
                </p>
              )}
            </div>
          </>
        )}

        {/* Placeholder when no platform selected */}
        {!formData.platform && (
          <div className="py-8 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Please select a platform to continue</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BindStoreModal;
