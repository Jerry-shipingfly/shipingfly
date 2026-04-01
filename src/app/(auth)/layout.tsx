'use client';

import React from 'react';
import { AuthLayout } from '@/components/layout';

/**
 * Authentication route group layout
 * @description Used for login, register, forgot password, etc. pages
 */
export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
