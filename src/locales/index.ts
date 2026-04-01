/**
 * i18n Configuration
 * @description Internationalization setup for HyperZone
 */

import enUS from './en-US.json';
import fr from './fr.json';
import de from './de.json';
import ptBR from './pt-BR.json';
import es from './es.json';
import ja from './ja.json';

export type Locale = 'en-US' | 'fr' | 'de' | 'pt-BR' | 'es' | 'ja';

export type TranslationKey = keyof typeof enUS;

/**
 * Available locales with their display information
 */
export const LOCALES: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  'en-US': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
};

const translations: Record<Locale, typeof enUS> = {
  'en-US': enUS,
  'fr': fr as unknown as typeof enUS,
  'de': de as unknown as typeof enUS,
  'pt-BR': ptBR as unknown as typeof enUS,
  'es': es as unknown as typeof enUS,
  'ja': ja as unknown as typeof enUS,
};

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'hyperzone-locale';

let currentLocale: Locale = 'en-US';

/**
 * Initialize locale from localStorage or browser preference
 */
function initializeLocale(): void {
  if (typeof window === 'undefined') return;

  // Try to get from localStorage
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
  if (storedLocale && translations[storedLocale]) {
    currentLocale = storedLocale;
    return;
  }

  // Try to get from browser language
  const browserLang = navigator.language;
  if (browserLang) {
    // Direct match
    if (translations[browserLang as Locale]) {
      currentLocale = browserLang as Locale;
      return;
    }
    // Match language part (e.g., 'en' from 'en-GB')
    const langPart = browserLang.split('-')[0];
    const matchedLocale = Object.keys(translations).find(
      locale => locale.startsWith(langPart)
    ) as Locale | undefined;
    if (matchedLocale) {
      currentLocale = matchedLocale;
    }
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeLocale();
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  if (!translations[locale]) {
    console.warn(`Locale "${locale}" is not supported. Falling back to "en-US".`);
    locale = 'en-US';
  }
  currentLocale = locale;

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Get translation by key path (e.g., 'common.loading', 'auth.loginTitle')
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
  const keys = keyPath.split('.');
  let value: unknown = translations[currentLocale];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Translation not found: ${keyPath}`);
      return keyPath;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation is not a string: ${keyPath}`);
    return keyPath;
  }

  // Replace parameters like {{param}} with actual values
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramValue)),
      value
    );
  }

  return value;
}

/**
 * Get a section of translations
 */
export function getSection<T extends keyof typeof enUS>(section: T): typeof enUS[T] {
  return translations[currentLocale][section];
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(keyPath: string): boolean {
  const keys = keyPath.split('.');
  let value: unknown = translations[currentLocale];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string; nativeName: string; flag: string }> {
  return Object.entries(LOCALES).map(([code, info]) => ({
    code: code as Locale,
    ...info,
  }));
}

export { translations };
export default translations;
