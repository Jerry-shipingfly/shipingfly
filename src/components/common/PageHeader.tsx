/**
 * PageHeader Component
 * @description Common page header bar, supports title, breadcrumbs, and action area slots
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display text */
  label: string;
  /** Link URL (optional, not clickable if not provided) */
  href?: string;
}

/**
 * PageHeader Props
 */
export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Breadcrumb navigation */
  breadcrumb?: BreadcrumbItem[];
  /** Action area slot (buttons, etc.) */
  actions?: React.ReactNode;
  /** Back button link */
  backHref?: string;
  /** Back button click callback */
  onBack?: () => void;
  /** Custom styles */
  className?: string;
  /** Children (bottom content) */
  children?: React.ReactNode;
}

/**
 * PageHeader Component
 * @description Unified page header layout, supports:
 * - Title and subtitle
 * - Breadcrumb navigation
 * - Action buttons area (slot)
 * - Back button
 *
 * @example
 * <PageHeader
 *   title="Product List"
 *   subtitle="Browse and manage your products"
 *   breadcrumb={[{ label: 'Home', href: '/dashboard' }, { label: 'Products' }]}
 *   actions={<Button>Add Product</Button>}
 * />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  backHref,
  onBack,
  className,
  children,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumb navigation */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={index === breadcrumb.length - 1 ? 'text-gray-900 font-medium' : ''}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title bar */}
      <div className="flex items-start justify-between gap-4">
        {/* Left side: Title + Subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* Back button */}
            {(backHref || onBack) && (
              <button
                onClick={onBack}
                className="p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="mt-1 text-gray-500 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side: Action area */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Children (bottom content) */}
      {children && (
        <div className="pt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
