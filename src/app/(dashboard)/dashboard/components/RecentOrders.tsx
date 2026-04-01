/**
 * RecentOrders component
 * @description Display recent order list
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS, ja, fr, de, es, ptBR } from 'date-fns/locale';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/helpers';
import { RecentOrder } from '@/services/dashboard.service';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/locales';

/**
 * RecentOrders Props
 */
export interface RecentOrdersProps {
  /** Order data */
  orders: RecentOrder[];
  /** Loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;
  /** View all link href */
  viewAllHref?: string;
}

/**
 * Get date-fns locale based on app locale
 */
const getDateFnsLocale = (locale: Locale) => {
  const localeMap: Record<Locale, typeof enUS> = {
    'en-US': enUS,
    'fr': fr,
    'de': de,
    'pt-BR': ptBR,
    'es': es,
    'ja': ja,
  };
  return localeMap[locale] || enUS;
};

/**
 * RecentOrders list
 */
export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  loading = false,
  className,
  viewAllHref,
}) => {
  const { t, locale } = useTranslation();

  // Get status label from translations
  const getStatusLabel = (status: string): string => {
    const statusKeyMap: Record<string, string> = {
      pending_payment: 'dashboard.pending',
      paid: 'dashboard.processing',
      processing: 'dashboard.processing',
      shipped: 'dashboard.shipped',
      delivered: 'dashboard.delivered',
      completed: 'dashboard.completed',
      cancelled: 'dashboard.cancelled',
    };
    const key = statusKeyMap[status];
    return key ? t(key) : status;
  };

  // Format time
  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), {
        addSuffix: true,
        locale: getDateFnsLocale(locale),
      });
    } catch {
      return dateStr;
    }
  };

  // Format amount
  const formatAmount = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(locale.replace('-', '_'), {
        style: 'currency',
        currency,
      }).format(amount);
    } catch {
      // Fallback for unsupported locales
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('dashboard.recentOrders')}
        </h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('common.viewAll')}
          </Link>
        )}
      </div>

      {/* Order list */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-6 py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {t('dashboard.noRecentOrders')}
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              {/* Product image */}
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {order.productImage ? (
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Order info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.productName}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {order.orderNumber} · {formatTime(order.createdAt)}
                </p>
              </div>

              {/* Amount and status */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {formatAmount(order.amount, order.currency)}
                </span>
                <StatusBadge
                  status={order.status}
                  label={getStatusLabel(order.status)}
                  size="sm"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
