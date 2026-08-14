# Market research prompt — for a claude.ai chat session

Paste the block below into a fresh chat session **with web search enabled**. It is
deliberately self-contained: chat has no access to this repo, so every fact it
needs is restated inline.

**Return path.** Whatever comes back gets merged into `pod-suppliers.md` (evidence,
with confidence marks) and `CLAUDE.md` (any rule that actually changes). Do not let
it live only in a separate document — `unit-color-system.html` is already cited as a
source of truth and is missing from this repo (issue #6). Same failure mode.

**Re-run it** when the palette or positioning changes materially. Update the facts
in the prompt first; stale premises produce confidently wrong research.

---

## The prompt

> I'm building a streetwear brand and need a market research pass on a design rule
> I've just committed to. I want you to try to break it, not confirm it — if the
> evidence supports it, say so, but I'm specifically looking for the case against.
> Use web search and cite sources.
>
> **The brand.** Accessible premium streetwear, positioned above Uniqlo U's value
> tier and below Fear of God Essentials / Represent. Tee $35–45, crewneck $55–70,
> pant/short similar to crewneck, socks $22–30. Print-on-demand to start (zero
> MOQ, so no inventory risk but thinner margins), moving to low-MOQ manufacturing
> later. The differentiator is not the earth-tone palette — that lane is crowded —
> it's a systemized, engineered-spec-sheet identity.
>
> **The core rule.** Every piece is designed to be worn as a full monotone fit, one
> colour head to toe. That's the default and the lead marketing story. The sellable
> line is "one colour, head to toe."
>
> **The rule I need checked.** "Monotone" means one *hue*, not one *hex*. Pieces may
> sit at different lightness values, stepping lighter as they go down the body — so
> a fit reads as one colour but has a deliberate break at the waist rather than
> being a flat block. Two grades, both sold as intentional:
>
> - **SOLID** — every piece the same colourway, exact hex match.
> - **STEP** — same hue family, one deliberate lightness step, specified as a ΔL
>   value (e.g. "STEP −0.15L").
>
> Matching is computed in OKLCh: hue within 22° (or both near-neutral), chroma
> within 0.045, lightness up by ΔL 0.13–0.22. ΔL 0.06–0.10 is a *forbidden* band —
> close enough to read as a laundry accident rather than a decision, and close
> enough that dye-lot variation swamps it.
>
> Storefront plan: badge each fit SOLID or STEP, show the ΔL as a spec value, make
> the grade a filter rather than a caveat, never use wording like "exact /
> approximate" that frames one as degraded.
>
> **Full disclosure on where this came from, because it affects how much you should
> trust it.** It started as an aesthetic instinct. It then turned out to also solve
> a supply constraint: my blank supplier's shorts styles carry at most three colours
> each, which capped a strict hex-matched matrix at 5 complete four-piece fits.
> Allowing steps across the whole palette takes that to 14. So "design and supply
> agree" — which is either genuine convergence or me rationalising a constraint, and
> I can't tell from the inside. That's the main thing I want you to stress-test.
>
> **Research questions, roughly in order of how much they'd change my mind:**
>
> 1. **Does anyone sell an explicit match grade?** Prior art for surfacing a
>    tonal-match spec as a product attribute — in apparel, paint, furniture, or
>    anywhere else. If nobody does it, is that because it's novel, or because it's
>    been tried and customers read it as a defect disclosure?
> 2. **Does the "set" purchase actually happen at $35–70 a piece?** The whole
>    monotone thesis assumes people buy two or three pieces to build a fit. Is that
>    real buyer behaviour at this price point, or do people buy one piece and pair
>    it with what they own? Evidence on attach rate / basket size for matching
>    sets in this tier.
> 3. **Is tonal / head-to-toe dressing a durable position or a passing moment?**
>    I need to know if I'm building on a trend that's already peaking. Look for
>    evidence either way, including search-interest trends and what's happened to
>    brands that led with it.
> 4. **Does spec-sheet language read as premium or as pretentious** to the actual
>    buyer in this tier? "STEP −0.15L" is either the most on-brand thing here or
>    insufferable, and I genuinely don't know which. Any evidence on technical-spec
>    merchandising in consumer apparel — where it works, where it backfires.
> 5. **Is 14 colourways too many to launch with?** What do comparable brands
>    actually launch with, in colourway count and SKU count? I can produce all 14
>    at zero MOQ, but that's not the same as it being a good idea merchandising-wise.
> 6. **Pricing:** does a stepped set command the same price as a solid set, or do
>    customers discount "not quite matching"? Any read on this.
> 7. **Brand name.** Working name is "Unit". Both "Unit" and "Tones" were checked
>    and have existing apparel trademark conflicts. I need a fresh read on whether
>    "Unit" is workable in apparel and, if not, what the realistic options are.
>
> **How to answer.** Mark every claim with its evidence quality — ✅ confirmed from
> a primary source (brand's own site, filing, published data), 🟡 secondary source
> (review site, trend piece, comparison article), ❓ unknown or not findable. I'd
> rather have five ✅ claims than thirty 🟡 ones. Where you find nothing, say so
> explicitly rather than inferring — "no evidence found" is a useful answer.
>
> Finish with two short sections: **"What should change"** (concrete edits to the
> rule or the storefront plan, if any) and **"What I'd need to test rather than
> research"** (things no amount of desk research settles, that need a real
> audience).

---

## What this pass is deliberately not for

- **The blank house decision.** Settled enough: staying on Apliiq, moving to AS
  Colour. Reopening it in a chat session without the catalog data will produce
  confident noise.
- **Supply and catalog facts.** Those come from `get_product` against the Apliiq
  API, not from search. See issue #1.
- **The colour maths.** Already computed from real hex values in
  `research/ascolour-regimes.mjs`. Chat cannot improve on it and may contradict it
  from memory.
