'use server';

import { z } from 'zod';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { isLocale } from '@/lib/i18n/config';

const NewsletterInput = z.object({
  email: z.email().max(254),
  locale: z.string()
});

export async function subscribeToNewsletter(input: { email: string; locale: string }): Promise<{ ok: boolean }> {
  const parsed = NewsletterInput.safeParse({ ...input, email: input.email.trim().toLowerCase() });
  if (!parsed.success) return { ok: false };
  await db
    .insert(newsletterSubscribers)
    .values({ email: parsed.data.email, locale: isLocale(parsed.data.locale) ? parsed.data.locale : 'fr' })
    .onConflictDoNothing();
  return { ok: true };
}
