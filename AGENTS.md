# AGENTS.md — AI Coding Agent Architecture & Operations Manual

> **Project**: ZAPHIRA Maison de Haute Couture  
> **Type**: Luxury E-Commerce Web Experience  
> **Architecture**: Being rebuilt as a full-stack **Next.js** app in [`web/`](web/) (branch `feat/nextjs-rebuild`). The original static site (root `*.html`, `css/`, `js/`) stays live until `web/` reaches parity, then is retired.  
> **Stack (`web/`)**: Next.js 16 (App Router, Cache Components) · TypeScript · Turso/libSQL via Drizzle ORM · Better Auth · Vercel  
> **Legacy (root)**: Vanilla HTML5 + CSS3 + ES modules, no build step  
> **Brand Concept**: Original luxury brand fusing handcrafted customizable handbags, Algerian cultural heritage, Parisian editorial discipline, and modernist geometric artistry.

---

## 0. The Next.js App (`web/`) — read first

The owner decided (2026-11-17) to move to a framework with a real backend and an admin dashboard. **All new feature work goes into `web/`.** Only fix bugs in the legacy static site.

- **Read [`web/AGENTS.md`](web/AGENTS.md) and [`web/README.md`](web/README.md)** before changing `web/`. Next.js 16 differs from older versions: Middleware is `proxy.ts`, Cache Components require `use cache` / `<Suspense>` around request data, and the bundled docs in `web/node_modules/next/dist/docs/` are the reference.
- **Routing**: storefront under `app/[lang]/` (`fr` default, `en`, `ar` with RTL); back office under `app/admin/` (its own root layout, admin role checked in `requireAdmin()` on every page and Server Action).
- **Data**: `src/db/schema.ts` (Drizzle). Customer-facing text is stored as `{ en, fr, ar }` JSON. Change the schema → `npm run db:generate` → commit the SQL in `web/drizzle/`. Never hand-edit applied migrations.
- **Prices are server truth**: `src/lib/pricing.ts` is shared by browser and server, but `placeOrder()` re-prices every line from the database. Never trust a price from the client.
- **Cache**: catalog/content reads are `use cache` with tags in `src/lib/catalog.ts`; every admin write must `updateTag()` the tag it affects.
- **Translations**: UI strings in `src/messages/{fr,en,ar}.json` (same keys in all three). Catalog text is edited in the admin.
- **Integrations**: CodPilot hand-off is a stub in `src/lib/codpilot.ts` until the owner provides API docs and a key. Email uses Resend (console in dev). Images use Vercel Blob (`public/uploads` in dev).

---

## 1. Repository-Wide Principle: Comprehensive Context

**The entire repository is available and active project context.**

When executing any task, AI coding agents and human engineers must inspect **any file or directory across the repository that is relevant to the task**, including:

- **Markup & Structure**: `index.html`, `panier.html`, `compte.html`
- **Stylesheets**: All stylesheets in `css/` (`tokens.css`, `base.css`, `components.css`, `sections.css`, `customizer.css`, `panier.css`, `compte.css`, `responsive.css`)
- **JavaScript & Logic**: Application entry points, UI controllers, and reactive state in `js/`
- **Data Layers**: Product catalogs, options matrices, multilingual dictionaries, and editorial articles in `js/data/`
- **State Stores**: Cart and customizer state singletons in `js/state/`
- **Media & Visual Assets**: Canonical `assets/` directory organized by category (`branding/`, `products/`, `editorial/`, `video/`)
- **Version Control & Documentation**: `.git/`, `AGENTS.md`, `SKILL.md`, `github/github.md`

### Context Rules
1. **Never restrict analysis** to a predefined or arbitrary subset of files.
2. **Never modify unrelated files** during a task.
3. **Never inspect, expose, or commit secrets**, tokens, private keys, API credentials, or private configuration.
4. **Never assume a file is unused** simply because it is not explicitly imported via an ES6 `import` statement (it may be dynamically loaded, referenced via HTML, CSS url(), or `localStorage`).
5. **Always search before modifying**: Before deleting, renaming, or refactoring anything, use global grep to trace all references across HTML, CSS, JavaScript, and data structures.
6. **Inspect visual assets alongside code**: When working on UI, examine the actual images, SVGs, or videos being rendered to ensure layout, proportions, and styling align with the brand aesthetic.

---

## 2. Project Identity & Brand Philosophy

ZAPHIRA is an **independent, original luxury brand concept** centered around:
- **Handcrafted & Customizable Handbags**: Signature creations featuring cascading silk organza, natural graduated freshwater pearls, baroque pearl handles, and bespoke gold-foil monogramming.
- **Algerian Cultural Heritage**: Named in tribute to Princess Zaphira (the legendary 16th-century Queen of Algiers), celebrating Algerian sartorial history and Mediterranean craftsmanship.
- **Parisian Luxury Sensibilities**: Embracing classical French haute couture principles—spatial restraint, editorial typography, quiet confidence, material richness, and packaging theater.
- **Picasso-Inspired Artistic Expression**: Incorporating modernist geometric balance, asymmetric layouts, intentional contrast, and gallery-level compositional tension.
- **Digital Excellence**: Delivering an instantaneous, responsive, accessible, and multilingual shopping experience (English, French, and Arabic with native RTL).

> [!IMPORTANT]
> **Brand Independence**: ZAPHIRA is an original brand. While it studies the design discipline of historic French luxury houses (such as Hermès), **it is NOT an official Hermès product, partner, clone, or affiliate**. Never use trademarked Hermès logos, emblems, registered packaging trade dress, or copy their proprietary assets.

---

## 3. Existing Repository Architecture

```
sac-web/
├── AGENTS.md                    # Core AI agent & architectural instructions (this file)
├── SKILL.md                     # Practical development workflows & subsystem checklists
├── github/
│   └── github.md                # Standardized Git & GitHub branch/PR workflow
├── index.html                   # Storefront landing page & Bespoke Customizer Studio
├── panier.html                  # Dedicated 3-step checkout & shopping bag experience
├── compte.html                  # Client account onboarding & security checklist
├── css/
│   ├── tokens.css               # Design tokens (colors, typography, spacing, elevations, transitions)
│   ├── base.css                 # CSS reset, typographic base, core button & input primitives
│   ├── components.css           # Global UI components (modals, drawers, badges, toasts)
│   ├── sections.css             # Page section layouts (header, hero, promises, collection, footer)
│   ├── customizer.css           # 3-column bespoke custom bag studio layout & swatches
│   ├── panier.css               # Cart layout, stepper, Boîte Orange showcase, order summary
│   ├── compte.css               # Two-column auth flow & dynamic password strength checklist
│   └── responsive.css           # Tablet (1024px) & mobile (768px, 480px) breakpoints & drawer adaptations
├── js/
│   ├── main.js                  # Main entry point & event orchestrator for index.html
│   ├── panier.js                # Stepper controller, shipping calculation & order simulation
│   ├── compte.js                # Email verification simulation & password criteria evaluator
│   ├── state/
│   │   ├── cart-state.js        # Reactive CartStore (observer pattern + localStorage + multi-currency)
│   │   └── customizer-state.js  # Reactive CustomizerStore & real-time pricing calculation engine
│   ├── data/
│   │   ├── products.js          # Product catalog (Pearl Ivory, Noir Prestige, Blush Organza, Taupe Elegance)
│   │   ├── customizer-options.js# Swatches, noble materials, pearl grades, chains & cost modifiers
│   │   ├── i18n.js              # Trilingual translation dictionary (EN, FR, AR)
│   │   ├── wilayas.js           # All 69 Algerian wilayas, FR + AR names (used by the panier.html delivery form)
│   │   ├── testimonials.js      # Curated client editorial reviews & quotes
│   │   └── journal.js           # Atelier journal articles & styling stories
│   ├── utils/
│   │   ├── i18n.js              # t() lookup with EN fallback, applyLanguage() for [data-i18n], lang/dir
│   │   └── escape.js            # escapeHtml() for values interpolated into template strings
│   └── components/
│       ├── navbar.js            # Two-tier navigation, sticky scroll, search triggers, mobile drawer
│       ├── hero.js              # Background video controls (mute/unmute, play/pause)
│       ├── customizer.js        # Bespoke bag studio controller & live preview rendering
│       ├── collection.js        # Dynamic product grid renderer & quickview triggers
│       ├── quickview-modal.js   # Product modal with thumbnail gallery & attribute tabs
│       ├── cart-added-modal.js  # Confirmation modal shown after any add-to-bag; links to panier.html
│       ├── search-modal.js      # Live full-text search overlay over products & materials
│       ├── story-modal.js       # Heritage & craftsmanship modal narrative
│       └── toast.js             # Ephemeral floating notification system
└── assets/                      # Canonical visual assets: branding/, products/, editorial/, video/
```

### Detailed Subsystem Responsibilities

| File / Module | Architecture Responsibility |
| :--- | :--- |
| [`index.html`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/index.html) | Primary application entry point. Hosts the two-tier luxury header, hero video, brand promises, Bespoke Studio, collection grid, editorial stories, heritage showcase, client testimonials, atelier journal, newsletter, and all global modal/drawer wrappers. |
| [`panier.html`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/panier.html) | Standalone 3-step checkout page (`PANIER` → `LIVRAISON & PAIEMENT` → `CONFIRMATION`). Features the empty-cart view, filled-cart item list, handwritten gift card option, signature luxury box presentation card, and customer service contacts. |
| [`compte.html`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/compte.html) | Client onboarding experience. Step 1 (email entry) transitions smoothly to Step 2 (two-column credentials + personal profile form with live 5-point password strength checklist). |
| [`main.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/main.js) | Bootstraps all components on `index.html`, runs `IntersectionObserver` scroll reveals, initializes the testimonials slider, renders the journal feed, and applies the active language. |
| [`cart-state.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/state/cart-state.js) | Centralized singleton store (`cartStore`) using the Observer pattern (`subscribe` / `notify`). Persists to `localStorage` (`zaphira_cart_v1`, `zaphira_currency_v1`, `zaphira_lang_v1`). Manages multi-currency conversion rates (`DZD`, `EUR`, `USD`) and formatting. |
| [`customizer-state.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/state/customizer-state.js) | Singleton store (`customizerStore`) tracking selected customizer configuration (color, material, pearls, chain, monogram) and dynamically calculating base price + option modifiers. |
| [`navbar.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/navbar.js) | Manages sticky header transparency on scroll, bag count badge reactivity, search modal triggers, currency selection, language switcher, and mobile navigation drawer. |
| [`customizer.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/customizer.js) | Renders color swatches, material pills, pearl buttons, and chain selectors. Synchronizes real-time preview layer, updates monogram badge, and dispatches custom creations into `cartStore`. |
| [`cart-added-modal.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/cart-added-modal.js) | Listens to `cart:item-added` events and displays an elegant confirmation card with thumbnail and "Voir le Panier" action. |

---

## 4. Architecture Preservation Rules

Rules 1–6 apply to the **legacy static site** (root `*.html`, `css/`, `js/`) only. In `web/`, follow section 0 and `web/AGENTS.md`; add dependencies only when they earn their place and pin exact versions.

1. **Preserve Vanilla HTML/CSS/ES6 (legacy site)**: Do not add frameworks to the root static site; framework work belongs in `web/`.
2. **Zero Unnecessary Dependencies (legacy site)**: The root site has no package manager or bundler; keep it that way.
3. **Preserve ES Module Architecture (legacy site)**: Root JavaScript uses native ES modules loaded via `<script type="module">`.
4. **Preserve State & Storage Contracts**:
   - `zaphira_cart_v1` (array of cart item objects)
   - `zaphira_currency_v1` (`DZD`, `EUR`, `USD`)
   - `zaphira_lang_v1` (`en`, `fr`, `ar`)
   - `zaphira_user` (persisted client session object)
   Never break these storage contracts without an explicit migration path.
5. **Reuse Existing Components & Events**:
   - Do not create parallel cart stores or modal systems.
   - Use established CustomEvents (`search:open`, `quickview:open`, `story:open`, `cart:item-added`, `i18n:change`).
   - The only cart & checkout flow is add-to-bag → `cart-added-modal.js` → `panier.html`. Cart lines are addressed by `item.key` (see `lineKey()` in `cart-state.js`), never by array index.
   - User-visible strings live in `js/data/i18n.js` (EN/FR/AR). Use `data-i18n` / `data-i18n-placeholder` / `data-i18n-aria` in markup and `t()` in JS; pass interpolated values through `escapeHtml()`.
6. **Avoid Duplicate Business Logic**: All price calculations and currency conversions must pass through `cartStore` or `customizerStore`.
7. **No Unnecessary Rewrites**: Follow the principle:
   ```text
   UNDERSTAND EXISTING SYSTEM
           ↓
   REUSE EXISTING SYSTEM
           ↓
   EXTEND EXISTING SYSTEM
           ↓
   REFACTOR ONLY WHEN JUSTIFIED
   ```
   **Never** use: `DELETE EVERYTHING → REBUILD`.

---

## 5. AI Task Workflow

Every coding task must follow this disciplined pipeline:

```text
READ
 ↓
UNDERSTAND
 ↓
TRACE DEPENDENCIES
 ↓
IDENTIFY AFFECTED FILES
 ↓
PLAN
 ↓
CREATE / SWITCH BRANCH
 ↓
IMPLEMENT
 ↓
VERIFY (Local HTTP Server, Console, RTL, Mobile)
 ↓
REVIEW DIFF
 ↓
COMMIT (Conventional format)
 ↓
PUSH
 ↓
PULL REQUEST
 ↓
REVIEW / FIX
 ↓
MERGE
```

### Pre-Implementation Checklist
Before writing a single line of code, answer:
1. Which files are directly involved?
2. Which components or modules depend on them?
3. Which state or data structures are affected?
4. Are visual assets affected or required?
5. Are all three languages (`en`, `fr`, `ar`) updated in [`i18n.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/data/i18n.js)?
6. Does this change affect responsive layouts (1024px, 768px, 480px)?
7. Does this change break RTL presentation in Arabic?
8. Could any existing user flow regress?

---

## 6. Code Quality & Standards

### JavaScript Standards
- Write clean, expressive, modern ES6+ code.
- Keep functions small, focused, and pure where possible.
- Separate state mutations (`js/state/`), view rendering (`js/components/`), and event listeners.
- Avoid duplicate event bindings; use event delegation for dynamic lists.
- Avoid unnecessary global variables; encapsulate within modules or stores.
- Cleanly handle empty, loading, and error states.

### CSS & Styling Standards
- **Always use existing tokens** from [`tokens.css`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/css/tokens.css). Do not introduce hardcoded hex colors, random pixel margins, or ad-hoc border radii.
- Organize CSS logically: component class followed by child elements, modifiers (`.is-active`, `.is-open`, `.is-revealed`), and responsive overrides.
- Maintain low specificity: favor class selectors over nested tag selectors.
- Ensure all components support **RTL** (`html[dir="rtl"]`) where directional layout matters (margins, paddings, absolute offsets, arrow icons).

### HTML & Semantic Standards
- Maintain valid HTML5 semantic hierarchy: proper `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Use a single `<h1>` per page.
- Preserve accessibility: use descriptive `aria-label`, `aria-modal="true"`, `role="dialog"`, and `data-i18n` attributes.
- Ensure all interactive elements (`<button>`, `<a href>`, `<input>`) have keyboard focus visibility and touch targets of at least 44×44px.

---

## 7. Security Rules

1. **Zero Secret Leaks**: Never hardcode, inspect, or commit API keys, authentication tokens, passwords, private keys, or `.env` files.
2. **Authentication**:
   - `web/` uses real accounts (Better Auth: hashed passwords, 6-digit email verification, database-backed rate limits, admin role). Always re-check the session/role on the server (`getSessionUser()`, `requireAdmin()`); UI checks are not authorization.
   - The legacy `compte.html` / `compte.js` is still a **client-side demo** (localStorage, on-screen code). Never present it as secure.
   - Do not store sensitive personal data in `localStorage`; the `web/` cart stores product/option ids and quantities only.
3. **Safe DOM Manipulation**:
   - Avoid `innerHTML` with unsanitized user inputs. When user input is rendered (such as custom monograms or customer names), sanitize or use `textContent`.
4. **Third-Party Integrations**:
   - Do not inject external third-party scripts, CDNs, or trackers without explicit user approval.

---

## 8. Asset Management: Canonical `assets/` Structure

All visual and multimedia assets reside strictly in the canonical `assets/` directory:

```text
assets/
├── images/
│   ├── branding/    # Brand logo SVG, background poster, Boîte Orange packaging
│   ├── products/    # Handbags (Pearl Ivory, Noir Prestige, Blush, Taupe, Hero)
│   └── editorial/   # Craftsmanship macro, Algerian heritage, Atelier journal stories
└── video/           # Hero background video (video-back-ground.mp4)
```

### Strict Asset Rules:
1. **Single Source of Truth**: All assets belong in `assets/` and its subdirectories. Never re-introduce `assests/` or loose root media.
2. **Never create alternate spellings**: Do not create `assests/`, `asset/`, or `images/` at the root.
3. **Trace every reference**: Before moving or renaming any asset, grep the entire codebase (HTML, CSS, JS, JSON) and update all references simultaneously.
4. **Preserve image quality & aspect ratios**: When introducing or replacing imagery, preserve high resolution, appropriate aspect ratios (e.g. 3:4 for portrait product shots, 16:9 for hero video/heritage), and optimized file sizes.

---

## 9. Visual Identity & Design System: The ZAPHIRA Grammar

ZAPHIRA’s visual identity is forged from three distinct pillars:

```text
       French Luxury Discipline (70%)
                    +
      Modernist Geometric Artistry (30%)
                    +
         Algerian Cultural Heritage
                    =
                 ZAPHIRA
```

### 1. French Luxury Discipline (70%)
- **Spatial Restraint**: Generous whitespace, disciplined margins, and uncluttered compositions.
- **Editorial Typography**: Pairing classical serif headlines (`Cormorant Garamond`, `Playfair Display`) with clean, modern sans-serif functional UI text (`Plus Jakarta Sans`).
- **Material Richness**: Colors derived from natural haute couture materials—warm raw silk ivory, midnight satin charcoal, polished champagne gold hardware, and dusty organza rose.
- **Packaging Theater**: Elevating unboxing through dedicated presentation cards, the ivory Écrin Zaphira with its champagne ribbon and Z seal, and bespoke concierge touches (never Hermès packaging trade dress such as the orange box or Bolduc ribbon).

### 2. Modernist Geometric Artistry (Picasso Inspiration) (30%)
- **Expressive Geometry**: Subtle asymmetric card grids, diagonal dividing accents, and geometric framing.
- **Fragmented Forms & Cutaways**: Elegant cutouts, layered overlapping editorial panels, and artistic collage compositions.
- **Controlled Visual Tension**: Juxtaposing soft translucent organic materials (silk organza, baroque pearls) with sharp, disciplined typographic rules and architectural borders.
- **Art-Gallery Presentation**: Product display treated as gallery curation rather than standard catalog merchandising.
- *Constraint*: Never copy specific Picasso artworks. Translate the philosophical principles of modern abstraction into original graphic compositions.

### 3. Algerian Cultural Heritage
- Honoring Princess Zaphira through historical storytelling, Casbah architectural motifs, Mediterranean color warmth, and celebration of ancestral Algerian embroidery and pearl work.

### Visual Hierarchy Rule
```text
PRODUCT
  ↓
BRAND STORY
  ↓
CRAFTSMANSHIP
  ↓
INTERACTION
  ↓
SECONDARY DECORATION
```
*The product must always remain the visual hero. Decorative and artistic elements must elevate the product, never overwhelm it.*

---

## 10. Design Review Checklist

Before marking any visual task complete, evaluate:

- [ ] **Brand Authenticity**: Does this feel distinctly ZAPHIRA? Does it avoid generic luxury clichés or direct imitation of other brands?
- [ ] **Balance**: Is the ratio roughly 70% luxury restraint to 30% artistic experimentation?
- [ ] **Typography**: Are headings serif and body sans-serif? Is letter-spacing (`tracking-wide` / `tracking-wider`) properly applied to uppercase labels?
- [ ] **Color Fidelity**: Are all colors drawn from [`tokens.css`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/css/tokens.css)? Is contrast WCAG compliant?
- [ ] **Responsiveness**: Does the layout gracefully adapt across 1440px desktop, 1024px tablet, and 375px mobile?
- [ ] **Arabic RTL Support**: Does the layout mirror correctly when Arabic (`dir="rtl"`) is selected?
- [ ] **Asset Integrity**: Are image aspect ratios preserved without distortion or broken links?

---

## 11. Standard AI-Agent Final Report Format

Every completed coding task must conclude with the following standardized report:

```markdown
## Task
<Concise statement of the requested task>

## Implementation
<Clear summary of architectural and visual changes made>

## Files Changed
- [filename](file:///path/to/file): Description of changes
- [filename](file:///path/to/file): Description of changes

## Verification
- Local HTTP verification steps performed
- Responsive checks (Desktop, Tablet, Mobile)
- Arabic RTL checks
- State and persistence verification

## Git
Branch: <branch-name>
Commit: <commit-hash> <commit-message>
Push: <push-status>
PR: <pr-status-or-url>

## Notes
<Any trade-offs, limitations, or recommended follow-up improvements>
```
