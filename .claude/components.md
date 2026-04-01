# Component Development Guidelines

> **Scope**: All component development in `@/components/` directory

## 🎯 Component Categories and Directory Structure

### 1. UI Components (`components/ui/`)
**Definition**: Highly reusable atomic components without business logic

**Standard Component List**:
```
components/ui/
├── Button.tsx           # Button (Primary/Secondary/Ghost/Danger)
├── Input.tsx            # Input (Text/Password/Number/Search)
├── Select.tsx           # Dropdown select
├── Modal.tsx            # Modal dialog
├── Table.tsx            # Data table
├── Card.tsx             # Card container
├── Badge.tsx            # Badge/Tag
├── Tabs.tsx             # Tab switcher
├── Dropdown.tsx         # Dropdown menu
├── Toast.tsx            # Toast notification
├── Loading.tsx          # Loading state
├── Empty.tsx            # Empty state
├── Pagination.tsx       # Pagination
├── Avatar.tsx           # Avatar
└── index.ts             # Unified export
```

### 2. Layout Components (`components/layout/`)
**Definition**: Page-level layout components defining page structure

**Standard Component List**:
```
components/layout/
├── MainLayout.tsx       # Main layout (Header + SideNav + Content)
├── AuthLayout.tsx       # Auth layout (centered card)
├── Header.tsx           # Top navigation bar
├── SideNav.tsx          # Side navigation (collapsible)
├── Breadcrumb.tsx       # Breadcrumb navigation
└── index.ts
```

### 3. Feature Components (`components/features/`)
**Definition**: Business logic components organized by module

**Module Organization**:
```
components/features/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ForgotPasswordForm.tsx
├── products/
│   ├── ProductCard.tsx
│   ├── ProductFilter.tsx
│   ├── ProductDetail.tsx
│   └── ProductGallery.tsx
├── orders/
│   ├── OrderTable.tsx
│   ├── OrderDetail.tsx
│   └── OrderStatus.tsx
├── stores/
│   ├── StoreCard.tsx
│   ├── BindStoreModal.tsx
│   └── UnbindStoreModal.tsx
└── index.ts
```

---

## 📐 Component Interface Design

### 1. Props Interface Definition

**Required Common Props**:
```typescript
interface BaseComponentProps {
  className?: string;        // ✅ Must support className extension
  children?: React.ReactNode;
}

// Example: Button component
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

### 2. JSDoc Comment Standard

**Must Include**:
- Component purpose description
- Props parameter descriptions
- Usage examples (for complex components)

```typescript
/**
 * Generic Button Component
 * @description Supports multiple variants, sizes, and loading states
 * @param props.variant - Button variant type
 * @param props.size - Button size
 * @param props.loading - Loading state
 * @param props.className - Extended style class name
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}) => {
  // Implementation code
};
```

---

## 🎨 Style Guidelines

### 1. Tailwind CSS Class Organization

**Recommended Class Order** (following Tailwind official recommendations):
```typescript
const buttonClasses = twMerge(clsx(
  // 1. Layout (Display & Position)
  'inline-flex items-center justify-center',

  // 2. Box Model (Box Model)
  'px-4 py-2 rounded-lg',

  // 3. Typography (Typography)
  'text-sm font-medium',

  // 4. Background & Border (Background & Border)
  'bg-primary-500 hover:bg-primary-600',

  // 5. Interactivity (Interactivity)
  'transition-colors duration-200',

  // 6. Responsive (Responsive)
  'md:px-6 md:py-3',

  // 7. State (State)
  'disabled:opacity-50 disabled:cursor-not-allowed',

  // 8. User custom className (must be last)
  className
));
```

### 2. Color Usage Guidelines

**Must use Tailwind configured custom colors**:
```typescript
// ❌ Wrong - Hardcoded color values
<div className="bg-blue-500 text-white">

// ✅ Correct - Use theme colors
<div className="bg-primary-500 text-white">

// ✅ Correct - Use semantic colors
<div className="bg-error text-white">
```

### 3. Responsive Design

**Mobile-first principle**:
```typescript
// ✅ Correct - Small screen to large screen
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-4
">

// ❌ Wrong - Large screen to small screen
<div className="
  grid
  grid-cols-4
  lg:grid-cols-3
  md:grid-cols-2
  sm:grid-cols-1
  gap-4
">
```

### 4. Style Consistency

**When creating new components, reference existing similar components**:
- Check existing card styles for shadow, border, and radius patterns
- Match button styles with existing variants
- Use consistent spacing patterns from similar components
- Apply the same transition and animation durations

---

## 🔧 Core UI Component Examples

### 1. Button Component

```typescript
// components/ui/Button.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Generic Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = twMerge(clsx(
    'inline-flex items-center justify-center',
    'rounded-lg font-medium',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  ));

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### 2. Input Component

```typescript
// components/ui/Input.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = twMerge(clsx(
    'w-full px-4 py-2 rounded-lg',
    'border border-gray-300',
    'text-gray-900 placeholder-gray-400', // ✅ WCAG compliant placeholder color
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    error && 'border-red-500 focus:ring-red-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  ));

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input id={inputId} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
};
```

### 3. Modal Component

```typescript
// components/ui/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={twMerge(clsx(
          'relative bg-white rounded-lg shadow-xl',
          'w-full mx-4',
          sizeClasses[size],
          className
        ))}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## ✅ Component Development Checklist

### When Creating UI Components:
- [ ] Component placed in `components/ui/` directory
- [ ] Complete TypeScript type definitions
- [ ] Props interface has JSDoc comments
- [ ] Supports `className` extension
- [ ] Uses Tailwind CSS (no hardcoded styles)
- [ ] Supports accessibility (ARIA labels, keyboard navigation)
- [ ] Proper documentation comments
- [ ] Exported in `index.ts`

### When Creating Feature Components:
- [ ] Component placed in `components/features/[module]/` directory
- [ ] Data fetched via custom hooks (no direct API calls in component)
- [ ] Loading state handling
- [ ] Error state handling
- [ ] Empty state handling (if applicable)
- [ ] No hardcoded mock data
- [ ] Follows single responsibility principle

### Style Checklist:
- [ ] Uses Tailwind configured theme colors
- [ ] Class order follows conventions
- [ ] Responsive design complete (Mobile-first)
- [ ] Placeholder color WCAG compliant
- [ ] Hover/Focus/Active states complete
- [ ] Disabled states complete

---

## 🚫 Common Mistakes

### Mistake 1: Hardcoded Data
```typescript
// ❌ Wrong
const ProductCard = () => {
  const product = {
    name: 'Product Name',
    price: 99.99,
    image: '/product.jpg',
  };

  return <div>{product.name}</div>;
};

// ✅ Correct
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return <div>{product.name}</div>;
};
```

### Mistake 2: No className Extension
```typescript
// ❌ Wrong
const Card = ({ children }) => {
  return <div className="p-4 bg-white rounded-lg">{children}</div>;
};

// ✅ Correct
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={twMerge(clsx('p-4 bg-white rounded-lg', className))}>
      {children}
    </div>
  );
};
```

### Mistake 3: Ignoring State Handling
```typescript
// ❌ Wrong
const ProductList = () => {
  const { products } = useProducts();
  return <div>{products.map(p => <ProductCard product={p} />)}</div>;
};

// ✅ Correct
const ProductList = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!products || products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

---

**Last Updated**: 2026-03-30
**Maintainer**: AI Assistant (Claude)
