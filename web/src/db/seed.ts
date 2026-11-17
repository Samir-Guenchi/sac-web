/**
 * Seeds the catalog from the original storefront data and creates the first
 * admin account. Safe to run repeatedly: existing rows are left untouched.
 *
 *   npm run db:seed
 */

import 'dotenv/config';
import { createClient } from '@libsql/client';
import { hashPassword } from 'better-auth/crypto';
import { and, eq, isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { randomUUID } from 'node:crypto';
import * as schema from './schema';
import { PRODUCTS } from './seed-data/products';
import { CUSTOMIZER_CONFIG } from './seed-data/customizer-options';
import { JOURNAL_ENTRIES } from './seed-data/journal';
import { TESTIMONIALS } from './seed-data/testimonials';
import collection2026 from './seed-data/collection-2026.json';
import { DEFAULT_SETTINGS } from '../lib/catalog-types';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});
const db = drizzle(client, { schema });

/** Original data used relative paths ("assets/…"); the app serves them from /assets. */
const asset = (path: string) => (path.startsWith('/') || path.startsWith('http') ? path : `/${path}`);

/** Collections of the original four bags (only set when they have none yet). */
const ORIGINAL_CATEGORIES: Record<string, string> = {
  'pearl-ivory': 'ceremonie',
  'noir-prestige': 'luxe',
  'blush-organza': 'printemps',
  'taupe-elegance': 'luxe'
};

async function seedCollections() {
  await db
    .insert(schema.categories)
    .values(collection2026.categories.map((c, i) => ({ id: c.id, name: c.name, description: c.description, sortOrder: i })))
    .onConflictDoNothing();

  // New bags arrive hidden: they go live from Admin → Products once real photos are in place
  await db
    .insert(schema.products)
    .values(collection2026.products.map(p => ({ ...p, active: false })))
    .onConflictDoNothing();

  for (const [productId, categoryId] of Object.entries(ORIGINAL_CATEGORIES)) {
    await db
      .update(schema.products)
      .set({ categoryId })
      .where(and(eq(schema.products.id, productId), isNull(schema.products.categoryId)));
  }
}

async function seedCatalog() {
  await db
    .insert(schema.products)
    .values(
      PRODUCTS.map((p, i) => ({
        id: p.id,
        name: p.name,
        collection: p.collection,
        tag: p.tag,
        badgeClass: p.badgeClass,
        priceDzd: p.priceDZD,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        materials: p.materials,
        dimensions: p.dimensions,
        hardware: p.hardware,
        primaryImage: asset(p.images.primary),
        gallery: p.images.gallery.map(asset),
        sortOrder: i
      }))
    )
    .onConflictDoNothing();

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
  const existingJournal = await db.select({ id: schema.journalEntries.id }).from(schema.journalEntries).limit(1);
  if (existingJournal.length === 0) {
    await db.insert(schema.journalEntries).values(
      JOURNAL_ENTRIES.map((e, i) => ({
        tag: e.tag,
        title: e.title,
        excerpt: e.excerpt,
        image: asset(e.image),
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
  await seedContent();
  await seedAdmin();
  console.log('Seed complete.');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.close());
