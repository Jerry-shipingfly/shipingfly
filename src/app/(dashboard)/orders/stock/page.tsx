/**
 * Stock Orders Page
 * @description Display stock order list with inventory alert support
 */

'use client';

import React, { useState } from 'react';
import { Warehouse, Download, AlertTriangle, Eye, Package } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableColumn, PaginationConfig } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Order, OrderStatus } from '@/types/order.types';
import { useOrders, useOrderDetail } from '@/hooks/api/useOrders';
import { formatPrice, formatDate } from '@/utils/helpers';
import { OrderFilters, stockOrderStatusOptions, OrderStatusBadge, OrderDetailModal } from '../components';

/**
 * Mock inventory alert data
 */
interface StockAlert {
  sku: string;
  productName: string;
  currentStock: number;
  minStock: number;
}

const mockStockAlerts: StockAlert[] = [
  { sku: 'SKU-1001', productName: 'Wireless Bluetooth Earbuds Pro', currentStock: 5, minStock: 20 },
  { sku: 'SKU-1003', productName: 'Premium Cotton T-Shirt', currentStock: 8, minStock: 50 },
  { sku: 'SKU-1005', productName: 'Yoga Mat Premium', currentStock: 2, minStock: 15 },
];

/**
 * Stock Orders Page Component
 */
export default function StockOrdersPage() {
  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<OrderStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Detail modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Fetch order list
  const { orders, total, isLoading } = useOrders({
    page: currentPage,
    limit: pageSize,
    search: searchValue || undefined,
    status: statusValue || undefined,
    type: 'stock_order',
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
      title: 'Stock Order No.',
      dataIndex: 'orderNumber',
      width: '180px',
      render: (_, record) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Warehouse className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-900">{record.orderNumber}</span>
        </div>
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
                <p className="text-xs text-gray-500">{record.itemCount} product types</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'itemCount',
      align: 'center',
      width: '100px',
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">
          {record.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'finalAmount',
      align: 'right',
      width: '120px',
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">
          {formatPrice(record.finalAmount, record.currency)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: '120px',
      render: (_, record) => <OrderStatusBadge status={record.status} size="sm" />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: '140px',
      render: (_, record) => (
        <span className="text-sm text-gray-500">
          {formatDate(record.createdAt, 'short')}
        </span>
      ),
    },
    {
      title: 'Actions',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail(record);
          }}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          Detail
        </Button>
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
        title="Stock Orders"
        subtitle="Manage inventory stocking and warehousing"
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Order Management' },
          { label: 'Stock Orders' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {mockStockAlerts.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setShowAlertModal(true)}
                className="text-orange-600 hover:text-orange-700"
                leftIcon={<AlertTriangle className="w-4 h-4" />}
              >
                Stock Alert ({mockStockAlerts.length})
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Export Data
            </Button>
          </div>
        }
      />

      {/* Stock Alert Banner */}
      {mockStockAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-800">
              {mockStockAlerts.length} products have low stock, please restock in time
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlertModal(true)}
              className="text-orange-600 hover:text-orange-700"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <OrderFilters
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search stock order no., product name..."
          statusValue={statusValue}
          onStatusChange={handleStatusChange}
          statusOptions={stockOrderStatusOptions}
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

      {/* Stock Alert Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Stock Alert"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            The following products are below safety stock level, please arrange restocking soon:
          </p>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Current Stock</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Safety Stock</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockStockAlerts.map((item) => {
                  const shortage = item.minStock - item.currentStock;
                  const shortagePercent = Math.round((shortage / item.minStock) * 100);

                  return (
                    <tr key={item.sku}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">
                        {item.currentStock}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {item.minStock}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="warning" size="sm">
                          Short {shortage} pcs ({shortagePercent}%)
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
              Close
            </Button>
            <Button variant="primary" leftIcon={<Package className="w-4 h-4" />}>
              Create Stock Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
