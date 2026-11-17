'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { placeOrder, type PlaceOrderResult } from '@/lib/orders';

export async function submitOrder(input: unknown): Promise<PlaceOrderResult> {
  // Link the order to the account when the customer is signed in
  const session = await auth.api.getSession({ headers: await headers() });
  return placeOrder(input, session?.user.id ?? null);
}
