import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders, type OrderItemSpecs } from '@/db/schema';

export type CodpilotOrder = {
  reference: string;
  customer: { firstName: string; lastName: string; phone: string; email: string };
  wilayaCode: string;
  address: string;
  paymentMethod: string;
  totalDzd: number;
  items: Array<{ name: string; quantity: number; unitPriceDzd: number; specs: OrderItemSpecs | null }>;
  note: string | null;
};

export const codpilotEnabled = () => Boolean(process.env.CODPILOT_API_URL && process.env.CODPILOT_API_KEY);

/**
 * Hands a new order to CodPilot for confirmation calls and delivery.
 *
 * TODO(codpilot): the request below is a placeholder. Replace the endpoint path,
 * payload fields and response parsing with CodPilot's documented order API
 * once the store's API credentials and docs are available. Until
 * CODPILOT_API_URL / CODPILOT_API_KEY are set, orders stay local with
 * codpilot_status = 'disabled' and can be pushed later from the admin.
 */
export async function pushOrderToCodpilot(order: CodpilotOrder): Promise<void> {
  if (!codpilotEnabled()) return;

  try {
    const response = await fetch(`${process.env.CODPILOT_API_URL}/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CODPILOT_API_KEY}` },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) throw new Error(`CodPilot responded ${response.status}: ${(await response.text()).slice(0, 300)}`);
    const body = (await response.json().catch(() => ({}))) as { id?: string | number; reference?: string };
    await db
      .update(orders)
      .set({ codpilotStatus: 'sent', codpilotRef: String(body.id ?? body.reference ?? ''), codpilotError: null })
      .where(eq(orders.id, order.reference));
  } catch (error) {
    // The customer's order is already saved; the admin can retry the hand-off
    await db
      .update(orders)
      .set({ codpilotStatus: 'failed', codpilotError: error instanceof Error ? error.message : String(error) })
      .where(eq(orders.id, order.reference));
  }
}
