/**
 * StatusBadge Component
 * @description Common status badge, supports custom color mapping
 */

'use client';

import React from 'react';
import { cn } from '@/utils/helpers';

/**
 * Badge size
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge variant
 */
type BadgeVariant = 'solid' | 'outline' | 'soft';

/**
 * Default color mapping
 */
const defaultColorMap: Record<string, string> = {
  // Order status
  pending: 'yellow',
  processing: 'blue',
  paid: 'cyan',
  shipped: 'indigo',
  delivered: 'green',
  completed: 'green',
  cancelled: 'red',
  refunded: 'orange',

  // Product status
  active: 'green',
  inactive: 'gray',
  draft: 'gray',
  published: 'green',
  failed: 'red',

  // Store status
  connected: 'green',
  disconnected: 'red',
  syncing: 'blue',

  // Ticket status
  open: 'blue',
  closed: 'gray',
  resolved: 'green',

  // General
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'blue',
};

/**
 * Color style mapping
 */
const colorStyles: Record<string, { solid: string; soft: string; outline: string }> = {
  green: {
    solid: 'bg-green-500 text-white',
    soft: 'bg-green-100 text-green-700',
    outline: 'border border-green-500 text-green-700',
  },
  blue: {
    solid: 'bg-blue-500 text-white',
    soft: 'bg-blue-100 text-blue-700',
    outline: 'border border-blue-500 text-blue-700',
  },
  yellow: {
    solid: 'bg-yellow-500 text-white',
    soft: 'bg-yellow-100 text-yellow-700',
    outline: 'border border-yellow-500 text-yellow-700',
  },
  red: {
    solid: 'bg-red-500 text-white',
    soft: 'bg-red-100 text-red-700',
    outline: 'border border-red-500 text-red-700',
  },
  orange: {
    solid: 'bg-orange-500 text-white',
    soft: 'bg-orange-100 text-orange-700',
    outline: 'border border-orange-500 text-orange-700',
  },
  purple: {
    solid: 'bg-purple-500 text-white',
    soft: 'bg-purple-100 text-purple-700',
    outline: 'border border-purple-500 text-purple-700',
  },
  cyan: {
    solid: 'bg-cyan-500 text-white',
    soft: 'bg-cyan-100 text-cyan-700',
    outline: 'border border-cyan-500 text-cyan-700',
  },
  indigo: {
    solid: 'bg-indigo-500 text-white',
    soft: 'bg-indigo-100 text-indigo-700',
    outline: 'border border-indigo-500 text-indigo-700',
  },
  gray: {
    solid: 'bg-gray-500 text-white',
    soft: 'bg-gray-100 text-gray-700',
    outline: 'border border-gray-400 text-gray-700',
  },
};

/**
 * Size style mapping
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * StatusBadge Props
 */
export interface StatusBadgeProps {
  /** Status value (for color mapping) */
  status: string;
  /** Custom color mapping { status: color } */
  colorMap?: Record<string, string>;
  /** Display text (defaults to status) */
  label?: string;
  /** Size */
  size?: BadgeSize;
  /** Variant style */
  variant?: BadgeVariant;
  /** Custom styles */
  className?: string;
}

/**
 * StatusBadge Component
 * @description Badge component that automatically matches colors based on status
 *
 * @example
 * // Use default color mapping
 * <StatusBadge status="completed" />
 *
 * @example
 * // Custom color mapping
 * <StatusBadge
 *   status="custom"
 *   colorMap={{ custom: 'purple' }}
 * />
 *
 * @example
 * // Custom display text
 * <StatusBadge status="completed" label="Completed" />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  colorMap,
  label,
  size = 'md',
  variant = 'soft',
  className,
}) => {
  // Merge color mappings
  const mergedColorMap = { ...defaultColorMap, ...colorMap };

  // Get color
  const color = mergedColorMap[status.toLowerCase()] || 'gray';

  // Get styles
  const colorStyle = colorStyles[color] || colorStyles.gray;
  const variantStyle = colorStyle[variant];

  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center font-medium rounded-full',
        // Size
        sizeStyles[size],
        // Color variant
        variantStyle,
        // Custom
        className
      )}
    >
      {label || status}
    </span>
  );
};

export default StatusBadge;
