import 'server-only';
import { randomInt } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { after } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { orderItems, orders, PAYMENT_METHODS, type OrderItemSpecs } from '@/db/schema';
import { describeLine } from './cart-display';
import { loadCatalog } from './catalog';
import { codpilotEnabled, pushOrderToCodpilot } from './codpilot';
import { createTranslator, pick, type Dictionary } from './i18n/translate';
import { isLocale } from './i18n/config';
import { MAX_LINE_QUANTITY, findOption, normalizeMonogram, unitPriceDzd, type CartLine } from './pricing';
import { WILAYAS } from './wilayas';

const selectionSchema = z.object({
  color: z.string().max(64),
  material: z.string().max(64),
  pearls: z.string().max(64),
  chain: z.string().max(64),
  monogram: z.string().max(3)
});

const lineSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('product'), productId: z.string().max(64), quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY) }),
  z.object({ type: z.literal('bespoke'), selection: selectionSchema, quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY) })
]);

const wilayaCodes = new Set([...WILAYAS.map(w => w.code), 'intl']);

export const checkoutSchema = z.object({
  locale: z.string(),
  email: z.email().max(254),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{8,20}$/),
  wilayaCode: z.string().refine(code => wilayaCodes.has(code)),
  address: z.string().trim().min(5).max(300),
  paymentMethod: z.enum(PAYMENT_METHODS),
  giftMessage: z.string().trim().max(500).optional(),
  lines: z.array(lineSchema).min(1).max(30),
  /** Total the customer saw; if prices changed meanwhile, they're asked to review. */
  expectedTotalDzd: z.number().int().nonnegative()
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type PlaceOrderResult =
  | { ok: true; orderId: string; totalDzd: number }
  | { ok: false; error: 'invalid' | 'unavailable' | 'priceChanged'; fields?: string[] };

function newOrderId() {
  return `ZPH-${randomInt(100000, 1000000)}`;
}

export async function placeOrder(raw: unknown, userId: string | null): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'invalid', fields: [...new Set(parsed.error.issues.map(issue => String(issue.path[0])))] };
  }
  const input = parsed.data;
  const locale = isLocale(input.locale) ? input.locale : 'fr';

  // Always price from the database, never from the browser
  const catalog = await loadCatalog();
  const frDictionary = (await import('@/messages/fr.json')).default as Dictionary;
  const tFr = createTranslator(frDictionary);
  const locFr = (value: Parameters<typeof pick>[0]) => pick(value, 'fr');

  const items: Array<Omit<typeof orderItems.$inferInsert, 'orderId'>> = [];
  let subtotal = 0;
  for (const line of input.lines as CartLine[]) {
    const unit = unitPriceDzd(catalog, line);
    if (unit === null) return { ok: false, error: 'unavailable' };
    subtotal += unit * line.quantity;

    const info = describeLine(line, catalog, locFr, tFr);
    let specs: OrderItemSpecs | null = null;
    if (line.type === 'bespoke') {
      const s = line.selection;
      const label = (kind: 'color' | 'material' | 'pearls' | 'chain') => locFr(findOption(catalog, kind, s[kind])?.name);
      specs = {
        colorId: s.color,
        materialId: s.material,
        pearlsId: s.pearls,
        chainId: s.chain,
        monogram: normalizeMonogram(s.monogram) || undefined,
        labels: { color: label('color'), material: label('material'), pearls: label('pearls'), chain: label('chain') }
      };
    }
    items.push({
      productId: line.type === 'product' ? line.productId : null,
      isCustom: line.type === 'bespoke',
      name: info.name,
      image: info.image,
      specs,
      unitPriceDzd: unit,
      quantity: line.quantity
    });
  }

  const shipping = 0; // Complimentary delivery, as advertised
  const total = subtotal + shipping;
  if (total !== input.expectedTotalDzd) return { ok: false, error: 'priceChanged' };

  // Retry on the (unlikely) id collision
  let orderId = newOrderId();
  for (let attempt = 0; attempt < 5; attempt++) {
    const clash = await db.query.orders.findFirst({ columns: { id: true }, where: eq(orders.id, orderId) });
    if (!clash) break;
    orderId = newOrderId();
  }

  await db.batch([
    db.insert(orders).values({
      id: orderId,
      userId,
      email: input.email.toLowerCase(),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      wilayaCode: input.wilayaCode,
      address: input.address,
      paymentMethod: input.paymentMethod,
      giftMessage: input.giftMessage || null,
      locale,
      subtotalDzd: subtotal,
      shippingDzd: shipping,
      totalDzd: total,
      codpilotStatus: codpilotEnabled() ? 'pending' : 'disabled'
    }),
    db.insert(orderItems).values(items.map(item => ({ ...item, orderId })))
  ]);

  // Sent after the response so the customer never waits on CodPilot
  const handoff = {
    reference: orderId,
    customer: { firstName: input.firstName, lastName: input.lastName, phone: input.phone, email: input.email },
    wilayaCode: input.wilayaCode,
    address: input.address,
    paymentMethod: input.paymentMethod,
    totalDzd: total,
    items: items.map(item => ({ name: item.name, quantity: item.quantity, unitPriceDzd: item.unitPriceDzd, specs: item.specs ?? null })),
    note: input.giftMessage || null
  };
  after(() => pushOrderToCodpilot(handoff));

  return { ok: true, orderId, totalDzd: total };
}
