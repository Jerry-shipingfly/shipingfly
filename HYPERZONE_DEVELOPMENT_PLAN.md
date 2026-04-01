# 🚀 HyperZone AppStore Frontend Development Guide (V1.4)

This guide is designed to direct AI assistants (Claude) to build the HyperZone cross-border e-commerce fulfillment system frontend from scratch using Figma MCP tools. This project has deep routing hierarchy and complex state interactions, please strictly follow the steps and path mappings in this guide.

## 📋 Current Implementation Status (Updated 2026-03-30)

### ✅ Completed Features
| Module | Status | Notes |
| :--- | :--- | :--- |
| Authentication (Login/Register/Forgot Password) | ✅ Complete | Multi-language supported |
| Dashboard | ✅ Complete | Sales stats, trends, recent orders |
| Store Management | ✅ Complete | Connect/unbind Shopify stores |
| Products - All Products | ✅ Complete | Grid view, filters, detail page |
| Products - Winning Products | ✅ Complete | Trending products view |
| Products - Sourcing Requests | ✅ Complete | New request form |
| Orders - Store/Sample/Stock | ✅ Complete | Order tables, filters, status |
| Branding - Packaging Products | ✅ Complete | Packaging list with filters |
| Branding - Packaging Connection | ✅ Complete | Store/Orders/Products tabs |
| Affiliate - Referral Links | ✅ Complete | Referral link management |
| Affiliate - Recommended Users | ✅ Complete | Referral user list |
| Wallet - Recharge | ✅ Complete | Balance, recharge flow |
| Wallet - Invoice | ✅ Complete | Invoice list, filtering |
| Support Tickets | ✅ Complete | Ticket table, status management |
| Settings - Profile | ✅ Complete | User profile editing |
| Settings - Address | ✅ Complete | Address CRUD |
| Settings - Shipping | ✅ Complete | Shipping channel config |
| Settings - Sub-Account | ✅ Complete | Team member management |
| Settings - Notification | ✅ Complete | Notification preferences |
| Multi-Language (i18n) | ✅ Complete | 6 languages supported |
| Dev Indicators | ✅ Disabled | Production-ready config |

### 🔄 Recently Modified (V1.4)
1. **Branding Module Tabs Renamed**: `Packaging Products`, `Packaging Connection`
2. **Packaging Connection**: Default tab changed to `Store`, tab order: Store → Orders → Products
3. **Packaging Connection**: Added functional descriptions for each tab
4. **Removed Menu Items**: `My Collection`, `Recommendations` from Products menu
5. **Fixed Issues**: Hydration errors, TypeScript errors, Intl.NumberFormat fallbacks

## 🛠 1. Tech Stack & Architecture Principles

### 1.0 Internationalization (i18n) - Multi-Language Support ⭐ CRITICAL

> **IMPORTANT**: All new features MUST follow multi-language requirements. No hardcoded text in components.

#### 1.0.1 Supported Languages
| Language | Code | File | Status |
| :--- | :--- | :--- | :--- |
| English (US) | `en-US` | `en-US.json` | ✅ Primary |
| German | `de` | `de.json` | ✅ Available |
| Spanish | `es` | `es.json` | ✅ Available |
| French | `fr` | `fr.json` | ✅ Available |
| Japanese | `ja` | `ja.json` | ✅ Available |
| Portuguese (BR) | `pt-BR` | `pt-BR.json` | ✅ Available |

#### 1.0.2 Architecture
- **Context**: `I18nContext` provides global language state and switching functionality
- **Hook**: `useTranslation()` returns `{ t, locale, setLocale, isLoading }`
- **Component**: `<LanguageSwitcher />` for language selection UI
- **Storage**: User preference saved to `localStorage` with key `hyperzone_locale`

#### 1.0.3 Directory Structure
```
src/
├── contexts/
│   └── I18nContext.tsx      # Global i18n context provider
├── hooks/
│   └── useTranslation.ts    # Translation hook
├── components/ui/
│   └── LanguageSwitcher.tsx # Language selection component
└── locales/
    ├── index.ts             # i18n config & loader
    ├── en-US.json           # English (Primary)
    ├── de.json              # German
    ├── es.json              # Spanish
    ├── fr.json              # French
    ├── ja.json              # Japanese
    └── pt-BR.json           # Portuguese (Brazil)
```

#### 1.0.4 Development Rules (MUST FOLLOW)
1. **NO Hardcoded Text**: All UI text must use `t('key.path')` from `useTranslation()` hook
2. **NO Chinese Characters**: Chinese (中文) is NOT allowed in source code files
3. **Add Keys First**: When adding new text, add translation keys to ALL language files
4. **Consistent Naming**: Use dot notation for key paths (e.g., `products.filters.status`)
5. **Mock Data in English**: All mock/example data must be in English

#### 1.0.5 Translation Key Categories
| Category | Prefix | Examples |
| :--- | :--- | :--- |
| Common | `common.` | `common.loading`, `common.save`, `common.cancel` |
| Auth | `auth.` | `auth.login`, `auth.register`, `auth.forgotPassword` |
| Navigation | `nav.` | `nav.dashboard`, `nav.products`, `nav.settings` |
| Dashboard | `dashboard.` | `dashboard.title`, `dashboard.recentOrders` |
| Products | `products.` | `products.title`, `products.filters.all` |
| Orders | `orders.` | `orders.title`, `orders.status.pending` |
| Tickets | `tickets.` | `tickets.title`, `tickets.status.open` |
| Settings | `settings.` | `settings.profile`, `settings.address` |
| Wallet | `wallet.` | `wallet.balance`, `wallet.recharge` |
| Affiliate | `affiliate.` | `affiliate.links`, `affiliate.recommended` |
| Validation | `validation.` | `validation.required`, `validation.email` |
| Messages | `messages.` | `messages.success`, `messages.error` |

#### 1.0.6 Usage Example
```tsx
// In component
import { useTranslation } from '@/hooks/useTranslation';

export function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLocale('ja')}>
        {t('common.switchToJapanese')}
      </button>
    </div>
  );
}
```

#### 1.0.7 Adding New Language
To add a new language (e.g., Korean `ko`):
1. Create `src/locales/ko.json` with all translation keys
2. Update `src/locales/index.ts` to import and export the new language
3. Update `I18nContext.tsx` to include the new language in supported list
4. Add the language option to `LanguageSwitcher.tsx`

#### 1.0.8 Rationale
HyperZone is a cross-border e-commerce platform serving global users across multiple regions and languages. Multi-language support is essential for:
- User accessibility across different markets
- Regulatory compliance in different regions
- Enhanced user experience and engagement

### 1.1 Core Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Data Flow**: React Context + SWR or TanStack Query (reserved)
- **Styling**: Tailwind CSS (strictly follow Figma design specs)
- **Language**: TypeScript (strict mode)
- **Icons**: Lucide React / Local SVG exports (`/public/assets/icons/`)
- **Charts**: Recharts (for Dashboard data visualization)

### 1.2 Architecture Principles
- All common components (Button, Input, Modal, Table) must be atomic and placed in `@/components/ui/`
- **Logic-UI Separation**: All API requests must be in `@/services/` or `@/hooks/api/`
- **Mock Mechanism**: Use local JSON or mock data before backend integration
- Data fetching must be encapsulated in custom Hooks
- Strictly read Figma design's Spacing, Colors and Typography via Figma MCP, prohibited to make up styles

---

## 🗺️ 2. 全局框架与布局设计 (Phase 1)
在开发具体页面前，必须先完成全局的主题配置和布局组件。

### 2.1 基础布局结构
- **参考 Figma 链接**:
  - [整体框架 - Default](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-19402&t=rJz40fLHc6Bp1sMu-4)
  - [整体框架 - Compact (收起状态)](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=307-5169&t=rJz40fLHc6Bp1sMu-4)
  - [整体框架 - Full layout](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=307-5818&t=rJz40fLHc6Bp1sMu-4)

### 2.2 核心布局组件任务
- `RootLayout`: 包含全局的 Provider (如 Auth, Theme)。
- `MainLayout`: 包含顶部导航栏 (Header) 和可折叠的左侧菜单栏 (SideNav)。
- `AuthLayout`: 独立布局，用于登录/注册页。

---

## 📂 3. 路由字典与 Figma 映射表 (Route & Figma Map)
> **AI 开发指令**: 请根据以下路由结构在 `/app` 目录下创建页面文件夹。开发特定页面时，必须先通过 MCP 读取对应的 Figma 链接。

### 🔐 认证模块 (Auth Flow) - 使用 `AuthLayout`
| 页面路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/login` | 登录页 | [Login View](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-26328&t=rJz40fLHc6Bp1sMu-4) |
| `/register` | 创建账号 | [Create Account](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-26445&t=rJz40fLHc6Bp1sMu-4) |
| `/forgot-password` | 找回密码 | [Retrieve Password](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-26579&t=rJz40fLHc6Bp1sMu-4) |

### 📊 主控台与管理模块 (Dashboard & Management)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/dashboard` | 数据大盘 | [Dashboard Main](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=307-16246&t=rJz40fLHc6Bp1sMu-4) |
| `/store-management` | 店铺管理总览 | [Store Management](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-5528&t=rJz40fLHc6Bp1sMu-4) |
| ` ├─ (Action Modal)` | ↳ 绑定店铺 | [Connect Store](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-6322&t=rJz40fLHc6Bp1sMu-4) |
| ` └─ (Action Modal)` | ↳ 解绑店铺 | [Unbind Store](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-8665&t=rJz40fLHc6Bp1sMu-4) |

### 🛒 找货源模块 (Find Products)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/products/all` | 所有商品 (网格/列表) | [All Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-3937&t=rJz40fLHc6Bp1sMu-4) |
| ` └─ /products/all/[id]` | ↳ 商品详情页 | [Product Detail](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-4194&t=rJz40fLHc6Bp1sMu-4) |
| `    ├─ (Tab: Publish)` | ↳ 发布商品配置 | [Publish Product](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-7169&t=rJz40fLHc6Bp1sMu-4) |
| `    ├─ (Tab: Pricing)` | ↳ 变体与定价 | [Variant Pricing](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-8032&t=rJz40fLHc6Bp1sMu-4) |
| `    ├─ (Tab: Media)` | ↳ 图片与视频 | [Images & Videos](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-7616&t=rJz40fLHc6Bp1sMu-4) |
| `    └─ (Action Modal)` | ↳ 创建样品订单 | [Create Sample Order](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-23711&t=rJz40fLHc6Bp1sMu-4) |
| `/products/winning` | 爆款商品 | [Winning Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-3937&t=rJz40fLHc6Bp1sMu-4) |
| `/products/sourcing` | 找货请求列表 | [Sourcing List](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-9077&t=rJz40fLHc6Bp1sMu-4) |
| ` └─ /products/sourcing/new`| ↳ 发起新找货 | [Add New Sourcing](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-6738&t=rJz40fLHc6Bp1sMu-4) |
> **Note**: `/products/collection` (My Collection) and `/products/recommend` (Recommendations) have been **removed** from the menu structure.

### 📦 店铺商品模块 (Store Products)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/store-products/list` | 我的库 (Store Products) | [Store Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-1423&t=rJz40fLHc6Bp1sMu-4) |
| ` ├─ (Tab: Associated)` | ↳ 已关联 | [Associated](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=2312-197&t=mjTOhaJh6YyWMOBj-4) |
| ` └─ (Tab: Not Associated)` | ↳ 未关联 | [Not Associated](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=307-16024&t=rJz40fLHc6Bp1sMu-4) |
| `/store-products/published` | 已上架商品 | [Published Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-1719&t=rJz40fLHc6Bp1sMu-4) |
| ` ├─ (Status: Failed)` | ↳ 发布失败视图 | [Failed View](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-2094&t=rJz40fLHc6Bp1sMu-4) |
| ` └─ (Action Modal)` | ↳ 删除确认 | [Delete Confirm](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-2795&t=rJz40fLHc6Bp1sMu-4) |

### 🏷️ 品牌包装模块 (Branding)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/branding/packaging` | 包材产品列表 (Packaging Products) | [Packaging Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-8634&t=rJz40fLHc6Bp1sMu-4) |
| `/branding/connection` | 包材关联设置 (Packaging Connection) | [Connection Products](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-5840&t=rJz40fLHc6Bp1sMu-4) |
| ` └─ (Tab: Store)` | ↳ 店铺包材关联 | Default tab on page load |
| ` └─ (Tab: Orders)` | ↳ 订单包材关联 | Orders tab |
| ` └─ (Tab: Products)` | ↳ 商品包材关联 | Products tab |
| ` └─ (Action Flow)` | ↳ 关联操作 | [Products Connect](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=279-7699&t=mjTOhaJh6YyWMOBj-4) |

#### Packaging Connection Tab Functional Descriptions
| Tab | Functional Description |
| :--- | :--- |
| **Store** | The package will be used for the store. All orders from this store will be packaged in this specific package (one piece per order). |
| **Orders** | The package will be used for the order. All orders includes this SKU will be packaged with this specific package (one piece per order only). |
| **Products** | The package will be used for each connected product, with quantities based on the number of SKUs. |

### 🧾 订单模块 (Orders)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/orders/store` | 店铺订单 | [Store Orders](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=275-27151&t=mjTOhaJh6YyWMOBj-4) |
| `/orders/sample` | 样品订单 | [Sample Orders](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-4382&t=mjTOhaJh6YyWMOBj-4) |
| `/orders/stock` | 备货订单 | [Stock Orders](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-4876&t=mjTOhaJh6YyWMOBj-4) |

### 🎧 工单模块 (Support Tickets)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/support-tickets` | 售后与工单记录 (RMA) | [Support Tickets](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-13933&t=mjTOhaJh6YyWMOBj-4) |

### 🤝 联盟计划模块 (Affiliate Plan)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/affiliate/links` | 联盟推荐链接 (Referral) | [Referral Links](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-10024&t=mjTOhaJh6YyWMOBj-4) |
| `/affiliate/recommended`| 推荐人列表 | [Recommended List](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-11065&t=mjTOhaJh6YyWMOBj-4) |

### 💰 钱包与财务模块 (Wallet)
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/wallet/recharge` | 充值记录与资金看板 | [Recharge Records](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-10154&t=mjTOhaJh6YyWMOBj-4) |
| `/wallet/invoice` | 发票与账单 | [Invoice Records](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-10697&t=mjTOhaJh6YyWMOBj-4) |

### ⚙️ 系统设置模块 (Settings) - 采用左侧次级 Tab 布局
| 菜单层级 / 路由路径 | 功能描述 | Figma MCP 参考链接 |
| :--- | :--- | :--- |
| `/settings/profile` | 个人资料 | [Profile](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-16546&t=8ln8eIjzDV9OMREP-4) |
| `/settings/address` | 地址管理 | [Address](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-16714&t=8ln8eIjzDV9OMREP-4) |
| `/settings/shipping` | 物流方案配置 | [Shipping Plan](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-17448&t=8ln8eIjzDV9OMREP-4) |
| `/settings/sub-account` | 子账号管理 | [Sub-Account](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-17901&t=8ln8eIjzDV9OMREP-4) |
| `/settings/notification`| 消息通知设置 | [Notification](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-16941&t=8ln8eIjzDV9OMREP-4) |
| ` └─ (Action Modal)` | ↳ 新增/编辑用户 | [Add User](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=282-18302&t=8ln8eIjzDV9OMREP-4) / [Edit User](https://www.figma.com/design/iHUlmzIGEPXwTta5FC4IXn/Appstore-ui-260325?node-id=307-11171&t=8ln8eIjzDV9OMREP-4) |

---
## 🔌 4. API Preparation & Integration Standards (Core Addition)
> **AI Development Directive**: When writing components, strictly prohibited to hardcode data in JSX. Please follow this preparation flow:

### 4.1 Define Data Models (TypeScript Interfaces)
Before developing any page, define backend-corresponding data structures in `@/types/`
- *Example*: Product object should contain `id`, `spu`, `price`, `variants[]`, `images[]` etc. fields, aligned with backend database fields.

### 4.2 Abstract Service Layer
Prepare basic Fetch wrapper in `@/services/api.ts`:
- Reserve `BASE_URL` variable
- Encapsulate `getProducts()`, `createOrder()`, `getWalletBalance()` etc. async functions
- **Current Stage Requirement**: Functions internally return `Promise.resolve(MOCK_DATA)`, but function signatures must be `async` for one-click replacement with real `fetch/axios` later

### 4.3 State Management Preparation
- List pages must include `isLoading`, `isError`, `data` state handling
- Search, pagination, filter parameters must be encapsulated as objects passed to API functions for easy backend integration

## 🛠 5. Key Feature Interaction Preparation Checklist

| Feature Module | Preparation Focus | Interaction Details |
| :--- | :--- | :--- |
| **Search Box** | Debounce handling | Trigger API request 500ms after user input |
| **Product Import** | Async status polling | Prepare Progress Bar interface during product import |
| **Wallet Module** | Amount formatting | Prepare formatting functions for different currencies (USD, EUR) |
| **Support Ticket** | File upload | Prepare multi-image upload API interface slot |


## 🤖 6. AI Execution Protocol (Claude Protocol)

1. **Mock Data Completeness**: Prepare multiple sets of local mock data based on various states shown in Figma (e.g., empty list, order pending payment, product delisted), ensure UI covers all edge cases
2. **Environment Variable Definition**: Reserve `NEXT_PUBLIC_API_ENDPOINT` variable in `.env.local`
3. **Figma Color Adjustment Note**:
   - *For light placeholder color issue*: When identified, manually adjust Placeholder color to meet Web Content Accessibility Guidelines (WCAG) contrast ratio (e.g., `text-gray-400` or `text-gray-500`), don't blindly copy Figma's extremely light color values
4. **Component Decoupling**:
   - All Tables must support `dataSource` prop, don't hardcode data fetching logic inside Table
5. **Lazy Inspection**: Don't try to read all Figma links at once. When I direct to develop specific module (e.g., “develop wallet module”), check this document, extract corresponding links and analyze with MCP
6. **Route First**: All sub-pages (e.g., Tab switching, detail pages) should use Next.js nested routing and URL query params where possible to support browser back and refresh
7. **Modal Handling**: For designs marked as `(Action Modal)` in tables, abstract as globally callable Dialog components, not separate physical pages
8. **Component Reusability**: E.g., pages under `/settings` have highly similar card layouts, please first abstract basic Wrapper components then develop specific content
9. **Multi-Language First**: All UI text MUST use `t('key.path')` from `useTranslation()` hook. Add translation keys to ALL 6 language files (`en-US`, `de`, `es`, `fr`, `ja`, `pt-BR`) when adding new text. NO hardcoded strings in components.
10. **i18n Checklist for New Features**: Before completing any feature, verify:
    - [ ] All UI text uses `t('key.path')` - no hardcoded strings
    - [ ] Translation keys added to ALL 6 language files
    - [ ] New keys follow naming convention (module.category.item)
    - [ ] LanguageSwitcher accessible from Header
    - [ ] Tested language switching works correctly