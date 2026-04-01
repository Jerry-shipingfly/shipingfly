/**
 * Store Module Mock Data
 */

import { Store, StoreDetail, StoreSyncStatus } from '@/types/store';

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number = 600): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulate error
 */
export const simulateError = (message: string = 'Mock error'): never => {
  throw new Error(message);
};

/**
 * Platform icon mapping
 */
export const PLATFORM_ICONS: Record<string, string> = {
  shopify: '/assets/platforms/shopify.svg',
  offline: '/assets/icons/offline-store.svg',
  amazon: '/assets/icons/amazon.svg',
  ebay: '/assets/icons/ebay.svg',
  woocommerce: '/assets/icons/woocommerce.svg',
  magento: '/assets/icons/magento.svg',
  custom: '/assets/icons/custom-store.svg',
};

/**
 * Mock store list
 */
export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'TechGear Official Store',
    platform: 'shopify',
    status: 'connected',
    url: 'https://techgear-store.myshopify.com',
    logo: '/assets/platforms/shopify.svg',
    description: 'Premium tech gadgets and accessories store',
    isConnected: true,
    lastSyncAt: '2024-03-29T10:30:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-29T10:30:00Z',
  },
  {
    id: 's2',
    name: 'Downtown Electronics',
    platform: 'offline',
    status: 'connected',
    url: '123 Main Street, New York, NY 10001',
    logo: undefined,
    description: 'Physical electronics store in downtown Manhattan',
    isConnected: true,
    lastSyncAt: '2024-03-29T09:45:00Z',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-29T09:45:00Z',
  },
  {
    id: 's3',
    name: 'Fashion Forward',
    platform: 'shopify',
    status: 'connected',
    url: 'https://fashion-forward.myshopify.com',
    logo: '/assets/platforms/shopify.svg',
    description: 'Trendy fashion and clothing marketplace',
    isConnected: true,
    lastSyncAt: '2024-03-28T16:00:00Z',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-03-28T16:00:00Z',
  },
  {
    id: 's4',
    name: 'Westside Mall Kiosk',
    platform: 'offline',
    status: 'connected',
    url: 'Westside Mall, 456 Oak Avenue, Los Angeles, CA 90001',
    logo: undefined,
    description: 'Mall kiosk for accessories',
    isConnected: true,
    lastSyncAt: '2024-03-25T11:00:00Z',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-03-28T09:00:00Z',
  },
  {
    id: 's5',
    name: 'Custom Electronics Hub',
    platform: 'offline',
    status: 'error',
    url: '789 Tech Park, San Francisco, CA 94102',
    logo: undefined,
    description: 'Custom electronics and DIY kits',
    isConnected: false,
    lastSyncAt: '2024-03-10T08:00:00Z',
    createdAt: '2024-03-01T16:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
];

/**
 * Mock store details
 */
export const MOCK_STORE_DETAILS: StoreDetail[] = [
  {
    id: 's1',
    name: 'TechGear Official Store',
    platform: 'shopify',
    status: 'connected',
    url: 'https://techgear-store.myshopify.com',
    logo: '/mocks/stores/shopify-logo.png',
    description: 'Premium tech gadgets and accessories store',
    isConnected: true,
    lastSyncAt: '2024-03-29T10:30:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-29T10:30:00Z',
    productsCount: 156,
    ordersCount: 2340,
    revenue: 156780.50,
    currency: 'USD',
    syncSettings: {
      autoSync: true,
      syncInterval: 30,
      syncProducts: true,
      syncOrders: true,
      syncInventory: true,
    },
    credentials: {
      apiKey: 'sk_live_****1234',
      apiSecret: '****5678',
      accessToken: 'shpat_****abcd',
      storeId: 'techgear-store',
    },
  },
  {
    id: 's2',
    name: 'Fashion Forward',
    platform: 'amazon',
    status: 'connected',
    url: 'https://amazon.com/stores/fashionforward',
    logo: '/mocks/stores/amazon-logo.png',
    description: 'Trendy fashion and clothing marketplace',
    isConnected: true,
    lastSyncAt: '2024-03-29T09:45:00Z',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-29T09:45:00Z',
    productsCount: 328,
    ordersCount: 4560,
    revenue: 289450.75,
    currency: 'USD',
    syncSettings: {
      autoSync: true,
      syncInterval: 60,
      syncProducts: true,
      syncOrders: true,
      syncInventory: true,
    },
    credentials: {
      apiKey: 'AKIA****WXYZ',
      apiSecret: '****secret',
      storeId: 'A1B2C3D4E5F6',
    },
  },
  {
    id: 's3',
    name: 'Home Essentials Plus',
    platform: 'ebay',
    status: 'connected',
    url: 'https://ebay.com/str/homeessentials',
    logo: '/mocks/stores/ebay-logo.png',
    description: 'Quality home goods at great prices',
    isConnected: true,
    lastSyncAt: '2024-03-28T16:00:00Z',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-03-28T16:00:00Z',
    productsCount: 89,
    ordersCount: 1230,
    revenue: 78920.30,
    currency: 'USD',
    syncSettings: {
      autoSync: true,
      syncInterval: 120,
      syncProducts: true,
      syncOrders: true,
      syncInventory: false,
    },
    credentials: {
      apiKey: 'ebay_app_****123',
      apiSecret: '****ebay_secret',
      storeId: 'homeessentials',
    },
  },
];

/**
 * Mock store sync status
 */
export const MOCK_SYNC_STATUS: StoreSyncStatus[] = [
  {
    storeId: 's1',
    status: 'success',
    lastSyncAt: '2024-03-29T10:30:00Z',
    nextSyncAt: '2024-03-29T11:00:00Z',
    syncedProducts: 156,
    syncedOrders: 45,
  },
  {
    storeId: 's2',
    status: 'syncing',
    lastSyncAt: '2024-03-29T09:45:00Z',
    syncedProducts: 200,
    syncedOrders: 30,
  },
  {
    storeId: 's3',
    status: 'idle',
    lastSyncAt: '2024-03-28T16:00:00Z',
    nextSyncAt: '2024-03-29T16:00:00Z',
    syncedProducts: 89,
    syncedOrders: 15,
  },
  {
    storeId: 's5',
    status: 'error',
    lastSyncAt: '2024-03-20T14:00:00Z',
    errorMessage: 'Connection timeout. Please check your API credentials.',
    syncedProducts: 0,
    syncedOrders: 0,
  },
];

/**
 * Empty store list
 */
export const MOCK_EMPTY_STORES: Store[] = [];

/**
 * Get mock store by ID
 */
export const getMockStoreById = (id: string): Store | undefined => {
  return MOCK_STORES.find(s => s.id === id);
};

/**
 * Get mock store detail by ID
 */
export const getMockStoreDetailById = (id: string): StoreDetail | undefined => {
  return MOCK_STORE_DETAILS.find(s => s.id === id);
};

/**
 * Get mock sync status by store ID
 */
export const getMockSyncStatusByStoreId = (storeId: string): StoreSyncStatus | undefined => {
  return MOCK_SYNC_STATUS.find(s => s.storeId === storeId);
};
