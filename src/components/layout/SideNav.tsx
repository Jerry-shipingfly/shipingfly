'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { t, getLocale, Locale } from '@/locales';

/**
 * Sub-menu item
 */
export interface SubMenuItem {
  /** Route path */
  path: string;
  /** Display text (fallback) */
  label: string;
  /** Translation key */
  i18nKey: string;
}

/**
 * Menu item with optional sub-menu
 */
export interface MenuItem {
  /** Route path (for direct links) */
  path?: string;
  /** Display text (fallback) */
  label: string;
  /** Icon name */
  icon: string;
  /** Sub-menu items */
  children?: SubMenuItem[];
  /** Translation key */
  i18nKey: string;
}

/**
 * Side navigation bar component Props
 */
export interface SideNavProps {
  /** Custom class name */
  className?: string;
  /** Whether collapsed */
  collapsed?: boolean;
  /** Collapse state change callback */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Current path (optional) */
  currentPath?: string;
}

/**
 * Menu configuration - Based on Figma design
 */
export const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    i18nKey: 'nav.dashboard',
  },
  {
    path: '/store-management',
    label: 'Store Management',
    icon: 'store',
    i18nKey: 'nav.storeManagement',
  },
  {
    label: 'Products',
    icon: 'products',
    i18nKey: 'nav.findProducts',
    children: [
      { path: '/products/all', label: 'All Products', i18nKey: 'nav.allProducts' },
      { path: '/products/winning', label: 'Winning Products', i18nKey: 'nav.winningProducts' },
      { path: '/products/sourcing', label: 'Sourcing Requests', i18nKey: 'nav.sourcingRequests' },
    ],
  },
  {
    label: 'Store Products',
    icon: 'store-products',
    i18nKey: 'nav.storeProducts',
    children: [
      { path: '/store-products/sku-mapping', label: 'Store Products', i18nKey: 'nav.storeProductsSkuMapping' },
      { path: '/store-products/published', label: 'Published Products', i18nKey: 'nav.publishedProducts' },
    ],
  },
  {
    label: 'Orders',
    icon: 'orders',
    i18nKey: 'nav.orders',
    children: [
      { path: '/orders/store', label: 'Store Orders', i18nKey: 'nav.storeOrders' },
      { path: '/orders/sample', label: 'Sample Orders', i18nKey: 'nav.sampleOrders' },
      { path: '/orders/stock', label: 'Stock Orders', i18nKey: 'nav.stockOrders' },
    ],
  },
  {
    path: '/branding',
    label: 'Branding',
    icon: 'branding',
    i18nKey: 'nav.branding',
  },
  {
    path: '/affiliate',
    label: 'Affiliate',
    icon: 'affiliate',
    i18nKey: 'nav.affiliate',
  },
  {
    path: '/wallet',
    label: 'Wallet',
    icon: 'wallet',
    i18nKey: 'nav.wallet',
  },
  {
    path: '/support-tickets',
    label: 'Support',
    icon: 'support',
    i18nKey: 'nav.support',
  },
  {
    path: '/settings/profile',
    label: 'Settings',
    icon: 'setting',
    i18nKey: 'nav.settings',
  },
];

/**
 * Menu Item Component
 */
interface MenuItemComponentProps {
  item: MenuItem;
  collapsed: boolean;
  activePath: string;
  expandedItems: string[];
  toggleExpand: (label: string) => void;
  locale: Locale;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  collapsed,
  activePath,
  expandedItems,
  toggleExpand,
  locale,
}) => {
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.label);
  // Get translated label
  const translatedLabel = t(item.i18nKey) || item.label;

  // Check if this item or any child is active
  const isActive = !!(item.path === activePath ||
    (hasChildren && item.children!.some(child => activePath.startsWith(child.path))));

  // If collapsed, show as simple link or tooltip
  if (collapsed) {
    if (hasChildren) {
      // When collapsed and has children, click navigates to first child
      const handleCollapsedClick = () => {
        if (item.children && item.children.length > 0) {
          router.push(item.children[0].path);
        }
      };

      return (
        <div
          className={cn(
            'flex items-center justify-center',
            'px-3 py-3 rounded-lg cursor-pointer',
            'transition-colors duration-200',
            isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
          title={translatedLabel}
          onClick={handleCollapsedClick}
        >
          <MenuIcon iconName={item.icon} isActive={isActive} size={20} />
        </div>
      );
    }

    return (
      <Link
        href={item.path!}
        className={cn(
          'flex items-center justify-center',
          'px-3 py-3 rounded-lg',
          'transition-colors duration-200',
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
        title={translatedLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        <MenuIcon iconName={item.icon} isActive={isActive} size={20} />
      </Link>
    );
  }

  // Expanded view - with children
  if (hasChildren) {
    return (
      <div className="space-y-1">
        {/* Parent button */}
        <button
          onClick={() => toggleExpand(item.label)}
          className={cn(
            'flex items-center justify-between',
            'w-full px-3 py-3 rounded-lg',
            'transition-colors duration-200',
            isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center">
            <MenuIcon iconName={item.icon} isActive={isActive} size={20} />
            <span className="ml-3 font-medium text-sm">{translatedLabel}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Sub-menu */}
        {isExpanded && (
          <ul className="ml-4 pl-4 border-l border-gray-200 space-y-1 mt-1">
            {item.children!.map((child) => {
              const childActive = activePath === child.path || activePath.startsWith(`${child.path}/`);
              const childLabel = t(child.i18nKey) || child.label;
              return (
                <li key={child.path}>
                  <Link
                    href={child.path}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg',
                      'text-sm transition-colors duration-200',
                      childActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    )}
                    aria-current={childActive ? 'page' : undefined}
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full mr-3',
                        childActive ? 'bg-blue-500' : 'bg-gray-300'
                      )}
                    />
                    {childLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // Simple link without children
  return (
    <Link
      href={item.path!}
      className={cn(
        'flex items-center',
        'px-3 py-3 rounded-lg',
        'transition-colors duration-200',
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <MenuIcon iconName={item.icon} isActive={isActive} size={20} />
      <span className="ml-3 font-medium text-sm">{translatedLabel}</span>
    </Link>
  );
};

/**
 * Menu Icon Component
 */
interface MenuIconProps {
  iconName: string;
  isActive: boolean;
  size?: number;
}

const MenuIcon: React.FC<MenuIconProps> = ({ iconName, isActive, size = 24 }) => {
  const color = isActive ? '#0ea5e9' : '#6b7280';

  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    products: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15"/>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </svg>
    ),
    orders: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1"/>
        <path d="M9 14l2 2 4-4"/>
      </svg>
    ),
    store: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
      </svg>
    ),
    branding: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="m2 17 10 5 10-5"/>
        <path d="m2 12 10 5 10-5"/>
      </svg>
    ),
    affiliate: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    wallet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
      </svg>
    ),
    support: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
      </svg>
    ),
    setting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  };

  return <>{icons[iconName] || icons.dashboard}</>;
};

/**
 * Side Navigation Component
 */
export const SideNav: React.FC<SideNavProps> = ({
  className,
  collapsed = false,
  onCollapseChange,
  currentPath,
}) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  // Use 'en-US' as initial state to prevent hydration mismatch
  // The actual locale will be set in useEffect after mount
  const [locale, setLocaleState] = useState<Locale>('en-US');
  const [mounted, setMounted] = useState(false);

  // Set mounted state and actual locale after hydration
  useEffect(() => {
    setMounted(true);
    setLocaleState(getLocale());
  }, []);

  // Listen for locale changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hyperzone-locale') {
        setLocaleState(getLocale());
      }
    };

    // Also check on focus to catch same-tab changes
    const handleFocus = () => {
      setLocaleState(getLocale());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    // Poll for changes (fallback)
    const interval = setInterval(() => {
      const currentStoredLocale = localStorage.getItem('hyperzone-locale') as Locale;
      if (currentStoredLocale && currentStoredLocale !== locale) {
        setLocaleState(getLocale());
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [locale]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleToggleCollapse = () => {
    onCollapseChange?.(!collapsed);
  };

  // Auto-expand parent menu when child is active
  React.useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => activePath.startsWith(child.path)
        );
        if (hasActiveChild && !expandedItems.includes(item.label)) {
          setExpandedItems((prev) => [...prev, item.label]);
        }
      }
    });
  }, [activePath]);

  return (
    <aside
      className={cn(
        'bg-white',
        'border-r border-gray-200',
        'flex flex-col',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64',
        'h-full',
        'sticky top-0',
        className
      )}
      style={{ backgroundColor: '#ffffff' }}
      aria-label="Sidebar navigation"
    >
      {/* Menu list */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.label}>
              <MenuItemComponent
                item={item}
                collapsed={collapsed}
                activePath={activePath}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse button - bottom of sidebar */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={handleToggleCollapse}
          className={cn(
            'flex items-center justify-center',
            'w-full py-2 rounded-lg',
            'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
            'transition-colors duration-200'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"/>
              <path d="m15 18 6-6-6-6"/>
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
              <path d="m9 18-6-6 6-6"/>
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
