/**
 * Mock Data Unified Export
 */

// Auth Mock
export * from './auth.mock';

// Product Mock (exclude duplicate utility functions)
export {
  MOCK_PRODUCTS,
  MOCK_PRODUCT_DETAILS,
  MOCK_COLLECTIONS,
  MOCK_SOURCING_REQUESTS,
  getMockProductById,
  getMockProductDetailById,
} from './product.mock';

// Store Mock (exclude duplicate utility functions)
export {
  MOCK_STORES,
  MOCK_STORE_DETAILS,
  MOCK_SYNC_STATUS,
  getMockStoreById,
  getMockStoreDetailById,
} from './store.mock';

// Order Mock (exclude duplicate utility functions)
export {
  MOCK_ORDERS,
  MOCK_ORDER_DETAILS,
  MOCK_ORDER_STATS,
  getMockOrderById,
  getMockOrderDetailById,
} from './order.mock';

