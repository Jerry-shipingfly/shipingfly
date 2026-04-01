/**
 * I18n Context
 * @description Global internationalization context for managing locale state
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { setLocale, getLocale, Locale, LOCALES } from '@/locales';

interface I18nContextType {
  /** Current locale */
  locale: Locale;
  /** Locale information */
  localeInfo: typeof LOCALES[Locale];
  /** Change locale */
  changeLocale: (locale: Locale) => void;
  /** Available locales */
  availableLocales: Array<{ code: Locale; name: string; nativeName: string; flag: string }>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Use 'en-US' as initial state to prevent hydration mismatch
  // The actual locale will be set in useEffect after mount
  const [locale, setCurrentLocale] = useState<Locale>('en-US');
  const [mounted, setMounted] = useState(false);

  // Set actual locale after hydration
  useEffect(() => {
    setMounted(true);
    setCurrentLocale(getLocale());
  }, []);

  // Get available locales
  const availableLocales = Object.entries(LOCALES).map(([code, info]) => ({
    code: code as Locale,
    ...info,
  }));

  // Change locale handler
  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }));
  }, []);

  // Listen for locale changes from other components
  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setCurrentLocale(e.detail);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hyperzone-locale' && e.newValue) {
        setCurrentLocale(e.newValue as Locale);
      }
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const localeInfo = LOCALES[locale];

  return (
    <I18nContext.Provider
      value={{
        locale,
        localeInfo,
        changeLocale,
        availableLocales,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Hook to access I18n context
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext;
