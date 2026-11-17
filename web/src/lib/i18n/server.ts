import { lang } from 'next/root-params';
import { notFound } from 'next/navigation';
import { getTextOverrides } from '@/lib/content';
import { isLocale, type Locale } from './config';
import { createTranslator, type Dictionary } from './translate';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import('@/messages/fr.json').then(m => m.default as Dictionary),
  en: () => import('@/messages/en.json').then(m => m.default as Dictionary),
  ar: () => import('@/messages/ar.json').then(m => m.default as Dictionary)
};

/** Locale of the current storefront route (from the `[lang]` root segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** Built-in texts with the admin's edits (Admin → Site texts) applied on top. */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const resolved = locale ?? (await getLocale());
  const [base, overrides] = await Promise.all([dictionaries[resolved](), getTextOverrides(resolved)]);
  if (Object.keys(overrides).length === 0) return base;

  const merged = structuredClone(base) as Record<string, unknown>;
  for (const [path, value] of Object.entries(overrides)) {
    const keys = path.split('.');
    let node = merged;
    for (const key of keys.slice(0, -1)) {
      if (!node[key] || typeof node[key] !== 'object') node[key] = {};
      node = node[key] as Record<string, unknown>;
    }
    node[keys.at(-1)!] = value;
  }
  return merged as Dictionary;
}

export async function getT(locale?: Locale) {
  return createTranslator(await getDictionary(locale));
}
