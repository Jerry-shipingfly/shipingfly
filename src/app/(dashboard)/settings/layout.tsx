'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SettingsSidebar } from './components/SettingsSidebar';
import { cn } from '@/utils/helpers';

/**
 * Settings module layout
 * @description Left tab navigation + right content area layout structure
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Get the current page title
  const getPageTitle = () => {
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/address')) return 'Address Management';
    if (pathname.includes('/shipping')) return 'Shipping Options';
    if (pathname.includes('/sub-account')) return 'Sub-account Management';
    if (pathname.includes('/notification')) return 'Notification Settings';
    return 'Settings';
  };

  // Default redirect to profile page
  React.useEffect(() => {
    if (pathname === '/settings' || pathname === '/settings/') {
      router.replace('/settings/profile');
    }
  }, [pathname, router]);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left navigation - Desktop vertical layout */}
        <div className="hidden lg:block">
          <SettingsSidebar layout="vertical" className="sticky top-6" />
        </div>

        {/* Mobile horizontal navigation */}
        <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
          <SettingsSidebar layout="horizontal" />
        </div>

        {/* Right content area */}
        <div className="flex-1 min-w-0">
          {/* Mobile page title */}
          <div className="lg:hidden mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>

          {/* Sub-page content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
