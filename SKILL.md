# SKILL.md — ZAPHIRA Practical Development & Engineering Manual

> **Scope**: Practical workflows, diagnostic procedures, and checklists for developing, debugging, extending, and maintaining the ZAPHIRA codebase.

---

## 1. Subsystem Flow & Tracing Methodology

When investigating an issue or developing a feature, **never edit only the file where the symptom appears**. Always trace the full vertical lifecycle through all six layers:

```text
       1. PAGE MARKUP (HTML Entry Point)
                   ↓
     2. UI CONTROLLER / COMPONENT (JS Module)
                   ↓
      3. REACTIVE STATE (CartStore / CustomizerStore)
                   ↓
       4. STATIC DATA CATALOG (Products / Options / i18n)
                   ↓
        5. DESIGN TOKENS & STYLES (CSS Tokens & Components)
                   ↓
         6. VISUAL ASSETS (Vectors / Images / Video)
```

### Diagnostic Tracing Example: "Add to Bag from Customizer"
1. **User Action**: Clicks "Add Bespoke Bag to Cart" on [`index.html#customizer-section`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/index.html).
2. **UI Component**: [`js/components/customizer.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/customizer.js) collects inputs, validates monogram letters.
3. **State Query**: Calls [`customizerStore.getSelectedDetails()`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/state/customizer-state.js) and `calculatePrice()`.
4. **Data Verification**: Options validated against [`js/data/customizer-options.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/data/customizer-options.js).
5. **State Mutation**: Dispatches `cartStore.addItem(customBagItem)` in [`js/state/cart-state.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/state/cart-state.js).
6. **Persistence**: `cartStore.saveCart()` synchronizes with `localStorage` (`zaphira_cart_v1`).
7. **Reactivity**: `cartStore.notify()` alerts:
   - Header badge in [`navbar.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/navbar.js)
   - Cart Drawer in [`cart-drawer.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/cart-drawer.js)
   - Dispatches `cart:item-added` event caught by [`cart-added-modal.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/cart-added-modal.js)
8. **Visual Feedback**: Ephemeral notification fired via [`js/components/toast.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/components/toast.js).

---

## 2. Engineering Workflows

### A. New Feature Workflow
```text
Requirement
    ↓
Impact Analysis (Which pages, stores, tokens, translations are touched?)
    ↓
Technical Plan (Break down into minimal, verifiable steps)
    ↓
Branch Creation (`feature/<feature-name>`)
    ↓
Implementation (Preserve tokens, zero ad-hoc styles, strict ES modules)
    ↓
Verification (Console logs, responsive viewports, language toggle, checkout flow)
    ↓
Diff Review (`git diff`, inspect every modified line)
    ↓
Commit (Conventional Commit format: `feat: ...`)
    ↓
Push to Remote (`git push -u origin <branch-name>`)
    ↓
Open Pull Request (Structured description with test proof)
```

### B. UI Component Development Workflow
```text
Understand ZAPHIRA Identity (70% Luxury Discipline + 30% Modernist Artistry)
    ↓
Inspect Existing Tokens (Colors, fonts, shadows in `css/tokens.css`)
    ↓
Inspect Existing Assets (Check canonical `assets/` subdirectories before adding new files)
    ↓
Inspect Sibling Components (Align markup, button classes, and spacing)
    ↓
Design & Draft Markup (Semantic HTML5 with proper aria labels and data-i18n tags)
    ↓
Style with Existing Tokens (Avoid random pixel values or one-off hex codes)
    ↓
Responsive Adaptation (Verify at 1440px, 1024px, 768px, 480px, 375px)
    ↓
Arabic RTL Adaptation (Verify directional flow under `html[dir="rtl"]`)
    ↓
Visual Review (Does this elevate the product as the hero?)
    ↓
Regression Check (Confirm existing animations, drawers, and forms still function)
```

### C. Bug Investigation & Fix Workflow
```text
Reproduce Issue Reliably (Identify exact trigger, page, and viewport)
    ↓
Trace to Root Cause (Check console errors, network requests, state mutation, CSS specificity)
    ↓
Confirm Affected Subsystem (Cart, Customizer, Navigation, Auth, i18n)
    ↓
Implement Minimal Fix (Avoid sweeping rewrites; fix the precise logic or style flaw)
    ↓
Regression Test (Verify fix does not break related views or currency/language modes)
    ↓
Commit (`fix: <concise-bug-description>`)
    ↓
Open PR for Review
```

---

## 3. Subsystem Engineering Checklists

### JavaScript Checklist
- [ ] Uses modern ES6+ syntax (`const`/`let`, arrow functions, destructuring, template literals).
- [ ] Module imports use clean relative paths with `.js` extension (e.g., `import { cartStore } from '../state/cart-state.js';`).
- [ ] No unhandled Promise rejections or uncaught exceptions in the console.
- [ ] Event listeners are attached once (use event delegation on parent containers where elements are dynamically rendered).
- [ ] Custom events use established namespaced names (`cart:open`, `checkout:open`, `search:open`, `quickview:open`, `story:open`, `cart:item-added`).
- [ ] State mutations trigger appropriate notifications via store observers (`notify()`).
- [ ] DOM queries are cached or scoped where appropriate.

### CSS & Design Token Checklist
- [ ] All colors use CSS variables defined in [`css/tokens.css`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/css/tokens.css) (`var(--color-ivory)`, `var(--color-charcoal)`, `var(--color-champagne)`, `var(--color-dusty-rose)`).
- [ ] Spacing uses the standardized scale (`var(--space-1)` to `var(--space-32)`).
- [ ] Typography uses font family tokens (`var(--font-serif)` for titles, `var(--font-sans)` for UI).
- [ ] Uppercase headlines and eyebrow tags use appropriate tracking (`var(--tracking-wide)`, `var(--tracking-wider)`).
- [ ] Hover and focus transitions use standard tokens (`var(--transition-base)` or `var(--transition-smooth)`).
- [ ] No excessive specificity chains (`!important` is forbidden unless overriding user-agent styles).

### HTML & Semantics Checklist
- [ ] Valid HTML5 structure using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- [ ] Only one `<h1>` per page.
- [ ] Interactive elements (`<button>`, `<a>`, `<input>`, `<select>`) have unique `id`s and descriptive `aria-label`s where visible text is absent.
- [ ] Form inputs have associated `<label>` elements or accessible names.
- [ ] Dialogs and drawers have `role="dialog"`, `aria-modal="true"`, and accessible close buttons.

### Accessibility (a11y) Checklist
- [ ] Focus outlines are visible for keyboard navigators (`:focus-visible`).
- [ ] Modals and drawers can be dismissed with the `Escape` key.
- [ ] Opening a modal or drawer traps or locks background scrolling (`document.body.style.overflow = 'hidden'`).
- [ ] Contrast ratios between text and background satisfy WCAG AA (minimum 4.5:1 for normal text, 3:1 for large display titles).
- [ ] Touch targets are at least 44×44px on mobile viewports.

### Responsive & Layout Checklist
- [ ] Mobile navigation drawer toggles smoothly and closes when any nav link is tapped.
- [ ] Grids gracefully degrade from multi-column desktop layouts to single-column mobile views.
- [ ] Images have `loading="lazy"` where appropriate and maintain consistent aspect ratios (`object-fit: cover`).
- [ ] Customizer 3-column layout reorders logically on mobile: Preview stage first, followed by controls, then price/CTA summary.
- [ ] Stepper in `panier.html` remains legible and uncluttered on narrow mobile screens.

### Multilingual (i18n) & RTL Checklist
- [ ] All user-facing strings are present in [`js/data/i18n.js`](file:///c:/Users/Samir%20Guenchi/Desktop/sac-web/js/data/i18n.js) for `en`, `fr`, and `ar`.
- [ ] Elements in HTML have corresponding `data-i18n="section.key"` or `data-i18n-placeholder="section.key"` attributes.
- [ ] Switching to Arabic toggles `dir="rtl"` on `<html>`.
- [ ] Under RTL, directional margins, paddings, and alignment mirror naturally (use logical properties where appropriate, or test explicit overrides).
- [ ] Currency select formats accurately in all three currencies:
  - DZD: `18,500 DZD`
  - EUR: `€125`
  - USD: `$135`

### State & Storage Checklist
- [ ] Cart updates persist across full page reloads via `localStorage`.
- [ ] Items with different bespoke options (e.g. different monograms or leather choices) are stored as distinct line items.
- [ ] Quantity adjustments never produce negative or zero quantities without explicit removal confirmation.
- [ ] User profile data stored in `localStorage.zaphira_user` is handled safely without leaking credentials.

### Asset Integrity Checklist
- [ ] Asset references use canonical `assets/` subdirectories (`branding/`, `products/`, `editorial/`, `video/`).
- [ ] Images load without 404 errors in the browser network tab.
- [ ] SVGs retain clean viewports and scale without clipping.
- [ ] Hero video has working fallback poster image (`assets/images/branding/background-image.png`).

---

## 4. Git & Workflow Checklist

- [ ] Started work on a dedicated branch created from updated `main`.
- [ ] Kept commit scope clean and atomic (no mixing unrelated refactors with feature work).
- [ ] Ran `git status` and `git diff` before staging.
- [ ] Staged specific files with `git add <files>` (no blind `git add .`).
- [ ] Wrote clear commit messages following Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).
- [ ] Pushed branch to remote and verified PR diff before merge.
