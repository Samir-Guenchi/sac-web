import type { Localized } from '@/db/schema';

export const LANGS = ['fr', 'en', 'ar'] as const;
export const LANG_NAMES = { fr: 'Français', en: 'English', ar: 'العربية' } as const;

export const str = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

/** Reads `${name}.fr`, `${name}.en`, `${name}.ar`; empty languages fall back to French. */
export function localized(form: FormData, name: string, { required = true } = {}): Localized {
  const fr = str(form, `${name}.fr`);
  const en = str(form, `${name}.en`) || fr;
  const ar = str(form, `${name}.ar`) || fr;
  if (required && !fr) throw new Error(`“${name}” is required in French.`);
  return { fr, en, ar };
}

export function int(form: FormData, name: string, { min = 0, max = 10_000_000 } = {}): number {
  const value = Number(str(form, name));
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`“${name}” must be a whole number between ${min} and ${max}.`);
  return value;
}

export const bool = (form: FormData, name: string) => form.get(name) === 'on';

/** URL-safe id from a name: "Pearl Ivory" → "pearl-ivory". */
export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}
