/**
 * Order Hook
 * @description Uses SWR to wrap order data fetching
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { orderService } from '@/services/order.service';
import { Order, OrderDetail, OrderQueryParams, OrderStats, PaginatedResponse } from '@/types/order.types';
import { CreateOrderRequest } from '@/types/order.types';

/**
 * Get order list hook
 * @param params - Query parameters (search, filter, pagination)
 * @returns Order list data and status
 */
export function useOrders(params?: OrderQueryParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Order>>(
    ['orders', params],
    () => orderService.getOrders(params),
    {
      revalidateOnFocus: false,  // Do not re-request on window focus
      dedupingInterval: 60000, // Deduplicate identical requests within 60 seconds
    }
  );

  return {
    orders: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate, // Used to manually refresh data
  };
}

 /**
 * Get order detail hook
 * @param id - Order ID
 * @returns Order detail data and status
 */
export function useOrderDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<OrderDetail>(
    id ? `order-${id}` : null,
    () => orderService.getOrderDetail(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    order: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Get order statistics hook
 * @returns Order statistics data
 */
export function useOrderStats() {
  const { data, error, isLoading } = useSWR<OrderStats>(
    'order-stats',
    () => orderService.getOrderStats(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache
    }
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error: error?.message,
  };
}

 /**
 * Create order hook (Mutation)
 * @returns Trigger function and status
 */
export function useCreateOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    'create-order',
    async (key: string, { arg }: { arg: CreateOrderRequest }) => {
      return orderService.createOrder(arg);
    }
  );

  return {
    createOrder: trigger,
    isCreating: isMutating,
    error: error?.message,
  };
}
 /**
 * Cancel order hook (Mutation)
 * @param id - Order ID
 * @returns Trigger function and status
 */
export function useCancelOrder(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    'cancel-order',
    async (key: string, { arg }: { arg: string }) => {
      return orderService.cancelOrder(arg);
    }
  );

  return {
    cancelOrder: trigger,
    isCanceling: isMutating,
    error: error?.message,
  };
}
