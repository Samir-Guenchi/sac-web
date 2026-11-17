import { lang } from 'next/root-params';
import { notFound } from 'next/navigation';
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

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}

export async function getT(locale?: Locale) {
  return createTranslator(await getDictionary(locale));
}
