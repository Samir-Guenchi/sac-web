'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { orderItems, orders, type OrderStatus } from '@/db/schema';

export type TrackedOrder = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalDzd: number;
  items: Array<{ name: string; quantity: number }>;
};

const Input = z.object({
  orderId: z
    .string()
    .trim()
    .toUpperCase()
    .transform(v => (v.startsWith('#') ? v.slice(1) : v))
    .pipe(z.string().regex(/^ZPH-\d{6}$/)),
  email: z.email().max(254)
});

/**
 * Guest order lookup: both the order number and the email used at checkout
 * must match, so one piece of information alone reveals nothing.
 */
export async function trackOrder(input: { orderId: string; email: string }): Promise<TrackedOrder | null> {
  const parsed = Input.safeParse({ orderId: input.orderId, email: input.email.trim().toLowerCase() });
  if (!parsed.success) return null;

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, parsed.data.orderId), eq(orders.email, parsed.data.email)),
    columns: { id: true, status: true, createdAt: true, totalDzd: true }
  });
  if (!order) return null;

  const items = await db.select({ name: orderItems.name, quantity: orderItems.quantity }).from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, createdAt: order.createdAt.toISOString(), items };
}
