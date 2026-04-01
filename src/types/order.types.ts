/**
 * Order related type definitions
 */

import { ID, Timestamp, PaginatedResponse } from './common.types';

// Re-export PaginatedResponse for convenience
export type { PaginatedResponse };

/**
 * Order status
 */
export type OrderStatus =
  | 'pending_payment'    // Pending payment
  | 'paid'              // Paid
  | 'processing'        // Processing
  | 'shipped'           // Shipped
  | 'delivered'         // Delivered
  | 'completed'         // Completed
  | 'cancelled'         // Cancelled
  | 'refunded';         // Refunded

/**
 * Order type
 */
export type OrderType =
  | 'store_order'       // Store order
  | 'sample_order'      // Sample order
  | 'stock_order'       // Stock order
  | 'sourcing_order';   // Sourcing order

/**
 * Order shipping address
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
}

/**
 * Order item
 */
export interface OrderItem {
  id: ID;
  productId: ID;
  productName: string;
  variantId?: ID;
  variantName?: string;
  sku: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

/**
 * Order basic information
 */
export interface Order {
  id: ID;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  storeId?: ID;
  storeName?: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  currency: string;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
}

/**
 * Order detail (extended information)
 */
export interface OrderDetail extends Order {
  customer: OrderCustomer;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  timeline: OrderTimeline[];
}

/**
 * Order customer information
 */
export interface OrderCustomer {
  id?: ID;
  name: string;
  email: string;
  phone: string;
}

/**
 * Order timeline
 */
export interface OrderTimeline {
  id: ID;
  status: OrderStatus;
  description: string;
  operator?: string;
  createdAt: Timestamp;
}

/**
 * Order query parameters
 */
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  type?: OrderType;
  storeId?: ID;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'totalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  type: OrderType;
  storeId?: ID;
  items: {
    productId: ID;
    variantId?: ID;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  notes?: string;
}

/**
 * Order statistics
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}
