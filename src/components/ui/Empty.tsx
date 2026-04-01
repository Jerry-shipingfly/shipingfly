/**
 * Empty Component
 * @description Common empty state component for displaying empty data, no results, errors, etc.
 */

'use client';

import React from 'react';
import { FileX, Inbox, Search, FolderX, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Empty component preset types
 */
export type EmptyPreset = 'default' | 'search' | 'data' | 'folder' | 'error';

/**
 * Empty component Props interface
 */
export interface EmptyProps {
  /** Title */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Preset type */
  preset?: EmptyPreset;
  /** Action button */
  action?: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Icon class name */
  iconClassName?: string;
  /** Text class name */
  textClassName?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Size style mapping
 */
const sizeStyles: Record<'sm' | 'md' | 'lg', { icon: string; text: string }> = {
  sm: { icon: 'w-8 h-8', text: 'text-sm' },
  md: { icon: 'w-12 h-12', text: 'text-base' },
  lg: { icon: 'w-16 h-16', text: 'text-lg' },
};

/**
 * Common empty state component
 */
export const Empty: React.FC<EmptyProps> = ({
  title,
  description,
  icon,
  preset = 'default',
  action,
  className,
  iconClassName,
  textClassName,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const styles = sizeStyles[size];

  // Get preset icon
  const getPresetIcon = () => {
    const iconClass = cn(styles.icon, 'text-gray-300');
    switch (preset) {
      case 'search':
        return <Search className={iconClass} />;
      case 'data':
        return <FileX className={iconClass} />;
      case 'folder':
        return <FolderX className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      default:
        return <Inbox className={iconClass} />;
    }
  };

  // Get preset description
  const getPresetDescription = () => {
    switch (preset) {
      case 'search':
        return t('empty.noSearchResultsDescription');
      case 'data':
        return t('empty.noDataDescription');
      case 'folder':
        return t('empty.noDataDescription');
      case 'error':
        return t('empty.errorDescription');
      default:
        return t('empty.noDataDescription');
    }
  };

  const displayIcon = icon || getPresetIcon();
  const displayDescription = description || getPresetDescription();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-8',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'text-gray-300 mb-4',
          iconClassName
        )}
      >
        {displayIcon}
      </div>

      {/* Title */}
      {title && (
        <h3
          className={cn(
            'text-gray-900 font-medium mb-2',
            styles.text,
            textClassName
          )}
        >
          {title}
        </h3>
      )}

      {/* Description text */}
      <p
        className={cn(
          'text-gray-500 mb-4',
          styles.text,
          textClassName
        )}
      >
        {displayDescription}
      </p>

      {/* Action button */}
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Empty data image component
 */
export interface EmptyImageProps {
  /** Image type */
  type?: 'default' | 'search' | 'data';
  /** Extended class name */
  className?: string;
}

export const EmptyImage: React.FC<EmptyImageProps> = ({
  type = 'default',
  className,
}) => {
  return (
    <svg
      className={cn('text-gray-300', className)}
      width="184"
      height="152"
      viewBox="0 0 184 152"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(24 31.67)">
          <ellipse
            fillOpacity=".8"
            fill="currentColor"
            cx="67.797"
            cy="106.89"
            rx="67.797"
            ry="12.668"
          />
          <path
            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            fill="currentColor"
          />
          <path
            d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z"
            fill="url(#linearGradient-1)"
            transform="translate(13.56)"
          />
          <path
            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            fill="#f5f5f7"
          />
          <path
            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zm.262 39.814h49.713a2 2 0 0 1 2 2v.652a2 2 0 0 1-2 2H42.94a2 2 0 0 1-2-2v-.652a2 2 0 0 1 2-2zm0 8.372h49.713a2 2 0 0 1 2 2v.652a2 2 0 0 1-2 2H42.94a2 2 0 0 1-2-2v-.652a2 2 0 0 1 2-2zm0 8.371h34.75a2 2 0 0 1 2 2v.652a2 2 0 0 1-2 2H42.94a2 2 0 0 1-2-2v-.652a2 2 0 0 1 2-2z"
            fill="#ebebeb"
          />
        </g>
        <path
          d="M104.09 33.674l-15.443 15.443a6.364 6.364 0 0 1-8.998 0L64.207 33.674"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Empty;
