# Project Context — Unit (working name)

This file is project-wide context, not a task spec. It exists so any Claude Code session — this one or a future one — has the full picture without re-explaining it. Task-specific detail lives in companion files (see bottom).

## What this is

A streetwear brand built around a color system, not just a palette. Positioning: accessible premium, sitting above Uniqlo U's value tier and below Fear of God Essentials/Represent's premium tier — the differentiator is the systemized, engineered-spec-sheet identity, not the earth-tone aesthetic itself (that lane is already crowded).

## The core rule

**Vertical is mandatory, horizontal is optional.** Every piece is designed first to be worn as a full monotone fit, one color head to toe — that's the default, the lead marketing story, and the thing every piece is designed around. Mixing colors across a "row" is a *guarantee* (matched value/chroma across all six hues means any two will read as intentional), not something the brand pushes as equally primary. This was a deliberate pivot from an earlier "two equal axes" framing — monotone-first is simpler to say, easier to sell, and lower QA burden on early production.

## The six colors

Sourced as real, orderable blanks — Comfort Colors (via Apliiq) for garments. Approximated hex values below are close enough to build against; confirm against a physical swatch before locking a print run.

> **⚠️ This table is provisional as of the first build session.** The palette is **no longer locked** — the brief became *best quality, best cuts, best fit*, and colours will be taken from whatever the chosen blank house actually offers. The design logic below (the value/chroma band) survives that change and is what to match against; the specific hexes and the Comfort Colors sourcing may not. See `pod-suppliers.md`.

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

**Open risk — reframed, still unresolved:** Apliiq's Pant/Shorts blanks run through different suppliers (Bella Canvas, AS Colour, Independent Trading Co) than the Comfort Colors tees/tops. The six-color match is confirmed for Tee/Crewneck; it is *not* confirmed for Pant/Shorts.

The original framing was *match the bottoms to the Comfort Colors tops*, choosing between as-close-as-possible or 2–3 hero colors. **That framing is now superseded.** Since the palette is no longer locked, the better move is to pick **one blank house that makes the entire matrix**, so the monotone rule holds by construction instead of by cross-brand colour matching. AS Colour is the leading candidate — it spans tees, crews, shorts and pants, and Apliiq already carries it.

This hinges on one unanswered question: does a given AS Colour colourway exist in both a tee and a sweatpant? See `pod-suppliers.md` and issue #4.

## Cross line — the patterned accessory system

Two pattern flavors, deliberately **interleaved, not firewalled** — pairing a considered monotone fit with a "doesn't care" patterned sock (or vice versa) is the actual point, not a risk to be managed. (This corrected an earlier instinct to keep the flavors ratio-controlled/separated — that was wrong; mixing them is the mechanic.)

- **Bridge** — sophisticated tonal patterns, each built from 3 of the 6 core colors (Warm Bridge, Cool Bridge, Anchor Bridge)
- **Novelty** — character/graphic motifs (e.g. "avocado in sunglasses"), still palette-locked to the 6 colors so it stays legible as the same brand
- **Production home: Printful, via sublimation, permanently** — not a stopgap. Sublimation prints across the whole surface rather than onto pre-dyed stock, so it hits exact hex values with zero MOQ. This is confirmed *better* for socks than jacquard would have been.
- **Sock length: crew, not ankle** — more leg-panel canvas for the pattern to actually read.

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
- `unit-color-system.html` — the interactive spec sheet. Canonical source for the full color rationale copy, the product grid, and the Cross pattern cards. Treat as source of truth for exact wording/values; this doc is the summary. **Missing from the repo — see issue #6.**
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
