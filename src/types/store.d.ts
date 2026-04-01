/**
 * Store related type definitions
 */

// Generic ID type
export type ID = string | number;

// Timestamp type
export type Timestamp = string | Date;

/**
 * Store platform type
 */
export type StorePlatform = 'shopify' | 'offline' | 'amazon' | 'ebay' | 'woocommerce' | 'magento' | 'custom';

/**
 * Store status
 */
export type StoreStatus = 'connected' | 'disconnected' | 'pending' | 'error';

/**
 * Store basic information
 */
export interface Store {
  id: ID;
  name: string;
  platform: StorePlatform;
  status: StoreStatus;
  url: string;
  logo?: string;
  description?: string;
  isConnected: boolean;
  lastSyncAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Store detail (extended information)
 */
export interface StoreDetail extends Store {
  productsCount: number;
  ordersCount: number;
  revenue: number;
  currency: string;
  syncSettings?: {
    autoSync: boolean;
    syncInterval: number;
    syncProducts: boolean;
    syncOrders: boolean;
    syncInventory: boolean;
  };
  credentials?: StoreCredentials;
}

/**
 * Store credentials (masked)
 */
export interface StoreCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  storeId?: string;
}

/**
 * Store query parameters
 */
export interface StoreQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  platform?: StorePlatform;
  status?: StoreStatus;
  sortBy?: 'name' | 'createdAt' | 'lastSyncAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Store sync status
 */
export interface StoreSyncStatus {
  storeId: ID;
  status: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncAt?: Timestamp;
  nextSyncAt?: Timestamp;
  errorMessage?: string;
  syncedProducts: number;
  syncedOrders: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Bind store request
 */
export interface BindStoreRequest {
  name: string;
  platform: StorePlatform;
  url: string;
  apiKey?: string;
  apiSecret?: string;
  location?: string;
  contactPhone?: string;
}

/**
 * Store sync status
 */
export type StoreSyncStatusType = StoreSyncStatus;
