import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Loading component size types
 */
export type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * Loading component Props interface
 */
export interface LoadingProps {
  /** Loading tip text */
  tip?: string;
  /** Size */
  size?: LoadingSize;
  /** Whether fullscreen mode */
  fullscreen?: boolean;
  /** Whether to show background overlay */
  overlay?: boolean;
  /** Extended class name */
  className?: string;
  /** Spinner class name */
  spinnerClassName?: string;
  /** Tip class name */
  tipClassName?: string;
}

/**
 * Size style mapping
 */
const sizeStyles: Record<LoadingSize, { spinner: string; tip: string }> = {
  sm: { spinner: 'w-4 h-4', tip: 'text-xs' },
  md: { spinner: 'w-6 h-6', tip: 'text-sm' },
  lg: { spinner: 'w-10 h-10', tip: 'text-base' },
};

/**
 * Common loading state component
 * @description Loading component supporting multiple sizes, fullscreen mode, overlay, etc.
 *
 * @example
 * // Basic usage
 * <Loading />
 *
 * @example
 * // With tip text
 * <Loading tip="Loading..." />
 *
 * @example
 * // Fullscreen loading
 * <Loading fullscreen tip="Loading data..." />
 */
export const Loading: React.FC<LoadingProps> = ({
  tip,
  size = 'md',
  fullscreen = false,
  overlay = false,
  className,
  spinnerClassName,
  tipClassName,
}) => {
  const styles = sizeStyles[size];

  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary-500',
          styles.spinner,
          spinnerClassName
        )}
      />
      {tip && (
        <span
          className={cn(
            'text-gray-500',
            styles.tip,
            tipClassName
          )}
        >
          {tip}
        </span>
      )}
    </div>
  );

  // Fullscreen mode
  if (fullscreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-[9999]',
          'flex items-center justify-center',
          'bg-white/80 backdrop-blur-sm'
        )}
      >
        {spinner}
      </div>
    );
  }

  // With overlay mode
  if (overlay) {
    return (
      <div
        className={cn(
          'absolute inset-0 z-10',
          'flex items-center justify-center',
          'bg-white/60'
        )}
      >
        {spinner}
      </div>
    );
  }

  // Normal mode
  return spinner;
};

/**
 * Loading wrapper component
 * @description Wraps content and shows overlay during loading
 */
export interface LoadingWrapperProps extends LoadingProps {
  /** Whether loading */
  loading: boolean;
  /** Children */
  children: React.ReactNode;
  /** Delay before showing loading (milliseconds) */
  delay?: number;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  children,
  delay = 0,
  ...loadingProps
}) => {
  const [showLoading, setShowLoading] = React.useState(delay === 0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (loading) {
      if (delay > 0) {
        timer = setTimeout(() => setShowLoading(true), delay);
      } else {
        setShowLoading(true);
      }
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return (
    <div className="relative">
      {children}
      {loading && showLoading && <Loading overlay {...loadingProps} />}
    </div>
  );
};

/**
 * Inline loading component
 * @description Inline loading indicator for use next to text
 */
export interface InlineLoadingProps {
  /** Size */
  size?: LoadingSize;
  /** Extended class name */
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 'sm',
  className,
}) => {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary-500',
        sizeStyles[size].spinner,
        className
      )}
    />
  );
};

export default Loading;
