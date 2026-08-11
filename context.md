# Aarisha project context

> Single living reference for the project's current state. Maintained per RULES.md §8.1 —
> one shared file for every operating document (RULES.md, UISKILL.md). Change history
> lives in `Changelog.md`, never here.

## Purpose

**Aarisha** is a luxury women's accessories brand storefront. The repository contains:

- A **vanilla-JS marketing and catalogue storefront** (`frontend/index.html` + `frontend/styles.css` + `frontend/script.js`) presenting brand story, category collections, featured items, social imagery, and contact details in a **deep forest green + antique gold** visual system ("Heritage Gold & Forest" v3, see `DESIGN.md`) built around a gold **Rani ki Vav (stepwell) monument line-art backdrop** with a cursor line-glow.
- A **FastAPI catalogue API** (`backend/app/main.py`) backed by **Supabase (Postgres)**, serving products, category listings, WhatsApp order drafts, and admin CRUD.
- An **admin panel** (`frontend/admin.html`) for managing the product catalogue.
- A **cart drawer** on the storefront whose only ordering path is a WhatsApp deep link generated server-side.

The frontend is static, but product data, stock, and order-draft pricing all come from the API.

## Quick start

Full setup and deployment instructions live in `README.md`. Summary:

1. Create a Supabase project and run `supabase-schema.sql` in its SQL editor.
2. Copy `backend/.env.example` to `backend/.env` and set every value. Generate the admin hash with `python generate_password_hash.py` (run from `backend/`).
3. Run the API from `backend/` (`.env` is read relative to the working directory):

   ```powershell
   python -m uvicorn app.main:app --reload   # API at http://127.0.0.1:8000
   ```

4. Serve **`frontend/`** with any static server (e.g. `python -m http.server 5500` inside `frontend/`) — the storefront and admin page call `http://127.0.0.1:8000` when the hostname is `localhost`/`127.0.0.1`. Port 5500 matches the default CORS allowlist (`ALLOWED_ORIGINS`, defined in `main.py` `Settings`; `.env` can override it).

API docs are at `http://127.0.0.1:8000/docs` while the API runs. On Vercel the API is served same-domain under `/api` and the frontend auto-detects it (see "Architecture").

## Technology

| Area | Implementation |
| --- | --- |
| Frontend markup | Semantic HTML5 in `frontend/index.html`, `frontend/admin.html` |
| Styling | Plain CSS (`frontend/styles.css`) with custom properties, responsive media queries, animations, and inline SVG ornaments/icons; no framework |
| Frontend interaction | Vanilla JavaScript in `frontend/script.js` (storefront) and an inline script in `frontend/admin.html` |
| Fonts | Google Fonts: **Bodoni Moda** (display/headings) + **Manrope** (body/labels) |
| API | FastAPI (`backend/app/main.py`), served locally by uvicorn, on Vercel via `api/index.py` (mounted under `/api`) |
| Database | Supabase Postgres via the REST API (`/rest/v1/...`), using the server-side service-role key |
| Auth | JWT (PyJWT) admin bearer tokens, bcrypt password hashes; regular-user login was removed |
| External services | Supabase (data), Google Drive thumbnail URLs (product images), WhatsApp (`wa.me`) deep links |
| Dependencies | `backend/requirements.txt`: fastapi, uvicorn, httpx, PyJWT, bcrypt, pydantic-settings, email-validator |
| Operating docs | `RULES.md` (agent rules), `UISKILL.md` (UI/UX & motion manual), `DESIGN.md` (design system — v3), `Changelog.md` (change log) |

## Repository structure

```text
The-aarisha/
├── frontend/                # ALL static frontend files live here (v3 migration)
│   ├── index.html           # Storefront: nav, hero, collections, featured, about, why, insta, contact, footer, modal, cart drawer
│   ├── styles.css           # Design tokens, layout, motion, components, responsive rules
│   ├── script.js            # Storefront behavior: API fetch, reveal, modal, cart, WhatsApp order, backdrop glow
│   ├── admin.html           # Admin panel (login + product CRUD), links styles.css, inline styles/script
│   ├── Logo.png             # Brand logo (footer, favicon)
│   ├── placeholder.svg      # Fallback for missing/broken product images
│   └── assets/
│       └── stepwell-motif.svg  # Master Rani ki Vav monument line-art (symbols: full, slim, frieze, shaft)
├── context.md               # This guide
├── DESIGN.md                # Frontend design system reference (v3 "Heritage Gold & Forest")
├── RULES.md                 # Agent operating rules
├── UISKILL.md               # UI/UX & motion design operating manual
├── README.md                # Setup + deployment instructions
├── requirements.txt         # Root copy of backend requirements (used by Vercel)
├── supabase-schema.sql      # DB schema: products + cart_items tables, RLS policies
├── vercel.json              # Rewrites: /api/* → api/index.py; other root paths → /frontend/*
├── .gitignore
├── api/
│   └── index.py             # Vercel entrypoint: mounts the catalogue app under /api, serves frontend/ files
└── backend/
    ├── requirements.txt
    ├── .env.example         # Env var template (never commit a populated .env)
    ├── generate_password_hash.py  # Hidden-prompt bcrypt hash generator for ADMIN_PASSWORD_HASH
    └── app/
        ├── __init__.py
        └── main.py          # FastAPI app: settings, auth, product routes, WhatsApp link, dedupe
```

> v2 records `NEW_DESIGN.md` and `IMPLEMENTATION_PLAN.md` were deleted during the v3
> migration (2026-08-11); `DESIGN.md` now carries the v3 content.

### Asset-status note

The Git index previously tracked `Earrings/`, `Rings/`, and `Bracelets/` product-photo folders at the repo root, but they are **absent from the current working tree**. The storefront now renders catalogue products from the API, and `script.js` swaps any failed image to `placeholder.svg`; the Instagram grid is explicitly set to placeholders (`instaImages.fill('placeholder.svg')`). Restore the folders (or re-point product images in Supabase to hosted URLs) to show real photography.

## Feature list

### Implemented
- **v3 "Heritage Gold & Forest" design (Stitch migration, 2026-08-11)**: deep forest green (`#1B3428` canvas, `#00180e` deepest) + antique gold (`#C9A24B`) + warm ivory plaques; Bodoni Moda + Manrope; full-page restyle of nav, hero (Jharokha frame + brand headline), step-well divider, category grid, footer, modal, cart drawer, and admin panel.
- **Fixed heritage backdrop**: one full-screen gold Rani ki Vav **monument line-art** layer (new artwork in `frontend/assets/stepwell-motif.svg`) behind every section at low rest opacity with an edge vignette.
- **Cursor line-glow**: a drop-shadowed glow copy of the artwork is masked to the cursor via rAF-throttled `--glow-x/--glow-y` (~240px window) so the **lines themselves emit light** (not a radial light source); touch/keyboard devices get a 9s ambient pulse; `prefers-reduced-motion` renders a static raised motif instead.
- Nav with three-part layout (links left, brand center, icon actions right), sticky blur + gold hairline after 80px scroll; cart bag icon in the nav carries the live count badge.
- Hero: Jharokha arch frame + gem icon, "Anti Tarnish Fine Jewellery" eyebrow, "The Aarisha" display headline, italic tagline, gold-outline "Explore Collections" CTA.
- Scrolling "Step-Well" divider (three descending gold lines) as the section break.
- Four collection cards (Neck Pieces, Bracelets, Earrings, Rings) as ivory plaques with an offset gold frame and hover lift, opening the full-screen product modal.
- Catalogue loaded live from the API: featured strip (`GET /products`) and category modal (`GET /products/{category}`).
- Product modal: name, INR price (en-IN formatting), image, Add to Bag button, Out-of-Stock disable, staggered entrance, Escape/back-button close.
- Cart drawer: session-scoped (`sessionStorage`), quantity +/- controls, remove, live count badge, scrim overlay.
- **Order on WhatsApp**: POSTs cart items to `/orders/whatsapp-link`, opens the generated `wa.me` draft, clears the cart on success. No payment/checkout exists.
- Reveal-on-scroll animations (`.reveal`, `.reveal-left`, `.reveal-right`) via IntersectionObserver with sibling stagger.
- About / brand-story section, "Why Aarisha" value props, Instagram placeholder grid, contact section (visible; form remains a non-functional placeholder).
- Footer: three-column grid (brand + logo, links, contact with phone numbers), flare divider, social icons.
- Admin panel (`frontend/admin.html`): bearer-token login, product list, add/edit/delete, toggle in-stock, and a duplicate-removal tool.
- Server-side (unchanged by the v3 migration): bcrypt admin auth with per-IP login rate limiting, JWT expiry, duplicate-name+category guard, Google Drive URL → thumbnail normalization.
- Supabase schema with RLS (`products` readable publicly; writes go through the service-role key).

### In-progress / known gaps
- Contact form is visible but non-functional (prevents default submit; no backend). Social links are `href="#"` placeholders.
- Instagram grid renders placeholder tiles only (no live feed).
- Product photography folders missing from the working tree (see Asset-status note).
- The v3 migration moved the frontend into `frontend/`; the root-level `stitch_the_aarisha_heritage_ui.zip` (the design source export) is kept as an archive.

### Planned / not built
- No product detail page, payments, order recording, stock management UI beyond in-stock toggle, or customer accounts.
- Login limiter is in-memory (single-process only); needs a shared store for multi-worker production.

## Architecture

### Data flow
```
Browser (storefront / admin)
   │  fetch()  ──►  API base
   │                ├─ local:    http://127.0.0.1:8000
   │                └─ deployed: {origin}/api   (Vercel rewrite → api/index.py → mounted catalogue app)
   ▼
FastAPI app  ──►  Supabase REST (/rest/v1/products)
   │                (service-role key, server-side only)
   └─ POST /orders/whatsapp-link builds a wa.me deep link with server-side prices
```

- **API base detection** (identical logic in `script.js` and `admin.html`): if `location.hostname` is `127.0.0.1` or `localhost`, use `http://127.0.0.1:8000`; otherwise use `${location.origin}/api`.
- **Static serving on Vercel**: `vercel.json` rewrites `/api/(.*)` to the function and `/(.*)` to `/frontend/$1`, so all non-API root paths (including `/`, `/index.html`, `/admin.html`, `/styles.css`, `/script.js`, `/Logo.png`, `/placeholder.svg`) resolve into `frontend/`. `api/index.py` keeps FastAPI fallback routes that serve the same files from `frontend/`.
- **Secrets** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `BRAND_WHATSAPP_NUMBER`) live only in backend env vars / `.env` — never in browser code.
- **CORS**: allowlist from `ALLOWED_ORIGINS` (default `http://127.0.0.1:5500,http://localhost:5500`).
- **WhatsApp flow**: the order phone number never appears in page source; the browser only receives a `wa.me` deep link from the API. (Support phone numbers shown in the footer come from the Stitch design export and are not the WhatsApp ordering number.)

### API routes (FastAPI, `backend/app/main.py`)
- `GET /health`
- `POST /admin/login` — admin JWT from server-only credentials (rate-limited per IP)
- `GET /products` — all products, newest first
- `GET /products/{category}` — category = `rings | necklaces | bracelets | earrings`
- `POST /orders/whatsapp-link` — validates items against live stock/prices, returns a WhatsApp draft URL
- `POST /admin/products`, `PATCH /admin/products/{id}`, `DELETE /admin/products/{id}` — require admin bearer token
- `POST /admin/products/deduplicate` — deletes all but the newest product per name+category group

## Key conventions & patterns

- **Design tokens** live in `:root` in `frontend/styles.css` (colors, fonts, easing curves). Change brand colors/typography there, not per component. The v3 token set is `--forest-*` (deep/dark/darker/base/high/highest), `--gold*`, `--white`, `--off-white`, `--ink` — the old `--olive-*` names were replaced in the migration.
- **One ground rule**: every surface is a forest ground; gold is the single accent (borders, icons, linework); warm ivory plaques (`--off-white`) carry cards/info panels with `--ink`/`--gold-dark` text for contrast.
- **Motif sprite sync**: each page inlines a hidden sprite whose symbols mirror `frontend/assets/stepwell-motif.svg`; edit the master file and the inline copies together. Every motif layer is `aria-hidden` + `pointer-events: none` (decorative only).
- **Backdrop**: the storefront uses one fixed `.heritage-bg[data-glow]` layer (base + glow copies, `--glow-x/--glow-y` line-glow). The admin page uses a static `.stepwell-bg` layer with no interaction.
- **Frontend is dependency-free**: plain HTML/CSS/JS, inline SVG icons, Google Fonts import only.
- **Money formatting** uses `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`; prices from the API are `numeric(10,2)`.
- **Category keys**: storefront card `data-category` (`Earrings`, `Rings`, `Bracelets`, `NeckPieces`) maps via `apiCategories` to API slugs (`earrings`, `rings`, `bracelets`, `necklaces`) and via `displayNames` to display labels.
- **Cart persistence** is per-tab `sessionStorage` (`aarisha-cart-v1`); admin token in `sessionStorage` (`aarisha-admin-token`).
- **Image fallback**: a global capture-phase `error` listener swaps any broken `<img>` to `placeholder.svg`.
- **Image URLs**: `drive_image_url()` in the backend turns Google Drive share links into `https://drive.google.com/thumbnail?id=...&sz=w1000` URLs.
- **Admin token auth**: `HTTPBearer` dependency `current_admin` decodes the JWT and requires `is_admin: true`.
- **Safety guards**: `ProductPatch` forbids extra fields; `ProductInput` enforces price bounds and category enum; password min 8 chars; login rate limit 5/min/IP.
- **Comments**: non-obvious server logic (e.g. the process-local limiter) is marked with a `ponytail:` comment naming the ceiling and upgrade path.

## Where to make changes

| Change | Primary location | Notes |
| --- | --- | --- |
| Page copy, section order, contact details | `frontend/index.html` | Update associated links/IDs when moving sections. |
| Brand colors, fonts, layout, animations, breakpoints | `frontend/styles.css` → `:root` tokens + component rules | Prefer tokens over per-component hex values. |
| Storefront behavior (reveal, modal, cart, WhatsApp, glow) | `frontend/script.js` | All inside a `DOMContentLoaded` listener; the backdrop glow block is the only design-coupled logic. |
| Product catalogue (name, price, stock, image, category) | Supabase `products` table via `frontend/admin.html` | Product data is **not** hard-coded in the frontend anymore. |
| Admin panel layout/behavior | `frontend/admin.html` (inline `<style>` + `<script>`) | Reuses `styles.css` tokens and `.btn-send`. |
| Motif artwork | `frontend/assets/stepwell-motif.svg` + inline sprites | Keep symbols in sync across master + `index.html` + `admin.html`. |
| API behavior / validation / auth | `backend/app/main.py` | `.env` config in `backend/`; restart uvicorn (`--reload` handles it). |
| DB schema | `supabase-schema.sql` | Run changes in the Supabase SQL editor; keep RLS in mind. |
| Deployment routing | `vercel.json` + `api/index.py` | Vercel only; local dev uses uvicorn + a static server on `frontend/`. |

## JavaScript behavior (storefront)

All storefront JS initializes inside a `DOMContentLoaded` listener in `frontend/script.js`:

- Broken-image fallback to `placeholder.svg`.
- Sticky navbar styling after 80px of scroll.
- Heritage-backdrop line-glow: rAF-throttled `--glow-x/--glow-y` + `.glowing` on `.heritage-bg[data-glow]` (fine pointers), `.pulse` ambient fallback (touch/keyboard), reduced-motion gate.
- `IntersectionObserver` reveal animations with sibling stagger (`index * 150ms`).
- Featured strip fetched from `GET /products` (cards animate in with `80ms` stagger) with mouse drag-to-scroll.
- Instagram grid rendered as placeholder tiles (observed for reveals).
- Category modal populated from `GET /products/{category}`; empty categories show a "Coming Soon — Stay Tuned" message; Escape or back button closes; body scroll locks while open.
- Cart: `sessionStorage`-backed, add/increase/decrease/remove, badge count, total, drawer + scrim open/close.
- WhatsApp order: requires every cart item to carry a `serverProductId`; on success opens the draft and clears the cart.
- Smooth scrolling for same-page anchor links.

## UI/Motion

Active operating manual: `UISKILL.md` (codename `Weave`). Design-system source of truth: `DESIGN.md` (v3 "Heritage Gold & Forest"). Summary of the current UI/motion state:

- **Component foundation**: hand-rolled vanilla CSS/JS — no React, Tailwind, or component library. Tokens in `frontend/styles.css` `:root` are the shared system (see `DESIGN.md`).
- **v3 "Heritage Gold & Forest" redesign (applied 2026-08-11, migrated from the Stitch export `stitch_the_aarisha_heritage_ui.zip`)**: palette is **deep forest green + antique gold** — `--forest` `#1b3428` page ground, `--forest-deep` `#00180e` deepest, `--gold` `#c9a24b` accent, `--off-white` `#ece1ce` ivory plaques, `--white` `#cce9d8` text. Typography moved to **Bodoni Moda + Manrope**. Layout: fixed top nav (links / brand / icons), full-height hero with a Jharokha frame, step-well divider, 4-up category grid with offset gold frames, 3-column footer. A single fixed `.heritage-bg` replaces the v2 per-section motif layers.
- **Signature interaction — cursor line-glow**: the gold monument line-art is rendered twice — a dim base copy and a drop-shadowed glow copy masked to a ~240px window around the pointer (`--glow-x`/`--glow-y` updated rAF-throttled; opacity + mask-position only, compositor-friendly). Because the glow copy carries `drop-shadow`, **the lines themselves glow** rather than a radial light source. Touch/keyboard devices get a 9s ambient pulse (`.pulse`) instead; `prefers-reduced-motion: reduce` disables both and renders the motif at a static raised opacity.
- **Motion budget classification**: marketing/brand site — motion part of the brand experience, restrained. Motion inventory: scroll reveals (fade + translate, one-shot, sibling stagger 150ms), hero entrance stagger, category-card hover lift (`-8px`) + image scale (`1.05`) + gold frame reveal, product-card hover lift, button fill-gold + glow (`box-shadow: 0 0 16px rgba(235,193,102,.35)`) at `:hover`/`:focus-visible`, modal/drawer slide+fade, staggered card entrances (`80–150ms`), backdrop ambient pulse (9s).
- **Motion tokens in use**: `--transition-smooth` (default); `--transition-glow: cubic-bezier(0.4, 0, 0.2, 1)` (glow fade, 0.25s); `--transition-bounce` defined but unreferenced. Durations remain component-specific (0.25–0.8s) rather than a shared scale — candidate improvement per UISKILL.md §5.4.
- **Known deviations to track** (UISKILL.md §2): the backdrop ambient pulse is infinite and unpausable (decorative, disabled under reduced motion); cart drawer and modal manage body scroll lock but no focus trap/return; global `:focus-visible` gold outline exists but no per-component focus styles beyond button glows; `aria-live` regions absent; no skeletons (content pops in). The contact form is visible but a non-functional placeholder. Price text on ivory plaques renders `--gold-dark`/`--ink` instead of gold (gold-on-ivory ≈ 2.4:1, below WCAG AA) — deliberate deviation from the raw Stitch palette.

## Current functional boundaries

- Contact form/`#contact` section is visible (v3) but remains a placeholder: it deliberately prevents default submit and sends nothing.
- Social and navigation `href="#"` links are placeholders needing real URLs.
- Cart is per-tab (`sessionStorage`); a refresh in the same tab keeps it, a new tab does not.
- WhatsApp is the only ordering path; the API records no orders and takes no payment.
- Regular-user registration/login was removed from the backend; only admin auth remains.
- Prices shown to the customer are server-derived at the moment the WhatsApp link is requested.
- Google Drive thumbnails can be throttled by Drive; migrate to managed object storage if traffic grows.
- The frontend lives in `frontend/` — any new static asset must be placed there and referenced with root-relative paths from the page files.

## Guidance for contributors and AI agents

- **Read `RULES.md` first** — it governs agent behavior, planning/approval, security, and mandates updating `Context.md` + `Changelog.md` after every run that changes the project.
- Read `UISKILL.md` before touching UI/motion, and keep `DESIGN.md` in sync when tokens/components change.
- Preserve the forest/gold visual language, the one-ground rule, the ivory-plaque card treatment, and the heritage-backdrop glow system when adding UI (see `DESIGN.md` v3).
- Keep the frontend dependency-free unless a requested feature justifies tooling.
- Server-side: never expose the service-role key or admin credentials to the browser; validate input at the API boundary.
- Test both desktop and mobile layouts after styling/modal changes; sanity-check ~375px, ~768px, ~1024px, ~1440px.
- Check `git status` before committing; restoring the missing product-photo folders is important for a visually complete site.

## Deployment

- **Vercel**: the repo deploys the FastAPI function at `/api` plus the static frontend under `frontend/` (via `vercel.json` rewrites and `api/index.py`). Non-API root paths rewrite to `/frontend/$1`. Set the values from `backend/.env` as Vercel Production environment variables — never upload the `.env` file. The storefront and admin page automatically use `/api` when deployed.
- **Local**: uvicorn for the API + any static server for `frontend/` (see Quick start).
- No build step is needed for the frontend; the host must preserve relative paths (`Logo.png`, `placeholder.svg`) within `frontend/`.
