import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/db';
import { contentOverrides, pages, type Localized } from '@/db/schema';
import { TAGS } from './catalog';

export type InfoPage = { slug: string; title: Localized; body: Localized };

export async function getPage(slug: string): Promise<InfoPage | null> {
  'use cache';
  cacheTag(TAGS.content);
  cacheLife('days');
  const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return row && row.published ? { slug: row.slug, title: row.title, body: row.body } : null;
}

export async function getPublishedPages(): Promise<InfoPage[]> {
  'use cache';
  cacheTag(TAGS.content);
  cacheLife('days');
  const rows = await db.select().from(pages).where(eq(pages.published, true)).orderBy(asc(pages.sortOrder));
  return rows.map(({ slug, title, body }) => ({ slug, title, body }));
}

/** Admin text edits for one language, as { "hero.title": "…" }. */
export async function getTextOverrides(locale: string): Promise<Record<string, string>> {
  'use cache';
  cacheTag(TAGS.content);
  cacheLife('days');
  const rows = await db.select().from(contentOverrides).where(eq(contentOverrides.locale, locale));
  return Object.fromEntries(rows.map(row => [row.key, row.value]));
}
