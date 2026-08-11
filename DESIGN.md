# DESIGN.md — Aarisha Design System (v3 "Heritage Gold & Forest")

> Design-context source of truth (UISKILL.md §4/§14). Migrated 2026-08-11 from the
> Stitch-generated `stitch_the_aarisha_heritage_ui.zip` export into the project's
> vanilla-CSS token architecture. Supersedes the v2 "Stepwell" olive/white/gold
> system; `NEW_DESIGN.md` and `IMPLEMENTATION_PLAN.md` (v2 records) were deleted.

## Brand & style

The system embodies the regal essence of Indian heritage, drawing on the
architectural majesty of **Rani ki Vav**. The personality is **stately, timeless,
curated** — museum-quality minimalism fused with ornate line art. Expansive dark
(forest) space contrasted with fine metallic gold linework creates an immersive
"digital gallery" rather than a retail store. Key motifs: the **Jharokha**
(mirrored arch), the cusped **pavilion arch**, colonnade bands, and the descending
**step-well** levels.

## Colors (Forest & Gold)

Rooted in the "Forest & Gold" archetype. **Deep Forest Green `#1B3428`** is the
infinite canvas; **Antique Gold `#C9A24B`** is the architectural layer (borders,
icons, linework only); **Warm Ivory `#F1E6D3`** is the tactile plaque surface for
high-contrast informational cards.

| Token | Hex | Usage |
| --- | --- | --- |
| `--forest-deep` | `#00180e` | deepest ground — modal, cart drawer, footer |
| `--forest-dark` | `#0a2419` | surface-container — alt surfaces |
| `--forest-darker` | `#062015` | surface-container-low |
| `--forest` | `#1b3428` | **primary-container — main page ground** |
| `--forest-high` | `#162f23` | image wells |
| `--forest-highest` | `#213a2e` | hover wells |
| `--gold` | `#c9a24b` | **antique gold — borders, icons, linework** |
| `--gold-light` | `#ebc166` | hover/bright gold, headings |
| `--gold-pale` | `#f1e6d3` | warm ivory highlight |
| `--gold-dark` | `#8a6a1f` | deep gold text on ivory (WCAG AA) |
| `--white` | `#cce9d8` | on-surface primary text |
| `--off-white` | `#ece1ce` | card / plaque surface |
| `--ink` | `#1c352a` | dark text on ivory |

Gold linework uses `rgba(201,162,75,…)` hairlines; glows use `rgba(235,193,102,…)`.
The gold-on-ivory pair alone is ≈2.4:1, so **text on ivory uses `--ink` or
`--gold-dark`** (documented deviation).

## Typography (High-Low contrast)

- **Bodoni Moda** (`--font-heading`) — the brand voice: extreme stroke contrast
  mirrors diamond cutting and gold smithing. Display headlines, product titles.
- **Manrope** (`--font-body`) — functional counterpoint for body copy and UI
  controls. Labels are uppercase with generous letter-spacing (watch-dial feel).

Scale (implemented in `styles.css`): hero display `clamp(52px,9vw,88px)`, section
headings `clamp(34px,5vw,48px)`, modal titles `clamp(34px,5vw,54px)`, eyebrows
12px/0.22em caps, body 15–16px/1.6–1.9.

## Layout & spacing

Fixed-grid philosophy (12-column on desktop, 4 on mobile). Wide margins — 80px
desktop, 20–24px mobile — for breathing room. Spacing unit 8px; section padding
110px; container max 1240–1440px. Every element curated and purposeful.

## Elevation — ornate layering, not shadows

1. **Level 0** — Deep Forest Green base.
2. **Level 1 (Architectural)** — fine 1px Antique Gold lines framing sections
   "like windows in a palace".
3. **Level 2 (Tactile)** — Warm Ivory plaques/cards; subtle gold glow (4–8%
   opacity) instead of black shadows ("lit from within" museum quality).
4. **Level 3 (Interactive)** — hovered/active elements get the **Gold Stroke**
   double-line treatment.

## Shapes

Soft-squared: 4px radius (`0.125rem`) on plaques/controls — "cut like a
gemstone". The exception is the **Architectural Motif**: the Jharokha arch
(straight vertical edges + multi-cusped top) used for specialized frames (hero
mark, background line art) as custom vector paths, not radii.

## The Rani ki Vav motif + cursor line-glow

Master artwork: `frontend/assets/stepwell-motif.svg` (symbols `stepwell-motif`,
`stepwell-motif-slim`, `stepwell-frieze`, `stepwell-shaft`; page sprites in
`frontend/index.html` / `frontend/admin.html` mirror it and must stay in sync).
Pure monoline (stroke-width 1.5, `currentColor`), architecture only — no
figurative carving.

- **Backdrop**: one fixed full-screen `.heritage-bg` layer (forest ground, gold
  linework at rest opacity 0.07, edge vignette). Sections are transparent over it.
- **Cursor line-glow** (pointer devices): a masked copy of the artwork
  (`--glow-x/--glow-y`, rAF-throttled by `script.js`) brightens within ~240px of
  the pointer; a `drop-shadow` on the glow copy makes **the lines themselves emit
  light** — not a radial light source.
- **Ambient pulse** (touch/keyboard): 9s breathing between rest and rest+0.12 on
  the base copy; triggered for touch devices and on first Tab key.
- **Reduced motion**: both disabled; the motif renders at a static raised opacity.
- ≤768px the slim (no-lattice) symbol is used; the admin page uses a static,
  non-interactive `.stepwell-bg` layer.

## Components

- **Buttons** — primary: solid Antique Gold with dark green text (`--forest-deep`).
  Secondary/ghost: 1px gold border, fill-gold on hover (`:hover`/`:focus-visible`)
  with a soft gold glow (`box-shadow: 0 0 16–18px rgba(235,193,102,.35)`).
- **Cards & containers** — Warm Ivory plaques framed by a gold border sitting 8px
  outside the container ("framed artwork"); product image above, name + deep-gold
  price below; hover: `translateY(-6..8px)` + gold border + glow.
- **Inputs** — minimal: single Antique-Gold bottom border, label above in
  label-sm uppercase; focus animates the border to a subtle gold gradient.
- **Architectural dividers** — the "Step-Well" motif: a series of gold lines
  mimicking the descending levels (used after the hero); ornamental divider
  (line–diamond–line) for section breaks.
- **Icons** — line-art style, 1px Antique Gold, sharp geometric terminals.

## Motion inventory

Marketing/brand site — motion is part of the brand experience, restrained.

- Scroll reveals: fade + 40px translate, one-shot, sibling stagger 150ms.
- Hero entrance: reveal on load (observer), jharokha + headline + CTA stagger.
- Hover lifts: cards `-6..8px`, images scale `1.05`, buttons fill gold.
- Glow pulse: `--transition-glow` (0.25s, `cubic-bezier(0.4,0,0.2,1)`).
- Drawer/modal: slide + fade (0.35–0.5s, `--transition-smooth`).
- Ambient backdrop pulse: 9s ease-in-out, decorative only.
- `prefers-reduced-motion: reduce` collapses everything to instant states.

## Responsive

Breakpoints: 1200 / 768 / 600 / 360 (admin: 1250 / 600). At 768px the nav links
hide (brand + icons remain), collections drop to 2 columns, the slim motif is
used, and the footer/contact/about grids stack. At 600px paddings compress,
hero title shrinks, insta grid goes 2-up, buttons go full-width in forms. At
360px collection grids go single-column.

## Accessibility baseline

Global `:focus-visible` gold outline; interactive elements are keyboard-reachable;
all motif layers are `aria-hidden` + `pointer-events:none`; reduced-motion support
(see above). Known gaps (tracked in `context.md → UI/Motion`): no focus trap in
modal/drawer, no `aria-live` regions, cart drawer and collection modal manage body
scroll lock only, the contact form is a visible non-functional placeholder, and the
category cards are clickable divs (not native buttons).
