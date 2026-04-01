# Agent 1 任务：UI组件库开发

## 🎯 任务目标
开发HyperZone项目的通用UI组件库（12个组件）

## 📂 工作目录
- 输出目录：`src/components/ui/`
- 类型定义：`src/types/`
- 工具函数：`src/utils/helpers.ts`

## ✅ 已完成的基础设施
- Next.js 16 + React 19 + TypeScript 6
- Tailwind CSS v4已配置
- `src/utils/helpers.ts` 中的 `cn()` 函数可用
- Figma设计资源在 `public/assets/`

## 📋 开发任务清单（按优先级）

### 1. Button组件（30分钟）
**文件**：`src/components/ui/Button.tsx`

**要求**：
- 4种变体：primary, secondary, ghost, danger
- 3种尺寸：sm, md, lg
- 支持loading状态（使用lucide-react的Loader2图标）
- 支持leftIcon和rightIcon
- 完整的TypeScript类型
- 使用Tailwind CSS

**参考代码**：
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({...}) => {
  // 实现
};
```

---

### 2. Input组件（30分钟）
**文件**：`src/components/ui/Input.tsx`

**要求**：
- 支持label、error、hint
- 支持leftIcon、rightIcon
- WCAG合规的placeholder颜色（text-gray-400）
- 错误状态样式（border-red-500）
- 完整TypeScript类型

---

### 3. Select组件（40分钟）
**文件**：`src/components/ui/Select.tsx`

**要求**：
- 单选/多选支持
- 搜索功能（可选）
- 异步加载选项（预留接口）
- 使用lucide-react的ChevronDown图标

---

### 4. Modal组件（30分钟）
**文件**：`src/components/ui/Modal.tsx`

**要求**：
- 4种尺寸：sm, md, lg, xl
- ESC键关闭
- 点击遮罩关闭
- 使用lucide-react的X图标
- body滚动锁定

---

### 5. Table组件（45分钟）
**文件**：`src/components/ui/Table.tsx`

**要求**：
- 支持dataSource属性（不写死数据）
- 支持columns配置
- 加载状态
- 空数据状态
- 分页（可选）

---

### 6. Card组件（20分钟）
**文件**：`src/components/ui/Card.tsx`

**要求**：
- 基础卡片容器
- Header/Body/Footer结构
- 支持shadow效果

---

### 7. Badge组件（15分钟）
**文件**：`src/components/ui/Badge.tsx`

**要求**：
- 多种颜色变体
- 尺寸变体

---

### 8. Tabs组件（30分钟）
**文件**：`src/components/ui/Tabs.tsx`

**要求**：
- 受控/非受控模式
- 水平/垂直布局

---

### 9. Dropdown组件（25分钟）
**文件**：`src/components/ui/Dropdown.tsx`

**要求**：
- 下拉菜单
- 支持items配置

---

### 10. Toast组件（20分钟）
**文件**：`src/components/ui/Toast.tsx`

**要求**：
- 成功/错误/警告/信息类型
- 自动消失

---

### 11. Loading组件（15分钟）
**文件**：`src/components/ui/Loading.tsx`

**要求**：
- Spinner样式
- 支持尺寸和颜色

---

### 12. Empty组件（15分钟）
**文件**：`src/components/ui/Empty.tsx`

**要求**：
- 空状态展示
- 支持自定义图标和文字

---

## 🎨 设计规范

### 颜色系统
```typescript
// Tailwind配置中的颜色
primary: {
  500: '#0ea5e9', // 主色
  600: '#0284c7',
}
success: { 500: '#22c55e' }
warning: { 500: '#f59e0b' }
error: { 500: '#ef4444' }
```

### 类名组织顺序
```typescript
twMerge(clsx(
  // 1. 布局
  'inline-flex items-center justify-center',
  // 2. 盒模型
  'px-4 py-2 rounded-lg',
  // 3. 排版
  'text-sm font-medium',
  // 4. 背景 & 边框
  'bg-primary-500 hover:bg-primary-600',
  // 5. 交互
  'transition-colors duration-200',
  // 6. 用户className
  className
))
```

---

## 📝 开发规范

### 必须遵循
1. ✅ 所有组件必须有完整的TypeScript类型
2. ✅ 必须支持className扩展
3. ✅ 使用 `cn()` 函数合并类名
4. ✅ 使用Tailwind CSS，不硬编码颜色
5. ✅ Placeholder颜色必须是 `text-gray-400` 或 `text-gray-500`
6. ✅ 所有图标使用 `lucide-react`

### 禁止事项
1. ❌ 不在组件内写死数据
2. ❌ 不硬编码颜色值（hex）
3. ❌ 不使用 `any` 类型

---

## 📦 最终交付

### 文件结构
```
src/components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Modal.tsx
├── Table.tsx
├── Card.tsx
├── Badge.tsx
├── Tabs.tsx
├── Dropdown.tsx
├── Toast.tsx
├── Loading.tsx
├── Empty.tsx
└── index.ts    # 统一导出
```

### index.ts示例
```typescript
export { Button } from './Button';
export { Input } from './Input';
// ... 其他组件
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
// ... 其他类型
```

---

## ⏱️ 时间分配
- 总计：4小时
- 每个组件平均：15-45分钟
- 测试和调整：30分钟

---

## 🚀 开始开发
请严格按照以上规范开发所有12个组件，确保代码质量和一致性。

**记住**：所有组件都是独立可复用的，不要依赖业务逻辑！
