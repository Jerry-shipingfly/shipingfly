/**
 * Sample Orders Page
 * @description Display sample application order list with status tracking support
 */

'use client';

import React, { useState } from 'react';
import { Box, Download, Clock, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Table, TableColumn, PaginationConfig } from '@/components/ui/Table';
import { Order, OrderStatus } from '@/types/order.types';
import { useOrders, useOrderDetail } from '@/hooks/api/useOrders';
import { formatPrice, formatDate } from '@/utils/helpers';
import { OrderFilters, sampleOrderStatusOptions, OrderDetailModal } from '../components';

/**
 * Sample order status steps
 */
const sampleStatusSteps = [
  { key: 'pending_payment', label: 'Pending', icon: Clock },
  { key: 'processing', label: 'Approved', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'completed', label: 'Received', icon: PackageCheck },
];

/**
 * Status Progress Component
 */
interface StatusProgressProps {
  status: OrderStatus;
}

const StatusProgress: React.FC<StatusProgressProps> = ({ status }) => {
  const currentIndex = sampleStatusSteps.findIndex(step => step.key === status);

  return (
    <div className="flex items-center gap-2">
      {sampleStatusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-6 h-6 rounded-full
                ${isCompleted ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
                ${isCurrent ? 'ring-2 ring-primary-200 ring-offset-1' : ''}
              `}
              title={step.label}
            >
              <Icon className="w-3 h-3" />
            </div>
            {index < sampleStatusSteps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  index < currentIndex ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Sample Orders Page Component
 */
export default function SampleOrdersPage() {
  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<OrderStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Detail modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch order list
  const { orders, total, isLoading } = useOrders({
    page: currentPage,
    limit: pageSize,
    search: searchValue || undefined,
    status: statusValue || undefined,
    type: 'sample_order',
  });

  // Fetch order detail
  const { order: selectedOrder, isLoading: isLoadingDetail } = useOrderDetail(selectedOrderId);

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusChange = (value: OrderStatus | '') => {
    setStatusValue(value);
    setCurrentPage(1);
  };

  // View order detail
  const handleViewDetail = (order: Order) => {
    setSelectedOrderId(String(order.id));
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  // Table column config
  const columns: TableColumn<Order>[] = [
    {
      title: 'Application No.',
      dataIndex: 'orderNumber',
      width: '180px',
      render: (_, record) => (
        <span className="font-medium text-gray-900 whitespace-nowrap">{record.orderNumber}</span>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'items',
      render: (_, record) => {
        const firstItem = record.items[0];
        return (
          <div className="flex items-center gap-3 max-w-xs">
            {/* SKU Thumbnail - Display first SKU image */}
            {firstItem?.image && (
              <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={firstItem.image}
                  alt={firstItem.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/mocks/products/product-1.jpg';
                  }}
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-gray-900 truncate">
                {firstItem?.productName || '-'}
              </p>
              {record.itemCount > 1 && (
                <p className="text-xs text-gray-500">{record.itemCount} samples total</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Applicant',
      dataIndex: 'shippingAddress',
      render: (_, record) => (
        <div>
          <p className="text-sm text-gray-900">{record.shippingAddress.name}</p>
          <p className="text-xs text-gray-500">{record.shippingAddress.city}</p>
        </div>
      ),
    },
    {
      title: 'Status Tracking',
      dataIndex: 'status',
      render: (_, record) => <StatusProgress status={record.status} />,
    },
    {
      title: 'Application Time',
      dataIndex: 'createdAt',
      width: '140px',
      render: (_, record) => (
        <span className="text-sm text-gray-500">
          {formatDate(record.createdAt, 'short')}
        </span>
      ),
    },
  ];

  // Pagination config
  const pagination: PaginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    onChange: (page) => setCurrentPage(page),
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <PageHeader
        title="Sample Orders"
        subtitle="Manage sample applications and shipping"
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Order Management' },
          { label: 'Sample Orders' },
        ]}
        actions={
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export Data
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <OrderFilters
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search application no., applicant..."
          statusValue={statusValue}
          onStatusChange={handleStatusChange}
          statusOptions={sampleOrderStatusOptions}
        />
      </div>

      {/* Order Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={pagination}
          striped
          hoverable
          onRowClick={handleViewDetail}
        />
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrderId}
        onClose={handleCloseDetail}
        order={selectedOrder ?? null}
        loading={isLoadingDetail}
      />
    </div>
  );
}
