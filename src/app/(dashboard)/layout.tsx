'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';

/**
 * Dashboard module layout
 * @description Uses MainLayout to wrap all dashboard pages
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated (must be in useEffect to avoid setState during render)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading tip="Loading..." />
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is handled in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Map user to expected format
  const layoutUser = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  } : undefined;

  return (
    <MainLayout user={layoutUser} onLogout={handleLogout}>
      {children}
    </MainLayout>
  );
}
