import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/db';
import { customizerOptions, journalEntries, products, settings, testimonials, OPTION_KINDS } from '@/db/schema';
import { DEFAULT_SETTINGS, type Catalog, type JournalEntry, type ShopSettings, type Testimonial } from './catalog-types';

/** Cache tags; admin Server Actions call updateTag() with these after edits. */
export const TAGS = { catalog: 'catalog', content: 'content' } as const;

async function readSettings(): Promise<ShopSettings> {
  const rows = await db.select().from(settings);
  const stored = Object.fromEntries(rows.map(row => [row.key, row.value])) as Partial<ShopSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    rates: { ...DEFAULT_SETTINGS.rates, ...(stored.rates ?? {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(stored.contact ?? {}) }
  };
}

/** Active products, customizer options and shop settings. Cached until an admin edit. */
export async function getCatalog(): Promise<Catalog> {
  'use cache';
  cacheTag(TAGS.catalog);
  cacheLife('days');
  return loadCatalog();
}

/** Uncached read for checkout, so prices are always the current ones. */
export async function loadCatalog(): Promise<Catalog> {
  const [productRows, optionRows, shopSettings] = await Promise.all([
    db.select().from(products).where(eq(products.active, true)).orderBy(asc(products.sortOrder), asc(products.name)),
    db.select().from(customizerOptions).where(eq(customizerOptions.active, true)).orderBy(asc(customizerOptions.sortOrder)),
    readSettings()
  ]);

  const options = Object.fromEntries(OPTION_KINDS.map(kind => [kind, [] as Catalog['options'][typeof kind]])) as Catalog['options'];
  for (const row of optionRows) {
    options[row.kind].push({
      kind: row.kind,
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      hex: row.hex,
      imageUrl: row.imageUrl,
      priceModifierDzd: row.priceModifierDzd
    });
  }

  return {
    products: productRows.map(({ active: _active, sortOrder: _sort, createdAt: _c, updatedAt: _u, ...product }) => product),
    options,
    settings: shopSettings
  };
}

export async function getJournal(): Promise<JournalEntry[]> {
  'use cache';
  cacheTag(TAGS.content);
  cacheLife('days');
  const rows = await db.select().from(journalEntries).where(eq(journalEntries.published, true)).orderBy(asc(journalEntries.sortOrder));
  return rows.map(({ sortOrder: _s, published: _p, ...entry }) => entry);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  'use cache';
  cacheTag(TAGS.content);
  cacheLife('days');
  const rows = await db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(asc(testimonials.sortOrder));
  return rows.map(({ sortOrder: _s, published: _p, ...entry }) => entry);
}
