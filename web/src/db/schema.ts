/**
 * ZAPHIRA — Database schema (Turso / libSQL via Drizzle)
 *
 * Customer-facing text is stored as JSON `{ en, fr, ar }` (type Localized) so
 * the admin can edit every language of an item in one form.
 * Money is stored as integer DZD.
 */

import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type Localized = { en: string; fr: string; ar: string };

const localized = (name: string) => text(name, { mode: 'json' }).$type<Localized>().notNull();
const createdAt = () => integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`);
const updatedAt = () =>
  integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date());

/* -------------------------------------------------------------------------- */
/* Catalog                                                                     */
/* -------------------------------------------------------------------------- */

export const products = sqliteTable('products', {
  id: text('id').primaryKey(), // slug, e.g. "pearl-ivory"
  name: text('name').notNull(), // proper name, not translated
  collection: localized('collection'),
  tag: localized('tag'),
  badgeClass: text('badge_class').notNull().default('badge-champagne'),
  priceDzd: integer('price_dzd').notNull(),
  shortDescription: localized('short_description'),
  fullDescription: localized('full_description'),
  materials: localized('materials'),
  dimensions: localized('dimensions'),
  hardware: localized('hardware'),
  primaryImage: text('primary_image').notNull(),
  gallery: text('gallery', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  sortOrder: integer('sort_order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt()
});

export const OPTION_KINDS = ['color', 'material', 'pearls', 'chain'] as const;
export type OptionKind = (typeof OPTION_KINDS)[number];

export const customizerOptions = sqliteTable(
  'customizer_options',
  {
    kind: text('kind', { enum: OPTION_KINDS }).notNull(),
    id: text('id').notNull(), // e.g. "noir"
    name: localized('name'),
    description: text('description', { mode: 'json' }).$type<Localized>(),
    hex: text('hex'), // colors only
    imageUrl: text('image_url'), // colors only: preview image
    priceModifierDzd: integer('price_modifier_dzd').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    active: integer('active', { mode: 'boolean' }).notNull().default(true)
  },
  t => [primaryKey({ columns: [t.kind, t.id] })]
);

/** Key/value store for shop-wide settings (base price, monogram cost, exchange rates, contact). */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).notNull()
});

/* -------------------------------------------------------------------------- */
/* Editorial content                                                           */
/* -------------------------------------------------------------------------- */

export const journalEntries = sqliteTable('journal_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tag: localized('tag'),
  title: localized('title'),
  excerpt: localized('excerpt'),
  image: text('image').notNull(),
  readTime: localized('read_time'),
  date: localized('date'),
  sortOrder: integer('sort_order').notNull().default(0),
  published: integer('published', { mode: 'boolean' }).notNull().default(true)
});

export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quote: localized('quote'),
  author: text('author').notNull(),
  location: localized('location'),
  product: text('product').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  published: integer('published', { mode: 'boolean' }).notNull().default(true)
});

/* -------------------------------------------------------------------------- */
/* Orders                                                                      */
/* -------------------------------------------------------------------------- */

export const ORDER_STATUSES = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled', 'returned'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ['cod', 'cib', 'card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** CodPilot hand-off state: `disabled` until the integration is configured. */
export const CODPILOT_STATUSES = ['disabled', 'pending', 'sent', 'failed'] as const;

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(), // "ZPH-123456"
    status: text('status', { enum: ORDER_STATUSES }).notNull().default('pending'),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    email: text('email').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    phone: text('phone').notNull(),
    wilayaCode: text('wilaya_code').notNull(), // "01".."69" or "intl"
    address: text('address').notNull(),
    paymentMethod: text('payment_method', { enum: PAYMENT_METHODS }).notNull(),
    giftMessage: text('gift_message'),
    locale: text('locale').notNull(),
    subtotalDzd: integer('subtotal_dzd').notNull(),
    shippingDzd: integer('shipping_dzd').notNull().default(0),
    totalDzd: integer('total_dzd').notNull(),
    adminNote: text('admin_note'),
    codpilotStatus: text('codpilot_status', { enum: CODPILOT_STATUSES }).notNull().default('disabled'),
    codpilotRef: text('codpilot_ref'),
    codpilotError: text('codpilot_error'),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  t => [index('orders_status_idx').on(t.status), index('orders_created_idx').on(t.createdAt), index('orders_user_idx').on(t.userId)]
);

/** Snapshot of what was bought, so later catalog edits never rewrite past orders. */
export type OrderItemSpecs = {
  colorId?: string;
  materialId?: string;
  pearlsId?: string;
  chainId?: string;
  monogram?: string;
  /** Names at the time of purchase (French), for the admin and CodPilot */
  labels?: { color?: string; material?: string; pearls?: string; chain?: string };
};

export const orderItems = sqliteTable(
  'order_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: text('product_id'), // null for bespoke bags
    isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
    name: text('name').notNull(),
    image: text('image'),
    specs: text('specs', { mode: 'json' }).$type<OrderItemSpecs>(),
    unitPriceDzd: integer('unit_price_dzd').notNull(),
    quantity: integer('quantity').notNull()
  },
  t => [index('order_items_order_idx').on(t.orderId)]
);

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  email: text('email').primaryKey(),
  locale: text('locale').notNull(),
  createdAt: createdAt()
});

/* -------------------------------------------------------------------------- */
/* Better Auth (core tables + admin plugin + Zaphira profile fields)           */
/* -------------------------------------------------------------------------- */

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  // admin plugin
  role: text('role').default('user'),
  banned: integer('banned', { mode: 'boolean' }).default(false),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
  // Zaphira profile
  civility: text('civility'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  birthDate: text('birth_date'), // YYYY-MM-DD
  newsletterOptIn: integer('newsletter_opt_in', { mode: 'boolean' }).default(false),
  locale: text('locale')
});

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by')
  },
  t => [index('session_user_idx').on(t.userId)]
);

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  t => [index('account_user_idx').on(t.userId)]
);

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  t => [index('verification_identifier_idx').on(t.identifier)]
);

/** Better Auth rate-limit counters (database storage works across serverless instances). */
export const rateLimit = sqliteTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  count: integer('count').notNull(),
  lastRequest: integer('last_request').notNull()
});
