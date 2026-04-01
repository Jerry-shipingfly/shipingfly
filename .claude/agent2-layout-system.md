# Agent 2 任务：布局系统开发

## 🎯 任务目标
开发HyperZone项目的布局系统（5个组件）

## 📂 工作目录
- 输出目录：`src/components/layout/`
- 页面布局：`src/app/`
- Figma参考：整体框架设计

## ✅ 已完成的基础设施
- Agent 1正在开发UI组件库（你可以依赖Agent 1已完成的组件）
- Next.js App Router已配置
- Figma设计资源在 `public/assets/`

## 📋 开发任务清单（按依赖顺序）

### 1. Header组件（45分钟）
**文件**：`src/components/layout/Header.tsx`

**Figma参考**：整体框架 - Default (`node-id=282-19402`)

**要求**：
- Logo区域（使用 `public/assets/logo/logo.svg`）
- 面包屑导航（可选）
- 右侧功能区：
  - 通知图标（使用lucide-react的Bell）
  - 用户头像/下拉菜单
- 高度：64px（h-16）
- 固定在顶部
- 支持响应式

**Props**：
```typescript
interface HeaderProps {
  className?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}
```

---

### 2. SideNav组件（60分钟）
**文件**：`src/components/layout/SideNav.tsx`

**Figma参考**：
- Default: `node-id=282-19402`
- Compact: `node-id=307-5169`

**要求**：
- 可折叠（展开宽度256px，折叠宽度80px）
- 菜单项：
  - Dashboard
  - Find Products
  - Store Management
  - Store Products
  - Branding
  - Orders
  - Affiliate Plan
  - Wallet
  - Settings
  - Support Tickets
- 使用Figma菜单图标（selected/unselected状态）
- 高亮当前路由
- 平滑折叠/展开动画

**Props**：
```typescript
interface SideNavProps {
  className?: string;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  currentPath?: string;
}
```

**菜单配置**：
```typescript
const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/find-products', label: 'Find Products', icon: 'findproduct' },
  // ... 其他菜单项
];
```

---

### 3. MainLayout组件（60分钟）
**文件**：`src/components/layout/MainLayout.tsx`

**Figma参考**：Full layout (`node-id=307-5818`)

**要求**：
- 结构：Header + SideNav + Content
- Content区域自适应高度
- 支持SideNav折叠
- 最小高度100vh
- 背景色：bg-gray-50

**Props**：
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}
```

**布局结构**：
```typescript
<div className="min-h-screen bg-gray-50">
  <Header />
  <div className="flex">
    <SideNav />
    <main className="flex-1 p-6">
      {children}
    </main>
  </div>
</div>
```

---

### 4. AuthLayout组件（30分钟）
**文件**：`src/components/layout/AuthLayout.tsx`

**Figma参考**：Login View (`node-id=275-26328`)

**要求**：
- 居中卡片式布局
- 左侧：装饰插图（使用 `public/assets/images/auth-illustration.png`）
- 右侧：登录/注册表单
- 响应式（移动端只显示卡片）
- 背景渐变

**Props**：
```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}
```

---

### 5. Breadcrumb组件（20分钟）
**文件**：`src/components/layout/Breadcrumb.tsx`

**要求**：
- 显示当前路径
- 支持点击导航
- 使用lucide-react的ChevronRight图标
- 响应式（移动端可隐藏）

**Props**：
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    path?: string;
  }>;
  className?: string;
}
```

---

## 🎨 设计规范

### 布局尺寸
```typescript
// Header
height: 64px (h-16)

// SideNav
expanded: 256px (w-64)
collapsed: 80px (w-20)

// Content
padding: 24px (p-6)
```

### 颜色
```typescript
// Header
bg: bg-white
border: border-b border-gray-200

// SideNav
bg: bg-white
selected: bg-primary-50 text-primary-600
unselected: text-gray-600 hover:bg-gray-50

// Content
bg: bg-gray-50
```

---

## 📝 开发规范

### 必须遵循
1. ✅ 使用Agent 1开发的UI组件
2. ✅ 响应式设计（Mobile-first）
3. ✅ 所有图标使用Figma资源或lucide-react
4. ✅ 完整TypeScript类型
5. ✅ 支持className扩展

### Next.js App Router集成
```typescript
// src/app/(dashboard)/layout.tsx
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
```

---

## 📦 最终交付

### 文件结构
```
src/components/layout/
├── Header.tsx
├── SideNav.tsx
├── MainLayout.tsx
├── AuthLayout.tsx
├── Breadcrumb.tsx
└── index.ts    # 统一导出

src/app/
├── (dashboard)/
│   └── layout.tsx    # 使用MainLayout
└── (auth)/
    └── layout.tsx    # 使用AuthLayout
```

---

## ⏱️ 时间分配
- 总计：3.5小时
- Header：45分钟
- SideNav：60分钟
- MainLayout：60分钟
- AuthLayout：30分钟
- Breadcrumb：20分钟
- 集成测试：15分钟

---

## 🔗 依赖关系
- **依赖Agent 1**：Button, Dropdown等UI组件
- **开始时间**：Agent 1完成Button和Input组件后（约1小时后）

---

## 🚀 开始开发
请等待Agent 1完成Button和Input组件后再开始，或先开发不依赖UI组件的部分（如AuthLayout）。

**记住**：布局是页面的骨架，必须稳定可靠！
