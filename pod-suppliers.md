# POD suppliers & blanks — running comparison

Working document for the manufacturing decision. Evidence lives here; the decision is tracked in the GitHub issues.

**Status: open.** The launch vendor is Apliiq and the working recommendation is to stay there and change the blank. That is a recommendation, not a decision — see [Open questions](#open-questions).

## How to read this

Everything below is marked with a confidence level, because most of it was gathered from search results rather than primary sources — the environment this was researched in could not reach `apliiq.com`, `printful.com`, or any vendor site directly.

| Mark | Means |
|---|---|
| ✅ | Confirmed from a vendor product page or spec |
| 🟡 | From a secondary source (review site, comparison article) — plausible, unverified |
| ❓ | Unknown, and named as a question below |

**Do not treat 🟡 rows as settled.** Once the Apliiq MCP server is verified, `get_product` answers most of them directly against the live catalog.

---

## The reframe that matters

The original constraint was: *six fixed colours, sourced as Comfort Colors, match the bottoms to them.* That was always going to be a compromise, because Apliiq's bottoms run through different manufacturers than its Comfort Colors tops — so it meant colour-matching **across two blank houses**.

The palette is no longer locked. That unlocks a better move:

> **Pick one blank house that makes the entire matrix.**

Then the monotone rule — *vertical is mandatory* — holds **by construction**. Same manufacturer, same dye program, same palette language across tee, crew, pant and short. Nothing is matched because nothing needs matching.

This reframes the whole comparison. The question is no longer "which vendor has the best tee", it is **"which blank house makes a coherent full-matrix palette, and which vendor can print on it with no minimums and sew in a woven label."**

---

## Platforms

### Apliiq — current choice

| | |
|---|---|
| **Pros** | Deepest private-label offering of any POD: **sewn-in woven labels**, appliqués, hem tags, patches ✅. Woven labels ~$100/100 including sewing and 1-year storage 🟡. Carries multiple blank houses — Comfort Colors, AS Colour, Independent Trading Co ✅. Zero MOQ, native Shopify app ✅. 750+ product catalog 🟡. |
| **Cons** | HMAC-signed API, more work to integrate than a bearer token ✅. Blank ranges are split across manufacturers, so a palette does not automatically carry from tops to bottoms ✅. Order API field-level spec not publicly obvious ✅. |
| **Verdict** | **The private-label depth is the moat.** It is the only platform here that sews in a woven label, and that is what carries the engineered-spec-sheet identity onto the physical garment. |

### Printful

| | |
|---|---|
| **Pros** | Carries **Comfort Colors 1717 tees and 1469 sweatpants**, both no-minimum ✅ — the only platform confirmed to do garment-dyed CC tops *and* bottoms. Already this project's permanent home for the Cross socks (sublimation). Mature, well-documented REST API with bearer-token auth. |
| **Cons** | **Printed inside labels only — no woven option** 🟡. For a brand whose differentiator is construction detail, that is a real loss. |
| **Verdict** | Strong on catalog, loses on branding. Consolidating here would trade the strongest differentiator for a colour match that picking one blank house solves anyway. |

### Printify

| | |
|---|---|
| **Pros** | Carries Comfort Colors including the 1469 ✅. Aggressive pricing — 1469 from ~$38.90, ~$28.19 on Premium 🟡. |
| **Cons** | 1469 listed in **only 7 colours** vs ~60 for the 1717 🟡 — the bottoms palette is far narrower than the tops palette. Quality varies by print provider, which is a real risk for a tonal system that depends on colour consistency. |
| **Verdict** | Not a fit. Provider variability is the wrong risk for a brand whose entire proposition is that the colour match is engineered. |

### Tapstitch — the wildcard

| | |
|---|---|
| **Pros** | Purpose-built for streetwear: **100+ garments at 250–400 GSM** 🟡, including a 300 GSM drop-shoulder boxy tee with one-piece body construction 🟡. No subscription, no minimums 🟡. 4.6★ on the Shopify app store 🟡. Custom hang tags and labels 🟡. |
| **Cons** | Bottoms range and palette coherence ❓. Smaller, less proven than Printful/Apliiq. Woven-label capability ❓. |
| **Verdict** | **Look here second if AS Colour disappoints.** Highest ceiling on garment quality of anything listed. |

### Fourthwall

| | |
|---|---|
| **Pros** | Strong all-in-one for creator-led brands; Merchant-of-Record handles tax 🟡. |
| **Cons** | Oriented at creator merch rather than a standalone label. Not obviously better than Apliiq for this use case. |
| **Verdict** | Not pursuing. |

---

## Blank houses

This is the more important table. The platform prints; the blank house determines quality, cut, and whether a coherent palette exists across the matrix.

### AS Colour — recommended candidate

- **Range:** staple / classic / heavy tees, premium hoods, heavy crews, fleece, shorts, pants, tanks, jackets 🟡 — the only house here confirmed to span the full matrix.
- **Reputation:** clean, refined, quality-first, with more tailored cuts than the garment-dye houses 🟡.
- **Via Apliiq:** Stencil Crew (5103), Relax Track Shorts (4933), Active Pro Shorts (5621) ✅ — so Apliiq carries it, though the full available range is ❓.
- **Why it wins on the brief:** full-matrix coverage from one manufacturer is the only path to a monotone system that does not depend on cross-brand colour matching.
- **Open:** does a given colourway actually exist in both a tee and a sweatpant? ❓ **This is the question that decides the whole thing.**

### Apliiq 4610 "Boxy Heavy Tee"

- **7.5 oz / 245–255 GSM**, 100% cotton, drop shoulders, boxy, shoulder-to-shoulder neck tape, 1" double-needle stitched sleeves and hem ✅.
- **Tear-away label**, explicitly built for relabeling ✅.
- Sits right on the **240 GSM streetwear benchmark** 🟡 — the weight associated with the boxy silhouette and a $10–20 price premium.
- **Open:** is there a companion bottom in a shared palette? ❓

### Comfort Colors — the incumbent

- **1717** heavyweight garment-dyed tee, ~60 colours ✅ including all six of the original palette ✅.
- **1469** garment-dyed lightweight fleece sweatpants, 100% ring-spun cotton, same dye process ✅ — **but not carried by Apliiq** ✅ (Apliiq's bottoms are Independent Trading Co 18400 and Jerzees 975MPR).
- **Pros:** best-in-class garment-dyed hand, genuine vintage character, huge tops palette.
- **Cons:** cut is relaxed-classic, **not modern streetwear** 🟡. Bottoms unavailable on the current vendor.
- **Verdict:** wins on character, loses on cut and on matrix coverage. Given the brief is *best quality, best cuts, best fit*, that trade goes against it.

### Also considered

| House | Note |
|---|---|
| **Shaka Wear** | 7.5 oz max heavyweight garment dye, oversized fit, shrink-free 🟡. Genuinely streetwear-grade. Availability through Apliiq ❓ |
| **Los Angeles Apparel** | Heavy, well-regarded, US-made 🟡. POD availability ❓ |
| **Independent Trading Co** | What Apliiq's bottoms actually are ✅. Has its own earth-tone line (Bone/Cement/Plum/Smoke) 🟡 — plausible, not matched to any tops range. |

---

## Open questions

Ordered by how much they move the decision. All three of the first group are `get_product` queries once the MCP server is verified.

1. **Does AS Colour hold a colourway across tops and bottoms?** ❓ If yes, the matrix is solved and the palette gets re-derived from AS Colour's range. If no, the whole one-house thesis collapses and this reopens.
2. **Which AS Colour styles does Apliiq actually carry, and in which colours?** ❓
3. **Does the Apliiq 4610 have a companion bottom?** ❓
4. Does Tapstitch offer woven labels and a coherent bottoms palette? ❓ Only matters if 1–3 disappoint.
5. Confirm woven-label pricing and turnaround directly with Apliiq 🟡.

## What is already decided and not up for revisiting

- **Socks stay on Printful, sublimation, permanently.** Sublimation prints the full surface rather than onto pre-dyed stock, so it hits exact hex values at zero MOQ. Confirmed better than jacquard for this. Independent of everything above.
- **Slip-On stays outsourced.** No POD path.

## Sources

Gathered from: [Printify's 240 GSM streetwear guide](https://printify.com/knowledge-hub/unlock-boxy-fit-premium-profits-240gsm-streetwear-blanks/), [Apliiq 4610 product page](https://www.apliiq.com/customize/mens/tshirts/Boxy-Heavy-Tee), [Apliiq AS Colour catalog](https://www.apliiq.com/catalog?brand=AS+Colour&feature=Heavyweight), [Printful Comfort Colors](https://www.printful.com/comfort-colors-custom-shirts), [Printful CC1469](https://www.printful.com/custom/mens/sweatpants-joggers/unisex-garment-dyed-fleece-sweatpants-comfort-colors-1469), [Printify Comfort Colors](https://printify.com/app/brand/47/comfort-colors), [Real Thread on Comfort Colors alternatives](https://www.realthread.com/blog/comfort-colors-alternatives), [Tapstitch](https://www.tapstitch.com/custom-apparel), [Apliiq woven labels](https://www.apliiq.com/woven-labels).
