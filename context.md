# Aarisha project context

## Purpose

This repository contains the single-page marketing and product-catalogue website for **Aarisha**, a luxury women's accessories brand. The experience presents the brand story, category collections, featured items, social imagery, and contact details in a dark green, ivory, and gold visual system.

It is a **static front-end project**: there is no package manager, framework, build pipeline, server application, database, authentication, cart, checkout, or API integration. A browser loads `index.html`, which links directly to the stylesheet, JavaScript, and local image assets.

## Quick start

Open `index.html` in a modern browser, or serve the repository root with any static-file server. No installation, environment variables, or build step is required.

For example, from the repository root:

```powershell
npx serve .
```

Use a local server when testing so that asset paths and browser behavior match deployment more closely.

## Technology

| Area | Implementation |
| --- | --- |
| Markup | Semantic HTML5 in `index.html` |
| Styling | Plain CSS with custom properties, responsive media queries, animations, and inline SVG ornaments/icons |
| Interaction | Vanilla JavaScript in `script.js` |
| Assets | Local PNG/JPEG files referenced with relative paths |
| Dependencies | None |

## Repository structure

```text
The-aarisha/
├── index.html                 # Page structure, copy, inline SVG icons, and section anchors
├── styles.css                 # Brand tokens, layout, motion, components, and responsive rules
├── script.js                  # Client-side interactions and in-memory product/catalogue data
├── Logo.png                   # Aarisha logo used in the navigation and footer
├── Earrings/                  # Product JPEGs referenced by the collection and featured views
├── Rings/                     # Product JPEGs referenced by the collection and featured views
├── Bracelets/                 # Product JPEGs referenced by the collection and featured views
├── context.md                 # This project guide
└── .git/                      # Git metadata; do not edit manually
```

### Asset-status note

The Git index includes `Earrings/`, `Rings/`, and `Bracelets/`, but those image folders are currently absent from this working tree (shown by Git as deleted). The page and product data reference them extensively, so collection, featured, and Instagram images will not load until the tracked assets are restored or the references are replaced. `NeckPieces` intentionally has no product catalog yet; its category opens a “Coming Soon” state.

## Page composition

`index.html` contains the complete page in this order:

1. Fixed navigation with desktop links, an Instagram icon, and a mobile hamburger menu.
2. Full-height hero with a decorative inline SVG, brand message, and collection call to action.
3. Scrolling category marquee.
4. Brand-story/about section.
5. Four collection cards: Earrings, Rings, Bracelets, and Neck Pieces.
6. Full-screen collection modal, populated by JavaScript.
7. Horizontally scrollable featured-products strip, populated by JavaScript.
8. “Why Aarisha” value propositions.
9. Instagram-style image grid, populated by JavaScript.
10. Contact form and static contact details.
11. Footer navigation and social icons.

The primary in-page anchors are `#hero`, `#collections`, `#about`, and `#contact`.

## Where to make changes

| Change | Primary location | Notes |
| --- | --- | --- |
| Page copy, section order, navigation, contact details | `index.html` | Update associated links/IDs when moving sections. |
| Product names, prices, categories, and image paths | `script.js` → `categoryData` | This is the source of truth for modal catalogue items. |
| Featured item list | `script.js` → `productImages` | Each item currently shows a placeholder price (`₹ —`). |
| Instagram grid images | `script.js` → `instaImages` | This is a local showcase grid, not a live Instagram feed. |
| Brand colors, fonts, layout, animations, breakpoints | `styles.css` | Prefer the CSS custom properties at the top of the file for shared visual tokens. |
| Logo | `Logo.png` | Keep the filename or update the two `<img>` references in `index.html`. |
| Product photography | category asset folders | Preserve/update the relative paths stored in `script.js` and `index.html`. |

## JavaScript behavior

All JavaScript initializes inside a `DOMContentLoaded` listener. It provides:

- A smoothed custom mouse cursor, including hover styling for interactive controls; it disables itself on touch-capable devices.
- Sticky-navigation styling after scrolling 80px.
- A responsive hamburger menu that locks background scrolling while open.
- A scroll-based hero parallax transform.
- `IntersectionObserver`-powered reveal animations for elements using `.reveal`, `.reveal-left`, and `.reveal-right`.
- Dynamic rendering of featured-product cards and the Instagram image grid.
- Mouse drag-to-scroll support for the featured-products strip.
- A category modal generated from `categoryData`, closed via its back button or the Escape key.
- Smooth scrolling for same-page anchor links.

### Catalogue data model

`categoryData` is an object keyed by the collection card’s `data-category` value. Each product is represented as:

```js
{ src: 'relative/path/to-image.jpeg', name: 'Product name', price: '₹ 1,299' }
```

To add a category, add a matching collection card in `index.html`, a `categoryData` key in `script.js`, and a label in `displayNames`. Add the images to the repository and make all paths match exactly, including spaces and capitalization.

## Styling and responsive design

The UI is built around reusable CSS classes rather than a component framework. The major layout breakpoints are:

- **1200px and below:** reduced page and navigation padding.
- **768px and below:** mobile navigation, single-column collection/about/contact layouts, two-column modal grid, and smaller horizontal cards.
- **480px and below:** two-column Instagram grid and one-column modal grid.

The stylesheet uses `clamp()` for responsive typography, CSS variables for the palette and shared transitions, and inline SVG rather than an icon library.

## Current functional boundaries

- The contact form deliberately prevents the browser’s default submit action. It does not send messages or validate/persist contact data.
- Social/navigation links that use `href="#"` are placeholders and need real destination URLs.
- There is no product detail page, cart, payment flow, stock management, or backend.
- Prices and product metadata are hard-coded in the browser and should be treated as display content only.
- The site currently depends on local image files with long WhatsApp-derived filenames; renaming them requires updating every corresponding reference.

## Guidance for contributors and AI agents

- Keep the site dependency-free unless a requested feature justifies introducing tooling.
- Preserve the existing dark-green/ivory/gold visual language and responsive behavior when adding UI.
- Prefer editing product content in the JavaScript data arrays instead of duplicating product card HTML.
- Test both desktop and mobile layouts after styling or modal changes.
- Ensure image paths work from the repository root and use descriptive `alt` text for any new imagery.
- Do not edit `.git/`.
- Before committing, check `git status`: restoring the currently missing asset folders is important for a visually complete site.

## Deployment

Deploy the repository root to any static hosting provider. The host must preserve the relative directory structure and filenames used by `index.html` and `script.js`; otherwise images will return 404 errors. No build command is needed.
