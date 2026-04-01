# HyperZone Project Development Rules

> **Importance**: ⚠️ All AI assistants must strictly follow the rules below during development

## 🎯 Core Project Principles

### 0. Internationalization (i18n) - English Only ⭐ HIGHEST PRIORITY
- **MANDATORY**: All UI text, comments, mock data, and documentation MUST be in English
- **PROHIBITED**: Chinese characters (中文) are NOT allowed in any source code files
- **Language Pack**: All translations are centralized in `@/locales/en.json`
- **Usage**: Use `useTranslation()` hook to access translations via `t('key.path')`
- **Structure**:
  ```
  src/locales/
  ├── en.json      # English language pack (primary)
  ├── index.ts     # i18n configuration
  └── [future]     # Additional languages (zh.json, es.json, etc.)
  ```
- **Translation Categories**: common, auth, nav, breadcrumb, dashboard, products, orders, tickets, settings, wallet, affiliate, validation, messages
- **Rationale**: HyperZone is a cross-border e-commerce platform serving global users

### 1. Style Consistency Development
- **Mandatory**: All UI implementations must maintain consistency with existing project styles
- **Reference**: Before implementing new components, review existing similar components in the codebase
- **Requirements**:
  - Use the same color palette (primary, secondary, gray scales)
  - Follow existing spacing patterns (padding, margin, gap)
  - Match typography styles (font sizes, weights, line heights)
  - Apply consistent border radius (rounded-lg, rounded-xl, etc.)
  - Maintain animation and transition patterns
  - Use the same shadow styles for cards and modals
- **Prohibited**: Making up styles that deviate from the established design system
- **Exception**: Placeholder color must be WCAG compliant (`text-gray-400` or `text-gray-500`)

### 2. Mock-First Development
- **Current Stage**: Backend not integrated, all data uses Mock
- **Function Signature**: Must be `async` functions returning `Promise<T>`
- **Data Coverage**: Mock data must cover multiple states (empty, loading, success, error)
- **Future Integration**: One-click replace Mock with real API, function signatures unchanged

### 3. TypeScript Strict Mode
- **Config**: `strict: true`
- **Requirement**: All components, functions, and variables must have explicit types
- **Prohibited**: Using `any` type (unless justified with comments)
- **Type Files**: Unified in `@/types/` directory

### 4. Atomic Design Components
- **UI Components**: All common components (Button, Input, Modal, etc.) in `@/components/ui/`
- **Feature Components**: Business feature components in `@/components/features/`
- **Requirement**: Components must support `className` prop extension
- **Prohibited**: Hard-coding data fetching logic inside components

---

## 📁 Directory Structure

### Path Alias
```typescript
// tsconfig.json configured
"@/*": ["./src/*"]
```

### Directory Responsibilities
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth module group (no MainLayout)
│   ├── (dashboard)/       # Main app module group (with MainLayout)
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Atomic UI components (Button, Input, Modal...)
│   ├── layout/            # Layout components (Header, SideNav...)
│   └── features/          # Business feature components (ProductCard, OrderTable...)
├── services/              # API service layer (all backend requests)
├── hooks/
│   ├── api/              # Data fetching hooks (useProducts, useOrders...)
│   └── use*.ts           # Other custom hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions (formatting, validation...)
├── constants/             # Constant configurations
├── locales/               # i18n language packs
│   ├── en.json           # English translations (primary)
│   └── index.ts          # i18n helpers
└── styles/                # Global styles
```

### File Naming Conventions
- **Component files**: PascalCase (e.g., `Button.tsx`)
- **Page files**: page.tsx (Next.js convention)
- **Layout files**: layout.tsx (Next.js convention)
- **Utility functions**: camelCase (e.g., `formatPrice.ts`)
- **Type files**: *.types.ts (e.g., `product.types.ts`)
- **Constant files**: UPPER_SNAKE_CASE.ts or kebab-case.ts

---

## 🛠 Technology Stack Guidelines

### 1. Next.js 14 App Router
- **Route Organization**: Use route groups `(auth)` and `(dashboard)` to separate layouts
- **Data Fetching**: Use `fetch` in Server Components, SWR in Client Components
- **Navigation**: Prefer `<Link>` component, avoid `useRouter` unless necessary
- **Dynamic Routes**: Use `[id]` folders, e.g., `/products/[id]/page.tsx`

### 2. Tailwind CSS
- **Principle**: Strictly follow Figma design's Spacing, Colors, Typography
- **Colors**: Use Tailwind configured custom colors, no direct hex values
- **Responsive**: Mobile-first, breakpoints `sm:640px md:768px lg:1024px xl:1280px`
- **Utils**: Use `clsx` and `tailwind-merge` to merge classNames

```typescript
// ✅ Correct
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ className, ...props }) => {
  return (
    <button
      className={twMerge(clsx(
        'px-4 py-2 bg-primary text-white rounded-lg',
        className
      ))}
      {...props}
    />
  );
};

// ❌ Wrong
const Button = ({ className }) => {
  return <button className="px-4 py-2 bg-blue-500 text-white" />;
};
```

### 3. Icons
- **Primary**: Lucide React icon library
- **Custom**: User-provided core icons in `public/assets/icons/`
- **Usage**:
  ```typescript
  import { Search, Menu } from 'lucide-react'; // Lucide icons
  import ShopifyIcon from '@/assets/icons/shopify-icon.svg'; // Custom icons
  ```

### 4. Data Fetching (SWR)
- **Hook Location**: `@/hooks/api/`
- **Naming**: `use[Resource]` (e.g., `useProducts`, `useOrders`)
- **Error Handling**: Unified in hooks, components handle `isLoading`, `isError`, `data`
- **Cache Strategy**: Configure `revalidateOnFocus`, `dedupingInterval` based on data characteristics

```typescript
// ✅ Correct
// hooks/api/useProducts.ts
import useSWR from 'swr';
import { api } from '@/services/api';

export function useProducts(params?: ProductQueryParams) {
  const { data, error, isLoading } = useSWR(
    ['products', params],
    () => api.products.getProducts(params)
  );

  return {
    products: data,
    isLoading,
    isError: !!error,
    error,
  };
}

// components/features/ProductList.tsx
const ProductList = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  return <div>{products.map(...)}</div>;
};
```

### 5. i18n Translation
```typescript
// ✅ Using translations
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('common.loading')}</p>
      <Button>{t('common.save')}</Button>
    </div>
  );
};

// ❌ Hardcoded text (NOT ALLOWED)
const MyComponent = () => {
  return <h1>Dashboard</h1>; // Wrong - should use translation
};
```

---

## 🚫 Prohibited Actions

### 1. No Hardcoded Data
```typescript
// ❌ Wrong
const ProductList = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];

  return <div>{products.map(...)}</div>;
};

// ✅ Correct
const ProductList = () => {
  const { products } = useProducts(); // Fetch via hook
  return <div>{products.map(...)}</div>;
};
```

### 2. No Direct API Calls in Components
```typescript
// ❌ Wrong
const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return <div>{products.map(...)}</div>;
};

// ✅ Correct - Encapsulate in Hook
// hooks/api/useProducts.ts
export function useProducts() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);
  return { products: data, isLoading, isError: !!error };
}

// ProductList.tsx
const ProductList = () => {
  const { products, isLoading, isError } = useProducts();
  // ...
};
```

### 3. No Hardcoded Colors and Spacing
```typescript
// ❌ Wrong
<div style={{ color: '#3B82F6', padding: '16px' }}>

// ✅ Correct
<div className="text-primary-500 p-4">
```

### 4. No Ignoring Error Handling
```typescript
// ❌ Wrong
const { products } = useProducts();
return <div>{products.map(...)}</div>; // Crashes if products is undefined

// ✅ Correct
const { products, isLoading, isError } = useProducts();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage />;
if (!products || products.length === 0) return <EmptyState />;

return <div>{products.map(...)}</div>;
```

### 5. No Chinese Characters in Code
```typescript
// ❌ Wrong
const title = "所有商品";  // Chinese not allowed
toast.success("操作成功");  // Chinese not allowed

// ✅ Correct
const title = t('products.allProducts');  // Use translation
toast.success(t('messages.operationSuccess'));  // Use translation
```

---

## ✅ Required Checklist

### Every Component Creation:
- [ ] Component has TypeScript type definitions
- [ ] Props interface has JSDoc comments
- [ ] Supports `className` prop extension
- [ ] No hardcoded style values
- [ ] No hardcoded data
- [ ] Has loading state handling
- [ ] Has error state handling
- [ ] Has empty state handling (if applicable)
- [ ] Extracted to correct directory (`ui/` or `features/`)
- [ ] All text uses translation keys (no hardcoded strings)

### Every Page Creation:
- [ ] Style consistent with existing pages
- [ ] Uses correct layout component (AuthLayout / MainLayout)
- [ ] Data fetched via custom hooks
- [ ] Complete TypeScript types
- [ ] Responsive adaptation complete
- [ ] Route structure follows conventions
- [ ] All UI text uses translations

### Every API Interface Addition:
- [ ] Service layer function defined
- [ ] Function signature is `async`
- [ ] Has TypeScript return type
- [ ] Mock data prepared
- [ ] Custom hook created
- [ ] Error handling implemented

---

## 🔄 Development Workflow

### Standard Development Process:
1. **Review Existing** → Check existing components for style reference and patterns
2. **Define Types** → Create TypeScript interfaces in `@/types/`
3. **Add Translations** → Add text to `@/locales/en.json`
4. **Create Mock** → Prepare mock data in `@/mocks/`
5. **Implement Service** → Add API functions in `@/services/`
6. **Create Hook** → Encapsulate data fetching in `@/hooks/api/`
7. **Develop Component** → Implement UI in `@/components/` (maintain style consistency)
8. **Assemble Page** → Create page in `@/app/` using components
9. **Test & Verify** → Manually test various states and edge cases

### Issue Priority:
1. **Blocking Issues** (won't run, compile errors) → Fix immediately
2. **Functional Issues** (interaction bugs, data errors) → Fix with priority
3. **Style Issues** (inconsistent with design) → Fix timely
4. **Optimization Suggestions** (performance, UX) → Record for later

---

## 📚 Reference Documentation

- [Next.js 14 App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [SWR Docs](https://swr.vercel.app/)
- [Lucide React Icons](https://lucide.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Accessibility Guide](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🚨 Violation Consequences

If code violates the above rules, AI assistants must:
1. **Stop Immediately** - Pause current development
2. **Identify Issue** - Inform user of the violation
3. **Propose Fix** - Present solution and seek approval
4. **Fix and Continue** - Resume after correction

---

**Last Updated**: 2026-03-30
**Maintainer**: AI Assistant (Claude)
**Status**: ✅ Active
