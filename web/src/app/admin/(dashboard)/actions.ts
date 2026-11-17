'use server';

/**
 * Admin Server Actions. Each one re-checks the admin role (never trust the UI),
 * validates input, writes, and refreshes the storefront cache tags it affects.
 * Files are uploaded separately (components/admin/MediaFields.tsx); forms only
 * submit URLs, so request size limits never apply here.
 */

import { and, count, eq } from 'drizzle-orm';
import { refresh, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import {
  categories,
  contentOverrides,
  customizerOptions,
  journalEntries,
  orderItems,
  orders,
  ORDER_STATUSES,
  OPTION_KINDS,
  pages,
  products,
  settings,
  testimonials,
  type OptionKind,
  type OrderStatus
} from '@/db/schema';
import { TAGS } from '@/lib/catalog';
import { codpilotEnabled, pushOrderToCodpilot } from '@/lib/codpilot';
import { LOCALES } from '@/lib/i18n/config';
import { requireAdmin } from '@/lib/session';
import { bool, int, localized, slugify, str } from './form-utils';
import { baseMessages, flattenMessages } from './messages';

export type ActionState = { ok: boolean; message: string } | null;

async function guarded(work: () => Promise<string>): Promise<ActionState> {
  await requireAdmin();
  try {
    const message = await work();
    // Re-render the admin page so it shows what was just saved
    refresh();
    return { ok: true, message };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Something went wrong.' };
  }
}

/** Accepts site-relative paths or http(s) URLs only (no javascript:, data:, …). */
function mediaUrl(form: FormData, name: string, { required = false } = {}): string | null {
  const value = str(form, name);
  if (!value) {
    if (required) throw new Error(`“${name}” is required.`);
    return null;
  }
  if (!/^(\/(?!\/)|https?:\/\/)/i.test(value)) throw new Error(`“${name}” must be a link starting with / or https://`);
  return value;
}

function mediaList(form: FormData, name: string): string[] {
  return str(form, name)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(url => {
      if (!/^(\/(?!\/)|https?:\/\/)/i.test(url)) throw new Error(`Invalid image link: ${url}`);
      return url;
    });
}

/* ------------------------------- Orders --------------------------------- */

export async function updateOrder(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const id = str(form, 'id');
    const status = str(form, 'status') as OrderStatus;
    if (!ORDER_STATUSES.includes(status)) throw new Error('Unknown status.');
    await db
      .update(orders)
      .set({ status, adminNote: str(form, 'adminNote') || null })
      .where(eq(orders.id, id));
    return 'Order updated.';
  });
}

export async function retryCodpilot(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    if (!codpilotEnabled()) throw new Error('CodPilot is not configured yet (CODPILOT_API_URL / CODPILOT_API_KEY).');
    const id = str(form, 'id');
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) throw new Error('Order not found.');
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    await pushOrderToCodpilot({
      reference: order.id,
      customer: { firstName: order.firstName, lastName: order.lastName, phone: order.phone, email: order.email },
      wilayaCode: order.wilayaCode,
      address: order.address,
      paymentMethod: order.paymentMethod,
      totalDzd: order.totalDzd,
      items: items.map(item => ({ name: item.name, quantity: item.quantity, unitPriceDzd: item.unitPriceDzd, specs: item.specs ?? null })),
      note: order.giftMessage
    });
    const after = await db.query.orders.findFirst({ columns: { codpilotStatus: true, codpilotError: true }, where: eq(orders.id, id) });
    if (after?.codpilotStatus !== 'sent') throw new Error(`CodPilot hand-off failed: ${after?.codpilotError ?? 'unknown error'}`);
    return 'Sent to CodPilot.';
  });
}

/* ------------------------------ Products -------------------------------- */

export async function saveProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  const result = await guarded(async () => {
    const existingId = str(form, 'existingId');
    const name = str(form, 'name');
    if (!name) throw new Error('Name is required.');
    const id = existingId || slugify(str(form, 'id') || name);
    if (!id) throw new Error('Please provide an id (letters and numbers).');

    const gallery = mediaList(form, 'gallery');
    if (gallery.length === 0) throw new Error('Add at least one photo.');

    const categoryId = str(form, 'categoryId') || null;
    if (categoryId && !(await db.query.categories.findFirst({ columns: { id: true }, where: eq(categories.id, categoryId) }))) {
      throw new Error('Unknown collection.');
    }

    const values = {
      name,
      categoryId,
      collection: localized(form, 'collection'),
      tag: localized(form, 'tag'),
      badgeClass: ['badge-champagne', 'badge-charcoal', 'badge-rose'].includes(str(form, 'badgeClass')) ? str(form, 'badgeClass') : 'badge-champagne',
      priceDzd: int(form, 'priceDzd', { min: 1 }),
      shortDescription: localized(form, 'shortDescription'),
      fullDescription: localized(form, 'fullDescription'),
      materials: localized(form, 'materials'),
      dimensions: localized(form, 'dimensions'),
      hardware: localized(form, 'hardware'),
      primaryImage: gallery[0],
      gallery,
      sortOrder: int(form, 'sortOrder', { min: 0, max: 9999 }),
      active: bool(form, 'active')
    };

    if (existingId) {
      await db.update(products).set(values).where(eq(products.id, existingId));
    } else {
      const clash = await db.query.products.findFirst({ columns: { id: true }, where: eq(products.id, id) });
      if (clash) throw new Error(`A product with id “${id}” already exists.`);
      await db.insert(products).values({ id, ...values });
    }
    updateTag(TAGS.catalog);
    return existingId ? 'Product saved.' : `created:${id}`;
  });
  if (result?.ok && result.message.startsWith('created:')) redirect(`/admin/products/${result.message.slice(8)}`);
  return result;
}

/** Show/hide straight from the product list. */
export async function setProductVisibility(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const active = str(form, 'active') === '1';
    await db.update(products).set({ active }).where(eq(products.id, str(form, 'id')));
    updateTag(TAGS.catalog);
    return active ? 'Now visible in the shop.' : 'Hidden from the shop.';
  });
}

/** Deleting is only allowed for products never ordered; otherwise hide them (keeps order history intact). */
export async function deleteProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  const result = await guarded(async () => {
    const id = str(form, 'id');
    const [{ n }] = await db.select({ n: count() }).from(orderItems).where(eq(orderItems.productId, id));
    if (n > 0) throw new Error(`This product appears in ${n} order line(s). Hide it instead of deleting it.`);
    await db.delete(products).where(eq(products.id, id));
    updateTag(TAGS.catalog);
    return 'deleted';
  });
  if (result?.ok) redirect('/admin/products');
  return result;
}

/* ------------------------------ Collections ----------------------------- */

export async function saveCategory(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const existingId = str(form, 'existingId');
    const id = existingId || slugify(str(form, 'id') || str(form, 'name.fr'));
    if (!id) throw new Error('Please provide an id.');
    const values = {
      name: localized(form, 'name'),
      description: localized(form, 'description', { required: false }),
      image: mediaUrl(form, 'image'),
      sortOrder: int(form, 'sortOrder', { max: 9999 }),
      active: bool(form, 'active')
    };
    if (existingId) {
      await db.update(categories).set(values).where(eq(categories.id, existingId));
    } else {
      if (await db.query.categories.findFirst({ columns: { id: true }, where: eq(categories.id, id) })) throw new Error(`A collection “${id}” already exists.`);
      await db.insert(categories).values({ id, ...values });
    }
    updateTag(TAGS.catalog);
    return existingId ? 'Collection saved.' : 'Collection added.';
  });
}

/* --------------------------- Bespoke options ---------------------------- */

export async function saveOption(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const kind = str(form, 'kind') as OptionKind;
    if (!OPTION_KINDS.includes(kind)) throw new Error('Unknown option type.');
    const existingId = str(form, 'existingId');
    const id = existingId || slugify(str(form, 'id') || str(form, 'name.en') || str(form, 'name.fr'));
    if (!id) throw new Error('Please provide an id.');

    const hex = str(form, 'hex');
    if (kind === 'color' && !/^#[0-9a-fA-F]{6}$/.test(hex)) throw new Error('Colour must be a hex value like #F7F2E8.');

    const values = {
      name: localized(form, 'name'),
      description: kind === 'color' ? null : localized(form, 'description', { required: false }),
      hex: kind === 'color' ? hex : null,
      imageUrl: kind === 'color' ? mediaUrl(form, 'imageUrl') : null,
      priceModifierDzd: int(form, 'priceModifierDzd', { min: 0 }),
      sortOrder: int(form, 'sortOrder', { min: 0, max: 9999 }),
      active: bool(form, 'active')
    };

    if (existingId) {
      await db.update(customizerOptions).set(values).where(and(eq(customizerOptions.kind, kind), eq(customizerOptions.id, existingId)));
    } else {
      const clash = await db.query.customizerOptions.findFirst({ where: and(eq(customizerOptions.kind, kind), eq(customizerOptions.id, id)) });
      if (clash) throw new Error(`An option “${id}” already exists in this group.`);
      await db.insert(customizerOptions).values({ kind, id, ...values });
    }
    updateTag(TAGS.catalog);
    return existingId ? 'Option saved.' : 'Option added.';
  });
}

/* ------------------------------- Settings ------------------------------- */

export async function saveSettings(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const number = (name: string) => {
      const display = str(form, `${name}.display`);
      const tel = str(form, `${name}.tel`).replace(/[^\d+]/g, '');
      return { display: display || '+213 (0) XX XX XX XX', tel: tel || null };
    };
    const social = (name: string) => {
      const value = str(form, `social.${name}`);
      if (value && !/^https:\/\//i.test(value)) throw new Error(`The ${name} link must start with https://`);
      return value;
    };
    const rows = [
      { key: 'basePriceDzd', value: int(form, 'basePriceDzd', { min: 1 }) },
      { key: 'monogramCostDzd', value: int(form, 'monogramCostDzd') },
      { key: 'rates', value: { EUR: int(form, 'rates.EUR', { min: 1, max: 100000 }), USD: int(form, 'rates.USD', { min: 1, max: 100000 }) } },
      { key: 'contact', value: { whatsapp: number('whatsapp'), phone: number('phone') } },
      {
        key: 'media',
        value: {
          heroVideo: mediaUrl(form, 'media.heroVideo', { required: true }),
          heroPoster: mediaUrl(form, 'media.heroPoster', { required: true }),
          craftImage: mediaUrl(form, 'media.craftImage', { required: true }),
          heritageImage: mediaUrl(form, 'media.heritageImage', { required: true })
        }
      },
      { key: 'social', value: { instagram: social('instagram'), facebook: social('facebook'), tiktok: social('tiktok') } }
    ];
    for (const row of rows) {
      await db.insert(settings).values(row).onConflictDoUpdate({ target: settings.key, set: { value: row.value } });
    }
    updateTag(TAGS.catalog);
    return 'Settings saved.';
  });
}

/* ------------------------------- Content -------------------------------- */

export async function saveJournalEntry(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const id = Number(str(form, 'id')) || null;
    const values = {
      tag: localized(form, 'tag'),
      title: localized(form, 'title'),
      excerpt: localized(form, 'excerpt'),
      readTime: localized(form, 'readTime'),
      date: localized(form, 'date'),
      image: mediaUrl(form, 'image', { required: true })!,
      sortOrder: int(form, 'sortOrder', { max: 9999 }),
      published: bool(form, 'published')
    };
    if (id) await db.update(journalEntries).set(values).where(eq(journalEntries.id, id));
    else await db.insert(journalEntries).values(values);
    updateTag(TAGS.content);
    return id ? 'Article saved.' : 'Article added.';
  });
}

export async function saveTestimonial(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const id = Number(str(form, 'id')) || null;
    const author = str(form, 'author');
    if (!author) throw new Error('Author is required.');
    const values = {
      quote: localized(form, 'quote'),
      location: localized(form, 'location'),
      author,
      product: str(form, 'product'),
      sortOrder: int(form, 'sortOrder', { max: 9999 }),
      published: bool(form, 'published')
    };
    if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));
    else await db.insert(testimonials).values(values);
    updateTag(TAGS.content);
    return id ? 'Testimonial saved.' : 'Testimonial added.';
  });
}

export async function savePage(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const existing = str(form, 'existingSlug');
    const slug = existing || slugify(str(form, 'slug') || str(form, 'title.fr'));
    if (!slug) throw new Error('Please provide a page address.');
    const values = {
      title: localized(form, 'title'),
      body: localized(form, 'body'),
      sortOrder: int(form, 'sortOrder', { max: 9999 }),
      published: bool(form, 'published')
    };
    if (existing) {
      await db.update(pages).set(values).where(eq(pages.slug, existing));
    } else {
      if (await db.query.pages.findFirst({ columns: { slug: true }, where: eq(pages.slug, slug) })) throw new Error(`A page “${slug}” already exists.`);
      await db.insert(pages).values({ slug, ...values });
    }
    updateTag(TAGS.content);
    return existing ? 'Page saved.' : 'Page added.';
  });
}

/**
 * Interface texts: a value equal to the built-in text removes the override,
 * anything else is stored and replaces that key on the storefront.
 */
export async function saveTexts(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const keys = str(form, 'keys').split(',').filter(Boolean);
    let changed = 0;
    for (const locale of LOCALES) {
      const base = flattenMessages(baseMessages[locale]);
      for (const key of keys) {
        if (!(key in base)) throw new Error(`Unknown text key: ${key}`);
        const value = String(form.get(`${locale}:${key}`) ?? '');
        if (!value.trim() || value === base[key]) {
          await db.delete(contentOverrides).where(and(eq(contentOverrides.locale, locale), eq(contentOverrides.key, key)));
        } else {
          await db
            .insert(contentOverrides)
            .values({ locale, key, value })
            .onConflictDoUpdate({ target: [contentOverrides.locale, contentOverrides.key], set: { value } });
          changed++;
        }
      }
    }
    updateTag(TAGS.content);
    return changed ? `Saved (${changed} custom text${changed > 1 ? 's' : ''} in this section).` : 'Saved: this section uses the default texts.';
  });
}
