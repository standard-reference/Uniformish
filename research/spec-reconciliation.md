# Reconciliation — `unitsystemflow.html` (Rev 06/09) against this repo

The system-flow document produced in a chat session is a real advance on the repo in
several places — Assembly, Aftercare and Roadmap are further developed than anything
here. This file records where the two disagree, so the disagreement doesn't quietly
become drift.

**Nothing below is a criticism of the direction.** Most of it is one root cause and
some bookkeeping.

---

## 1. Blocking: STEP hexes are computed, not sourced

The document derives each STEP hex mathematically — hold hue and chroma, move
lightness +0.15L, gamut-map back to sRGB — producing Jet `#70675D`, Moss `#B0B695`,
Clay `#E89768`, Slate `#6F8088`, Umber `#DACEA9`.

**Those maths check out.** All five land at ΔL +0.150 ±0.001, hue within 22°, chroma
within 0.045. Verified in `verify-step-hexes.mjs`.

**But you cannot order a computed hex from a POD supplier on dyed blanks.** Apliiq
sells stock dye lots. A specified hex is only achievable through *sublimation*, which
is why the socks and patterns live on Printful — sublimation prints the full surface
rather than onto pre-dyed stock.

This inverts the constraint the AS Colour analysis was built on. There, a STEP was
**discovered in the catalog** — Bone → Faded Bone, Shadow → Faded Grey — because the
lighter tone had to be a real orderable colourway. Here it is **specified**, which
works for the Slip-On, socks and patterns and does not work for tee, crew, pant or
shorts.

Stage 01 half-sees this: *"SOLID colors are matched to existing Comfort Colors dye
names, not custom-mixed — the one place in this flow where the specced hex and the
shipped hex can differ."* The gap is that STEP has the same problem and worse, and
isn't covered by that note.

**Fix:** treat the computed hex as the *target*, then snap it to the nearest real
colourway in the supplier's range and re-check the result against the match spec.
The nearest real colourway may fall in the forbidden band, in which case that STEP
doesn't exist. `ascolour-tonal-match.mjs` already does exactly this snap.

## 2. Blocking: the palette reverted to Comfort Colors, which Apliiq cannot build

> **Resolved to a candidate, pending one check.** See "The split" below — a
> Comfort Colors / Independent Trading Co split keeps the palette *and* the woven
> label. What it hinges on is not yet verifiable from this environment.


The six colours (Jet/Bone/Moss/Clay/Slate/Umber) are the **historical** palette from
`CLAUDE.md`'s superseded table, sourced as Comfort Colors Pepper/Ivory/Moss/
Terracotta/Denim/Sandstone.

The document also lists Pant and Shorts as **Apliiq**, in all six colours.

Those two facts are incompatible, per this repo's own confirmed evidence:

- Apliiq does not carry Comfort Colors bottoms. Its bottoms are Independent Trading
  Co 18400 and Jerzees 975MPR ✅.
- Apliiq carries **13** Comfort Colors products total, against **243** AS Colour ✅.
- Comfort Colors 1469 sweatpants exist on **Printful**, not Apliiq ✅.

So the six-colour Comfort Colors palette is buildable across the core four — but on
**Printful**, which is printed-label-only 🟡 and therefore gives up the woven label
that Stage 01 correctly identifies as the moat.

**This is a genuine strategic fork and it needs a human decision**, because the
document currently wants both halves of a trade-off:

| | Comfort Colors palette | AS Colour palette |
|---|---|---|
| Woven labels (Apliiq) | ✗ not buildable | ✓ |
| Six-colour core four | ✓ (via Printful) | ✗ — 5 solid, 14 with STEP |
| Garment-dyed character | ✓ | ✗ |
| Modern streetwear cut | ✗ relaxed-classic 🟡 | ✓ |

## 3. The "5 → 14" figure is imported from a different palette

Stage 07 states STEP takes buildable four-piece fits *"from 5 (strict hex) to 14,
inside the shorts supplier's 3-colors-per-style cap."*

Those numbers are from `ascolour-regimes.mjs` and are specific to **AS Colour's**
real catalog. They do not transfer to a Comfort Colors palette, and the
"3-colors-per-style cap" is an AS Colour shorts fact. Quoting them against this
palette makes the document look validated where it isn't.

## 4. The Bone gamut claim is wrong — the conclusion is right

> *"Bone is the one color that can't clear the floor: pushed 0.13L lighter it runs
> into white before the step is deliberate enough to read as one"* — and the swatch
> note: *"max achievable ΔL is ~0.12 before hitting gamut white."*

Measured: Bone `#E7CEB5` is L=0.8657, C=0.0438, h=67.2°. Holding chroma and hue, the
maximum in-gamut ΔL is **0.0715** — not ~0.12. The claim understates the problem by
about 40%.

The **conclusion stands, and is stronger than stated**: Bone cannot take a lighter
step. (Allowing chroma to move within the spec's own ±0.045 tolerance technically
reaches ΔL 0.134, but only by driving chroma to zero and landing on pure `#FFFFFF` —
not a step, just white.)

Worth correcting rather than leaving, because it is checkable in about a minute and
anyone who checks it will start doubting the numbers that are right.

Bone going **darker** has enormous headroom — ΔL 0.671 available — which supports the
Multi-Step section's finding that Bone works downward only. A −0.15L Bone would be
`#B69F87`.

## 5. Smaller inconsistencies

- **Sock supplier.** The items table and Stage 01 both put Sock on **Apliiq**.
  `CLAUDE.md` lists socks on Printful sublimation as decided and explicitly not up
  for revisiting, and Stage 03 of the document itself puts the patterns on Printful.
  If solid socks genuinely moved to Apliiq, that is a real decision and should be
  recorded as one; if not, it is drift.
- **Slip-On.** The document ships it day one via Printful. `CLAUDE.md` says
  outsource-only with no POD path established. Needs confirming that Printful
  actually offers a suitable slip-on before it goes in a launch plan.
- **Revision number.** Header says `REV. 06`, footer says `Rev. 09`.
- **Palette count.** Header meta says `6 HUES`. Six is supported for Comfort Colors
  *tops*; it is the bottoms that fail.

## 6. Commercial items worth a second look — not errors, judgement calls

- **The two-piece floor.** This is the most consequential idea in the document and
  the least reversible. It forces the set-purchase behaviour rather than testing
  whether it exists, and it puts a ~$90–115 minimum on a first order from an unknown
  brand. Strong strategically, high-risk commercially — a good candidate for a live
  A/B test rather than a launch commitment.
- **Duos as final sale.** UK/EU distance-selling rules give a statutory cancellation
  right that generally cannot be waived. Personalised or made-to-order goods are
  exempt, and POD *may* qualify — but a stock blank with a brand label attached is
  not obviously personalised. Worth a real legal check before publishing
  "no return path exists by construction" to any market outside the US.

---

# The split — measured, and the one thing still blocking it

The brand call was: *split if the cuts can be matched or coordinated; otherwise keep
the colour names and move to AS Colour.* Here is what the catalog actually says.

## The split is forced, not optional

**Apliiq's entire Comfort Colors range is 13 products, and every one is a top** ✅ —
tees, hoodies, crews, long-sleeves, a tank. There are **no Comfort Colors bottoms on
Apliiq at all**. So the six-colour core four cannot be built single-house on Comfort
Colors under any arrangement. Either the palette splits across houses, or it leaves
Comfort Colors.

## The candidate: Comfort Colors tops + Independent Trading Co pigment-dyed bottoms

Apliiq carries **Independent Trading Co PRM50PTPD Pigment Dyed Fleece Joggers** and
**PRM50STPD Pigment Dyed Fleece Shorts** ✅ — a matched pant *and* short in one
family.

Why this is the right shape for the "cuts coordinated" condition:

- **Same dye process.** Comfort Colors is garment-dyed; ITC's PD line is pigment-dyed.
  Both produce the washed, slightly uneven hand that garment dyeing gives, so the two
  coordinate on *finish and character*, not merely on a hex value. A garment-dyed top
  over a piece-dyed bottom is the mismatch that reads wrong on a body; this avoids it.
- **Everything stays on Apliiq**, so the woven label — which the system flow doc
  correctly identifies as the moat — survives intact. This is the split that costs
  nothing structurally.
- **A matched pant/short pair in one family is a structural advantage over AS
  Colour**, where no shorts style carries more than three colours and each colour
  implies a different silhouette (Cypress only in a walk short, Shadow only in an
  active short). ITC offers one silhouette family across both bottoms.

## What still blocks it

**Whether Comfort Colors tops and ITC pigment-dyed bottoms actually share
colourways.** ❓ This is the whole question and it is not answerable from here:

- `independenttradingco.com` returns 429 to automated requests.
- `alphabroder.com` and `ssactivewear.com` return 403 without a browser fingerprint.
- `comfortcolors.com` is a client-rendered SPA; colours are not in the HTML.
- Chromium cannot traverse this environment's agent proxy, so rendering is unavailable.

**`get_product` against Apliiq answers it directly** — both houses are in Apliiq's
catalog, so one authenticated call per style resolves it. That makes API credentials
(issue #1, handoff blocker #3) the gate on the palette decision, not just on the
smoke test.

## Fallback, if the overlap turns out thin

Keep **Jet / Bone / Moss / Clay / Slate / Umber as brand language** and re-point them
at AS Colour hexes. The colour names are brand IP and do not have to map to a
supplier's dye names — AS Colour already ships a "Bone" (`#D1CDCA`) against Comfort
Colors Ivory (`#E7CEB5`). The vocabulary survives a change of house; only the hexes
move.

## What to check the moment credentials land

1. `get_product` on Comfort Colors 1717 (Apliiq "Comfort Colors Heavyweight T-Shirt")
   — full colour list with hexes.
2. `get_product` on ITC PRM50PTPD and PRM50STPD — same.
3. Run both through `ascolour-tonal-match.mjs` (the `CAT` map takes any house) to get
   SOLID and STEP counts for the split.
4. Compare against AS Colour's 5 solid / 14 stepped. **If the split does not beat
   that, take the fallback** — a coordinated dye process is not worth a materially
   smaller matrix.
