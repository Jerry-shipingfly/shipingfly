/**
 * Store Hook
 * @description Uses SWR to wrap store data fetching
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { storeService } from '@/services/store.service';
import { Store, StoreDetail, StoreQueryParams, StoreSyncStatus, BindStoreRequest, PaginatedResponse } from '@/types/store';

type BindStoreData = BindStoreRequest; // Type alias for compatibility

/**
 * Get store list hook
 * @param params - Query parameters (search, filter, pagination)
 * @returns Store list data and status
 */
export function useStores(params?: StoreQueryParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Store>>(
    params ? `stores-${JSON.stringify(params)}` : 'stores',
    async () => await storeService.getStores(params),
    {
      revalidateOnFocus: false, // Do not re-request on window focus
      dedupingInterval: 60000, // Deduplicate identical requests within 60 seconds
    }
  );

  return {
    stores: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate, // Used to manually refresh data
  };
}

 /**
 * Get store detail hook
 * @param id - Store ID
 * @returns Store detail data and status
 */
export function useStoreDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<StoreDetail>(
    id ? `store-${id}` : null,
    () => storeService.getStoreDetail(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    store: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Get store sync status hook
 * @param storeId - Store ID
 * @returns Sync status
 */
export function useStoreSyncStatus(storeId: string) {
  const { data, error, isLoading, mutate } = useSWR<StoreSyncStatus>(
    ['store-sync-status', storeId],
    () => storeService.getStoreSyncStatus(storeId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache within 5 minutes
      refreshInterval: 5000, // Refresh every 5 minutes
    }
  );

  return {
    syncStatus: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Bind store hook (Mutation)
 * @returns Trigger function and status
 */
export function useBindStore() {
  const { trigger, isMutating, error } = useSWRMutation(
    'bind-store',
    async (key: string, { arg }: { arg: BindStoreData }) => {
      return storeService.bindStore(arg);
    }
  );

  return {
    bindStore: trigger,
    isBinding: isMutating,
    error: error?.message,
  };
}

 /**
 * Unbind store hook (Mutation)
 * @param storeId - Store ID
 * @returns Trigger function and status
 */
export function useUnbindStore(storeId: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    'unbind-store',
    async (key: string, { arg }: { arg: string }) => {
      return storeService.unbindStore(arg);
    }
  );

  return {
    unbindStore: trigger,
    isUnbinding: isMutating,
    error: error?.message,
  };
}
 /**
 * Sync store data hook (Mutation)
 * @param storeId - Store ID
 * @returns Trigger function and status
 */
export function useSyncStore(storeId: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    'sync-store',
    async (key: string, { arg }: { arg: string }) => {
      return storeService.syncStore(arg);
    }
  );

  return {
    syncStore: trigger,
    isSyncing: isMutating,
    error: error?.message,
  };
}
