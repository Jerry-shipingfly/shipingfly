import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Option data structure
 */
export interface SelectOption {
  /** Option value */
  value: string;
  /** Option display text */
  label: string;
  /** Whether disabled */
  disabled?: boolean;
}

/**
 * Select component Props interface
 */
export interface SelectProps {
  /** Option list */
  options: SelectOption[];
  /** Currently selected value (single select) */
  value?: string;
  /** Currently selected values (multi select) */
  values?: string[];
  /** Value change callback */
  onChange?: (value: string) => void;
  /** Multi-select value change callback */
  onMultiChange?: (values: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint message */
  hint?: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Whether multiple select */
  multiple?: boolean;
  /** Whether searchable */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Extended class name */
  className?: string;
  /** Size */
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
 * Common dropdown select component
 * @description Dropdown select component supporting single select, multi-select, and search
 *
 * @example
 * // Single select
 * <Select
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' },
 *   ]}
 *   value={value}
 *   onChange={setValue}
 * />
 *
 * @example
 * // Multi-select + search
 * <Select
 *   multiple
 *   searchable
 *   options={options}
 *   values={values}
 *   onMultiChange={setValues}
 * />
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  values = [],
  onChange,
  onMultiChange,
  placeholder = 'Please select',
  label,
  error,
  hint,
  disabled = false,
  multiple = false,
  searchable = false,
  searchPlaceholder = '搜索...',
  className,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected label
  const getSelectedLabel = (): string => {
    if (multiple) {
      if (values.length === 0) return placeholder;
      return `${values.length} selected`;
    }
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : placeholder;
  };

  // Handle option click
  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const newValues = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onMultiChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  // Remove selected tag (multi-select mode)
  const handleRemoveTag = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    const newValues = values.filter((v) => v !== optionValue);
    onMultiChange?.(newValues);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const triggerClasses = cn(
    // 布局
    'flex items-center justify-between',
    // 盒模型
    'w-full rounded-lg border cursor-pointer',
    sizeStyles[size],
    // 背景 & 边框
    'bg-white border-gray-300',
    // 交互
    'hover:border-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    // 状态
    disabled && 'bg-gray-50 cursor-not-allowed opacity-50',
    error && 'border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        {/* Trigger */}
        <div
          className={triggerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) setIsOpen(!isOpen);
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-1 flex-1 flex-wrap overflow-hidden">
            {multiple && values.length > 0 ? (
              values.map((v) => {
                const option = options.find((opt) => opt.value === v);
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-sm max-w-[120px]"
                  >
                    <span className="truncate">{option?.label}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTag(e, v)}
                      className="hover:text-red-500 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className={cn(
                'truncate',
                !value && values.length === 0 && 'text-gray-400'
              )}>
                {getSelectedLabel()}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )}
          />
        </div>

        {/* Dropdown panel */}
        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            role="listbox"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Option list */}
            <div className="max-h-60 overflow-y-auto overflow-x-hidden">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                  No data
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? values.includes(option.value)
                    : value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'px-4 py-2 cursor-pointer transition-colors',
                        'hover:bg-gray-50',
                        isSelected && 'bg-primary-50 text-primary-600',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      title={option.label}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {multiple && (
                          <div
                            className={cn(
                              'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                              isSelected
                                ? 'bg-primary-500 border-primary-500'
                                : 'border-gray-300'
                            )}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 12 12"
                              >
                                <path d="M10.28 2.28L4.5 8.06 1.72 5.28A.75.75 0 00.66 6.34l3.25 3.25a.75.75 0 001.06 0l6.5-6.5a.75.75 0 00-1.06-1.06l-.13-.75z" />
                              </svg>
                            )}
                          </div>
                        )}
                        <span className="truncate">{option.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default Select;
