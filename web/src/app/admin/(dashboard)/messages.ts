import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';
import type { Locale } from '@/lib/i18n/config';

/** Built-in interface texts, before any admin override. */
export const baseMessages: Record<Locale, Record<string, unknown>> = { fr, en, ar };

/** { hero: { title: "…" } } → { "hero.title": "…" } */
export function flattenMessages(tree: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') Object.assign(out, flattenMessages(value as Record<string, unknown>, path));
    else if (typeof value === 'string') out[path] = value;
  }
  return out;
}
