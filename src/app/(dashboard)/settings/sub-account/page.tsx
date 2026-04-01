'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, UserPlus } from 'lucide-react';
import { Button, Modal, Badge, Dropdown } from '@/components/ui';
import { SubAccountForm, SubAccountData } from '../components/SubAccountForm';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Sub-account management page
 * @description CRUD operations and permission management for team member accounts
 */

// Mock sub-account data
const mockSubAccounts: SubAccountData[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    note: 'Main Admin',
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'operator',
    status: 'active',
  },
  {
    id: '3',
    username: 'mike_wang',
    email: 'mike@example.com',
    role: 'finance',
    status: 'inactive',
    note: 'Finance Account',
  },
  {
    id: '4',
    username: 'lisa_chen',
    email: 'lisa@example.com',
    role: 'customer_service',
    status: 'pending',
  },
];

// Role label mapping
const roleLabels: Record<string, string> = {
  admin: 'Admin',
  operator: 'Operator',
  finance: 'Finance',
  customer_service: 'Customer Service',
  viewer: 'Read Only',
};

// Status variant mapping
const statusVariants: Record<SubAccountData['status'], 'success' | 'danger' | 'warning'> = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning',
};

// Status label mapping
const statusLabels: Record<SubAccountData['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export default function SubAccountPage() {
  const { t } = useTranslation();
  const [subAccounts, setSubAccounts] = useState<SubAccountData[]>(mockSubAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SubAccountData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open add modal
  const handleAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (account: SubAccountData) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  // Save account
  const handleSave = (data: SubAccountData) => {
    if (editingAccount?.id) {
      // Edit mode
      setSubAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id ? { ...data, id: editingAccount.id } : acc
        )
      );
    } else {
      // Add mode
      const newAccount: SubAccountData = {
        ...data,
        id: Date.now().toString(),
      };
      setSubAccounts((prev) => [...prev, newAccount]);
    }
    handleCloseModal();
  };

  // Delete account
  const handleDelete = (id: string) => {
    setSubAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setDeleteConfirmId(null);
  };

  // Toggle account status
  const handleToggleStatus = (id: string) => {
    setSubAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, status: acc.status === 'active' ? 'inactive' : 'active' }
          : acc
      )
    );
  };

  // Get action menu items
  const getActionItems = (account: SubAccountData) => [
    {
      key: 'edit',
      label: t('common.edit'),
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => handleEdit(account),
    },
    {
      key: 'toggle',
      label: account.status === 'active' ? t('common.disable') : t('common.enable'),
      onClick: () => handleToggleStatus(account.id!),
    },
    {
      key: 'delete',
      label: t('common.delete'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => setDeleteConfirmId(account.id!),
      danger: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{t('settings.subAccountManagement')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.subAccountManagementHint')}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={handleAdd}
        >
          {t('settings.addAccount')}
        </Button>
      </div>

      {/* Account list */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                {t('settings.username')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                {t('settings.email')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                {t('settings.role')}
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                {t('common.status')}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subAccounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-gray-500">{t('settings.noSubAccounts')}</p>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={handleAdd}
                  >
                    {t('settings.addFirstAccount')}
                  </Button>
                </td>
              </tr>
            ) : (
              subAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-gray-900">
                        {account.username}
                      </span>
                      {account.note && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {account.note}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {account.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {roleLabels[account.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={statusVariants[account.status]} size="sm">
                      {statusLabels[account.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown
                      trigger={
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                      items={getActionItems(account)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role description */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('settings.rolePermissions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">{t('settings.admin')}: </span>
            <span className="text-gray-500">{t('settings.fullPermissions')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('settings.operator')}: </span>
            <span className="text-gray-500">{t('settings.productOrderManagement')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('settings.finance')}: </span>
            <span className="text-gray-500">{t('settings.billingFinancialReports')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('settings.customerService')}: </span>
            <span className="text-gray-500">{t('settings.orderQueriesCommunication')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('settings.readOnly')}: </span>
            <span className="text-gray-500">{t('settings.viewOnlyNoEdit')}</span>
          </div>
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? t('settings.editAccount') : t('settings.addAccount')}
        size="lg"
      >
        <SubAccountForm
          initialData={editingAccount || undefined}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          showPasswordField={!editingAccount}
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
          {t('settings.deleteSubAccountConfirm')}
        </p>
      </Modal>
    </div>
  );
}
