# Zaphira — storefront, API and back office

Next.js 16 (App Router, Cache Components) · TypeScript · Turso (libSQL) + Drizzle ORM · Better Auth · Vercel.

| URL | What |
| --- | --- |
| `/fr`, `/en`, `/ar` | Home: hero video, promise ribbon, shop by mood, selection, Picasso-blue universe band, step-by-step bespoke atelier, editorial, art of giving, testimonials, journal. `/` redirects to the visitor's language. Arabic is right-to-left. |
| `/{lang}/collections`, `/{lang}/collections/{id}` | All bags / one collection (Luxe, Mariages & Cérémonies, Printemps, Hiver), with sorting. |
| `/{lang}/produits/{id}` | Product page: gallery, details, delivery & care, related bags. |
| `/{lang}/recherche?q=` | Search results (matches every language). |
| `/{lang}/panier` | Bag and 3-step checkout. Orders are saved and priced on the server. |
| `/{lang}/compte` | Customer accounts: sign-up with a 6-digit email code, sign-in, order history. |
| `/{lang}/suivi` | Order tracking for guests (order number + checkout email). |
| `/{lang}/maison` | About Zaphira: story, atelier, savoir-faire steps, collections, commitments. |
| `/{lang}/univers` | Picasso & the Mediterranean: the brand universe, palette and line-art motifs. |
| `/{lang}/lookbook` | Lookbook 2026: one chapter per collection, built from the live catalogue. |
| `/{lang}/cadeaux` | The art of giving: the Picasso-blue packaging and gift ideas by budget. |
| `/{lang}/journal`, `/{lang}/journal/{id}` | Journal stories with photo galleries and the bags that appear in them. |
| `/{lang}/pages/{slug}` | Delivery & returns, FAQ, care, contact, terms, privacy, legal notice, accessibility. |
| `/admin` | Back office (see below). |

### What the admin can change

| Section | |
| --- | --- |
| Orders | List and filters, status, internal notes, send to CodPilot |
| Products | Add, edit, show/hide, delete (if never ordered); collection; photo gallery with upload, reordering and main photo; texts in FR/EN/AR |
| Collections | Names, descriptions, menu image, order, visibility |
| Bespoke options | Colours (each with a photo of a real bag), stitches, finishing touches, straps and their prices |
| Customers | Accounts, verification, newsletter consent, orders and spend |
| Site texts | Every interface label of the shop, in FR/EN/AR |
| Pages | Delivery, FAQ, legal… (simple formatting: `## ` heading, `- ` bullet) |
| Journal & testimonials | Stories (cover, full text, photo gallery), client quotes |
| Settings & media | WhatsApp/phone (enables the WhatsApp button), social links, hero video and images, bespoke base price, exchange rates, Google Analytics and Meta Pixel ids (loaded only after cookie consent) |

### Look and motion

Identity: Picasso blue, Mediterranean blue, sand, gold and powder pink (`src/styles/brand.css`), with single-line Picasso drawings (`src/components/art/LineArt.tsx`) that draw themselves on scroll. Every photo frame is the same rectangle as the product cards (`--photo-radius`). Motion lives in `animations.css` and `brand.css`: product photo morphs into the product page (React `ViewTransition`), staggered reveals, curtain reveals, scroll-driven titles/parallax where supported, header that hides while scrolling down. Everything is switched off for visitors who prefer reduced motion.

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

Without Turso credentials the app uses the local SQLite file `web/local.db`. Without `RESEND_API_KEY`, emails (verification codes) are printed in the terminal running `npm run dev`. Without `BLOB_READ_WRITE_TOKEN`, admin uploads (images up to 8 MB, videos up to 100 MB) go to `public/uploads/`; with it, the browser uploads straight to Vercel Blob.

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
- **Caching**: catalog, content, pages and text overrides use `'use cache'` with tags; admin actions call `updateTag()`. The home page updates on the next visit; pages with a slug (product, collection, info page) refresh in the background, so the first visit after an edit can still show the previous version and the next one is up to date.
- **Translations**: interface text lives in `src/messages/*.json`; catalog text (products, options, journal, testimonials) is stored as `{ fr, en, ar }` and edited in the admin. An empty English/Arabic field falls back to French.
- **Orders → CodPilot**: `lib/codpilot.ts` runs after the response (`after()`), so customers never wait on it. Its request format is a **placeholder** until CodPilot's order API documentation and a store API key are available; until then orders are stored with CodPilot status *not configured*, and the admin can send them later from the order page.

## Before launch

- **New bags are hidden drafts.** The 24 bags imported from the photo folders (`pic/`) are seeded with `active = false`. Several source photos carried other makers' branding (name plates such as MODERNO, BAGAMI, Michiku Store; watermarks such as MAROUA, Lyra, By Khuyên Kim) and were not imported; the imported ones may also come from other sellers. Replace each product's photos with your own (Admin → Products → photo gallery), check the proposed name and price, then click **Show**.
- Legal pages (terms, privacy, legal notice) are templates marked “[À compléter…]”: write the final text (ideally reviewed by a lawyer) in **Admin → Pages**.
- Real customer-service numbers and social links: **Admin → Settings** (placeholders until then).
- Online payment (CIB/Edahabia, international cards) is not integrated with a gateway yet; those orders are recorded and the customer is told the team will contact them to pay.
- Finish the CodPilot integration once the API details are available.
- Arabic wilaya names come from an open dataset; check them against the Journal officiel.
