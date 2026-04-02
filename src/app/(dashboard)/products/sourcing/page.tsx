/**
 * Sourcing Request List Page
 * @description Manage user sourcing requests
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Clock, Trash2 } from 'lucide-react';
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
      title: 'Image',
      dataIndex: 'images',
      width: 80,
      align: 'center',
      render: (value) => {
        const src = (value as string[] | undefined)?.[0];
        return src ? (
          <img
            src={src}
            alt=""
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 mx-auto"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        );
      },
    },
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      width: 100,
      render: (value) => (
        <span className="font-mono text-sm text-gray-900">{value as string}</span>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 260,
      render: (value) => (
        <span className="text-sm text-gray-600 line-clamp-2 truncate block max-w-[260px]">
          {value as string}
        </span>
      ),
    },
    {
      title: 'Target Price',
      dataIndex: 'targetPrice',
      width: 110,
      render: (value) => (
        <span className="whitespace-nowrap">{value ? `$${value}` : '-'}</span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 80,
      align: 'center',
      render: (value) => (value ? (value as number).toLocaleString() : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (value) => <StatusBadge status={value as string} colorMap={statusColorMap} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 110,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {formatDate(value as string, 'short')}
        </span>
      ),
    },
    {
      title: 'Actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <button
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Delete sourcing request:', record.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
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
