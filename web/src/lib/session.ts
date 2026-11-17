import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

/**
 * Data Access Layer for the signed-in user. Reads request headers, so callers
 * must render inside a <Suspense> boundary (Cache Components rule).
 */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** For admin pages and admin Server Actions: re-checks the role on every call. */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') redirect('/admin/login');
  return user;
}
