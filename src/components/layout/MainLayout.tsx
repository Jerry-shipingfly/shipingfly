'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { Header } from './Header';
import { SideNav } from './SideNav';

/**
 * 用户信息类型
 */
interface User {
  name: string;
  avatar?: string;
  email?: string;
}

/**
 * MainLayout组件Props
 * @description 主布局组件，包含Header、SideNav和内容区域
 */
export interface MainLayoutProps {
  /** 子组件内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 用户信息（可选，用于Header显示） */
  user?: User;
  /** 登出回调 */
  onLogout?: () => void;
}

/**
 * 主布局组件
 * @description 包含顶部导航栏、可折叠侧边菜单栏和内容区域
 * @param props.children - 页面内容
 * @param props.user - 用户信息
 * @param props.onLogout - 登出回调
 * @param props.className - 扩展样式类名
 *
 * @example
 * <MainLayout user={{ name: 'John' }} onLogout={handleLogout}>
 *   <DashboardPage />
 * </MainLayout>
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  user,
  onLogout,
}) => {
  // 侧边栏折叠状态
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);

  // 移动端侧边栏显示状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // 切换页面时重置内容区域滚动位置
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  // 响应式：屏幕宽度大于lg时自动关闭移动端菜单
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 阻止移动端菜单打开时的滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={cn(
        'h-screen overflow-hidden bg-gray-50',
        className
      )}
    >
      {/* Header - 固定在顶部 */}
      <Header
        user={user}
        onLogout={onLogout}
        showMenuButton={true}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      {/* 主体区域 */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* 桌面端侧边栏 - 固定定位 */}
        <div className="hidden lg:block flex-shrink-0 h-full overflow-hidden">
          <SideNav
            collapsed={isSideNavCollapsed}
            onCollapseChange={setIsSideNavCollapsed}
          />
        </div>

        {/* 移动端侧边栏遮罩 */}
        {isMobileMenuOpen && (
          <div
            className={cn(
              'fixed inset-0 z-30',
              'bg-black/50',
              'lg:hidden'
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 移动端侧边栏 */}
        <div
          className={cn(
            'fixed top-16 left-0 bottom-0 z-30',
            'lg:hidden',
            'overflow-hidden',
            'transition-transform duration-300',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SideNav
            collapsed={false}
            onCollapseChange={() => {}}
          />
        </div>

        {/* 内容区域 - 独立滚动 */}
        <main
          ref={mainRef}
          className={cn(
            'flex-1',
            'h-full',
            'overflow-y-auto',
            'p-6 md:p-8 lg:p-10',
            'transition-all duration-300'
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
