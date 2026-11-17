import 'server-only';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

/**
 * Turso in production (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN),
 * a local SQLite file in development when no URL is set.
 */
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
export { schema };
