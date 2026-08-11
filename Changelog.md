# Changelog

> Running log of every change made to the project, in reverse-chronological order, one
> timestamped heading per work session/run. Maintained per RULES.md §8.1 — every
> operating document (RULES.md, UISKILL.md) writes into this single shared file under
> category-tagged subsections.

## [2026-08-11 23:05]

### [Category: UI] — v3 "Heritage Gold & Forest" migration (Stitch design) + frontend/ restructure
What changed: Replaced the v2 olive/white/gold "Stepwell" design with the Stitch-generated "Heritage Gold & Forest" design (deep forest green + antique gold Rani ki Vav monument backdrop), and moved all static frontend files into a new `frontend/` folder.
- **Restructure**: created `frontend/` and moved `index.html`, `styles.css`, `script.js`, `admin.html`, `Logo.png`, `placeholder.svg`, and `assets/stepwell-motif.svg` into it; all JS hooks, IDs, classes, and data-* attributes preserved.
- `frontend/index.html`: new layout per the Stitch export — fixed top nav (links / brand / icons with the cart bag as `#cartToggle` + `#cartCount` badge), full-height hero with Jharokha arch frame + gem icon, "Anti Tarnish Fine Jewellery" eyebrow, "The Aarisha" display headline, step-well divider, "Curated Collections" 4-up ivory-plaque grid with offset gold frames (category order: Neck Pieces, Bracelets, Earrings, Rings), featured strip, about, why, instagram, contact, 3-column footer (brand + logo, links, contact with phones), plus the unchanged collection modal, cart drawer, and scrim. Marquee section replaced by the step-well divider.
- `frontend/styles.css`: new `:root` token set — `--forest-*` (deep `#00180e`, dark `#0a2419`, darker `#062015`, base `#1b3428`, high `#162f23`, highest `#213a2e`), `--gold #c9a24b`, `--gold-light #ebc166`, `--gold-pale #f1e6d3`, `--gold-dark #8a6a1f`, `--white #cce9d8`, `--off-white #ece1ce`, `--ink #1c352a` — replacing the old `--olive-*` names (v2 `--olive-*` tokens removed). Fonts switched to Bodoni Moda + Manrope. New `.heritage-bg` fixed backdrop system (base + drop-shadowed `.motif-glow` masked to the cursor — lines glow, not a radial light source), static `.stepwell-bg` variant for admin, gold hairline inputs, global `:focus-visible`, responsive breakpoints (1200/768/600/360) and a `prefers-reduced-motion` block.
- `frontend/script.js`: ONLY the motif/glow block changed — `.heritage-bg[data-glow]` replaces the v2 `.stepwell-bg[data-glow]` per-section layers; the rAF-throttled `--glow-x/--glow-y` approach is kept with document-level listeners (the layer is fixed full-screen); frieze-tiling code removed; ambient `.pulse` + reduced-motion gates preserved. All other logic (API fetch, cart, WhatsApp, modal, reveals, image fallback) is byte-identical.
- `frontend/admin.html`: inline styles restyled to the forest/gold tokens (page `--forest-deep`, dialog `--forest`, gold hairlines `rgba(201,162,75,…)`); inline sprite updated to the new monument artwork; the admin inline script is byte-identical.
- `frontend/assets/stepwell-motif.svg`: new gold Rani ki Vav monument line-art (grand pavilion with festooned arches, side jharokha arches, colonnade, niche rows, descending steps, well shaft) — same symbol IDs (`stepwell-motif`, `stepwell-motif-slim`, `stepwell-frieze`, `stepwell-shaft`) kept in sync with the page sprites.
- `api/index.py`: static fallback routes now serve from `frontend/` (FRONTEND_DIR). `vercel.json`: the catch-all rewrite is now `/(.*)` → `/frontend/$1` so all non-API root paths resolve into the new folder.
- `DESIGN.md`: rewritten as the v3 "Heritage Gold & Forest" design-system spec (from the Stitch zip's DESIGN.md, adapted to the vanilla-CSS tokens). Deleted `NEW_DESIGN.md` and `IMPLEMENTATION_PLAN.md` (v2 records) per owner decision.
Why: Owner request — adopt the Stitch-generated design while preserving 100% of the existing functionality/logic/backend integration; cosmetic + structural migration only (no backend/API/schema changes). DESIGN.md handling (rewrite) and v2-doc deletion were confirmed by the owner via ask_user.

### [Category: Dev] — Update context.md for the v3 state; deployment routing for frontend/
What changed: `context.md` fully updated — new repository tree (frontend/ folder, deleted v2 docs), v3 design/feature/conventions sections (forest/gold tokens, heritage-backdrop glow, one-ground rule), updated UI/Motion summary, local-serve instructions (serve `frontend/`), and deployment notes (Vercel rewrites to `/frontend/$1`, api/index.py fallback paths). `api/index.py` and `vercel.json` updated so static files are served from `frontend/` (see UI entry).
Why: RULES.md §8.1 requires Context.md and Changelog.md to reflect every project change; documentation must describe the current implementation, not stale paths.

## [2026-08-11 19:12]

### [Category: UI] — Implement the v2 "Stepwell" redesign (olive/gold/white + Rani ki Vav motif)
What changed: Implemented the approved v2 design (IMPLEMENTATION_PLAN.md) across the frontend.
- `styles.css`: palette migrated to `--olive-*` / `--gold #C9A227` / `--white` / `--off-white` / `--olive-ink*`; new `--transition-glow` token; `.stepwell-bg` system (rest-opacity layers, two-ground color logic, masked `.motif-glow` keyed to `--glow-x/--glow-y`, ambient `.pulse`, frieze strips with ≤360px shaft swap, slim-variant swap ≤768px); button/card/FAB glow pulse on `:hover`/`:focus-visible`; new global `prefers-reduced-motion` block (instant transitions, static raised motif, no glow/pulse); hero-parallax + ornament styles removed; contact styled.
- `index.html`: hidden motif sprite added; `.stepwell-bg` layer added to every section (navbar frieze, hero, marquee frieze, about on-white, collections, modal — kept fixed behind the scrolling grid, featured on-white, why, instagram on-white, contact, footer frieze, cart-drawer vertical strip); v1 hero/about mandala ornaments removed; contact section un-hidden; inline icon hex (`#C9A96E`) replaced with `currentColor` (parent tints gold).
- `script.js`: rAF-throttled cursor-glow tracker (`hover:hover and pointer:fine` gate) setting `--glow-x/--glow-y` + `.glowing`; ambient `.pulse` for touch/keyboard (Tab-key detection); reduced-motion gate; static frieze tiling (9 `<use>` tiles per strip); hero parallax handler removed.
- `admin.html`: inline styles swapped to olive/white tokens (gold hairlines `rgba(201,162,39,…)`); stepwell layer at 0.04 opacity; sprite added; behavior unchanged.
- New `assets/stepwell-motif.svg` — master monoline artwork with `#stepwell-motif`, `#stepwell-motif-slim`, `#stepwell-frieze`, `#stepwell-shaft` symbols (architecture only, no figurative carving).
Why: Approved redesign per NEW_DESIGN.md — the brand shifts to olive/gold/white unified by the stepwell motif with a cursor-reactive glow as the signature interaction; `prefers-reduced-motion` becomes a hard requirement (closes the v1 gap); contact shown and hero parallax removed per owner decisions.

### [Category: Dev] — Promote DESIGN.md to v2, update context.md
What changed: `DESIGN.md` now carries the v2 "Stepwell" content (promoted from `NEW_DESIGN.md`, which remains as the versioned spec snapshot). `context.md` updated: repo tree (assets/, DESIGN.md/NEW_DESIGN.md/IMPLEMENTATION_PLAN.md descriptions), feature list (motif system, glow/pulse, reduced-motion, visible contact), key conventions (two-ground rule, sprite-sync rule), rewritten `## UI/Motion` section, functional boundaries, and guidance. Also created `IMPLEMENTATION_PLAN.md` earlier this session (19:02 entry).
Why: RULES.md §8.1 — Context.md and Changelog.md must reflect every project change; UISKILL.md §12 keeps DESIGN.md as the single design source of truth.
Bug fixed (if applicable): v1 gap — no `prefers-reduced-motion` handling anywhere on the site; now implemented globally.
Root cause (if applicable): v1 shipped without a reduced-motion strategy; v2 mandates it because the glow system adds continuously-animated content.
Known deviation: modal-product-card price renders `--olive-ink` on the light info panel instead of gold for WCAG contrast (gold-on-white ≈ 2.4:1) — tracked in `context.md → UI/Motion`.

## [2026-08-11 19:02]

### [Category: Dev] — Save the Stepwell v2 UI implementation plan; no code changed
What changed: Created `IMPLEMENTATION_PLAN.md` at the project root — the full
implementation plan for the UI v2 "Stepwell" redesign specified in `NEW_DESIGN.md`
(olive/gold/white palette, Rani ki Vav motif system with cursor glow, admin restyle,
`prefers-reduced-motion` support). No source code was written, edited, or deleted:
implementation is gated on explicit owner approval per RULES.md §2.2. Owner decisions
already captured in the plan: contact section becomes visible, hero parallax removed,
`DESIGN.md` promoted to the v2 content after implementation. Also added `NEW_DESIGN.md`
and `IMPLEMENTATION_PLAN.md` to the repository tree in `context.md`.
Why: RULES.md §2 requires an approved plan before any code change; RULES.md §8.1
requires Context.md and Changelog.md updates after any run that changes the project
(this run's change is the plan file and the context tree entry).

## [2026-08-11 18:21]

### [Category: Dev] — Rewrite context.md for the full-stack project state
What changed: Replaced the entire `context.md`. The old version described a static-only
project (no backend, `categoryData`/`productImages` in `script.js`, custom cursor,
hamburger menu) that no longer matches the repository. The new version documents the
current full-stack reality: FastAPI catalogue API (`backend/app/main.py`) with Supabase,
the storefront + cart + WhatsApp order flow, the admin panel, Vercel deployment
(`api/index.py` + `vercel.json`), the Supabase schema, `RULES.md`/`UISKILL.md` operating
documents, current folder/file structure, implemented/in-progress/planned feature list,
architecture & data flow, API routes, key conventions, a "Where to make changes" table,
the storefront JavaScript behavior, a dedicated `## UI/Motion` subsection, current
functional boundaries, contributor guidance, and deployment notes.
Why: RULES.md §8.1 requires a single living context document that reflects the project's
current state so new developers and agents can get oriented without asking; the previous
content was stale and misleading (referenced data structures and UI that were removed
when the API, cart, and admin panel were added).

### [Category: UI] — Create DESIGN.md design-system reference
What changed: Created `DESIGN.md` at the project root. It documents the current frontend
design system derived from `styles.css`, `index.html`, `script.js`, and `admin.html`:
design philosophy and motion budget; all `:root` design tokens (dark-green/ivory/gold
palette with hex values and usage, Cormorant Garamond + Jost typography with the full
type scale, spacing, elevation/border conventions); every component (nav, buttons, hero,
marquee, ornamental divider, about, collection cards, modal, featured strip, why,
instagram, contact, footer, cart drawer + FAB, admin panel); inline-SVG iconography
conventions; responsive breakpoints (1200/768/600/360 + admin 1250/600); states and
interactions; the current accessibility baseline and gaps; the motion inventory with
easing/duration tokens; and a Definition-of-Done checklist for new UI work.
Why: UISKILL.md §4/§14 designates `DESIGN.md` as the design-context source of truth for
the project — the shared reference that prevents agents from fabricating a parallel
design system and enables design-system-drift checks. It also gives the `## UI/Motion`
subsection of `context.md` a full companion document to point at.
