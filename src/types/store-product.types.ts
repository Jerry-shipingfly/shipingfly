/**
 * Store product type definitions
 */

import { ID, Timestamp, PaginatedResponse } from './common.types';

// Re-export ID for convenience
export type { ID };

/**
 * Store platform
 */
export type StorePlatform = 'shopify' | 'woocommerce' | 'magento' | 'other';

/**
 * Store product status
 */
export type StoreProductStatus = 'draft' | 'published' | 'unpublished' | 'archived' | 'failed';

/**
 * Sync status
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Product variant
 */
export interface ProductVariant {
  id: ID;
  sku: string;
  name: string;
  price: number;
  inventory: number;
  attributes: Record<string, string>;
  image?: string;
}

/**
 * Store information
 */
export interface StoreInfo {
  id: ID;
  name: string;
  platform: StorePlatform;
  logo?: string;
  url: string;
}

/**
 * Store product
 */
export interface StoreProduct {
  id: ID;
  sku: string;
  name: string;
  images: string[];
  sourceProductId?: string;
  packagingId?: string;
  inventory: number;
  costPrice: number;
  salePrice: number;
  profit: number;
  profitRate: number;
  status: StoreProductStatus;
  storeId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Store product detail (extended information)
 */
export interface StoreProductDetail extends StoreProduct {
  description?: string;
  category?: string;
  tags?: string[];
  variants?: ProductVariant[];
  stores?: StoreInfo[];
  syncStatus?: SyncStatus;
}

/**
 * Store product query parameters
 */
export interface StoreProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  status?: StoreProductStatus;
  hasPackaging?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'inventory' | 'costPrice' | 'salePrice' | 'profit';
  sortOrder?: 'asc' | 'desc';
}

// Re-export PaginatedResponse for convenience
export type { PaginatedResponse };
