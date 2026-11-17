import { config } from 'dotenv';

// Same files as Next.js: .env.local (developer secrets) wins over .env
config({ path: ['.env.local', '.env'], quiet: true });
import { defineConfig } from 'drizzle-kit';

const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  // 'turso' speaks libSQL to both remote Turso databases and local files
  dialect: 'turso',
  dbCredentials: {
    url,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
});
