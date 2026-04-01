/**
 * Language Switcher Component
 * @description A dropdown component for switching between available languages
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Locale, LOCALES } from '@/locales';
import { useI18n } from '@/contexts/I18nContext';

// Re-export for backward compatibility
export type { Locale } from '@/locales';
export { LOCALES } from '@/locales';
export { useI18n } from '@/contexts/I18nContext';

/**
 * LanguageSwitcher Props
 */
export interface LanguageSwitcherProps {
  /** Display mode */
  mode?: 'dropdown' | 'inline' | 'compact';
  /** Additional CSS classes */
  className?: string;
  /** Show native name instead of English name */
  showNativeName?: boolean;
  /** Show flag emoji */
  showFlag?: boolean;
  /** Callback when language changes */
  onLocaleChange?: (locale: Locale) => void;
}

/**
 * LanguageSwitcher Component
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  mode = 'dropdown',
  className,
  showNativeName = true,
  showFlag = true,
  onLocaleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use I18n context
  const { locale: currentLocale, changeLocale, availableLocales: locales } = useI18n();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (locale: Locale) => {
    changeLocale(locale);
    setIsOpen(false);
    onLocaleChange?.(locale);
  };

  const currentLocaleInfo = LOCALES[currentLocale];

  if (mode === 'compact') {
    return (
      <div ref={dropdownRef} className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'p-2 rounded-lg hover:bg-gray-100 transition-colors',
            'flex items-center gap-1'
          )}
          title={currentLocaleInfo.nativeName}
        >
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="text-sm">{currentLocaleInfo.flag}</span>
        </button>

        {isOpen && (
          <div
            className={cn(
              'absolute top-full right-0 mt-1 min-w-[160px]',
              'bg-white border border-gray-200 rounded-lg shadow-lg',
              'py-1 z-50'
            )}
          >
            {locales.map((locale) => (
              <button
                key={locale.code}
                type="button"
                onClick={() => handleLocaleChange(locale.code)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2',
                  'text-sm text-left transition-colors',
                  currentLocale === locale.code
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="text-base">{locale.flag}</span>
                <span className="flex-1">{locale.nativeName}</span>
                {currentLocale === locale.code && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mode === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {locales.map((locale) => (
          <button
            key={locale.code}
            type="button"
            onClick={() => handleLocaleChange(locale.code)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              currentLocale === locale.code
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {showFlag && <span className="mr-1.5">{locale.flag}</span>}
            {showNativeName ? locale.nativeName : locale.name}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown mode (default)
  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-white border border-gray-200 hover:border-gray-300',
          'transition-colors duration-200',
          'text-sm font-medium text-gray-700'
        )}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="flex items-center gap-1.5">
          {showFlag && <span>{currentLocaleInfo.flag}</span>}
          <span>{showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name}</span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 min-w-[180px]',
            'bg-white border border-gray-200 rounded-lg shadow-lg',
            'py-1 z-50'
          )}
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              type="button"
              onClick={() => handleLocaleChange(locale.code)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2',
                'text-sm text-left transition-colors',
                currentLocale === locale.code
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {showFlag && <span className="text-base">{locale.flag}</span>}
              <span className="flex-1">
                {showNativeName ? locale.nativeName : locale.name}
              </span>
              {currentLocale === locale.code && (
                <Check className="w-4 h-4 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
