'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * 面包屑项配置
 */
export interface BreadcrumbItem {
  /** 显示文本 */
  label: string;
  /** 跳转路径（可选，无路径则为当前页） */
  path?: string;
}

/**
 * 面包屑组件Props
 * @description 显示当前页面路径，支持点击导航
 */
export interface BreadcrumbProps {
  /** 面包屑项列表 */
  items: BreadcrumbItem[];
  /** 自定义类名 */
  className?: string;
  /** 是否显示首页图标 */
  showHome?: boolean;
  /** 首页路径 */
  homePath?: string;
}

/**
 * 面包屑导航组件
 * @description 显示当前页面路径，支持点击导航
 * @param props.items - 面包屑项列表
 * @param props.className - 扩展样式类名
 * @param props.showHome - 是否显示首页图标
 * @param props.homePath - 首页路径
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: '商品管理', path: '/products' },
 *     { label: '商品详情' }
 *   ]}
 * />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  showHome = true,
  homePath = '/dashboard',
}) => {
  return (
    <nav
      className={cn(
        'flex items-center',
        'text-sm text-gray-500',
        // 移动端隐藏
        'hidden sm:flex',
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-1">
        {/* 首页 */}
        {showHome && (
          <>
            <li className="flex items-center">
              <Link
                href={homePath}
                className={cn(
                  'flex items-center',
                  'text-gray-500 hover:text-primary-600',
                  'transition-colors duration-200'
                )}
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
          </>
        )}

        {/* 面包屑项 */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                // 当前页面 - 不可点击
                <span
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  {item.path ? (
                    <Link
                      href={item.path}
                      className={cn(
                        'text-gray-500 hover:text-primary-600',
                        'transition-colors duration-200'
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-500">{item.label}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
