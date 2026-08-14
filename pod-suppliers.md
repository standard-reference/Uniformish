# POD suppliers & blanks — running comparison

Working document for the manufacturing decision. Evidence lives here; the decision is tracked in the GitHub issues.

**Status: open, but materially advanced.** The launch vendor is Apliiq and the working recommendation is to stay there and change the blank to AS Colour. The question that was blocking that — *does a colourway exist in both a tee and a sweatpant?* — is now **answered: yes**, with the important caveat that full core-four coverage narrows the system to **three** colours, not six. See [AS Colour](#as-colour--recommended-candidate) and [Open questions](#open-questions).

## How to read this

Everything below is marked with a confidence level, because most of it was gathered from search results rather than primary sources — the environment this was *originally* researched in could not reach `apliiq.com`, `printful.com`, or any vendor site directly.

**That network restriction is now lifted.** The AS Colour section has since been rewritten from primary sources (Apliiq's live catalog and AS Colour's own product pages) and its ✅ marks are real. The rest of this document has not been re-verified and its 🟡 marks still stand.

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

- **Range:** staple / classic / heavy tees, premium hoods, heavy crews, fleece, shorts, pants, tanks, jackets ✅ — the only house here confirmed to span the full matrix.
- **Reputation:** clean, refined, quality-first, with more tailored cuts than the garment-dye houses 🟡.
- **Via Apliiq: 243 products** ✅ — measured from Apliiq's own catalog filter, against **13** for Comfort Colors and 1410 for the catalog as a whole. AS Colour is Apliiq's deepest single blank house by a wide margin, spanning tshirts (49), hats (49), hoodies (25), sweatshirts (21), long-sleeves (17), jackets (17), tanks (15), shorts (14), pants (7).
- **Why it wins on the brief:** full-matrix coverage from one manufacturer is the only path to a monotone system that does not depend on cross-brand colour matching.
- **The deciding question is now answered — see below.** Short version: yes, but at three colours, not six.

#### Does a colourway exist in both a tee and a sweatpant? ✅ **Yes — six of them.**

Measured from AS Colour's own US site, reading colour name **and hex** off each product's swatch markup, then intersecting.

**Tee ∩ Sweatpant — 6 shared colourways, identical hex on both:**

| Colour | Hex |
|---|---|
| Bone | `#D1CDCA` |
| Butter | `#F4F0D7` |
| Cypress | `#51594A` |
| Shadow | `#626367` |
| Athletic Heather | `#A4A4A2` |
| Black | `#000000` |

**But the full core four is much narrower.** Intersecting Tee ∩ Crew ∩ Pant ∩ Short leaves **three**: Bone, Athletic Heather, Black. Adding a hood doesn't cost anything further — still those three.

The binding constraint is **bottoms, and shorts worst of all**:

| Category | Distinct colours across every style checked |
|---|---|
| Tee | 76 (Staple Tee 5001 alone) |
| Crew | 22 |
| Hood | 22 |
| Pant | 11 |
| **Short** | **4** |

Individual styles are thinner still — Relax Track Shorts 5933 lists 3 colours, Court Shorts 5910 lists 2, Surplus Track Pants 5917 lists 2. The 76-colour Staple Tee is the outlier, not the norm; the Heavy Tee 5080 lists 14.

**What this means for the brand:** the one-house thesis survives — a genuine monotone fit head-to-toe in a single AS Colour colourway is real and buildable. **The six-colour matrix does not.** At full core-four coverage the system is a *three*-colour system, and one of those three (Athletic Heather) is a grey marl rather than a flat tone, which sits awkwardly with the engineered-tonal identity.

Three ways out, in rough order of attractiveness:

1. **Ship the matrix at 3 colours** (Bone / Black + one more), and let tees carry extra colours as a wider "tops-only" range. Keeps the monotone rule literally true.
2. **Drop shorts from the launch matrix.** Shorts alone cost the system half its colours — Tee ∩ Crew ∩ Pant is meaningfully wider than the core four. Shorts join later, in whatever colours exist.
3. **Mix houses for bottoms only**, which reopens exactly the cross-brand colour matching this whole reframe was meant to eliminate.

**Caveats on the above** 🟡 — this is AS Colour's **US direct-to-consumer** range, which is not necessarily their full wholesale/blank offering, and **Apliiq's carried subset may differ again**. All four relevant styles are confirmed present in Apliiq's catalog (Staple Tee, Mens Relax Crew, Relax Track Pants, Mens Relax Track Shorts) ✅, but Apliiq's per-product colour lists render client-side and could not be read without API credentials. `get_product` is still the check that makes these numbers ✅ for *Apliiq specifically* rather than for AS Colour generally.

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

Ordered by how much they move the decision.

1. ~~**Does AS Colour hold a colourway across tops and bottoms?**~~ ✅ **Answered: yes — 6 across tee+pant, but only 3 across the full core four.** See [AS Colour](#as-colour--recommended-candidate). The one-house thesis holds; the six-colour matrix does not.
2. ~~**Which AS Colour styles does Apliiq actually carry?**~~ ✅ **243 products**, spanning the full matrix. **In which colours is still ❓** — Apliiq's per-product colour lists render client-side and need `get_product`.
3. **NEW, and now the decision that matters: how many colours does the matrix ship at, and does it include shorts?** Options 1–3 in the AS Colour section. This is a brand call, not a research question — it changes the core "6 colours × 8 silhouettes" premise in `CLAUDE.md`.
4. **Does the AS Colour US DTC range match the wholesale blank range, and Apliiq's subset of it?** ❓ The colour counts above are from the DTC site; `get_product` is what makes them authoritative for Apliiq.
5. **Does the Apliiq 4610 have a companion bottom?** ❓ — less urgent now that AS Colour is measured rather than assumed.
6. Does Tapstitch offer woven labels and a coherent bottoms palette? ❓ Only matters if the 3-colour answer is judged too narrow.
7. Confirm woven-label pricing and turnaround directly with Apliiq 🟡.

## What is already decided and not up for revisiting

- **Socks stay on Printful, sublimation, permanently.** Sublimation prints the full surface rather than onto pre-dyed stock, so it hits exact hex values at zero MOQ. Confirmed better than jacquard for this. Independent of everything above.
- **Slip-On stays outsourced.** No POD path.

## Sources

Gathered from: [Printify's 240 GSM streetwear guide](https://printify.com/knowledge-hub/unlock-boxy-fit-premium-profits-240gsm-streetwear-blanks/), [Apliiq 4610 product page](https://www.apliiq.com/customize/mens/tshirts/Boxy-Heavy-Tee), [Apliiq AS Colour catalog](https://www.apliiq.com/catalog?brand=AS+Colour&feature=Heavyweight), [Printful Comfort Colors](https://www.printful.com/comfort-colors-custom-shirts), [Printful CC1469](https://www.printful.com/custom/mens/sweatpants-joggers/unisex-garment-dyed-fleece-sweatpants-comfort-colors-1469), [Printify Comfort Colors](https://printify.com/app/brand/47/comfort-colors), [Real Thread on Comfort Colors alternatives](https://www.realthread.com/blog/comfort-colors-alternatives), [Tapstitch](https://www.tapstitch.com/custom-apparel), [Apliiq woven labels](https://www.apliiq.com/woven-labels).
