/**
 * OrderTable Component
 * @description Order table component, supports pagination, row clicking, batch selection and payment
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Eye,
  CreditCard,
  CheckSquare,
  CheckCircle,
  XCircle,
  Truck,
  FileText,
  Download,
  Merge,
  Plus,
  Upload,
  RefreshCw,
  PackageCheck,
} from 'lucide-react';
import { Table, TableColumn, PaginationConfig } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Order, OrderStatus } from '@/types/order.types';
import { formatPrice, formatDate } from '@/utils/helpers';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/helpers';

/**
 * OrderTable Props
 */
export interface OrderTableProps {
  /** Order data */
  orders: Order[];
  /** Loading state */
  loading?: boolean;
  /** Pagination configuration */
  pagination?: PaginationConfig;
  /** Row click callback */
  onRowClick?: (order: Order) => void;
  /** View detail callback */
  onViewDetail?: (order: Order) => void;
  /** Pay callback */
  onPay?: (order: Order) => void;
  /** Batch pay callback */
  onBatchPay?: (orders: Order[]) => void;
  /** Actions menu callback */
  onAction?: (action: string, selectedOrders: Order[]) => void;
  /** Extended styles */
  className?: string;
  /** Whether to show actions column */
  showActions?: boolean;
  /** Whether to show batch selection */
  showBatchSelection?: boolean;
}

/**
 * OrderTable Component
 */
export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading = false,
  pagination,
  onRowClick,
  onViewDetail,
  onPay,
  onBatchPay,
  onAction,
  className,
  showActions = true,
  showBatchSelection = true,
}) => {
  const { t } = useTranslation();

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get payable orders (pending_payment status)
  const payableOrders = useMemo(() =>
    orders.filter(order => order.status === 'pending_payment'),
    [orders]
  );

  // Get selected orders
  const selectedOrders = useMemo(() =>
    orders.filter(order => selectedIds.has(String(order.id))),
    [orders, selectedIds]
  );

  // Calculate total amount of selected payable orders
  const selectedPayableTotal = useMemo(() => {
    return selectedOrders
      .filter(order => order.status === 'pending_payment')
      .reduce((sum, order) => sum + order.finalAmount, 0);
  }, [selectedOrders]);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.size === payableOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(payableOrders.map(order => String(order.id))));
    }
  };

  // Handle select one
  const handleSelectOne = (orderId: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(orderId)) {
      newSelectedIds.delete(orderId);
    } else {
      newSelectedIds.add(orderId);
    }
    setSelectedIds(newSelectedIds);
  };

  // Handle batch pay
  const handleBatchPay = () => {
    const payableSelected = selectedOrders.filter(order => order.status === 'pending_payment');
    if (payableSelected.length > 0) {
      onBatchPay?.(payableSelected);
    }
  };

  // Actions dropdown items
  const actionItems = [
    { key: 'cancel', label: t('orders.cancelOrder'), icon: <XCircle className="w-4 h-4" /> },
    { key: 'changeShipping', label: t('orders.changeShippingMethod'), icon: <Truck className="w-4 h-4" /> },
    { key: 'divider1', label: '', divider: true },
    { key: 'downloadInvoice', label: t('orders.downloadInvoice'), icon: <FileText className="w-4 h-4" /> },
    { key: 'exportOrder', label: t('orders.exportOrder'), icon: <Download className="w-4 h-4" /> },
    { key: 'divider2', label: '', divider: true },
    { key: 'mergeOrder', label: t('orders.mergeOrder'), icon: <Merge className="w-4 h-4" /> },
    { key: 'addOrder', label: t('orders.addOrder'), icon: <Plus className="w-4 h-4" /> },
    { key: 'uploadOrder', label: t('orders.uploadOrder'), icon: <Upload className="w-4 h-4" /> },
    { key: 'divider3', label: '', divider: true },
    { key: 'afterSales', label: t('orders.afterSales'), icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'useYourStock', label: t('orders.useYourStock'), icon: <PackageCheck className="w-4 h-4" /> },
  ];

  // Handle action click
  const handleActionClick = (key: string) => {
    onAction?.(key, selectedOrders);
  };

  // Table column configuration
  const columns: TableColumn<Order>[] = [
    {
      title: t('orders.orderId'),
      dataIndex: 'orderNumber',
      width: '180px',
      render: (_, record) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-900">{record.orderNumber}</span>
        </div>
      ),
    },
    {
      title: t('orders.products'),
      dataIndex: 'items',
      render: (_, record) => {
        const firstItem = record.items[0];
        return (
          <div className="flex items-center gap-3 max-w-xs">
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
                <p className="text-xs text-gray-500">
                  {t('common.items', { count: record.itemCount })}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: t('orders.customer'),
      dataIndex: 'shippingAddress',
      render: (_, record) => (
        <div>
          <p className="text-sm text-gray-900">{record.shippingAddress.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">
            {record.shippingAddress.city}
          </p>
        </div>
      ),
    },
    {
      title: t('orders.totalAmount'),
      dataIndex: 'finalAmount',
      align: 'right',
      render: (_, record) => (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(record.finalAmount, record.currency)}
          </p>
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      align: 'center',
      width: '100px',
      render: (_, record) => (
        <OrderStatusBadge status={record.status} size="sm" />
      ),
    },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      width: '150px',
      render: (_, record) => (
        <span className="text-sm text-gray-500">
          {formatDate(record.createdAt, 'short')}
        </span>
      ),
    },
  ];

  // Add checkbox column for batch selection
  if (showBatchSelection && payableOrders.length > 0) {
    columns.unshift({
      title: (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={payableOrders.length > 0 && selectedIds.size === payableOrders.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>
      ),
      align: 'center',
      width: 50,
      render: (_, record) => {
        if (record.status !== 'pending_payment') return null;
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.has(String(record.id))}
              onChange={() => handleSelectOne(String(record.id))}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        );
      },
    });
  }

  // Add actions column
  if (showActions) {
    columns.push({
      title: (
        <div className="flex items-center justify-center">
          <Dropdown
            items={actionItems}
            onItemClick={handleActionClick}
            placement="bottom-start"
          >
            <Button variant="ghost" size="sm" className="p-1.5 hover:bg-gray-100">
              <span className="text-sm font-medium text-gray-600">{t('common.actions')}</span>
            </Button>
          </Dropdown>
        </div>
      ),
      align: 'center',
      width: 140,
      render: (_, record) => {
        const isPaid = record.status !== 'pending_payment' && record.status !== 'cancelled';

        return (
          <div className="flex items-center justify-center gap-2">
            {/* View Details - Always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail?.(record);
              }}
              className="p-2 hover:bg-gray-100"
              aria-label={t('common.viewDetails')}
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Button>

            {/* Pay Button or Paid Status */}
            {record.status === 'pending_payment' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPay?.(record);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-md shadow-sm hover:shadow transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 mr-1" />
                {t('orders.pay')}
              </Button>
            ) : isPaid ? (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-md cursor-default">
                <CheckCircle className="w-3.5 h-3.5" />
                {t('orders.paid')}
              </div>
            ) : null}
          </div>
        );
      },
    });
  }

  return (
    <div className={className}>
      {/* Batch Payment Toolbar */}
      {showBatchSelection && selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-t-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              {t('orders.selectedCount', { count: selectedIds.size })}
            </span>
            <span className="text-sm text-blue-600">
              ({t('orders.selectedPayable', { count: selectedOrders.filter(o => o.status === 'pending_payment').length })})
            </span>
            {selectedPayableTotal > 0 && (
              <span className="text-sm font-semibold text-blue-800 ml-2">
                {t('orders.total')}: {formatPrice(selectedPayableTotal, 'USD')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-600"
            >
              {t('common.clearSelection')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBatchPay}
              disabled={selectedOrders.filter(o => o.status === 'pending_payment').length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-sm hover:shadow"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              {t('orders.batchPay')}
            </Button>
          </div>
        </div>
      )}

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        striped
        hoverable
        onRowClick={onRowClick}
        className={cn(
          selectedIds.size > 0 && 'rounded-t-none'
        )}
      />
    </div>
  );
};

export default OrderTable;
