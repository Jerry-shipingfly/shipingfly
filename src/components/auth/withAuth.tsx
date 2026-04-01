/**
 * 路由保护HOC
 * @description 保护需要认证的页面，未登录时自动跳转到登录页
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';

/**
 * 高阶组件：路由保护
 * @description 包装需要认证的页面组件
 *
 * @param Component - 需要保护的组件
 * @param options - 配置选项
 *
 * @example
 * export default withAuth(DashboardPage);
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    /** 自定义重定向路径 */
    redirectTo?: string;
  }
) {
  const { redirectTo = '/login' } = options || {};

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // 等待加载完成
      if (!isLoading && !isAuthenticated) {
        // 保存当前路径，登录后可以跳回
        const returnUrl = encodeURIComponent(pathname || '/');
        router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      }
    }, [isAuthenticated, isLoading, router, pathname]);

    // 加载中显示loading
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loading size="lg" />
        </div>
      );
    }

    // 未认证时不渲染内容
    if (!isAuthenticated) {
      return null;
    }

    // 已认证，渲染组件
    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
}

/**
 * Guest Only HOC
 * @description 仅允许未登录用户访问（如登录页、注册页）
 */
export function guestOnly<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    /** 自定义重定向路径 */
    redirectTo?: string;
  }
) {
  const { redirectTo = '/dashboard' } = options || {};

  const GuestComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // 等待加载完成
      if (!isLoading && isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, router]);

    // 加载中显示loading
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loading size="lg" />
        </div>
      );
    }

    // 已认证时不渲染内容
    if (isAuthenticated) {
      return null;
    }

    // 未认证，渲染组件
    return <Component {...props} />;
  };

  GuestComponent.displayName = `guestOnly(${Component.displayName || Component.name || 'Component'})`;

  return GuestComponent;
}

export default withAuth;
