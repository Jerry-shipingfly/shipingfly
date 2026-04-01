# API Integration Patterns

> **Scope**: All data fetching, API calls, and mock data management

## 🎯 Core Principles

### 1. Three-Layer Architecture Pattern
```
View (Components)
  ↓ calls
Hook (Data fetching logic)
  ↓ calls
Service (API wrapper)
  ↓ calls
Mock/Real API
```

### 2. Mock-First Strategy
- **Current Stage**: All APIs return mock data
- **Function Signature**: Must be `async`, returning `Promise<T>`
- **Integration Stage**: One-click replace mock with real API, function signatures unchanged

### 3. TypeScript Type Safety
- **Interface Definition**: All API functions must have explicit TypeScript types
- **Type Files**: Unified in `@/types/`
- **Shared Types**: Frontend and backend shared data structures must be consistent

---

## 📁 Directory Structure

### API Service Layer Architecture
```
src/
├── services/
│   ├── api.ts              # Base API wrapper
│   ├── auth.service.ts     # Auth service
│   ├── product.service.ts  # Product service
│   ├── store.service.ts    # Store service
│   ├── order.service.ts    # Order service
│   └── index.ts            # Unified export
├── hooks/
│   └── api/
│       ├── useAuth.ts
│       ├── useProducts.ts
│       ├── useStores.ts
│       ├── useOrders.ts
│       └── index.ts
├── types/
│   ├── auth.types.ts
│   ├── product.types.ts
│   ├── store.types.ts
│   ├── order.types.ts
│   └── common.types.ts
└── mocks/
    ├── auth.mock.ts
    ├── product.mock.ts
    ├── store.mock.ts
    └── order.mock.ts
```

---

## 🔧 Service Layer Implementation

### 1. Base API Wrapper

```typescript
// services/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

/**
 * Base fetch wrapper
 * @description Unified handling of request headers, auth token, error handling
 */
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Get auth token
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Error handling
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Network error',
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Export HTTP methods
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
```

### 2. Module Service Implementation

#### Auth Service Example

```typescript
// services/auth.service.ts
import { api } from './api';
import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth.types';
import { MOCK_USER, MOCK_TOKEN } from '@/mocks/auth.mock';

export const authService = {
  /**
   * User login
   * @current-stage: Returns mock data
   * @future-integration: Replace with real API call
   */
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    // TODO: Connect to real API
    // return api.post('/auth/login', credentials);

    // Mock implementation (current stage)
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      return {
        user: MOCK_USER,
        token: MOCK_TOKEN,
      };
    }

    throw new Error('Invalid email or password');
  },

  /**
   * User registration
   */
  async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // TODO: Connect to real API
    // return api.post('/auth/register', data);

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      user: { id: '1', email: data.email, name: data.name },
      token: 'mock_token_' + Date.now(),
    };
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    // TODO: Connect to real API
    // return api.post('/auth/forgot-password', { email });

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800));
    return { message: 'Password reset email sent' };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    // TODO: Connect to real API
    // return api.post('/auth/logout');

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('auth_token');
  },
};
```

#### Product Service Example

```typescript
// services/product.service.ts
import { api } from './api';
import { Product, ProductDetail, ProductQueryParams, PaginatedResponse } from '@/types/product.types';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from '@/mocks/product.mock';

export const productService = {
  /**
   * Get product list
   */
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    // TODO: Connect to real API
    // const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    // return api.get(`/products${queryString}`);

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredProducts = [...MOCK_PRODUCTS];

    // Search filter
    if (params?.search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    // Category filter
    if (params?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }

    // Price range filter
    if (params?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    };
  },

  /**
   * Get product detail
   */
  async getProductDetail(id: string): Promise<ProductDetail> {
    // TODO: Connect to real API
    // return api.get(`/products/${id}`);

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    const product = MOCK_PRODUCT_DETAIL.find(p => p.id === id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },

  /**
   * Add to collection
   */
  async addToCollection(productId: string): Promise<{ message: string }> {
    // TODO: Connect to real API
    // return api.post(`/products/${productId}/collect`);

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Added to collection' };
  },
};
```

---

## 🎣 Hook Layer Implementation

### 1. Using SWR for Data Fetching

```typescript
// hooks/api/useProducts.ts
import useSWR from 'swr';
import { productService } from '@/services/product.service';
import { ProductQueryParams, PaginatedResponse, Product } from '@/types/product.types';

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
      revalidateOnFocus: false,  // Don't re-request on window focus
      dedupingInterval: 60000,   // Deduplicate identical requests within 60 seconds
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
    mutate, // Used for manual data refresh
  };
}

/**
 * Get product detail hook
 */
export function useProductDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `product-${id}` : null,
    () => productService.getProductDetail(id!)
  );

  return {
    product: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}
```

### 2. Using SWR Mutation for Operations

```typescript
// hooks/api/useProducts.ts (continued)
import useSWRMutation from 'swr/mutation';

/**
 * Add to collection hook (Mutation)
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
```

### 3. Auth Hook Implementation

```typescript
// hooks/api/useAuth.ts
import { useState, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterData, AuthUser } from '@/types/auth.types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('auth_token', token);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.register(data);
      localStorage.setItem('auth_token', token);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [router]);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
```

---

## 📦 Mock Data Management

### 1. Mock Data File Structure

```typescript
// mocks/product.mock.ts
import { Product, ProductDetail } from '@/types/product.types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: 79.99,
    originalPrice: 99.99,
    currency: 'USD',
    category: 'Electronics',
    images: ['/mocks/product-1.jpg'],
    inventory: 150,
    salesCount: 1250,
    rating: 4.5,
    reviewCount: 89,
    tags: ['wireless', 'bluetooth', 'earbuds'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  // ... more products
];

// Empty state mock
export const MOCK_EMPTY_PRODUCTS: Product[] = [];

// Error state simulation
export const simulateError = () => {
  throw new Error('Failed to fetch products');
};
```

### 2. Mock Data Coverage Scenarios

**Required Coverage**:
- ✅ Success state (with data)
- ✅ Empty state (no data)
- ✅ Loading state (simulated via delay)
- ✅ Error state (via throw error)
- ✅ Edge cases (long text, special characters, large values)

---

## 📝 TypeScript Type Definition Guidelines

### 1. Common Types

```typescript
// types/common.types.ts

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
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Base query parameters interface
 */
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### 2. Module Type Example

```typescript
// types/product.types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  images: string[];
  inventory: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  variants: ProductVariant[];
  specifications: ProductSpecification[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  inventory: number;
  attributes: Record<string, string>;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductQueryParams extends BaseQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}
```

---

## ✅ API Development Checklist

### When Creating Service:
- [ ] Function signature is `async`
- [ ] Has explicit TypeScript return type
- [ ] Has mock implementation (current stage)
- [ ] Has TODO comment marking real API integration point
- [ ] Has error handling
- [ ] Has simulated network delay (mock stage)

### When Creating Hook:
- [ ] Uses SWR for data fetching
- [ ] Returns `isLoading`, `isError`, `data` states
- [ ] Has appropriate SWR configuration (cache, deduplication)
- [ ] Has error handling
- [ ] Returns `mutate` method (for manual refresh)

### When Creating Mock Data:
- [ ] Covers success, empty data, error states
- [ ] Data structure matches TypeScript types
- [ ] Has sufficient test data (at least 5-10 items)
- [ ] Simulates real data characteristics (timestamps, ID format, etc.)

---

## 🚫 Common Mistakes

### Mistake 1: Synchronous Function Returning Mock Data
```typescript
// ❌ Wrong
export const productService = {
  getProducts() {
    return MOCK_PRODUCTS; // Synchronous return
  },
};

// ✅ Correct
export const productService = {
  async getProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_PRODUCTS;
  },
};
```

### Mistake 2: Direct API Call in Component
```typescript
// ❌ Wrong
const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  return <div>{products.map(...)}</div>;
};

// ✅ Correct - Use Hook
const ProductList = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return <div>{products.map(...)}</div>;
};
```

### Mistake 3: Oversimplified Mock Data
```typescript
// ❌ Wrong
export const MOCK_PRODUCTS = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
];

// ✅ Correct - Matches real data structure
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds...',
    price: 79.99,
    currency: 'USD',
    category: 'Electronics',
    images: ['/product-1.jpg'],
    inventory: 150,
    salesCount: 1250,
    rating: 4.5,
    reviewCount: 89,
    tags: ['wireless', 'bluetooth'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  // ... more sample data
];
```

---

## 🔄 Future Real API Integration Process

### Step 1: Remove Mock Implementation
```typescript
// services/product.service.ts
export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    // ✅ Remove mock code
    // await new Promise(resolve => setTimeout(resolve, 600));
    // return { data: MOCK_PRODUCTS, ... };

    // ✅ Use real API
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return api.get(`/products${queryString}`);
  },
};
```

### Step 2: Update Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_ENDPOINT=https://api.hyperzone.com/v1
```

### Step 3: Test and Verify
- ✅ Test all API calls
- ✅ Verify error handling
- ✅ Test auth token transmission
- ✅ Test pagination and filtering

---

**Last Updated**: 2026-03-30
**Maintainer**: AI Assistant (Claude)
