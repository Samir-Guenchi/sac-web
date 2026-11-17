/**
 * Dictionary lookup shared by Server and Client Components.
 * `t('section.key', { var })` falls back to English, then to the key itself.
 */

import type { Localized } from '@/db/schema';
import type { Locale } from './config';
import en from '@/messages/en.json';

export type Dictionary = typeof en;
export type TFunction = (key: string, vars?: Record<string, string | number>) => string;

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (val, k) => (val && typeof val === 'object' ? (val as Record<string, unknown>)[k] : undefined),
    dict
  );
}

export function createTranslator(dict: Dictionary): TFunction {
  return (key, vars) => {
    let val = lookup(dict, key);
    if (typeof val !== 'string') val = lookup(en, key);
    if (typeof val !== 'string') return key;
    if (!vars) return val;
    return val.replace(/\{(\w+)\}/g, (match, name: string) => (vars[name] !== undefined ? String(vars[name]) : match));
  };
}

/** Pick the active language from a `{ en, fr, ar }` value stored in the database. */
export function pick(value: Localized | null | undefined, locale: Locale): string {
  if (!value) return '';
  return value[locale] || value.fr || value.en || '';
}
