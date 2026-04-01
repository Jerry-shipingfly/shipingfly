'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { Button, Modal, Badge } from '@/components/ui';
import { AddressForm, AddressData } from '../components/AddressForm';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Address management page
 * @description CRUD operations and default settings for shipping addresses
 */

// Mock address data
const mockAddresses: AddressData[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+86 138 8888 8888',
    country: 'CN',
    province: 'Guangdong Province',
    city: 'Shenzhen',
    address: 'Room 1001, Building A, xxx Tower, Nanshan District Science Park South',
    zipCode: '518000',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1 234 567 8900',
    country: 'US',
    province: 'California',
    city: 'Los Angeles',
    address: '123 Main Street, Apt 4B',
    zipCode: '90001',
    isDefault: false,
  },
];

// Country code to name mapping
const countryNames: Record<string, string> = {
  CN: 'China',
  US: 'United States',
  UK: 'United Kingdom',
  JP: 'Japan',
  KR: 'South Korea',
  DE: 'Germany',
  FR: 'France',
  AU: 'Australia',
};

export default function AddressPage() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<AddressData[]>(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open add modal
  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (address: AddressData) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  // Save address
  const handleSave = (data: AddressData) => {
    if (editingAddress?.id) {
      // Edit mode
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...data, id: editingAddress.id }
            : data.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
    } else {
      // Add mode
      const newAddress: AddressData = {
        ...data,
        id: Date.now().toString(),
      };
      // If set as default, clear other defaults
      if (data.isDefault) {
        setAddresses((prev) => [
          ...prev.map((addr) => ({ ...addr, isDefault: false })),
          newAddress,
        ]);
      } else {
        setAddresses((prev) => [...prev, newAddress]);
      }
    }
    handleCloseModal();
  };

  // Set as default
  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Delete address
  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('settings.shippingAddresses')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.addressManagementHint')}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAdd}
        >
          {t('settings.addAddress')}
        </Button>
      </div>

      {/* Address list */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('settings.noAddresses')}</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={handleAdd}
            >
              {t('settings.addFirstAddress')}
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'border rounded-lg p-4 transition-colors',
                address.isDefault
                  ? 'border-primary-500 bg-primary-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Address info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {address.name}
                    </span>
                    <span className="text-gray-500">{address.phone}</span>
                    {address.isDefault && (
                      <Badge variant="primary" size="sm">
                        {t('common.default')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {countryNames[address.country] || address.country}
                    {address.province} {address.city} {address.address}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('settings.zipCode')}: {address.zipCode}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id!)}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('settings.setAsDefault')}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(address.id!)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAddress ? t('settings.editAddress') : t('settings.addAddress')}
        size="lg"
      >
        <AddressForm
          initialData={editingAddress || undefined}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t('settings.confirmDelete')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteConfirmId!)}
            >
              {t('settings.confirmDeleteBtn')}
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          {t('settings.deleteAddressConfirm')}
        </p>
      </Modal>
    </div>
  );
}
