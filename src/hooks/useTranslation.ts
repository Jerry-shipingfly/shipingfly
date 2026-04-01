/**
 * useTranslation Hook
 * @description React hook for accessing translations with locale switching support
 */

'use client';

import { useCallback, useMemo } from 'react';
import { t, getSection, Locale, getAvailableLocales, LOCALES } from '@/locales';
import { useI18n } from '@/contexts/I18nContext';

export function useTranslation() {
  // Get locale from I18n context - this will trigger re-render when locale changes
  const { locale, changeLocale, localeInfo, availableLocales } = useI18n();

  const translate = useCallback((key: string, params?: Record<string, string | number>) => {
    return t(key, params);
  }, [locale]);

  const getTranslations = useCallback(
    <T extends keyof typeof import('@/locales/en-US.json')>(section: T) => {
      return getSection(section);
    },
    [locale]
  );

  const hasKey = useCallback((key: string): boolean => {
    const keys = key.split('.');
    let value: unknown = getSection('common');

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return false;
      }
    }
    return typeof value === 'string';
  }, [locale]);

  return {
    t: translate,
    locale,
    localeInfo,
    setLocale: changeLocale,
    getSection: getTranslations,
    availableLocales,
    hasKey,
  };
}

export default useTranslation;
