'use client';

import React, { useState } from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import { Table, TableColumn, Badge, Card, CardBody } from '@/components/ui';
import { formatDate } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

interface ReferralUser {
  id: string;
  username: string;
  email: string;
  registeredAt: string;
  totalSpent: number;
  commission: number;
  status: 'active' | 'inactive';
}

const mockReferralUsers: ReferralUser[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john***@example.com',
    registeredAt: '2024-01-15T10:30:00Z',
    totalSpent: 1250.00,
    commission: 62.50,
    status: 'active',
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane***@example.com',
    registeredAt: '2024-01-20T14:45:00Z',
    totalSpent: 890.00,
    commission: 44.50,
    status: 'active',
  },
  {
    id: '3',
    username: 'mike_wang',
    email: 'mike***@example.com',
    registeredAt: '2024-02-05T09:15:00Z',
    totalSpent: 0,
    commission: 0,
    status: 'inactive',
  },
  {
    id: '4',
    username: 'lisa_chen',
    email: 'lisa***@example.com',
    registeredAt: '2024-02-10T16:20:00Z',
    totalSpent: 3200.00,
    commission: 160.00,
    status: 'active',
  },
  {
    id: '5',
    username: 'david_liu',
    email: 'david***@example.com',
    registeredAt: '2024-02-18T11:00:00Z',
    totalSpent: 560.00,
    commission: 28.00,
    status: 'active',
  },
];

const stats = {
  totalUsers: mockReferralUsers.length,
  activeUsers: mockReferralUsers.filter((u) => u.status === 'active').length,
  totalCommission: mockReferralUsers.reduce((sum, u) => sum + u.commission, 0),
};

export default function RecommendedTab() {
  const { t } = useTranslation();
  const [users] = useState<ReferralUser[]>(mockReferralUsers);

  const columns: TableColumn<ReferralUser>[] = [
    {
      title: t('affiliate.user'),
      dataIndex: 'username',
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-900">{record.username}</p>
          <p className="text-sm text-gray-500">{record.email}</p>
        </div>
      ),
    },
    {
      title: t('affiliate.registeredAt'),
      dataIndex: 'registeredAt',
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          {formatDate(value as string, 'datetime')}
        </div>
      ),
    },
    {
      title: t('affiliate.totalSpent'),
      dataIndex: 'totalSpent',
      align: 'right',
      render: (value) => (
        <span className="font-medium text-gray-900">
          ${(value as number).toFixed(2)}
        </span>
      ),
    },
    {
      title: t('affiliate.commission'),
      dataIndex: 'commission',
      align: 'right',
      render: (value) => (
        <span className="font-medium text-primary-600">
          ${(value as number).toFixed(2)}
        </span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      align: 'center',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'default'}>
          {value === 'active' ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('affiliate.totalReferrals')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('affiliate.activeUsers')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-100">
                <DollarSign className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('affiliate.totalCommission')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalCommission.toFixed(2)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Referral users list */}
      <Card shadow="sm">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 10,
            total: users.length,
          }}
          emptyText={t('affiliate.noReferralUsers')}
        />
      </Card>
    </div>
  );
}
