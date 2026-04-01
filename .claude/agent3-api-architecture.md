# Agent 3 任务：API架构开发

## 🎯 任务目标
搭建HyperZone项目的API服务层、Mock数据和自定义Hooks

## 📂 工作目录
- API封装：`src/services/`
- Mock数据：`src/mocks/`
- 自定义Hooks：`src/hooks/api/`
- 类型定义：`src/types/`

## ✅ 已完成的基础设施
- 环境变量：`NEXT_PUBLIC_API_ENDPOINT`
- TypeScript类型：`src/types/` 已有基础类型
- 完全独立，不依赖其他代理

## 📋 开发任务清单

### 1. 基础API封装（45分钟）

#### 1.1 创建 `src/services/api.ts`

**要求**：
- 基础request函数（支持GET/POST/PUT/DELETE）
- 自动添加认证token
- 统一错误处理
- TypeScript泛型支持

**代码框架**：
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Network error',
    }));
    throw new ApiError(response.status, error.message);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };
```

---

### 2. Mock数据准备（60分钟）

#### 2.1 认证Mock数据
**文件**：`src/mocks/auth.mock.ts`

**要求**：
- Mock用户数据（至少3个用户）
- Mock token
- 覆盖成功、失败、网络错误状态

```typescript
import { AuthUser } from '@/types/auth.types';

export const MOCK_USERS: AuthUser[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: '/assets/images/avatar-demo.jpg',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-29T00:00:00Z',
  },
  // ... 更多用户
];

export const MOCK_TOKEN = 'mock_token_' + Date.now();

export const simulateDelay = (ms: number = 600) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const simulateError = (message: string = 'Mock error') => {
  throw new Error(message);
};
```

---

#### 2.2 商品Mock数据
**文件**：`src/mocks/product.mock.ts`

**要求**：
- 至少20个商品
- 包含各种状态（有库存、无库存、不同分类）
- 包含变体（variants）
- 符合Product类型定义

```typescript
import { Product, ProductDetail } from '@/types/product.types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds...',
    price: 79.99,
    currency: 'USD',
    category: 'Electronics',
    images: ['/mocks/product-1.jpg'],
    inventory: 150,
    salesCount: 1250,
    rating: 4.5,
    reviewCount: 89,
    tags: ['wireless', 'bluetooth'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  // ... 19个更多商品
];

export const MOCK_PRODUCT_DETAIL: ProductDetail[] = [
  // 商品详情（包含variants和specifications）
];

export const MOCK_EMPTY_PRODUCTS: Product[] = [];
```

---

#### 2.3 店铺Mock数据
**文件**：`src/mocks/store.mock.ts`

**要求**：
- 至少5个店铺
- 包含不同平台（Shopify, Amazon, eBay等）
- 不同状态（已连接、未连接）

---

#### 2.4 订单Mock数据
**文件**：`src/mocks/order.mock.ts`

**要求**：
- 至少15个订单
- 包含不同状态（待支付、已支付、已发货、已完成）
- 包含不同类型（店铺订单、样品订单、备货订单）

---

### 3. Service层实现（60分钟）

#### 3.1 认证服务
**文件**：`src/services/auth.service.ts`

```typescript
import { api } from './api';
import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth.types';
import { MOCK_USERS, MOCK_TOKEN, simulateDelay } from '@/mocks/auth.mock';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    // TODO: 对接真实API
    // return api.post('/auth/login', credentials);

    // Mock实现
    await simulateDelay(800);

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid email or password');
    }

    return { user, token: MOCK_TOKEN };
  },

  async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // TODO: 对接真实API
    await simulateDelay(800);

    const newUser: AuthUser = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: newUser, token: 'mock_token_' + Date.now() };
  },

  async logout(): Promise<void> {
    // TODO: 对接真实API
    await simulateDelay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    // TODO: 对接真实API
    await simulateDelay(400);
    return MOCK_USERS[0];
  },
};
```

---

#### 3.2 商品服务
**文件**：`src/services/product.service.ts`

**要求**：
- `getProducts(params)` - 支持搜索、筛选、分页
- `getProductDetail(id)` - 获取商品详情
- `addToCollection(productId)` - 添加到收藏
- `getCollections()` - 获取收藏列表

---

#### 3.3 店铺服务
**文件**：`src/services/store.service.ts`

**要求**：
- `getStores()` - 获取店铺列表
- `bindStore(data)` - 绑定店铺
- `unbindStore(id)` - 解绑店铺
- `getStoreDetail(id)` - 获取店铺详情

---

#### 3.4 订单服务
**文件**：`src/services/order.service.ts`

**要求**：
- `getOrders(params)` - 获取订单列表
- `getOrderDetail(id)` - 获取订单详情
- `createOrder(data)` - 创建订单

---

### 4. 自定义Hooks（90分钟）

#### 4.1 认证Hook
**文件**：`src/hooks/api/useAuth.ts`

```typescript
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterData, AuthUser } from '@/types/auth.types';

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
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
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
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
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

#### 4.2 商品Hook
**文件**：`src/hooks/api/useProducts.ts`

**要求**：
- 使用SWR
- 支持搜索、筛选、分页
- 返回 `{ products, isLoading, isError, error, mutate }`

```typescript
import useSWR from 'swr';
import { productService } from '@/services/product.service';
import { ProductQueryParams, PaginatedResponse, Product } from '@/types/product.types';

export function useProducts(params?: ProductQueryParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    ['products', params],
    () => productService.getProducts(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    products: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

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

---

#### 4.3 店铺Hook
**文件**：`src/hooks/api/useStores.ts`

**要求**：
- `useStores()` - 获取店铺列表
- `useStoreDetail(id)` - 获取店铺详情

---

#### 4.4 订单Hook
**文件**：`src/hooks/api/useOrders.ts`

**要求**：
- `useOrders(params)` - 获取订单列表
- `useOrderDetail(id)` - 获取订单详情

---

## 📦 最终交付

### 文件结构
```
src/services/
├── api.ts
├── auth.service.ts
├── product.service.ts
├── store.service.ts
├── order.service.ts
└── index.ts

src/mocks/
├── auth.mock.ts
├── product.mock.ts
├── store.mock.ts
├── order.mock.ts
└── index.ts

src/hooks/api/
├── useAuth.ts
├── useProducts.ts
├── useStores.ts
├── useOrders.ts
└── index.ts
```

---

## ⏱️ 时间分配
- 总计：4.5小时
- 基础API封装：45分钟
- Mock数据：60分钟
- Service层：60分钟
- 自定义Hooks：90分钟
- 测试：15分钟

---

## 🚀 开始开发
你的工作完全独立，可以立即开始！请按照上述任务清单逐步完成所有开发工作。

**记住**：Mock数据质量直接决定前端开发体验，请确保Mock数据真实、丰富！
