/**
 * Order Service
 * @description Handle order list, order detail, create order and other order-related functions
 */

import { api } from './api';
import { Order, OrderDetail, OrderQueryParams, CreateOrderRequest, OrderStats, PaginatedResponse } from '@/types/order.types';
import { MOCK_ORDERS, MOCK_ORDER_DETAILS, MOCK_ORDER_STATS, simulateDelay } from '@/mocks/order.mock';

export const orderService = {
  /**
   * Get order list
   */
  async getOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    // TODO: Integrate with real API
    // const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    // return api.get(`/orders${queryString}`);

    // Mock implementation
    await simulateDelay(600);

    let filteredOrders = [...MOCK_ORDERS];

    // Search filter
    if (params?.search) {
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    // Status filter
    if (params?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status);
    }

    // Type filter
    if (params?.type) {
      filteredOrders = filteredOrders.filter(order => order.type === params.type);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      data: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit),
    };
  },

  /**
   * Get order detail
   */
  async getOrderDetail(id: string): Promise<OrderDetail> {
    // TODO: Integrate with real API
    // return api.get(`/orders/${id}`);

    // Mock implementation
    await simulateDelay(500);
    const order = MOCK_ORDER_DETAILS.find(o => o.id === id);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  },

  /**
   * Create order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    // TODO: Integrate with real API
    // return api.post('/orders', data);

    // Mock implementation
    await simulateDelay(800);

    const newOrder: Order = {
      id: String(MOCK_ORDERS.length + 1),
      orderNumber: `ORD${Date.now()}`,
      type: 'store_order',
      status: 'pending_payment',
      items: [],
      itemCount: 1,
      totalAmount: 0,
      currency: 'USD',
      shippingFee: 0,
      taxAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      shippingAddress: data.shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newOrder;
  },

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<{ message: string }> {
    // TODO: Integrate with real API
    // return api.post(`/orders/${id}/cancel`);

    // Mock implementation
    await simulateDelay(600);
    return { message: 'Order cancelled successfully' };
  },

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStats> {
    // TODO: Integrate with real API
    // return api.get('/orders/stats');

    // Mock implementation
    await simulateDelay(400);
    return MOCK_ORDER_STATS;
  },
};
