import React from 'react';
import { cn } from '@/utils/helpers';

/**
 * Badge component variant types
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Badge component size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge component Props interface
 */
export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Variant type */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Whether to show as dot mode */
  dot?: boolean;
  /** Whether to show as outline style */
  outline?: boolean;
  /** Extended class name */
  className?: string;
}

/**
 * Variant style mapping (solid)
 */
const variantSolidStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

/**
 * Variant style mapping (outline)
 */
const variantOutlineStyles: Record<BadgeVariant, string> = {
  default: 'border-gray-300 text-gray-700',
  primary: 'border-primary-500 text-primary-600',
  success: 'border-green-500 text-green-600',
  warning: 'border-yellow-500 text-yellow-600',
  danger: 'border-red-500 text-red-600',
  info: 'border-blue-500 text-blue-600',
};

/**
 * Size style mapping
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Dot size style mapping
 */
const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

/**
 * Dot color mapping
 */
const dotColorStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

/**
 * Common badge/tag component
 * @description Badge component supporting multiple color variants, sizes, and styles
 *
 * @example
 * // Basic usage
 * <Badge variant="success">Completed</Badge>
 *
 * @example
 * // Outline style
 * <Badge variant="primary" outline>In Progress</Badge>
 *
 * @example
 * // Dot mode
 * <Badge dot variant="danger" />
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  outline = false,
  className,
}) => {
  // Dot mode
  if (dot) {
    return (
      <span
        className={cn(
          'inline-block rounded-full',
          dotSizeStyles[size],
          dotColorStyles[variant],
          className
        )}
        aria-label={`Status: ${variant}`}
      />
    );
  }

  const variantStyles = outline ? variantOutlineStyles : variantSolidStyles;

  return (
    <span
      className={cn(
        // Layout
        'inline-flex items-center',
        // Box model
        'rounded-full font-medium',
        outline && 'border',
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Custom styles
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
