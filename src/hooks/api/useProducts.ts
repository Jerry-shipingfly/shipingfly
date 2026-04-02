/**
 * Product Hook
 * @description Uses SWR to wrap product data fetching
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { productService } from '@/services/product.service';
import { ProductQueryParams, PaginatedResponse, Product, ProductDetail, ProductCollection, SourcingRequest } from '@/types/product.types';

/**
 * Get product list hook
 * @param params - Query parameters (search, filter, pagination)
 * @returns Product list data and status
 */
export function useProducts(params?: ProductQueryParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    ['products', params],
    () => productService.getProducts(params),
    {
      revalidateOnFocus: false,  // Do not re-request on window focus
      dedupingInterval: 60000, // Deduplicate identical requests within 60 seconds
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
    mutate, // Used to manually refresh data
  };
}

/**
 * Get recommended products hook
 * @param params - Query parameters (search, filter, pagination)
 * @returns Recommended products data and status
 */
export function useRecommendedProducts(params?: Omit<ProductQueryParams, 'isRecommended'>) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    ['recommended-products', params],
    () => productService.getProducts({ ...params, isRecommended: true }),
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

 /**
 * Get product detail hook
 * @param id - Product ID
 * @returns Product detail data and status
 */
export function useProductDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ProductDetail>(
    id ? `product-${id}` : null,
    () => productService.getProductDetail(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    product: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Get product category list hook
 * @returns Product category list
 */
export function useCategories() {
  const { data, error, isLoading } = useSWR<string[]>(
    'product-categories',
    () => productService.getCategories(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache within 5 minutes
    }
  );

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
  };
}

 /**
 * Get product collection list hook
 * @param params - Pagination parameters
 * @returns Collection list data and status
 */
export function useCollections(params?: { page?: number; limit?: number }) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<ProductCollection>>(
    ['product-collections', params],
    () => productService.getCollections(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    collections: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Add product to collection hook (Mutation)
 * @returns Trigger function and status
 */
export function useAddToCollection() {
  const { trigger, isMutating, error } = useSWRMutation(
    'add-to-collection',
    async (key: string, { arg }: { arg: string }) => {
      return productService.addToCollection(arg);
    }
  );

  return {
    addToCollection: trigger,
    isAdding: isMutating,
    error: error?.message,
  };
}

 /**
 * Remove from collection hook (Mutation)
 * @returns Trigger function and status
 */
export function useRemoveFromCollection() {
  const { trigger, isMutating, error } = useSWRMutation(
    'remove-from-collection',
    async (key: string, { arg }: { arg: string }) => {
      return productService.removeFromCollection(arg);
    }
  );

  return {
    removeFromCollection: trigger,
    isRemoving: isMutating,
    error: error?.message,
  };
}

 /**
 * Check collection status hook
 * @param productId - Product ID
 * @returns Collection status
 */
export function useCollectionStatus(productId: string) {
  const { data, error, isLoading, mutate } = useSWR<{ isCollected: boolean }>(
    ['collection-status', productId],
    () => productService.checkCollectionStatus(productId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    isCollected: data?.isCollected ?? false,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

/**
 * Batch check collection status hook
 * @param productIds - Array of product IDs
 * @returns Collection status map and loading state
 */
export function useCollectionStatuses(productIds: string[]) {
  const { data, error, isLoading, mutate } = useSWR<Record<string, boolean>>(
    productIds.length > 0 ? ['collection-statuses', productIds.sort().join(',')] : null,
    () => productService.batchCheckCollectionStatus(productIds),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    collectionStatuses: data || {},
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

 /**
 * Submit sourcing request hook (Mutation)
 * @returns Trigger function and status
 */
export function useSubmitSourcingRequest() {
  const { trigger, isMutating, error } = useSWRMutation(
    'submit-sourcing-request',
    async (key: string, { arg }: { arg: {
      productName: string;
      description: string;
      images: string[];
      targetPrice?: number;
      quantity?: number;
    }}) => {
      return productService.submitSourcingRequest(arg);
    }
  );

  return {
    submitSourcingRequest: trigger,
    isSubmitting: isMutating,
    error: error?.message,
  };
}
 /**
 * Get sourcing request list hook
 * @returns Sourcing request list
 */
export function useSourcingRequests() {
  const { data, error, isLoading, mutate } = useSWR<SourcingRequest[]>(
    'sourcing-requests',
    () => productService.getSourcingRequests(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    requests: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

/**
 * Search products by image hook (Mutation)
 * @returns Trigger function and status
 */
export function useSearchByImage() {
  const { trigger, isMutating, error, data } = useSWRMutation(
    'search-by-image',
    async (key: string, { arg }: { arg: File }) => {
      return productService.searchByImage(arg);
    }
  );

  return {
    searchByImage: trigger,
    results: data || [],
    isSearching: isMutating,
    error: error?.message,
  };
}
