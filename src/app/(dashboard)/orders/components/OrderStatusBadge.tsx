/**
 * OrderStatusBadge Component
 * @description Order status badge, displays different colors based on status
 */

'use client';

import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { OrderStatus } from '@/types/order.types';

/**
 * Order status text mapping
 */
const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

/**
 * Order status color mapping
 */
const orderStatusColors: Record<OrderStatus, string> = {
  pending_payment: 'yellow',
  paid: 'cyan',
  processing: 'blue',
  shipped: 'indigo',
  delivered: 'green',
  completed: 'green',
  cancelled: 'red',
  refunded: 'orange',
};

/**
 * OrderStatusBadge Props
 */
export interface OrderStatusBadgeProps {
  /** Order status */
  status: OrderStatus;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom styles */
  className?: string;
}

/**
 * OrderStatusBadge Component
 * @description Badge component that automatically matches color and text based on order status
 *
 * @example
 * <OrderStatusBadge status="completed" />
 */
export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  return (
    <StatusBadge
      status={status}
      label={orderStatusLabels[status]}
      colorMap={orderStatusColors}
      size={size}
      className={className}
    />
  );
};

export default OrderStatusBadge;
