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
custom Shopify Hydrogen storefront. Based in Spain, selling worldwide, made to
order — one EUR base price converted per buyer by Shopify Markets.

**Positioning:** accessible premium. Above Uniqlo U's value tier, below Fear of
God Essentials. The differentiator is the systemised, engineered identity — not
the earth-tone aesthetic, which is a crowded lane on its own.

**Brand name:** "Uniform-ish". The Shopify store is registered as *Uniformish*
on `uniformish.store`, contact `hello@uniformish.store`. Earlier working names
were "Unit" and "Tones"; both had existing apparel trademark conflicts.
Uniform-ish has **not** been cleared in Class 25 — do that before anything
public.

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

**Availability is Shopify's to decide, never the repo's.** All six hues render
and link on the home and shop grids. Whether a hue can actually be bought is
controlled by the product's variants in the admin — the PDP's swatches come from
`getProductOptions`, so a variant that is disabled or missing renders as a
disabled swatch on its own. Do not reintroduce a hardcoded list of "live" hues
here; that is commerce state and it will drift.

Design logic: all six sit on the same narrow band of lightness and chroma, held
inside set OKLCh tolerances. That band is *why* any two read as chosen. **If a
hue ever needs substituting, match it to the band — not to a hue on a colour
wheel.** Each hue also carries `dark` / `light` / `lighter` steps, used for the
stepped-look blocks.

Colours are matched to Shopify option values by name, case-insensitively, and
under either spelling of Colour/Color (`isHueOption`). An unmapped colour falls
back to the Storefront swatch rather than breaking the page.

## The range

`app/data/range.ts` mirrors the live catalogue. Prices there are the **EUR base**
— never render them as a buyer's price; buyers always see a Markets-converted
figure from the Storefront API.

| Piece | Fit | Base (EUR) | Handle | Colour option |
|---|---|---|---|---|
| Oversized Crewneck | Oversized | €62 | `uniform-ish-embroidered-crewneck-sweatshirt` | Jet / Moss / Slate |
| Heavyweight Tee | Regular | €42 | `uniform-ish-embroidered-tee` | none |
| Tapered Sweatpant | Lean | €64 | `uniform-ish-embroidered-sweatpants` | none |
| Fleece Short | Relaxed | €54 | `uniform-ish-embroidered-shorts` | none |
| Crew Sock | Cushioned | €46 | `uniform-ish-embroidered-socks` | Jet / Umber |

Six older per-hue crewnecks (`jet-crewneck`, `moss-crewneck`, …) still exist in
the admin as **drafts** with zero inventory. They are superseded by the single
multi-variant crewneck above; don't wire anything to them.

**Fabric:** heavyweight cotton blanks, **embroidered, not printed** — AS Colour
5160 for the crewneck (80% cotton / 20% recycled polyester, 320 g/m²), Cotton
Heritage MC1086 and M7580 for the tee and sweatpant, Independent Trading
IND20SRT for the short, SOCCO SC200 for the sock. *An earlier version of the
site described a sublimated poly knit whose dye "becomes part of the fibre".
That was never true of these products and has been removed — don't reintroduce
it.*

**Fulfilment:** Printful, made to order, produced at the facility nearest the
delivery address. Four Printful delivery profiles carry per-product-type rates;
the default profile is €6.99 Spain / €8.99 EU / €12.99 rest of world.

**Returns: keep what works, send back what doesn't.** Every piece is sold and
refunded individually — a duo or a kit is never all-or-nothing. 14 days to
withdraw in the EU and UK, 30 days elsewhere. Return postage is the customer's
on a change of mind; faulty, damaged or wrong items are the merchant's, both
ways. Faulty pieces are replaced or refunded in full regardless, and a
three-year Spanish conformity guarantee sits underneath all of it.

Two things here are load-bearing, not stylistic:

- **"Final sale" was removed and must not come back.** The personalisation
  exemption in Directive 2011/83/EU covers goods made to a customer's own
  specification. A stock size in a stock colour is not that, so made-to-order
  does not remove the withdrawal right.
- **Return postage being the customer's cost is disclosed pre-purchase** via
  `ORDER_TERMS`, which renders on the product page and in the cart. That
  disclosure is what makes the term binding on an EU consumer — if those terms
  move, the term has to stay visible before checkout.

*There is no free size-remake policy* — deliberately removed; don't reintroduce
it. The canonical policy text lives at `docs/policies/refund-policy.md`; Shopify
admin is the live version and the two must be kept in step.

**Shipping windows and rates come from Shopify**, not from a guess: windows from
the published Shipping policy, rates from the default delivery profile's zones.
If either changes in the admin, update `SHIPPING_WINDOWS` in `app/data/range.ts`
to match. A mismatch there is a consumer-law problem, not a copy inconsistency.

**No reviews anywhere on the site.** Also deliberate. No review module, no
star ratings, no "be the first to review" placeholder.

---

# Working in this repo

## What it is

A Shopify Hydrogen storefront: **Hydrogen 2026.4, React Router 7, Vite, Oxygen.**
Shopify is the backend of record — checkout, payments, tax, order routing.
This app is the browsing UI in front of it, talking to the **Storefront API** and
handing off to Shopify's hosted checkout.

**The store:** `smsg1t-j1.myshopify.com` (Uniformish, Basic plan, based in Sant
Cugat del Vallès, Spain). Products are published to the **`Uniform-ish`**
publication — the Hydrogen storefront channel — which is what the Storefront API
reads.

**The public domain is `uniformish.store`**, owned but **not yet attached to the
store**: Shopify's `primaryDomain` is still the myshopify host. `SITE_URL` in
`app/lib/seo.ts` is the single place the public domain is written down; canonical
URLs and social cards always point there, so Oxygen previews and the myshopify
fallback can't compete with production in search. `PUBLIC_STORE_DOMAIN` is a
different thing and stays as the myshopify host — it addresses the API, not the
site.

## Currency, and why nothing is hardcoded

The store sells worldwide from **one EUR base price**. Shopify Markets converts
per buyer: three markets (Spain primary, European Union, International), local
currencies enabled on both non-primary markets, and **20 presentment currencies**
active including USD, AUD, GBP and JPY.

So there is no second price list and there must never be one. Do **not** add a
USD column, a currency switcher that re-prices, or a hardcoded symbol next to a
Storefront price. Instead:

- `app/lib/i18n.ts` resolves the buyer's country per request from Oxygen's
  `oxygen-buyer-country` header and hands it to `@inContext`. That single value
  decides the currency the buyer is quoted.
- Every price renders through Hydrogen's `<Money>`, which uses whatever the
  Storefront API returned for that context.
- The only hardcoded figures are `basePrice` in `app/data/range.ts` and the
  shipping rates, both explicitly labelled EUR, used for "from" figures on the
  Shop page and the shipping table.

`MARKET_COUNTRIES` in `app/lib/i18n.ts` mirrors the markets' regions. If a market
gains a region in the admin and that list isn't updated, buyers there silently
fall back to the primary market's EUR.

## Layout

```
docs/policies/    canonical text of the Shopify policy pages, kept in sync by hand
app/
  data/          brand content — the hue system and the range. Not commerce data.
    hues.ts      the six hues, their steps, and option-name matching
    range.ts     pieces, size chart, PDP tabs, FAQs, shipping windows, order terms
  components/    Header, Footer, PageLayout, Aside (overlays), cart, ProductForm…
  lib/           Storefront queries, buyer locale, variant matching, session
  routes/        file-based routes (React Router flat routes)
  styles/        reset.css + app.css — tokens first, then blocks
  assets/fonts/  self-hosted JetBrains Mono (latin + latin-ext subsets)
```

**The `app/data` vs Storefront split is deliberate.** Shopify owns products,
variants, prices and the cart. This repo owns the hue system, the size chart and
the standing editorial copy — things that outlive any one product listing and get
edited as copy, not as merchandising. Don't move commerce data into `app/data`,
and don't put brand copy behind a metafield just because it can be.

**Anything true of one product only belongs to Shopify.** `PRODUCT_TABS` renders
on *every* PDP, so it holds only what is true of the whole range — care,
shipping, returns. A product's blank, fabric and cut come from its Shopify
description, which the PDP renders above those tabs. This split exists because
it was once broken: crewneck fit notes and an AS Colour fleece spec were showing
on the tee. Same rule for the size chart: `SIZE_CHART` is the crewneck's, and
`hasSizeChart()` gates the size-guide link so no product ever shows another's
measurements.

**The site is not about one product.** The range is five pieces. Home, About,
Shop and the size guide talk about the range; fit characteristics like "runs
oversized" live on the product page that they are true of, and nowhere else.

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
- **Shopify's published policies win.** Shipping windows, returns terms and tax
  wording on the site must match the store's policy pages. When they disagree,
  fix the site or change the policy — don't leave both live.
- **Copy rules.** No reviews. No size-remake policy. Don't reintroduce
  apologetic "we're a new brand" framing — the one place newness is mentioned is
  the "why does it take two weeks" FAQ, where it explains the made-to-order
  pipeline, and that is enough.
- **Branch and PR, don't push to `main`.** CI runs typecheck and build.

## Not done yet

- **Not connected to the live store yet.** Two steps, both admin-only:
  1. Create a Storefront API access token (Settings → Apps and sales channels →
     Develop apps) and put it in `.env` as `PUBLIC_STOREFRONT_API_TOKEN`.
     Creating tokens is deliberately blocked to AI tools, so this is a human
     step.
  2. Publish the five products to that app's sales channel. They are currently
     published to Online Store / Shop / POS only (`onlineStoreUrl` is null), so
     the Storefront API returns nothing for them until this is done.
  Until both are done, `npm run dev` runs against mock.shop.
- **English only.** Language is pinned to `EN` in `app/lib/i18n.ts` (country is
  not pinned — see above). Translations and any Shopify apps are a deliberate
  later step.
- **Photography.** Every image is a labelled colour block. Real shots want the
  same crop and lighting per hue.
- **Newsletter signup** in the footer is not wired to a list provider. It is
  left as a plain form rather than a fake success state.
- **Kits are not a real Shopify product yet.** The kit path in the PDP bundles
  three separate line items. A true bundled product (needed for the 30-day kit
  return to mean anything at checkout) is still to be modelled in Shopify.
- **Paste the new refund policy into Shopify.** `docs/policies/refund-policy.md`
  is the agreed text and the site now matches it, but the *live* policy in
  Shopify admin is still the old one — it says duos are final sale, promises a
  free size exchange, and opens "We're a new, small operation". The Shopify MCP
  connection lacks the `write_legal_policies` scope, so this is a human step:
  Settings → Policies → Refund policy. Until it is done, the live legal text
  contradicts the storefront.
- **Have the policy read by a lawyer** before taking payments. It was drafted to
  be defensible rather than merely tidy, but it states positions on EU
  withdrawal rights and the Spanish conformity guarantee, and it is the document
  a dispute would turn on.
- **Terms of service needs two edits** to match reality: it says "Prices are
  shown in EUR", which Markets makes untrue for most buyers, and it should point
  at the refund policy rather than restating return terms.
- **`uniformish.store` is not attached to the store.** Domain is owned; Shopify
  still reports the myshopify host as primary. For a headless build the domain
  should point at the **Oxygen deployment** via the Hydrogen channel, not at the
  Online Store theme.
- **Trademark clearance** for "Uniform-ish" in Class 25.
