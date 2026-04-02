import React from 'react';
import { cn } from '@/utils/helpers';

/**
 * Input component Props interface
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint message */
  hint?: string;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Size style mapping
 */
const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

/**
 * Common input component
 * @description Input component supporting labels, error hints, icons, etc.
 *
 * @example
 * // Basic usage
 * <Input
 *   label="Username"
 *   placeholder="Enter username"
 * />
 *
 * @example
 * // With error state
 * <Input
 *   label="Email"
 *   error="Invalid email format"
 *   leftIcon={<Mail />}
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  size = 'md',
  id,
  ...props
}) => {
  // Generate unique ID
  const inputId = id || `input-${React.useId()}`;

  const inputClasses = cn(
    // Layout
    'w-full',
    // Box model
    'rounded-lg border',
    sizeStyles[size],
    // Typography
    'text-gray-900 placeholder-gray-400', // WCAG compliant placeholder color
    // Background & Border
    'bg-white border-gray-300',
    // Interaction
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'transition-colors duration-200',
    // States
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    // Error state
    error && 'border-red-500 focus:ring-red-500',
    // Icon spacing
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    // Custom styles
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="text-sm text-gray-500"
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
