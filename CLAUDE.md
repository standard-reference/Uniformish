# Project Context — Unit (working name)

This file is project-wide context, not a task spec. It exists so any Claude Code session — this one or a future one — has the full picture without re-explaining it. Task-specific detail lives in companion files (see bottom).

## What this is

A streetwear brand built around a color system, not just a palette. Positioning: accessible premium, sitting above Uniqlo U's value tier and below Fear of God Essentials/Represent's premium tier — the differentiator is the systemized, engineered-spec-sheet identity, not the earth-tone aesthetic itself (that lane is already crowded).

## The core rule

**Vertical is mandatory, horizontal is optional.** Every piece is designed first to be worn as a full monotone fit, one color head to toe — that's the default, the lead marketing story, and the thing every piece is designed around. Mixing colors across a "row" is a *guarantee* (matched value/chroma across all six hues means any two will read as intentional), not something the brand pushes as equally primary. This was a deliberate pivot from an earlier "two equal axes" framing — monotone-first is simpler to say, easier to sell, and lower QA burden on early production.

### The tonal-step rule — one hue, value steps down the body

**"Monotone" means one hue head to toe, not one hex.** A fit is built from a single hue family, and pieces may sit at different lightness values, stepping *lighter* as they go down the body. The fit still reads as one colour; the value step gives a deliberate break instead of a flat block.

Two grades, and both are features:

- **Solid** — every piece the same colourway, exact hex.
- **Step** — same hue family, one deliberate value step. Specified as a ΔL, e.g. `−0.15L`.

This started as an aesthetic call about shorts and turned out to be structural. No AS Colour shorts style carries more than three colours, so strict hex matching caps the system at 5 complete core-four fits. Applying the step rule to shorts *only* changes nothing — pant immediately becomes the binding constraint. Applying it **across the whole palette** takes complete fits to **14** (5 solid, 9 stepped). Design and supply point the same way, which is usually a sign the rule is right rather than a rationalisation.

**The rule is measured, not eyeballed.** Pairings are matched in **OKLCh** — perceptually uniform, so one step means the same thing on a dark green as on a pale sand. Hue within 22° (or both near-neutral, where hue angle is meaningless); chroma within 0.045; lightness up by ΔL 0.13–0.22.

**ΔL 0.06–0.10 is a forbidden band, not a lesser grade.** Close enough to read as a laundry accident rather than a decision, and dye-lot variation can swamp it outright. Eight otherwise-valid pairings are excluded by this and must stay excluded.

**Direction is fixed: never darker going down.** A consistent gradient reads as design; a random one reads as accident.

Worth knowing when weighing "solid" against "step": exact hex matching across *different fabrics* is already partly illusory — a jersey tee, a fleece crew and a woven short take the same dye differently. Solid is less solid than it sounds, which is a further argument for specifying the step deliberately rather than chasing a match that the substrate won't hold.

Full working and the matching script in `pod-suppliers.md` and `research/`.

#### A STEP must be sourced, not computed

**You cannot order a computed hex.** Apliiq ships stock dye lots; a specified hex is only achievable through sublimation, which is why the patterns, socks and Slip-On sit with Printful.

So the workflow is: compute the target (anchor + ΔL 0.15, hue and chroma held), then **snap it to the nearest real colourway in the supplier's range**, then re-check the snapped result against the match spec. If nothing in range lands outside the forbidden band, **that STEP does not exist** and the colour ships SOLID-only. `research/ascolour-tonal-match.mjs` does exactly this snap.

Getting this backwards is the easiest mistake to make here, because the maths is clean and self-consistent and looks finished. It was made once already — see `research/spec-reconciliation.md`.

#### Surfacing it in the storefront

The match grade is **merchandising, not a disclosure**. Both grades are sold as deliberate; neither is presented as the compromised version of the other.

- Badge every fit **`SOLID`** or **`STEP`**. Never "exact / approximate", never "close match" — any wording implying one is a degraded version of the other invites the customer to read Step as a defect.
- On a Step fit, show the actual spec: `STEP −0.15L`. This is the engineered-spec-sheet identity doing real work — it is the same move as printing GSM on a tee, and it is not copyable by a competitor who just bought two black blanks.
- Let the grade be a **filter**, so a customer who wants the pure block can get it and a customer who wants the break can get that. A filter reads as choice; a caveat reads as apology.
- The headline rule on the site stays **"one colour, head to toe."** That is still literally true under the step rule — one *hue*. The grade lives in the product spec, one level down, where someone who cares goes looking.

This is why widening to steps does not cost the brand its simple hook. The sellable line is unchanged; what changes is that the spec sheet now has something worth reading on it.

## The six colors

Sourced as real, orderable blanks — Comfort Colors (via Apliiq) for garments. Approximated hex values below are close enough to build against; confirm against a physical swatch before locking a print run.

> **⚠️ This table is provisional as of the first build session.** The palette is **no longer locked** — the brief became *best quality, best cuts, best fit*, and colours will be taken from whatever the chosen blank house actually offers. The design logic below (the value/chroma band) survives that change and is what to match against; the specific hexes and the Comfort Colors sourcing may not. See `pod-suppliers.md`.
>
> **⚠️⚠️ Further: "six" is resolved, but not as six.** AS Colour has been measured against the real matrix (`pod-suppliers.md`). A colourway *does* carry from tee to sweatpant — six do at exact hex. Across the full core four, exact matching gives only **three** (Bone, Athletic Heather, Black), because no AS Colour shorts style carries more than three colours.
>
> **The tonal-step rule fixes this** — see "The core rule" below. Applied across the *whole* matrix it takes complete core-four fits from **5 to 14**. Applied to shorts alone it achieves nothing (pant immediately becomes the binding constraint), which is why the rule is palette-wide rather than a shorts exception. The palette should be re-derived from that list, not from the table below, which is now historical.

| Code | Brand name | Hex | Sourced as |
|---|---|---|---|
| C1 | Jet | `#443E3A` | Comfort Colors "Pepper" |
| C2 | Bone | `#E7CEB5` | Comfort Colors "Ivory" (confirmed hex) |
| C3 | Moss | `#7E8873` | Comfort Colors "Moss" — same name |
| C4 | Clay | `#B36A48` | Comfort Colors "Terracotta" |
| C5 | Slate | `#425563` | Comfort Colors "Denim" (confirmed hex) |
| C6 | Umber | `#A69F88` | Comfort Colors "Sandstone" |

Design logic: all six sit in the same narrow band of value and chroma (tonal harmony), which is *why* any two can be worn together and still read as chosen. This matters more than matching any individual hex exactly — if a color needs substituting later, match it to this band, not to a hue on a color wheel.

## The product matrix — 6 colors × 8 silhouettes

| Code | Item | Status |
|---|---|---|
| T | Tee | core |
| CN | Crewneck | core |
| HD | Hoodie | **later** — self/POD-manufacture cost too high to launch with |
| PT | Pant | core |
| SH | Shorts | core |
| JK | Jacket | **later** — same reason as Hoodie |
| SK | Sock (solid) | core — separate product from the patterned Cross socks below |
| SO | Slip-On | **outsource** — footwear was never going to be self/POD-made regardless of demand |

**Open risk — reframed, and now partly measured:** Apliiq's Pant/Shorts blanks run through different suppliers (Bella Canvas, AS Colour, Independent Trading Co) than the Comfort Colors tees/tops. The six-color match is confirmed for Tee/Crewneck; it is *not* confirmed for Pant/Shorts.

The original framing was *match the bottoms to the Comfort Colors tops*, choosing between as-close-as-possible or 2–3 hero colors. **That framing is now superseded.** Since the palette is no longer locked, the better move is to pick **one blank house that makes the entire matrix**, so the monotone rule holds by construction instead of by cross-brand colour matching. AS Colour is the leading candidate — it spans tees, crews, shorts and pants, and Apliiq carries **243** of its products (vs 13 Comfort Colors).

The question this hinged on — *does a given AS Colour colourway exist in both a tee and a sweatpant?* — is **answered: yes, six do.** But the full core four narrows to three, and shorts are the reason. The open item is no longer research, it is the brand call about how many colours the matrix ships at. See `pod-suppliers.md` and issue #4.

## Cross line — the patterned accessory system

Two pattern flavors, deliberately **interleaved, not firewalled** — pairing a considered monotone fit with a "doesn't care" patterned sock (or vice versa) is the actual point, not a risk to be managed. (This corrected an earlier instinct to keep the flavors ratio-controlled/separated — that was wrong; mixing them is the mechanic.)

- **Bridge** — sophisticated tonal patterns, each built from 3 of the 6 core colors (Warm Bridge, Cool Bridge, Anchor Bridge)
- **Novelty** — character/graphic motifs (e.g. "avocado in sunglasses"), still palette-locked to the 6 colors so it stays legible as the same brand
- **Production home: Printful, via sublimation, permanently** — not a stopgap. Sublimation prints across the whole surface rather than onto pre-dyed stock, so it hits exact hex values with zero MOQ. This is confirmed *better* for socks than jacquard would have been.
- **Sock length: crew, not ankle** — more leg-panel canvas for the pattern to actually read.

## How a fit gets sold — the floor

From the system flow doc (`unit-system-flow.html`), and not previously recorded here.

- **Minimum two pieces, same colourway, every order.** No single-item checkout. Stated as a rule — "we don't sell orphan pieces" — not implemented as an upsell.
- **Enforcement stops at checkout.** The floor governs what ships, not what gets worn. Nothing polices the pair after the sale and nothing should; the identity lives in the object (woven label, grade, code) whether the pieces are worn together or not.
- **Kit** — 3–4 pieces as one bundled SKU. The only path Aftercare applies to.
- **Duo** — two pieces listed individually and grouped at cart, not a bundled SKU. Two anchors: tee + bottom, or tee + slip-on.
- **Grade drives the path.** SOLID pairs with what someone already owns, so it's à-la-carte-friendly. STEP only reads as a decision in combination, so it's kit-first. Socks are upsell-only — they don't clear the floor alone.
- **Returns: Kits only.** Duos are grouped from individually final-sale pieces, so there's nothing to partially unwind. A return can size a Kit down but never below the two-piece floor. Handled personally — neither Apliiq nor Printful covers buyer's-remorse returns, so it's a cost carried on purpose and priced into Kit margin.

**Two open risks on this, flagged and not yet resolved:**

1. The floor puts a **~$90–115 minimum on a first order** from an unknown brand. It forces the set-purchase behaviour rather than testing whether it exists. Strong strategically, high-risk commercially — a better A/B test than launch commitment.
2. **"Final sale" on Duos needs a legal check outside the US.** UK/EU distance-selling rules give a statutory cancellation right that generally cannot be waived. Made-to-order goods are exempt and POD *may* qualify, but a stock blank with a brand label attached is not obviously personalised.

Also unresolved by design rather than by data: whether the Duo cart rule (block checkout on an unmatched single piece) is supported by the storefront platform. Confirm before this goes live.

## Manufacturing & sourcing

- **Garments (Tee/Crewneck/Pant/Shorts):** Apliiq, zero-MOQ, private-labeled. **The vendor is settled; the blank is not** — Comfort Colors was the original pick, but AS Colour is the leading candidate on cut/fit and full-matrix coverage. Apliiq itself stays because its sewn-in woven labels are the moat and no competitor offers them. See `pod-suppliers.md`. This is the capital-constrained launch path — chosen specifically because building the full 6-color matrix through a real low-MOQ factory would run **$20–40K+** upfront (MOQ multiplies per color, not just per style).
- **Socks (solid + Cross patterns):** Printful, sublimation, permanent — see above.
- **Slip-On:** outsource only, no path through Apliiq/Printful established yet.
- **Scaling path, once Apliiq margins are the constraint, not capital:** a real low-MOQ manufacturer (e.g. Argyle Haus-tier, ~$18–65/unit at 50-unit minimums) — but narrow to 2 hero colors first (~$8–12K realistic first batch), not the full six at once.
- **Hoodie/Jacket move off "later"** only after Tee/Crewneck/Pant/Shorts have validated fit and real demand.

## Pricing (validated against Essentials/Uniqlo U/Asket comps)

- Tee: $35–45
- Crewneck: ~$55–70
- Pant/Shorts: similar range to Crewneck, tbd exact
- Hoodie/Jacket (once live): $70–95 / higher
- Socks (solid + Cross): $22–30

Positioning explicitly is *not* fast fashion (can't win on scale/price as a POD/low-MOQ brand) — it's accessible premium, priced clearly above Shein-tier, below hype/luxury.

## Tech architecture

- **Shopify** — backend of record: checkout, payments, tax, and order routing. The native Apliiq↔Shopify app handles fulfillment automation; this is *not* being rebuilt custom.
- **Custom frontend** — built via Claude Code, using Shopify's **Storefront API** for product/cart data, handing off to Shopify's hosted checkout for payment. This is headless commerce, not a conflict with "custom frontend + Shopify backend" — Apliiq's fulfillment automation still fires because the order still lands in Shopify regardless of who built the browsing UI.
- **Shopify Dev MCP** — local, dev-time only, gives Claude Code the Storefront/Admin API schema while building. Not the same thing as the official Shopify-Claude connector (store management) or Storefront MCP (ambient AI-shopping-agent discovery) — those are separate, unrelated to this build.
- **Apliiq MCP** — custom-built (see `apliiq-mcp-spec.md`). HMAC-signed auth, not a bearer token. **Local/stdio only for now, inside Claude Code — no hosting.** Architected with a client/transport split specifically so remote hosting (Cloudflare Workers) can be added later without a rewrite, if/when there's a real reason to query Apliiq from claude.ai chat instead of a coding session.

## Launch sequence

1. Choose the blank house and re-derive the palette from its real range (open risk above; `pod-suppliers.md`)
2. Apliiq MCP built and tested (built; **not yet verified against the live API** — see `HANDOFF.md`)
3. Shopify store created, Apliiq app connected, four core products + Cross socks listed
4. Sizes locked (2–3), care/fiber labels sorted
5. First 10 sold via payment link + Instagram — no full storefront needed yet
6. Real photos: founder-modeled, shot by a connected photographer — resourced, not a blocker
7. Custom frontend built against Storefront API once real products exist in Shopify — the existing interactive sheet (`unit-color-system.html`) is most of this UI already; it needs wiring to real product/variant data, not a rebuild
8. Hoodie/Jacket/Slip-On graduate off "later" only after step 5 validates demand

## Marketing (low-cost, no paid ads early)

The system itself is the content — "one rule, one color" and the cares/doesn't-care Bridge/Novelty sock pairing are both native short-form hooks. Founder-modeled photos + a pre-launch waitlist landing page. Seed 5–10 micro-creators with free product instead of paid reach. Paid ads deliberately deferred until there's a pixel with real data.

## Companion files in this project

- `HANDOFF.md` — **read this first in a new session.** Current state, blockers needing a human, and the suggested order of work.
- `pod-suppliers.md` — running comparison of POD platforms and blank houses, with evidence marked confirmed / unverified. Where the manufacturing decision gets made.
- `unit-system-flow.html` — **the interactive spec sheet, now in the repo.** Traces the whole path: supply, palette and grades, patterns, items, assembly, aftercare, roadmap. Canonical source for exact wording and spec values; this doc is the summary. Supersedes the never-committed `unit-color-system.html` (issue #6).
- `research/spec-reconciliation.md` — where the spec sheet and these notes disagreed, and why. Read before trusting either in isolation.
- `apliiq-mcp-spec.md` — the current active build target. Auth flow, tool list, architecture, open gaps.
- `apliiq-mcp/` — the MCP server itself, with its own README covering setup and the assumptions still needing live verification.

## Open items — don't assume these are resolved

- Blank house choice, and the palette that follows from it (see Product Matrix section and `pod-suppliers.md`)
- Apliiq MCP is built but **unverified against the live API** — signing, endpoint paths and artwork field names are all assumptions until `npm run smoke` passes
- Apliiq API access — confirm it's not gated behind a support/approval step
- Apliiq order creation/status endpoint — auth pattern confirmed, full field-level spec not yet pulled
- Brand name — "Unit" is provisional. Both "Unit" and "Tones" were checked and have existing trademark conflicts in apparel. Not blocking current work; revisit before any public launch.

---

# Working in this repo

*(Section added when the repo was first scaffolded. Everything above is the brand/product context; everything below is how to actually work here.)*

## Layout

```
/                        brand-level context and specs
  HANDOFF.md             READ FIRST in a new session — state, blockers, next actions
  CLAUDE.md              this file — brand and product context
  pod-suppliers.md       POD platform + blank house comparison, evidence for the mfg decision
  apliiq-mcp-spec.md     build spec for the MCP server
  unit-color-system.html MISSING — referenced above, never added to the repo (issue #6)
  apliiq-mcp/            the MCP server (see its own README)
```

`unit-color-system.html` is listed above as a companion file and source of truth for exact color copy, but it is **not in this repo**. Until it is added, treat the color table in this file as the working reference and don't assume wording matches the sheet.

## Ground rules

- **`APLIIQ_SHARED_SECRET` never enters git.** `.env` is gitignored; `.env.example` carries the key names with empty values and is the only env file that gets committed. If a secret is ever committed, rotating it in the Apliiq dashboard is the fix — removing the commit is not sufficient on its own.
- **Don't build against unconfirmed API shapes.** Spec §5 sets this rule for the order endpoints; it applies generally. If a request body's field names haven't been read from Apliiq's docs, the tool doesn't ship — it becomes an issue.
- **Branch and PR, don't push to `main`.** CI runs typecheck + tests on every push and PR.

## Commands

All commands run from `apliiq-mcp/`:

```
npm install
npm run typecheck     # tsc --noEmit
npm test              # node:test, no network required
npm run build         # emit dist/
npm run smoke         # LIVE call to Apliiq — needs .env and network reachability
```
