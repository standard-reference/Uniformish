# Uniform-ish — project context

This file is project-wide context, not a task spec. It exists so any session has
the full picture without re-explaining it.

> **History:** this repo previously held brand/supplier research and an Apliiq
> MCP server. Both were removed in the reset that introduced this storefront —
> the repo is now the storefront and nothing else. The Apliiq work is still in
> git history if it is ever wanted back.

---

## What this is

A streetwear brand built around a colour system, not just a palette, sold from a
custom Shopify Hydrogen storefront. Australian, priced in AUD, made to order.

**Positioning:** accessible premium. Above Uniqlo U's value tier, below Fear of
God Essentials. The differentiator is the systemised, engineered identity — not
the earth-tone aesthetic, which is a crowded lane on its own.

**Brand name:** "Uniform-ish". Earlier working names were "Unit" and "Tones";
both had existing apparel trademark conflicts. Uniform-ish has **not** been
cleared in Class 25 — do that before anything public.

## The core rule

**One hue, head to toe. Not one hex.**

Stay inside a single hue family across a whole fit and it reads as monotone,
whether every piece matches exactly or steps lighter toward the feet. The rule
is the product; the garments are how you apply it.

Two consequences that show up all over the site:

1. **No orphan pieces.** Every order is at least two pieces in one hue — a duo
   (two separately-sold pieces) or a kit (three pieces, one bundled product).
   Enforced at the register and nowhere else. `MIN_PIECES_PER_ORDER` in
   `app/data/range.ts` is the single source of that number; the cart gates
   checkout on it.
2. **Patterns work the opposite way.** One printed piece against plain ones,
   drawn from the same six hues. Not a separate line.

## The six hues

Canonical values live in **`app/data/hues.ts`** — that module is the source of
truth, not this table. Reproduced here for orientation only:

| Code | Name  | Hex       |
|------|-------|-----------|
| J-01 | Jet   | `#1C1B19` |
| B-02 | Bone  | `#E8E2D4` |
| M-03 | Moss  | `#4A4F3C` |
| C-04 | Clay  | `#A9634B` |
| S-05 | Slate | `#5A6470` |
| U-06 | Umber | `#5C4636` |

Design logic: all six sit on the same narrow band of lightness and chroma, held
inside set OKLCh tolerances. That band is *why* any two read as chosen. **If a
hue ever needs substituting, match it to the band — not to a hue on a colour
wheel.** Each hue also carries `dark` / `light` / `lighter` steps, used for the
stepped-look blocks.

Colours are matched to Shopify option values by name, case-insensitively, and
under either spelling of Colour/Color (`isHueOption`). An unmapped colour falls
back to the Storefront swatch rather than breaking the page.

## The range

`app/data/range.ts` holds the roadmap. Only the crewneck is confirmed; the rest
carry indicative prices and render with a `~`.

| Piece | Fit | Price (AUD) | Status |
|---|---|---|---|
| Oversized Crewneck | Oversized | $89 | confirmed, launch piece |
| Boxy Tee | Relaxed | ~$59 | price TBC |
| Tapered Jogger | Lean | ~$99 | price TBC |
| Mid Short | Lean | ~$79 | price TBC |

Slip-ons and socks come later. The crewneck is the one deliberately oversized
cut; everything else sits lean.

**Fabric:** sublimated poly knit. Sublimation puts dye inside the fibre, which
is what lets six hues land on exact specified values instead of drifting between
batches. A cotton line follows once the same tolerances hold on it.

**Fulfilment:** made to order through a print partner — 2–5 business days to
make, 3–7 in transit. No warehouse, no dead stock.

**Returns:** kits return whole within 30 days. Duos are final sale (two
separately-sold pieces, nothing to partially unwind). Faulty or misprinted
pieces are replaced or refunded in full, always. *There is no free size-remake
policy* — it was deliberately removed; don't reintroduce it.

**No reviews anywhere on the site.** Also deliberate. No review module, no
star ratings, no "be the first to review" placeholder.

---

# Working in this repo

## What it is

A Shopify Hydrogen storefront: **Hydrogen 2026.4, React Router 7, Vite, Oxygen.**
Shopify is the backend of record — checkout, payments, tax, order routing.
This app is the browsing UI in front of it, talking to the **Storefront API** and
handing off to Shopify's hosted checkout.

## Layout

```
app/
  data/          brand content — the hue system and the range. Not commerce data.
    hues.ts      the six hues, their steps, and option-name matching
    range.ts     pieces, size chart, PDP tabs, FAQs, shipping windows, order terms
  components/    Header, Footer, PageLayout, Aside (overlays), cart, ProductForm…
  lib/           Storefront queries, companion-variant matching, session, context
  routes/        file-based routes (React Router flat routes)
  styles/        reset.css + app.css — tokens first, then blocks
  assets/fonts/  self-hosted JetBrains Mono (latin + latin-ext subsets)
```

**The `app/data` vs Storefront split is deliberate.** Shopify owns products,
variants, prices and the cart. This repo owns the hue system, the size chart and
the standing editorial copy — things that outlive any one product listing and get
edited as copy, not as merchandising. Don't move commerce data into `app/data`,
and don't put brand copy behind a metafield just because it can be.

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/products/:handle` | PDP — hue + size selection, duo/kit pairing |
| `/shop` | Shop — hue grid, kits & duos, the range table |
| `/about` | About |
| `/size-and-fit` | Size & fit guide |
| `/shipping-and-faq` | Shipping, returns & FAQ |
| `/cart` | Cart as a page (the drawer is the primary surface) |

Plus the scaffold's `/collections/*`, `/search`, `/policies/*`, `/account/*`,
`robots.txt` and `sitemap.xml`.

Header nav is **fixed in `app/components/Header.tsx`**, not driven by a Shopify
menu — these destinations are the brand's structure, and shouldn't change
because someone reorders a menu in the admin. Note the nav has **no crewneck
entry**; the product is reached from Shop, the hue grid and the hero.

## Products and the pairing UI

The PDP resolves companion pieces from the Storefront API by handle
(`COMPANION_KEYS` → `Piece.handle`). A piece that isn't listed yet simply
doesn't come back, and the pairing panel hides itself — the PDP falls back to a
plain add-to-cart, and the two-piece rule is still enforced at the cart. Nothing
in the UI invents a variant that doesn't exist: if a companion isn't made in the
selected hue, the option is disabled and says so.

`handleQuery()` builds a Storefront **search** filter, not an exact match, so
both the PDP and `/shop` re-filter the results against known handles. Keep that.

## Commands

```
npm install
npm run dev         # MiniOxygen dev server on :3000, with codegen
npm run build       # production build
npm run preview     # build, then serve the built app
npm run typecheck   # react-router typegen && tsc --noEmit
npm run codegen     # regenerate storefrontapi.generated.d.ts
npm run lint
```

`npm run dev` works with no Shopify credentials — Hydrogen falls back to
**mock.shop**, whose products are generic samples (sweatpants, slides) rather
than this range. Hue swatches, pairing and the real handles only light up
against a real storefront.

## Ground rules

- **Secrets never enter git.** `.env` is gitignored; `.env.example` carries the
  key names with empty values and is the only env file committed.
- **Regenerate, don't hand-edit.** `storefrontapi.generated.d.ts` and
  `customer-accountapi.generated.d.ts` are codegen output. Change a query, then
  run `npm run codegen`.
- **Don't fabricate commerce data.** If a product, variant or price isn't in the
  Storefront API, show the indicative figure and label it, or hide the control.
  `Piece.confirmed` exists for exactly this.
- **Placeholders are labelled.** Every colour block standing in for photography
  carries a caption naming the shot it's holding a place for. Keep that when
  adding new ones — an unlabelled placeholder ships as a bug.
- **Copy rules.** No reviews. No size-remake policy. Don't reintroduce
  apologetic "we're a new brand" framing — the one place newness is mentioned is
  the "why does it take two weeks" FAQ, where it explains the made-to-order
  pipeline, and that is enough.
- **Branch and PR, don't push to `main`.** CI runs typecheck and build.

## Not done yet

- **English only, no i18n.** `i18n` is pinned to `EN`/`AU` in
  `app/lib/context.ts` and the app was scaffolded with `--markets none`.
  Translations and any Shopify apps are a deliberate later step.
- **Photography.** Every image is a labelled colour block. Real shots want the
  same crop and lighting per hue.
- **Newsletter signup** in the footer is not wired to a list provider. It is
  left as a plain form rather than a fake success state.
- **Kits are not a real Shopify product yet.** The kit path in the PDP bundles
  three separate line items. A true bundled product (needed for the 30-day kit
  return to mean anything at checkout) is still to be modelled in Shopify.
- **Trademark clearance** for "Uniform-ish" in Class 25.
- **`hello@uniform-ish.com`** in the footer, and the Privacy/Terms links, assume
  a domain and Shopify policy pages that don't exist yet.
