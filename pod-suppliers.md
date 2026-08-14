# POD suppliers & blanks — running comparison

Working document for the manufacturing decision. Evidence lives here; the decision is tracked in the GitHub issues.

**Status: open, but materially advanced.** The launch vendor is Apliiq and the working recommendation is to stay there and change the blank to AS Colour. The question that was blocking that — *does a colourway exist in both a tee and a sweatpant?* — is **answered: yes.**

Exact hex matching across the full core four is tight (3 colours on one shorts silhouette, 5 if you'll accept a different shorts cut per colour). But allowing **shorts to run one shade lighter in the same hue** — a tonal break rather than a strict monotone — takes the matrix to **9 colours on a single shorts silhouette**, 8 of them with a matching pant. That is now the working design rule. See [AS Colour](#as-colour--recommended-candidate) and [Open questions](#open-questions).

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

**Category palettes** (9 men's shorts styles, 3 pant, 3 tee, 3 crew, 1 hood sampled):

| Category | Distinct colours | Most in any *single* style |
|---|---|---|
| Tee | 76 | 76 (Staple Tee 5001) |
| Crew | 22 | 15 (Relax Crew 5160) |
| Hood | 22 | 22 |
| Pant | 11 | 8 (Relax Track Pants 5932) |
| Short | 15 | **3** |

**The real constraint is not the shorts palette, it is the shorts *style*.** No AS Colour shorts style carries more than **three** colours, and the three-colour styles don't agree with each other:

| Style | Colours |
|---|---|
| Relax Track Shorts 5933 | Bone, Athletic Heather, Black |
| Relax Faded Track Shorts 5939 | Faded Bone, Faded Grey, Faded Black |
| Active Shorts 5620 | Black, Ink Blue, Shadow |
| Stadium Shorts 5916 | White Heather, Steel Heather, Black |
| Walk Shorts 5929s | Cypress |
| Canvas Shorts | Walnut, Black |
| Court Shorts 5910 | Navy, Black |

So the exact-match answer depends entirely on whether "SH" is allowed to mean a different garment in different colours:

- **One shorts silhouette, exact hex match: 3** — Bone, Athletic Heather, Black (Relax Track Shorts 5933).
- **Any shorts silhouette, exact hex match: 5** — adds Cypress and Shadow, but only by making a Cypress fit a *walk* short and a Shadow fit an *active* short. For a brand whose proposition is a system, that is not really a five-colour matrix.

### The fix: tonal break — shorts a shade lighter, same hue

Relaxing "shorts must hex-match" to "shorts must be the same hue, a step lighter" changes the picture completely, and it is a stronger design position than exact matching: you get a visible break at the waist *and* the fit still reads as one colour.

AS Colour already manufactures this idea. The **Faded** line — Faded Track Shorts 5939, Faded Track Pants 5938 — is washed-down siblings of the base colours. Faded Bone is Bone lighter; Faded Grey is Shadow lighter.

Matching was done in **OKLCh** (perceptually uniform, so "one step lighter" means the same thing on a green as on a brown). A pairing qualifies when hue is within 22° — or both colours are near-neutral, where hue angle is meaningless — chroma is within 0.045, and lightness rises by ΔL 0.06–0.34.

Staying inside the **Relax Track short family (5933 + 5939)**, one silhouette, the matrix reaches **9 colours**:

| Top (tee + crew) | Short | ΔL | Pant? |
|---|---|---|---|
| Bone `#D1CDCA` | Bone — exact | — | ✅ |
| Athletic Heather `#A4A4A2` | Athletic Heather — exact | — | ✅ |
| Black `#000000` | Black — exact | — | ✅ |
| Shadow `#626367` | Faded Grey `#797470` | 0.06 | ✅ |
| Bone `#D1CDCA` | Faded Bone `#EAE7E2` | 0.08 | ✅ |
| Athletic Heather `#A4A4A2` | Bone `#D1CDCA` | 0.13 | ✅ |
| Athletic Heather `#A4A4A2` | Faded Bone `#EAE7E2` | 0.21 | ✅ |
| Shadow `#626367` | Athletic Heather `#A4A4A2` | 0.22 | ✅ |
| Coal `#323031` | Faded Black `#424243` | 0.07 | ✗ |
| Eucalyptus `#938E71` | Athletic Heather `#A4A4A2` | 0.08 | ✗ |
| Petrol Blue `#404A53` | Faded Grey `#797470` | 0.16 | ✗ |
| Sand `#B7B09D` | Faded Bone `#EAE7E2` | 0.17 | ✗ |
| Army `#4E4A36` | Athletic Heather `#A4A4A2` | 0.31 | ✗ |

**A note on ΔL.** The 0.06–0.08 pairings (Shadow/Faded Grey, Bone/Faded Bone, Coal/Faded Black) are *subtle* — close enough that they risk reading as a laundry accident rather than a decision. The pairings that most clearly read as deliberate sit around **ΔL 0.13–0.22**: Athletic Heather over Bone, Shadow over Athletic Heather, Athletic Heather over Faded Bone. All three have a pant in the anchor colour, so each works as both a long and a short fit. Confirm against physical swatches before committing — a 0.06 ΔL is well inside the range that dye-lot variation can swamp.

**Correction to an earlier version of this section.** It claimed "eight of the nine anchors have a matching pant." That counted table *rows*, not colours — only **four** of the nine (Bone, Athletic Heather, Black, Shadow) have a pant. The consequence is larger than the arithmetic, and is the subject of the next section.

### Stepping shorts alone achieves nothing — the rule has to be palette-wide

Counting **complete core-four fits** (tee + crew + pant + short, one hue family, never darker going down):

| Regime | Complete fits | Solid | Stepped |
|---|---|---|---|
| Strict — exact hex everywhere | 5 | 5 | 0 |
| Step on **shorts only**, ΔL 0.13–0.22 | **5** | 5 | **0** |
| Step on shorts only, ΔL 0.10–0.34 | **5** | 5 | **0** |
| **Step across the whole palette, ΔL 0.13–0.22** | **14** | 5 | 9 |
| Step across the whole palette, ΔL 0.10–0.34 | 19 | 5 | 14 |

Stepping shorts adds **zero** complete fits, because the anchors that gain a shorts option (Eucalyptus, Army, Petrol Blue, Sand, Coal) have no pant in their colour. Relaxing shorts just moves the bottleneck to pant. The rule only pays out when it applies everywhere.

**The 14 buildable fits under the recommended regime** (`*` = exact on that piece):

| Anchor | Crew | Pant | Short | Grade |
|---|---|---|---|---|
| Black `#000000` | Black* | Black* | Black* | Solid |
| Bone `#D1CDCA` | Bone* | Bone* | Bone* | Solid |
| Cypress `#51594A` | Cypress* | Cypress* | Cypress* | Solid |
| Shadow `#626367` | Shadow* | Shadow* | Shadow* | Solid |
| Athletic Heather `#A4A4A2` | Athletic Heather* | Athletic Heather* | Athletic Heather* | Solid |
| Navy `#1E202C` | Petrol Blue | Faded Black | Navy* | Step |
| Midnight Blue `#35374C` | Midnight Blue* | Shadow | Shadow | Step |
| Coal `#323031` | Coal* | Shadow | Shadow | Step |
| Petrol Blue `#404A53` | Petrol Blue* | Faded Grey | Faded Blue | Step |
| Sand `#B7B09D` | Sand* | Butter | Faded Bone | Step |
| Mushroom `#B2A795` | Ecru | Butter | Faded Bone | Step |
| Smoke `#98A0A5` | Ecru | Bone | White Heather | Step |
| Light Grey `#B9B5AC` | Ecru | Butter | White Heather | Step |
| Granite `#A1A0A5` | Ecru | Bone | White Heather | Step |

Note the spread: the nine stepped fits add warm neutrals (Sand, Mushroom, Light Grey, Granite) and a blue family (Navy, Midnight Blue, Petrol Blue) — both squarely in the value/chroma band the brand was already aiming at.

**The forbidden band.** ΔL 0.06–0.10 is excluded outright, not graded lower. Eight otherwise-valid shorts pairings fall in it: Eucalyptus→Athletic Heather (0.075), Walnut→Faded Grey (0.082), Petrol Blue→Shadow (0.097), Bone→White Heather (0.069), Bone→Faded Bone (0.078), Light Grey→Bone (0.077), Shadow→Faded Grey (0.062), Coal→Faded Black (0.068). At that distance the step reads as a laundry accident, and dye-lot drift can swamp it.

**What this means for the brand:** the one-house thesis holds, and the palette-wide step rule roughly triples the matrix — from 5 fits to 14 — while keeping the customer-facing rule ("one colour, head to toe") completely unchanged. It removes the constraint rather than conceding to it.

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

1. ~~**Does AS Colour hold a colourway across tops and bottoms?**~~ ✅ **Answered: yes.** 6 across tee+pant at exact hex; 3 across the full core four within a single shorts silhouette; **9 once shorts are allowed to run a shade lighter.** See [AS Colour](#as-colour--recommended-candidate).
2. ~~**Which AS Colour styles does Apliiq actually carry?**~~ ✅ **243 products**, spanning the full matrix. **In which colours is still ❓** — Apliiq's per-product colour lists render client-side and need `get_product`.
3. ~~**How many colours does the matrix ship at?**~~ ✅ **Resolved by the tonal-break rule** — shorts run a shade lighter in the same hue, which yields 9 anchors on one shorts silhouette instead of 3. The remaining sub-question is which ΔL band to standardise on; the 0.13–0.22 pairings read as deliberate, the 0.06–0.08 ones risk reading as a mistake.
4. **Does the AS Colour US DTC range match the wholesale blank range, and Apliiq's subset of it?** ❓ Everything above is from the DTC site; `get_product` is what makes it authoritative for Apliiq. **This is now the top open research item.**
5. **Do the Faded styles (5938/5939) exist on Apliiq at all?** ❓ The tonal-break matrix leans on them. If Apliiq doesn't carry the Faded line, the answer degrades toward 7 anchors on 5933 alone.
6. **Physical swatch check on the ΔL 0.06–0.08 pairings** — dye-lot variation could swamp a difference that small. Confirm before committing to any of them.
7. **Does the Apliiq 4610 have a companion bottom?** ❓ — less urgent now that AS Colour is measured rather than assumed.
8. Does Tapstitch offer woven labels and a coherent bottoms palette? ❓ Only matters if AS Colour disappoints on 4–5.
9. Confirm woven-label pricing and turnaround directly with Apliiq 🟡.

## What is already decided and not up for revisiting

- **Socks stay on Printful, sublimation, permanently.** Sublimation prints the full surface rather than onto pre-dyed stock, so it hits exact hex values at zero MOQ. Confirmed better than jacquard for this. Independent of everything above.
- **Slip-On stays outsourced.** No POD path.

## Sources

Gathered from: [Printify's 240 GSM streetwear guide](https://printify.com/knowledge-hub/unlock-boxy-fit-premium-profits-240gsm-streetwear-blanks/), [Apliiq 4610 product page](https://www.apliiq.com/customize/mens/tshirts/Boxy-Heavy-Tee), [Apliiq AS Colour catalog](https://www.apliiq.com/catalog?brand=AS+Colour&feature=Heavyweight), [Printful Comfort Colors](https://www.printful.com/comfort-colors-custom-shirts), [Printful CC1469](https://www.printful.com/custom/mens/sweatpants-joggers/unisex-garment-dyed-fleece-sweatpants-comfort-colors-1469), [Printify Comfort Colors](https://printify.com/app/brand/47/comfort-colors), [Real Thread on Comfort Colors alternatives](https://www.realthread.com/blog/comfort-colors-alternatives), [Tapstitch](https://www.tapstitch.com/custom-apparel), [Apliiq woven labels](https://www.apliiq.com/woven-labels).
