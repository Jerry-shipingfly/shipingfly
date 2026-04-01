/**
 * OrderFilters Component
 * @description Order filter component, supports status filtering, search, and batch actions
 */

'use client';

import React from 'react';
import {
  Search,
  XCircle,
  Truck,
  FileText,
  Download,
  Merge,
  Plus,
  Upload,
  RefreshCw,
  PackageCheck,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { OrderStatus, OrderType } from '@/types/order.types';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/helpers';

/**
 * Order status options
 */
export const orderStatusOptions: SelectOption[] = [
  { value: '', label: 'All Status' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

/**
 * Store order status options (simplified version)
 */
export const storeOrderStatusOptions: SelectOption[] = [
  { value: '', label: 'All Status' },
  { value: 'pending_payment', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

/**
 * Sample order status options
 */
export const sampleOrderStatusOptions: SelectOption[] = [
  { value: '', label: 'All Status' },
  { value: 'pending_payment', label: 'Pending' },
  { value: 'processing', label: 'Approved' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'completed', label: 'Received' },
];

/**
 * Stock order status options
 */
export const stockOrderStatusOptions: SelectOption[] = [
  { value: '', label: 'All Status' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'completed', label: 'Completed' },
];

/**
 * OrderFilters Props
 */
export interface OrderFiltersProps {
  /** Search keyword */
  searchValue?: string;
  /** Search change callback */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Current status */
  statusValue?: OrderStatus | '';
  /** Status change callback */
  onStatusChange?: (value: OrderStatus | '') => void;
  /** Status options */
  statusOptions?: SelectOption[];
  /** Action click callback */
  onAction?: (action: string) => void;
  /** Whether to show actions dropdown */
  showActions?: boolean;
  /** Extended styles */
  className?: string;
}

/**
 * Actions dropdown item
 */
interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  divider?: boolean;
}

/**
 * OrderFilters Component
 * @description Order filter component, supports search and status filtering
 *
 * @example
 * <OrderFilters
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   statusValue={status}
 *   onStatusChange={setStatus}
 * />
 */
export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search order number, customer name...',
  statusValue,
  onStatusChange,
  statusOptions = orderStatusOptions,
  onAction,
  showActions = true,
  className,
}) => {
  const { t } = useTranslation();
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Action menu items
  const actionItems: ActionItem[] = [
    { key: 'cancel', label: t('orders.cancelOrder'), icon: <XCircle className="w-4 h-4" />, danger: true },
    { key: 'changeShipping', label: t('orders.changeShippingMethod'), icon: <Truck className="w-4 h-4" /> },
    { key: 'divider1', label: '', icon: null, divider: true },
    { key: 'downloadInvoice', label: t('orders.downloadInvoice'), icon: <FileText className="w-4 h-4" /> },
    { key: 'exportOrder', label: t('orders.exportOrder'), icon: <Download className="w-4 h-4" /> },
    { key: 'divider2', label: '', icon: null, divider: true },
    { key: 'mergeOrder', label: t('orders.mergeOrder'), icon: <Merge className="w-4 h-4" /> },
    { key: 'addOrder', label: t('orders.addOrder'), icon: <Plus className="w-4 h-4" /> },
    { key: 'uploadOrder', label: t('orders.uploadOrder'), icon: <Upload className="w-4 h-4" /> },
    { key: 'divider3', label: '', icon: null, divider: true },
    { key: 'afterSales', label: t('orders.afterSales'), icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'useYourStock', label: t('orders.useYourStock'), icon: <PackageCheck className="w-4 h-4" /> },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };

    if (isActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsOpen]);

  // Handle action click
  const handleActionClick = (key: string) => {
    onAction?.(key);
    setIsActionsOpen(false);
  };

  return (
    <div className={cn('flex flex-col sm:flex-row gap-4', className)}>
      {/* Search Box */}
      <div className="flex-1">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          size="md"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <Select
          options={statusOptions}
          value={statusValue}
          onChange={(value) => onStatusChange?.(value as OrderStatus | '')}
          placeholder="Filter by Status"
          size="md"
        />
      </div>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className={cn(
              'inline-flex items-center justify-between gap-2',
              'w-full sm:w-auto px-4 py-2.5',
              'text-sm font-medium text-gray-700',
              'bg-white border border-gray-300 rounded-lg',
              'hover:bg-gray-50 hover:border-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-colors duration-200'
            )}
          >
            <span>{t('common.actions')}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isActionsOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isActionsOpen && (
            <div
              className={cn(
                'absolute z-50 right-0',
                'min-w-[200px] mt-1',
                'bg-white rounded-lg shadow-lg border border-gray-200',
                'py-1',
                'animate-in fade-in-0 zoom-in-95 duration-150'
              )}
              role="menu"
            >
              {actionItems.map((item) => {
                if (item.divider) {
                  return (
                    <div
                      key={item.key}
                      className="my-1 border-t border-gray-100"
                      role="separator"
                    />
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleActionClick(item.key)}
                    className={cn(
                      'w-full flex items-center gap-3',
                      'px-4 py-2.5 text-sm text-left',
                      'transition-colors duration-150',
                      item.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    role="menuitem"
                  >
                    <span className={cn('flex-shrink-0', item.danger && 'text-red-500')}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
