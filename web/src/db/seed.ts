/**
 * Seeds the catalog from the original storefront data and creates the first
 * admin account. Safe to run repeatedly: existing rows are left untouched.
 *
 *   npm run db:seed
 */

import { config } from 'dotenv';

// Same files as Next.js: .env.local (developer secrets) wins over .env
config({ path: ['.env.local', '.env'], quiet: true });
import { createClient } from '@libsql/client';
import { hashPassword } from 'better-auth/crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { randomUUID } from 'node:crypto';
import * as schema from './schema';
import { CUSTOMIZER_CONFIG, LEGACY_OPTION_IDS } from './seed-data/customizer-options';
import { JOURNAL_ENTRIES, LEGACY_JOURNAL_TITLES } from './seed-data/journal';
import { TESTIMONIALS } from './seed-data/testimonials';
import collection2026 from './seed-data/collection-2026.json';
import { PAGES } from './seed-data/pages';
import { DEFAULT_SETTINGS } from '../lib/catalog-types';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});
const db = drizzle(client, { schema });

/** Original data used relative paths ("assets/…"); the app serves them from /assets. */
const asset = (path: string) => (path.startsWith('/') || path.startsWith('http') ? path : `/${path}`);

/** Placeholder bags from the first mock-up, replaced by the real 2026 line. */
const SAMPLE_PRODUCT_IDS = ['pearl-ivory', 'noir-prestige', 'blush-organza', 'taupe-elegance'];

/** Removes the placeholder bags; any that appear in an order are only hidden so order history stays intact. */
async function retireSampleProducts() {
  const ordered = await db
    .selectDistinct({ id: schema.orderItems.productId })
    .from(schema.orderItems)
    .where(inArray(schema.orderItems.productId, SAMPLE_PRODUCT_IDS));
  const keep = new Set(ordered.map(row => row.id));
  for (const id of SAMPLE_PRODUCT_IDS) {
    if (keep.has(id)) await db.update(schema.products).set({ active: false }).where(eq(schema.products.id, id));
    else await db.delete(schema.products).where(eq(schema.products.id, id));
  }
}

async function seedCollections() {
  await db
    .insert(schema.categories)
    .values(collection2026.categories.map((c, i) => ({ id: c.id, name: c.name, description: c.description, sortOrder: i })))
    .onConflictDoNothing();

  // Published at the owner's request; photos showing other makers' branding were not imported
  await db
    .insert(schema.products)
    .values(collection2026.products.map(p => ({ ...p, active: true })))
    .onConflictDoNothing();

}

/**
 * The first mock-up's bespoke options (organza, satin…) did not match the real handmade
 * line. If they are still there, replace every option and the old prices once.
 */
async function replaceLegacyOptions() {
  const legacy = await db
    .select({ id: schema.customizerOptions.id })
    .from(schema.customizerOptions)
    .where(and(eq(schema.customizerOptions.kind, 'material'), inArray(schema.customizerOptions.id, LEGACY_OPTION_IDS)));
  if (legacy.length === 0) return;
  await db.delete(schema.customizerOptions);
  for (const [key, old, value] of [
    ['basePriceDzd', 18500, CUSTOMIZER_CONFIG.basePriceDZD],
    ['monogramCostDzd', 1500, CUSTOMIZER_CONFIG.monogramCostDZD]
  ] as const) {
    const [row] = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
    if (row && row.value === old) await db.update(schema.settings).set({ value }).where(eq(schema.settings.key, key));
  }
  console.log('Replaced the mock-up bespoke options with the handmade atelier options.');
}

async function seedCatalog() {
  await replaceLegacyOptions();
  const kinds = [
    ['color', CUSTOMIZER_CONFIG.colors],
    ['material', CUSTOMIZER_CONFIG.materials],
    ['pearls', CUSTOMIZER_CONFIG.pearls],
    ['chain', CUSTOMIZER_CONFIG.chains]
  ] as const;
  for (const [kind, list] of kinds) {
    await db
      .insert(schema.customizerOptions)
      .values(
        list.map((o, i) => ({
          kind,
          id: o.id,
          name: o.name,
          description: 'description' in o ? o.description : null,
          hex: 'hex' in o ? o.hex : null,
          imageUrl: 'imageRef' in o ? asset(o.imageRef) : null,
          priceModifierDzd: o.priceModifierDZD,
          sortOrder: i
        }))
      )
      .onConflictDoNothing();
  }

  const settingRows = [
    { key: 'basePriceDzd', value: CUSTOMIZER_CONFIG.basePriceDZD },
    { key: 'monogramCostDzd', value: CUSTOMIZER_CONFIG.monogramCostDZD },
    { key: 'rates', value: DEFAULT_SETTINGS.rates },
    { key: 'contact', value: DEFAULT_SETTINGS.contact }
  ];
  await db.insert(schema.settings).values(settingRows).onConflictDoNothing();
}

async function seedContent() {
  // Replace the first mock-up's stories (pearls, organza) with the house's real ones, once
  const journal = await db.select({ id: schema.journalEntries.id, title: schema.journalEntries.title }).from(schema.journalEntries);
  const mockup = journal.some(row => LEGACY_JOURNAL_TITLES.includes(row.title.en));
  if (mockup) await db.delete(schema.journalEntries);
  if (journal.length === 0 || mockup) {
    await db.insert(schema.journalEntries).values(
      JOURNAL_ENTRIES.map((e, i) => ({
        tag: e.tag,
        title: e.title,
        excerpt: e.excerpt,
        body: e.body,
        image: asset(e.image),
        gallery: e.gallery.map(asset),
        readTime: e.readTime,
        date: e.date,
        sortOrder: i
      }))
    );
  }

  const existingTestimonials = await db.select({ id: schema.testimonials.id }).from(schema.testimonials).limit(1);
  if (existingTestimonials.length === 0) {
    await db.insert(schema.testimonials).values(
      TESTIMONIALS.map((t, i) => ({ quote: t.quote, author: t.author, location: t.location, product: t.product, sortOrder: i }))
    );
  }
}

async function seedPages() {
  await db
    .insert(schema.pages)
    .values(PAGES.map((page, i) => ({ ...page, sortOrder: i })))
    .onConflictDoNothing();
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set: skipping admin account.');
    return;
  }
  if (password.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters.');

  const existing = await db.query.user.findFirst({ where: eq(schema.user.email, email) });
  if (existing) {
    if (existing.role !== 'admin') {
      await db.update(schema.user).set({ role: 'admin' }).where(eq(schema.user.id, existing.id));
      console.log(`Promoted ${email} to admin.`);
    } else {
      console.log(`Admin ${email} already exists.`);
    }
    return;
  }

  // Same rows Better Auth writes for an email/password sign-up
  const id = randomUUID();
  await db.insert(schema.user).values({ id, name: 'Admin', email, emailVerified: true, role: 'admin' });
  await db.insert(schema.account).values({
    id: randomUUID(),
    accountId: id,
    providerId: 'credential',
    userId: id,
    password: await hashPassword(password)
  });
  console.log(`Created admin ${email}.`);
}

async function main() {
  await seedCatalog();
  await seedCollections();
  await retireSampleProducts();
  await seedContent();
  await seedPages();
  await seedAdmin();
  console.log('Seed complete.');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.close());
