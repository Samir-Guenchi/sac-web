# Zaphira — storefront, API and back office

Next.js 16 (App Router, Cache Components) · TypeScript · Turso (libSQL) + Drizzle ORM · Better Auth · Vercel.

| URL | What |
| --- | --- |
| `/fr`, `/en`, `/ar` | Storefront (home, bespoke customizer, collection). `/` redirects to the visitor's language. Arabic is right-to-left. |
| `/{lang}/panier` | Bag and 3-step checkout. Orders are saved and priced on the server. |
| `/{lang}/compte` | Customer accounts: sign-up with a 6-digit email code, sign-in, order history. |
| `/admin` | Back office: orders, products, bespoke options and prices, customers, journal & testimonials, settings. |

## Run it locally

Requires Node 20+.

```bash
cd web
npm install
cp .env.example .env.local      # then fill BETTER_AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
cp .env.local .env              # drizzle-kit and the seed script read .env
npm run db:setup                # creates web/local.db, applies migrations, loads the catalog + first admin
npm run dev                     # http://localhost:3000
```

Without Turso credentials the app uses the local SQLite file `web/local.db`. Without `RESEND_API_KEY`, emails (verification codes) are printed in the terminal running `npm run dev`. Without `BLOB_READ_WRITE_TOKEN`, admin image uploads go to `public/uploads/`.

Useful scripts: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run db:studio` (browse the database).

## Deploy (Vercel + Turso)

1. **Database** — create it with the [Turso CLI](https://docs.turso.tech/cli/introduction):
   ```bash
   turso db create zaphira
   turso db show zaphira --url          # → TURSO_DATABASE_URL
   turso db tokens create zaphira       # → TURSO_AUTH_TOKEN
   ```
2. **Schema and catalog** — from your machine, with those two values in `web/.env`:
   ```bash
   npm run db:setup     # migrations + catalog + admin account (safe to re-run)
   ```
   After any later schema change: `npm run db:generate`, commit `drizzle/`, then `npm run db:migrate` against Turso **before** deploying the code that uses it.
3. **Vercel project** — import the repository and set **Root Directory = `web`**. Add the environment variables from `.env.example`:
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
   - `BETTER_AUTH_SECRET` (32+ random characters), `BETTER_AUTH_URL` (your production URL, e.g. `https://zaphira.dz`)
   - `RESEND_API_KEY`, `EMAIL_FROM` (a sender on a domain verified in Resend)
   - `BLOB_READ_WRITE_TOKEN` (Vercel → Storage → Blob → connect to the project)
   - `CODPILOT_API_URL`, `CODPILOT_API_KEY` — leave empty until the CodPilot integration is finished (see below)
4. Deploy. The build prerenders the storefront from the database, so the Turso variables must be available at build time.

## How it fits together

```
src/
  app/[lang]/           storefront routes (layout = <html lang dir>, store provider, overlays)
  app/admin/            back office (own root layout; (dashboard)/ pages check the admin role)
  app/api/auth/         Better Auth endpoints (rate-limited, limits stored in the database)
  components/           storefront UI (ported from the original HTML/CSS) and admin UI
  db/                   Drizzle schema, seed script, seed data from the original site
  lib/                  catalog (cached), pricing, orders, auth, email, uploads, CodPilot, i18n
  messages/             UI translations: fr.json, en.json, ar.json (same keys)
  proxy.ts              adds the locale to storefront URLs (Next 16's name for middleware)
  styles/               the original design CSS + app.css, fonts.css, admin.css
drizzle/                generated SQL migrations (commit these)
```

- **Prices**: `lib/pricing.ts` is shared by the browser (display) and `lib/orders.ts` (checkout). The browser sends only product/option ids and quantities; the server recomputes every price from the database and rejects the order if the total changed.
- **Caching**: `getCatalog()`, `getJournal()`, `getTestimonials()` use `'use cache'` with tags. Admin actions call `updateTag()`, so edits show on the storefront immediately.
- **Translations**: interface text lives in `src/messages/*.json`; catalog text (products, options, journal, testimonials) is stored as `{ fr, en, ar }` and edited in the admin. An empty English/Arabic field falls back to French.
- **Orders → CodPilot**: `lib/codpilot.ts` runs after the response (`after()`), so customers never wait on it. Its request format is a **placeholder** until CodPilot's order API documentation and a store API key are available; until then orders are stored with CodPilot status *not configured*, and the admin can send them later from the order page.

## Before launch

- Real customer-service numbers: **Admin → Settings** (placeholders until then).
- Online payment (CIB/Edahabia, international cards) is not integrated with a gateway yet; those orders are recorded and the customer is told the team will contact them to pay.
- Finish the CodPilot integration once the API details are available.
- Arabic wilaya names come from an open dataset; check them against the Journal officiel.
