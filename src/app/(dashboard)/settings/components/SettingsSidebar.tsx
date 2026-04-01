'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  MapPin,
  Truck,
  Users,
  Bell,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Settings navigation item configuration
 */
export interface SettingsNavItem {
  /** Navigation key */
  key: string;
  /** Display label */
  label: string;
  /** Route path */
  href: string;
  /** Icon */
  icon: React.ReactNode;
}

/**
 * Settings sidebar Props
 */
export interface SettingsSidebarProps {
  /** Custom styles */
  className?: string;
  /** Layout mode: vertical | horizontal */
  layout?: 'vertical' | 'horizontal';
}

/**
 * Settings Page Sidebar Component
 * @description Navigation for settings page, supports both vertical and horizontal layouts
 */
export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  className,
  layout = 'vertical',
}) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  /**
   * Settings page navigation items
   */
  const settingsNavItems: SettingsNavItem[] = [
    {
      key: 'profile',
      label: t('settings.profile'),
      href: '/settings/profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      key: 'address',
      label: t('settings.addressManagement'),
      href: '/settings/address',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      key: 'shipping',
      label: t('settings.shippingOptions'),
      href: '/settings/shipping',
      icon: <Truck className="w-5 h-5" />,
    },
    {
      key: 'sub-account',
      label: t('settings.subAccounts'),
      href: '/settings/sub-account',
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: 'notification',
      label: t('settings.notificationSettings'),
      href: '/settings/notification',
      icon: <Bell className="w-5 h-5" />,
    },
  ];

  // Determine if current item is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isVertical = layout === 'vertical';

  return (
    <nav
      className={cn(
        isVertical
          ? 'flex flex-col w-64 space-y-1'
          : 'flex flex-row gap-1 overflow-x-auto',
        className
      )}
      aria-label="Settings navigation"
    >
      {settingsNavItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              // Base styles
              'flex items-center gap-3 rounded-lg transition-colors',
              // Vertical layout styles
              isVertical && 'px-4 py-3',
              // Horizontal layout styles
              !isVertical && 'px-4 py-2 whitespace-nowrap',
              // Active state
              active
                ? 'bg-primary-50 text-primary-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span className={cn('flex-shrink-0', active && 'text-primary-600')}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;
