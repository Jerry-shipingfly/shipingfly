/**
 * Sourcing Request List Page
 * @description Manage user sourcing requests
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Clock, Eye, MoreHorizontal } from 'lucide-react';
import { useSourcingRequests } from '@/hooks/api/useProducts';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { cn } from '@/utils/helpers';
import { formatDate } from '@/utils/helpers';
import { SourcingRequest } from '@/types/product.types';
import { TableColumn } from '@/components/ui/Table';

/**
 * Sourcing Request List Page
 */
export default function SourcingPage() {
  const { requests, isLoading, isError, mutate } = useSourcingRequests();

  // Status color mapping
  const statusColorMap: Record<string, string> = {
    pending: 'yellow',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red',
  };

  // Table column configuration
  const columns: TableColumn<SourcingRequest>[] = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      width: 120,
      render: (value) => (
        <span className="font-mono text-sm text-gray-900">{value as string}</span>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 200,
      render: (value) => (
        <span className="text-sm text-gray-600 line-clamp-2 truncate block max-w-[200px]">{value as string}</span>
      ),
    },
    {
      title: 'Target Price',
      dataIndex: 'targetPrice',
      width: 120,
      render: (value) => (
        <span className="whitespace-nowrap">{value ? `$${value}` : '-'}</span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 80,
      render: (value) => (
        value ? (value as number).toLocaleString() : '-'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <StatusBadge status={value as string} colorMap={statusColorMap} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 150,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {formatDate(value as string, 'datetime')}
        </span>
      ),
    },
    {
      title: 'Actions',
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            title="More"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Refresh list
  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading tip="Loading..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load: {isError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Sourcing Requests"
        subtitle="Submit sourcing requirements and let us help you find suitable suppliers"
        breadcrumb={[
          { label: 'Source Products', href: '/products/all' },
          { label: 'Sourcing Requests' },
        ]}
        actions={
          <Link href="/products/sourcing/new">
            <Button variant="primary" leftIcon={<Plus className="w-5 h-4" />}>
              New Request
            </Button>
          </Link>
        }
      />

      {/* Request list */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="id"
          loading={false}
          emptyText="No sourcing requests yet"
          onRowClick={(record) => {
            console.log('Row clicked:', record.id);
          }}
        />
      </div>
    </div>
  );
}
