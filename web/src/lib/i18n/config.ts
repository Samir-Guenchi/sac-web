/** Shared by proxy, server and client code — keep free of server-only imports. */

export const LOCALES = ['fr', 'en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when the browser's Accept-Language matches none of LOCALES. */
export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_COOKIE = 'zaphira_locale';

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');

export const LOCALE_LABELS: Record<Locale, string> = { fr: 'FR', en: 'EN', ar: 'العربية' };
