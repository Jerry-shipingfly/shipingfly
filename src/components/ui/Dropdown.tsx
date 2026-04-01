import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Dropdown item data structure
 */
export interface DropdownItem {
  /** Unique key */
  key: string;
  /** Display text */
  label: React.ReactNode;
  /** Icon */
  icon?: React.ReactNode;
  /** Whether disabled */
  disabled?: boolean;
  /** Whether it is a divider */
  divider?: boolean;
  /** Danger action style */
  danger?: boolean;
}

/**
 * Dropdown component Props interface
 */
export interface DropdownProps {
  /** Trigger content */
  trigger?: React.ReactNode;
  /** Menu item list */
  items: DropdownItem[];
  /** Menu item click callback */
  onItemClick?: (key: string) => void;
  /** Trigger type */
  triggerType?: 'click' | 'hover';
  /** Placement */
  placement?: 'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end';
  /** Whether disabled */
  disabled?: boolean;
  /** Extended class name */
  className?: string;
  /** Menu class name */
  menuClassName?: string;
  /** Children (as trigger) */
  children?: React.ReactNode;
}

/**
 * Placement style mapping
 */
const placementStyles: Record<string, string> = {
  'bottom-start': 'top-full left-0 mt-1',
  'bottom': 'top-full left-1/2 -translate-x-1/2 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top': 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
};

/**
 * Common dropdown menu component
 * @description Supports multiple trigger types, placements, dividers, danger actions, etc.
 *
 * @example
 * // Basic usage
 * const items = [
 *   { key: 'edit', label: 'Edit', icon: <Edit /> },
 *   { key: 'copy', label: 'Copy' },
 *   { key: 'divider', label: '', divider: true },
 *   { key: 'delete', label: 'Delete', danger: true },
 * ];
 *
 * <Dropdown items={items} onItemClick={handleClick}>
 *   <Button>Actions</Button>
 * </Dropdown>
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onItemClick,
  triggerType = 'click',
  placement = 'bottom-start',
  disabled = false,
  className,
  menuClassName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle menu item click
  const handleItemClick = useCallback(
    (item: DropdownItem) => {
      if (item.disabled || item.divider) return;
      onItemClick?.(item.key);
      setIsOpen(false);
    },
    [onItemClick]
  );

  // Close on click outside
  useEffect(() => {
    if (triggerType !== 'click') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [triggerType]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Hover event handlers

  const hoverProps =
    triggerType === 'hover'
      ? {
          onMouseEnter: () => !disabled && setIsOpen(true),
          onMouseLeave: () => setIsOpen(false),
        }
      : {};

  // Click event handler
  const handleClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Render trigger
  const renderTrigger = () => {
    if (children) {
      return (
        <div
          className="inline-flex"
          onClick={triggerType === 'click' ? handleClick : undefined}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          {...hoverProps}
        >
          {children}
        </div>
      );
    }

    if (trigger) {
      return trigger;
    }

    return (
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-2',
          'px-4 py-2 text-sm font-medium',
          'bg-white border border-gray-300 rounded-lg',
          'hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          className
        )}
        onClick={triggerType === 'click' ? handleClick : undefined}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        {...hoverProps}
      >
        More
        <ChevronDown
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      {...hoverProps}
    >
      {renderTrigger()}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50',
            'min-w-[160px]',
            'bg-white rounded-lg shadow-lg',
            'border border-gray-200',
            'py-1',
            'animate-in fade-in-0 zoom-in-95',
            placementStyles[placement],
            menuClassName
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item) => {
            if (item.divider) {
              return (
                <div
                  key={item.key}
                  className="my-1 border-t border-gray-100"
                  role="separator"
                />
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  'w-full flex items-center gap-2',
                  'px-4 py-2 text-sm text-left',
                  'transition-colors duration-150',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : item.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
