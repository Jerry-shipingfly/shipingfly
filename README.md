# HyperZone - 跨境电商履约系统

> 专业的Shopify店铺一件代发货履约平台前端应用

## 🚀 项目概览

HyperZone是一个专为跨境电商卖家打造的履约管理系统，支持Shopify店铺管理、商品同步、订单处理等核心功能。

### 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS
- **数据获取**: SWR
- **图标**: Lucide React
- **图表**: Recharts
- **设计来源**: Figma (通过MCP工具读取)

## 📁 项目结构

```
HyperZone/
├── .claude/              # AI开发规范和配置
│   ├── rules.md          # 项目开发规则
│   ├── components.md     # 组件开发规范
│   └── api-patterns.md   # API对接模式
├── public/               # 静态资源
│   └── assets/           # 图片、图标等
│       ├── logo/         # Logo资源
│       ├── icons/        # 图标资源（按模块分类）
│       └── images/       # 图片资源
├── src/
│   ├── app/              # Next.js App Router页面
│   │   ├── (auth)/       # 认证模块（登录、注册）
│   │   └── (dashboard)/  # 主应用模块
│   ├── components/       # React组件
│   │   ├── ui/           # 原子UI组件
│   │   ├── layout/       # 布局组件
│   │   └── features/     # 业务功能组件
│   ├── services/         # API服务层
│   ├── hooks/            # 自定义Hooks
│   │   └── api/          # 数据获取Hooks
│   ├── types/            # TypeScript类型定义
│   ├── utils/            # 工具函数
│   ├── constants/        # 常量配置
│   └── styles/           # 全局样式
├── .env.local            # 本地环境变量
├── .env.development      # 开发环境配置
└── .env.production       # 生产环境配置

```

## 🛠️ 开发指南

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

### 代码检查

```bash
npm run lint
```

## 🎨 设计规范

本项目严格遵循Figma设计稿，所有UI实现必须基于设计稿。

### 设计资源

- **Figma文件**: [Appstore-ui-260325](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325)
- **设计资源位置**: `E:\VSCode\Figma\icon-svg`

### 颜色系统

使用Tailwind配置的自定义颜色，不直接使用hex值：

```typescript
// ✅ 正确
<div className="bg-primary-500 text-white">

// ❌ 错误
<div style={{ backgroundColor: '#3B82F6' }}>
```

## 📝 开发规范

详细开发规范请查看 `.claude/` 目录下的文档：

- [rules.md](.claude/rules.md) - 项目核心规则
- [components.md](.claude/components.md) - 组件开发规范
- [api-patterns.md](.claude/api-patterns.md) - API对接模式

### 核心原则

1. **设计驱动**: 严格基于Figma设计稿实现
2. **Mock优先**: 后端未对接前使用Mock数据
3. **TypeScript严格模式**: 所有代码必须有类型定义
4. **组件原子化**: 高度可复用的UI组件

## 🗂️ 功能模块

### 已完成模块

- ✅ 认证模块 (登录/注册/找回密码)
- ✅ Dashboard数据大盘
- ✅ 店铺管理 (绑定Shopify店铺)
- ✅ 找货源 (商品浏览/详情)
- ✅ 店铺商品管理
- ✅ 品牌包装 (包材产品/包材关联)
- ✅ 订单管理 (店铺/样品/备货)
- ✅ 工单系统
- ✅ 联盟计划
- ✅ 钱包财务
- ✅ 系统设置
- ✅ 多语言支持 (6种语言)

## 🌐 多语言支持 (i18n)

项目支持以下语言：

| 语言 | 代码 | 状态 |
| :--- | :--- | :--- |
| English (US) | `en-US` | ✅ 默认语言 |
| Français | `fr` | ✅ 可用 |
| Deutsch | `de` | ✅ 可用 |
| Español | `es` | ✅ 可用 |
| Português (BR) | `pt-BR` | ✅ 可用 |
| 日本語 | `ja` | ✅ 可用 |

### 使用方式

```tsx
import { useTranslation } from '@/hooks/useTranslation';

export function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLocale('ja')}>日本語</button>
    </div>
  );
}
```

### 添加新翻译

1. 在 `src/locales/en-US.json` 中添加翻译键
2. 同步添加到其他 5 个语言文件 (`de.json`, `es.json`, `fr.json`, `ja.json`, `pt-BR.json`)
3. 使用 `t('key.path')` 在组件中引用

## 🔌 API对接

当前阶段使用Mock数据，API接口已预留。

### 环境变量配置

```bash
# .env.local
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001/api/v1
```

### Service层示例

```typescript
// services/product.service.ts
export const productService = {
  async getProducts() {
    // TODO: 对接真实API
    // return api.get('/products');

    // Mock实现
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_PRODUCTS;
  },
};
```

## 📦 依赖说明

### 核心依赖

- `next` - Next.js框架
- `react` / `react-dom` - React库
- `typescript` - TypeScript支持
- `tailwindcss` - Tailwind CSS
- `swr` - 数据获取Hook
- `lucide-react` - 图标库
- `recharts` - 图表库
- `clsx` / `tailwind-merge` - 类名合并工具

## 🚀 部署

### Vercel部署（推荐）

```bash
npm install -g vercel
vercel
```

### Docker部署

```bash
docker build -t hyperzone .
docker run -p 3000:3000 hyperzone
```

## 📄 License

ISC

## 👥 维护者

- AI Assistant (Claude) - 开发协助

---

**最后更新**: 2026-03-29
