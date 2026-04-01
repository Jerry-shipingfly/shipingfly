/**
 * Store Service
 * @description Handles store-related functions including store list, binding, unbinding, and synchronization
 */

import { api } from './api';
import { Store, StoreDetail, StoreQueryParams, BindStoreRequest, StoreSyncStatus, PaginatedResponse } from '@/types/store';
import { StoreProduct } from '@/types/store-product.types';
import { MOCK_STORES, MOCK_STORE_DETAILS, MOCK_SYNC_STATUS, simulateDelay } from '@/mocks/store.mock';

export const storeService = {
  /**
   * Get store list
   */
  async getStores(params?: StoreQueryParams): Promise<PaginatedResponse<Store>> {
    // TODO: Integrate with real API
    // const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    // return api.get(`/stores${queryString}`);

    // Mock implementation
    await simulateDelay(600);

    let filteredStores = [...MOCK_STORES];

    // Search filter
    if (params?.search) {
      filteredStores = filteredStores.filter(store =>
        store.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    // Platform filter
    if (params?.platform) {
      filteredStores = filteredStores.filter(store => store.platform === params.platform);
    }

    // Status filter
    if (params?.status) {
      filteredStores = filteredStores.filter(store => store.status === params.status);
    }

    const total = filteredStores.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data: filteredStores.slice((page - 1) * limit, page * limit),
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Get store details
   */
  async getStoreDetail(id: string): Promise<StoreDetail> {
    // TODO: Integrate with real API
    // return api.get(`/stores/${id}`);

    // Mock implementation
    await simulateDelay(500);
    const store = MOCK_STORE_DETAILS.find(s => s.id === id);

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  },

  /**
   * Bind store
   */
  async bindStore(data: BindStoreRequest): Promise<Store> {
    // TODO: Integrate with real API
    // return api.post('/stores/bind', data);

    // Mock implementation
    await simulateDelay(1000);

    const newStore: Store = {
      id: String(MOCK_STORES.length + 1),
      name: data.name,
      platform: data.platform,
      status: 'connected',
      url: data.url,
      isConnected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newStore;
  },

  /**
   * Unbind store
   */
  async unbindStore(id: string): Promise<{ message: string }> {
    // TODO: Integrate with real API
    // return api.post(`/stores/${id}/unbind`);

    // Mock implementation
    await simulateDelay(800);
    return { message: 'Store unbound successfully' };
  },

  /**
   * Sync store data
   */
  async syncStore(id: string): Promise<{ message: string; syncId: string }> {
    // TODO: Integrate with real API
    // return api.post(`/stores/${id}/sync`);

    // Mock implementation
    await simulateDelay(1200);
    return {
      message: 'Store sync started',
      syncId: `sync_${Date.now()}`,
    };
  },

  /**
   * Get store sync status
   */
  async getStoreSyncStatus(id: string): Promise<StoreSyncStatus> {
    // TODO: Integrate with real API
    // return api.get(`/stores/${id}/sync-status`);

    // Mock implementation
    await simulateDelay(300);
    // Return single sync status object instead of array
    return Array.isArray(MOCK_SYNC_STATUS) ? MOCK_SYNC_STATUS[0] : MOCK_SYNC_STATUS;
  },

  /**
   * Get store product list
   */
  async getProducts(params?: {
    page?: number;
    limit?: number;
    storeId?: string;
    status?: string;
    hasPackaging?: boolean;
  }): Promise<PaginatedResponse<StoreProduct>> {
    // TODO: Integrate with real API
    // const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    // return api.get(`/stores/products${queryString}`);

    // Mock implementation
    await simulateDelay(500);

    // Return empty paginated data
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
    };
  },
};
