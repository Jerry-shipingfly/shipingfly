/**
 * BindOfflineStoreModal - Register Offline Store Modal
 * @description Simple modal for registering offline store with just URL/address
 */

'use client';

import React, { useState } from 'react';
import { Building2, MapPin, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers';
import { storeService } from '@/services/store.service';

/**
 * BindOfflineStoreModal Props
 */
export interface BindOfflineStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * BindOfflineStoreModal - Simple offline store registration modal
 */
export const BindOfflineStoreModal: React.FC<BindOfflineStoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: { name?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter store name';
    }

    if (!address.trim()) {
      newErrors.address = 'Please enter store address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Call API to register offline store
      await storeService.bindStore({
        name: name.trim(),
        platform: 'offline',
        url: address.trim(), // Use address as URL for offline stores
      });

      // Reset and close
      setName('');
      setAddress('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ name: 'Failed to register store. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    setName('');
    setAddress('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Register Offline Store"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!name.trim() || !address.trim()}
          >
            Register Store
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Register your offline store</p>
            <p className="text-sm text-gray-600">Add your physical store location</p>
          </div>
        </div>

        {/* Store Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Store Name
          </label>
          <Input
            placeholder="Enter store name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            leftIcon={<Building2 className="w-4 h-4" />}
            size="lg"
          />
        </div>

        {/* Store Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Store Address
          </label>
          <Input
            placeholder="Enter store address or location URL"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
            }}
            error={errors.address}
            leftIcon={<MapPin className="w-4 h-4" />}
            size="lg"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: 123 Main St, City, Country or Google Maps URL
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default BindOfflineStoreModal;
