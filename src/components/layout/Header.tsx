/**
 * Header Component
 * @description Top navigation bar component
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * User information
 */
interface User {
  /** Username */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Email */
  email?: string;
}

/**
 * Header component Props
 */
export interface HeaderProps {
  /** Custom class name */
  className?: string;
  /** User information */
  user?: User;
  /** Logout callback */
  onLogout?: () => void;
  /** Mobile menu click callback */
  onMenuClick?: () => void;
  /** Whether to show mobile menu button */
  showMenuButton?: boolean;
  /** Notification count */
  notificationCount?: number;
}

/**
 * Top navigation bar component
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  user,
  onLogout,
  onMenuClick,
  showMenuButton = false,
  notificationCount = 0,
}) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'flex items-center justify-between',
        'w-full h-16',
        'px-4 md:px-6',
        'bg-white',
        'border-b border-gray-200',
        className
      )}
    >
      {/* Left side area */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className={cn(
              'p-2 rounded-lg',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
              'lg:hidden'
            )}
            aria-label={t('nav.openMenu')}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/assets/logo/logo.svg"
            alt="HyperZone Logo"
            width={140}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Right side function area */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Language switcher */}
        <LanguageSwitcher mode="compact" />

        {/* Notification icon */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={cn(
              'relative p-2 rounded-lg',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
              'transition-colors duration-200'
            )}
            aria-label={t('nav.notifications')}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span
                className={cn(
                  'absolute -top-0.5 -right-0.5',
                  'min-w-[18px] h-[18px]',
                  'flex items-center justify-center',
                  'bg-red-500 text-white',
                  'text-xs font-medium',
                  'rounded-full',
                  'px-1'
                )}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* Notification dropdown panel */}
          {isNotificationOpen && (
            <div
              className={cn(
                'absolute right-0 mt-2',
                'w-80 md:w-96',
                'bg-white rounded-lg shadow-lg',
                'border border-gray-200',
                'py-2',
                'animate-in fade-in slide-in-from-top-1'
              )}
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">{t('nav.notifications')}</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{t('empty.noNotificationsDescription')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User information */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                'flex items-center gap-2',
                'px-2 py-1.5 rounded-lg',
                'hover:bg-gray-100',
                'transition-colors duration-200'
              )}
              aria-label={t('nav.userMenu')}
              aria-expanded={isDropdownOpen}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full overflow-hidden',
                  'bg-gray-200',
                  'flex items-center justify-center'
                )}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
              </div>

              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user.name}
              </span>

              <ChevronDown
                className={cn(
                  'hidden md:block w-4 h-4 text-gray-400',
                  'transition-transform duration-200',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* User dropdown menu */}
            {isDropdownOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2',
                  'w-56',
                  'bg-white rounded-lg shadow-lg',
                  'border border-gray-200',
                  'py-1',
                  'animate-in fade-in slide-in-from-top-1'
                )}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex items-center gap-3',
                      'w-full px-4 py-2',
                      'text-sm text-red-600',
                      'hover:bg-red-50'
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Not logged in state */}
        {!user && (
          <Link
            href="/login"
            className={cn(
              'px-4 py-2',
              'text-sm font-medium',
              'text-white bg-primary-500',
              'rounded-lg',
              'hover:bg-primary-600',
              'transition-colors duration-200'
            )}
          >
            {t('auth.login')}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
