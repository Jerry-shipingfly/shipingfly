/**
 * Store Product Hook
 * @description Uses SWR to wrap store product data fetching
 */

import useSWR from 'swr';
import { storeService } from '@/services/store.service';

/**
 * Get store product list
 */
export function useStoreProducts(params?: {
  page: number;
  limit: number
  storeId?: string
  status?: string
  hasPackaging?: boolean
}) {
  const { data, isLoading, error, mutate } = useSWR(
    ['store-products', params],
    () => storeService.getProducts(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    products: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}
