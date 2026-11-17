'use server';

/**
 * Admin Server Actions. Each one re-checks the admin role (never trust the UI),
 * validates input, writes, and refreshes the storefront cache tags it affects.
 */

import { and, eq } from 'drizzle-orm';
import { refresh, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { customizerOptions, journalEntries, orders, ORDER_STATUSES, OPTION_KINDS, products, settings, testimonials, type OptionKind, type OrderStatus } from '@/db/schema';
import { TAGS } from '@/lib/catalog';
import { codpilotEnabled, pushOrderToCodpilot } from '@/lib/codpilot';
import { requireAdmin } from '@/lib/session';
import { saveImage } from '@/lib/uploads';
import { bool, int, localized, slugify, str } from './form-utils';

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
    const items = await db.query.orderItems.findMany({ where: (item, { eq: equals }) => equals(item.orderId, id) });
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

    const uploaded = await saveImage(form.get('primaryImageFile'), 'products');
    const primaryImage = uploaded ?? str(form, 'primaryImage');
    if (!primaryImage) throw new Error('A main image is required (upload one or paste a URL).');
    const extra = await saveImage(form.get('galleryFile'), 'products');
    const gallery = str(form, 'gallery')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    if (extra) gallery.push(extra);
    if (!gallery.includes(primaryImage)) gallery.unshift(primaryImage);

    const values = {
      name,
      collection: localized(form, 'collection'),
      tag: localized(form, 'tag'),
      badgeClass: ['badge-champagne', 'badge-charcoal', 'badge-rose'].includes(str(form, 'badgeClass')) ? str(form, 'badgeClass') : 'badge-champagne',
      priceDzd: int(form, 'priceDzd', { min: 1 }),
      shortDescription: localized(form, 'shortDescription'),
      fullDescription: localized(form, 'fullDescription'),
      materials: localized(form, 'materials'),
      dimensions: localized(form, 'dimensions'),
      hardware: localized(form, 'hardware'),
      primaryImage,
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

/* --------------------------- Bespoke options ---------------------------- */

export async function saveOption(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const kind = str(form, 'kind') as OptionKind;
    if (!OPTION_KINDS.includes(kind)) throw new Error('Unknown option type.');
    const existingId = str(form, 'existingId');
    const id = existingId || slugify(str(form, 'id') || str(form, 'name.en') || str(form, 'name.fr'));
    if (!id) throw new Error('Please provide an id.');

    const uploaded = kind === 'color' ? await saveImage(form.get('imageFile'), 'options') : null;
    const hex = str(form, 'hex');
    if (kind === 'color' && !/^#[0-9a-fA-F]{6}$/.test(hex)) throw new Error('Colour must be a hex value like #F7F2E8.');

    const values = {
      name: localized(form, 'name'),
      description: kind === 'color' ? null : localized(form, 'description', { required: false }),
      hex: kind === 'color' ? hex : null,
      imageUrl: kind === 'color' ? uploaded ?? (str(form, 'imageUrl') || null) : null,
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
    const rows = [
      { key: 'basePriceDzd', value: int(form, 'basePriceDzd', { min: 1 }) },
      { key: 'monogramCostDzd', value: int(form, 'monogramCostDzd') },
      { key: 'rates', value: { EUR: int(form, 'rates.EUR', { min: 1, max: 100000 }), USD: int(form, 'rates.USD', { min: 1, max: 100000 }) } },
      { key: 'contact', value: { whatsapp: number('whatsapp'), phone: number('phone') } }
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
    const uploaded = await saveImage(form.get('imageFile'), 'journal');
    const image = uploaded ?? str(form, 'image');
    if (!image) throw new Error('An image is required.');
    const values = {
      tag: localized(form, 'tag'),
      title: localized(form, 'title'),
      excerpt: localized(form, 'excerpt'),
      readTime: localized(form, 'readTime'),
      date: localized(form, 'date'),
      image,
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
