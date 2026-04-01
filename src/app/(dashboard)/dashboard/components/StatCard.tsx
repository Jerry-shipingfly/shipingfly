/**
 * StatCard component
 * @description Used to display statistics with trend indicators
 */

'use client';

import React from 'react';
import {
  ShoppingCart,
  DollarSign,
  Store,
  Ticket,
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
  CreditCard,
  Wallet,
} from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Icon map
 */
const iconMap: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
  store: Store,
  ticket: Ticket,
  'credit-card': CreditCard,
  wallet: Wallet,
};

/**
 * StatCard Props
 */
export interface StatCardProps {
  /** Title */
  title: string;
  /** Display value */
  value: string;
  /** Period-over-period change percentage */
  change?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'flat';
  /** Icon name */
  icon?: string;
  /** Custom icon */
  iconNode?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * StatCard component
 * @description Displays a single statistic with title, value, trend change, and icon
 *
 * @example
 * <StatCard
 *   title="Total Revenue"
 *   value="$156,892.50"
 *   change={8.3}
 *   trend="up"
 *   icon="dollar-sign"
 * />
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'flat',
  icon,
  iconNode,
  className,
  loading = false,
  onClick,
}) => {
  // Get icon component
  const IconComponent = icon ? iconMap[icon] : null;

  // Get trend icon
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // Get trend color
  const trendColor = trend === 'up'
    ? 'text-green-600'
    : trend === 'down'
      ? 'text-red-600'
      : 'text-gray-500';

  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 shadow-sm',
        'flex items-start justify-between',
        className,
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className="text-sm text-gray-500 truncate">{title}</p>

        {/* Value */}
        {loading ? (
          <div className="mt-2 h-8 w-24 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="mt-2 text-2xl font-bold text-gray-900 truncate">{value}</p>
        )}

        {/* Trend */}
        {loading ? (
          <div className="mt-2 h-4 w-16 bg-gray-100 rounded animate-pulse" />
        ) : change !== undefined && (
          <div className={cn('mt-2 flex items-center gap-1 text-sm', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span>
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Icon */}
      {(IconComponent || iconNode) && (
        <div
          className={cn(
            'flex items-center justify-center',
            'w-12 h-12 rounded-lg',
            'bg-primary-50 text-primary-600'
          )}
        >
          {iconNode || (IconComponent && <IconComponent className="w-6 h-6" />)}
        </div>
      )}
    </div>
  );
};

export default StatCard;
