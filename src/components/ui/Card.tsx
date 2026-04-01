import React from 'react';
import { cn } from '@/utils/helpers';

/**
 * Card component Props interface
 */
export interface CardProps {
  /** Children */
  children: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Whether to show shadow */
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show border */
  bordered?: boolean;
  /** Whether hoverable */
  hoverable?: boolean;
  /** Click event */
  onClick?: () => void;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * CardHeader component Props interface
 */
export interface CardHeaderProps {
  /** Children */
  children: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Whether to show bottom border */
  bordered?: boolean;
  /** Extra action area */
  extra?: React.ReactNode;
}

/**
 * CardBody component Props interface
 */
export interface CardBodyProps {
  /** Children */
  children: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * CardFooter component Props interface
 */
export interface CardFooterProps {
  /** Children */
  children: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Whether to show top border */
  bordered?: boolean;
}

/**
 * Shadow style mapping
 */
const shadowStyles: Record<string, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

/**
 * Padding style mapping
 */
const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Common card container component
 * @description Supports Header/Body/Footer structure, shadow effects, hover effects, etc.
 *
 * @example
 * // Basic usage
 * <Card shadow>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 *
 * @example
 * // Simple usage
 * <Card shadow padding="lg">
 *   <p>Direct content</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = true,
  bordered = false,
  hoverable = false,
  onClick,
  padding = 'none',
}) => {
  const shadowClass = typeof shadow === 'boolean'
    ? (shadow ? 'shadow-md' : '')
    : shadowStyles[shadow];

  return (
    <div
      className={cn(
        // Layout
        'flex flex-col',
        // Box model
        'rounded-lg',
        // Background
        'bg-white',
        // Shadow
        shadowClass,
        // Border
        bordered && 'border border-gray-200',
        // Hover effect
        hoverable && 'transition-shadow hover:shadow-lg',
        // Click
        onClick && 'cursor-pointer',
        // Padding
        paddingStyles[padding],
        // Custom styles
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  bordered = false,
  extra,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'px-4 py-3',
        bordered && 'border-b border-gray-200',
        className
      )}
    >
      <div className="text-lg font-semibold text-gray-900">{children}</div>
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  );
};

/**
 * Card body component
 */
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  padding = 'md',
}) => {
  return (
    <div
      className={cn(
        'flex-1',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card footer component
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  bordered = false,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        'px-4 py-3',
        bordered && 'border-t border-gray-200',
        'bg-gray-50 rounded-b-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
