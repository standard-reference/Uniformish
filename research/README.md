# research/

Throwaway-but-worth-keeping scripts behind decisions recorded in `pod-suppliers.md`.

## `ascolour-tonal-match.mjs`

Produced the colour matrix in `pod-suppliers.md` → "The fix: tonal break".

Reads saved AS Colour product pages, pulls each colour's name and hex out of the
swatch markup, converts to **OKLCh**, and finds pairs where a shorts colour reads
as "the same colour as the top, one step lighter" — hue within 22° (or both
near-neutral, where hue angle is meaningless), chroma within 0.045, lightness up
by ΔL 0.06–0.34.

OKLCh rather than raw RGB or HSL because it is perceptually uniform: a ΔL of 0.15
is the same *apparent* step on a dark green as on a pale sand, which is exactly
the property the tonal rule needs.

**It expects `as_<product-handle>.html` files in the working directory.** They
aren't committed — they're ~250KB each of vendor HTML that will drift. To
regenerate:

```bash
# product handles come from https://ascolour.com/xmlsitemap.php?type=products&page=1
curl -sSL -A "Mozilla/5.0" "https://ascolour.com/staple-tee-5001/" -o as_staple-tee-5001.html
# ...repeat for each handle in the CAT map at the top of the script
node ascolour-tonal-match.mjs
```

The `CAT` map at the top assigns each handle to TEE / CREW / HOOD / PANT / SHORT.
Add handles there to widen the sample.

**Known limitation, and it bit once already:** an early version of this analysis
sampled only two shorts styles and concluded the shorts category held four
colours. It holds fifteen. The real constraint turned out to be that no *single*
shorts style carries more than three. Sample the whole category before drawing a
conclusion from an intersection.

This reads AS Colour's US direct-to-consumer site, which is not necessarily the
wholesale blank range and not necessarily what Apliiq carries. `get_product`
against Apliiq is what makes any of this authoritative — see issue #1.
