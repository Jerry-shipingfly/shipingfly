/**
 * Store Orders Page
 * @description Display store order list with filtering and search support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { OrderStatus, Order } from '@/types/order.types';
import { useOrders, useOrderDetail } from '@/hooks/api/useOrders';
import { storeOrderStatusOptions, OrderFilters } from '../components/OrderFilters';
import { OrderTable, OrderDetailModal } from '../components';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * URL status to OrderStatus mapping
 * Maps simplified URL params to full OrderStatus values
 */
const urlStatusToOrderStatus: Record<string, OrderStatus> = {
  'pending': 'pending_payment',
  'paid': 'paid',
  'shipped': 'shipped',
  'completed': 'completed',
  'cancelled': 'cancelled',
};

/**
 * OrderStatus to URL status mapping (reverse)
 */
const orderStatusToUrlStatus: Record<OrderStatus, string> = {
  'pending_payment': 'pending',
  'paid': 'paid',
  'processing': 'processing',
  'shipped': 'shipped',
  'delivered': 'delivered',
  'completed': 'completed',
  'cancelled': 'cancelled',
  'refunded': 'refunded',
};

/**
 * Store Orders Page Component
 */
export default function StoreOrdersPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Get initial status from URL query params and map to OrderStatus
  const getInitialStatus = (): OrderStatus | '' => {
    const urlStatus = searchParams.get('status');
    if (!urlStatus) return '';
    return urlStatusToOrderStatus[urlStatus] || (urlStatus as OrderStatus);
  };

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<OrderStatus | ''>(getInitialStatus());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Update status when URL param changes
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const mappedStatus = urlStatus ? (urlStatusToOrderStatus[urlStatus] || urlStatus as OrderStatus) : '';
    if (mappedStatus !== statusValue) {
      setStatusValue(mappedStatus);
    }
  }, [searchParams]);

  // Detail modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch order list
  const { orders, total, isLoading, mutate } = useOrders({
    page: currentPage,
    limit: pageSize,
    search: searchValue || undefined,
    status: statusValue || undefined,
    type: 'store_order',
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

  // Pagination config
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    onChange: (page: number) => setCurrentPage(page),
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <PageHeader
        title={t('orders.storeOrders')}
        subtitle={t('orders.storeOrdersSubtitle')}
        breadcrumb={[
          { label: t('nav.dashboard'), href: '/dashboard' },
          { label: t('nav.orders') },
          { label: t('orders.storeOrders') },
        ]}
        actions={
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            {t('common.export')}
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <OrderFilters
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('orders.searchPlaceholder')}
          statusValue={statusValue}
          onStatusChange={handleStatusChange}
          statusOptions={storeOrderStatusOptions}
        />
      </div>

      {/* Order Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <OrderTable
          orders={orders}
          loading={isLoading}
          pagination={pagination}
          onRowClick={handleViewDetail}
          onViewDetail={handleViewDetail}
          showActions
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
