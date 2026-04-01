import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Button component variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

/**
 * Button component size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component Props interface
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant type */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state */
  loading?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

/**
 * Variant style mapping
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
};

/**
 * Size style mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Common button component
 * @description Button component supporting multiple variants, sizes, and loading states
 *
 * @example
 * // Basic usage
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * @example
 * // With icon and loading state
 * <Button variant="primary" leftIcon={<Plus />} loading={isLoading}>
 *   Add Item
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}) => {
  const buttonClasses = cn(
    // Layout
    'inline-flex items-center justify-center',
    // Box model
    'rounded-lg',
    // Typography
    'font-medium',
    // Interaction
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // States
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Variant styles
    variantStyles[variant],
    // Size styles
    sizeStyles[size],
    // Custom styles
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
