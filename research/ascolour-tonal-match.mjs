import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const CAT = {
  'staple-tee-5001': 'TEE', 'heavy-tee-5080': 'TEE', 'block-oversized-tee-5052': 'TEE',
  'mens-heavy-crew-5145': 'CREW', 'mens-relax-crew-5160': 'CREW', 'mens-premium-crew-5121s': 'CREW',
  'mens-relax-hood-5161': 'HOOD',
  'mens-relax-track-pants-5932': 'PANT', 'mens-surplus-track-pants-5917': 'PANT',
  'relax-faded-track-pants-5938': 'PANT',
  'relax-track-shorts-18-5933': 'SHORT', 'mens-court-shorts-5910': 'SHORT',
  'active-shorts-18-5620': 'SHORT', 'cargo-walk-shorts-19-5925s': 'SHORT',
  'walk-shorts-18-5929s': 'SHORT', 'mens-stadium-shorts-20-5916': 'SHORT',
  'mens-canvas-shorts': 'SHORT', 'relax-faded-track-shorts-18-5939': 'SHORT',
  'mens-faded-stadium-shorts-19-5916fs': 'SHORT',
};

const RE = /form-option-variant--color' title="([^"]+)" style="background-color: (#[0-9A-Fa-f]{6})/g;

// ---- sRGB hex -> OKLCh. Perceptually uniform, so "lighter by the same amount"
// means the same thing on a green as on a brown.
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function hexToOklch(hex) {
  const [r, g, b] = [1, 3, 5].map(i => srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
}

const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

// Below this chroma a colour reads as a neutral and its hue angle is numerically
// unstable — Bone and Ecru are "the same colour" to the eye regardless of angle.
const NEUTRAL_C = 0.025;

const byCat = {};
const seenIn = new Map(); // colour name -> Set of categories

for (const f of readdirSync('.').filter(f => f.startsWith('as_') && f.endsWith('.html'))) {
  const key = f.slice(3, -5);
  const cat = CAT[key];
  if (!cat) continue;
  for (const [, rawName, hex] of readFileSync(f, 'utf8').matchAll(RE)) {
    const name = rawName.trim().toUpperCase();
    byCat[cat] ??= new Map();
    if (!byCat[cat].has(name)) byCat[cat].set(name, hex.toUpperCase());
    if (!seenIn.has(name)) seenIn.set(name, new Set());
    seenIn.get(name).add(cat);
  }
}

console.log('=== CATEGORY PALETTE SIZES (widened bottoms sample) ===');
for (const c of ['TEE', 'CREW', 'HOOD', 'PANT', 'SHORT']) console.log(`${c.padEnd(6)} ${byCat[c]?.size ?? 0}`);

console.log('\n=== FULL SHORTS PALETTE ===');
const shorts = [...byCat.SHORT].map(([n, hex]) => ({ n, hex, ...hexToOklch(hex) }))
  .sort((a, b) => b.L - a.L);
for (const s of shorts) {
  console.log(`  ${s.n.padEnd(20)} ${s.hex}  L=${s.L.toFixed(3)} C=${s.C.toFixed(3)} h=${s.h.toFixed(0)}${s.C < NEUTRAL_C ? '  (neutral)' : ''}`);
}

// A top colour is usable as an anchor only if it exists in BOTH a tee and a crew.
const anchors = [...byCat.TEE]
  .filter(([n]) => byCat.CREW.has(n))
  .map(([n, hex]) => ({ n, hex, ...hexToOklch(hex), inPant: byCat.PANT.has(n) }));

console.log(`\n=== ANCHORS (in tee AND crew): ${anchors.length} ===`);

/**
 * Does `short` read as "the same colour as `top`, lighter"?
 * Same hue family, clearly lighter, and no chroma jump that would make it
 * read as a different colour rather than a lighter tone of the same one.
 */
function tonalMatch(top, short) {
  const dL = short.L - top.L;
  if (dL < 0.06 || dL > 0.34) return null;          // too close to read, or too far to be tonal
  if (Math.abs(short.C - top.C) > 0.045) return null; // chroma jump breaks the family
  const bothNeutral = top.C < NEUTRAL_C && short.C < NEUTRAL_C;
  const dh = hueGap(top.h, short.h);
  if (!bothNeutral && dh > 22) return null;
  return { dL, dh, bothNeutral };
}

const results = [];
for (const top of anchors) {
  for (const s of shorts) {
    const m = tonalMatch(top, s);
    if (m) results.push({ top, short: s, ...m });
  }
}
results.sort((a, b) => a.dL - b.dL);

console.log(`\n=== BUILDABLE "TONAL BREAK" FITS: ${results.length} ===`);
console.log('top (tee+crew)          short                   ΔL     Δhue   pant in same colour?');
for (const r of results) {
  console.log(
    `${(r.top.n + ' ' + r.top.hex).padEnd(24)}${(r.short.n + ' ' + r.short.hex).padEnd(24)}` +
    `${r.dL.toFixed(3)}  ${r.bothNeutral ? ' n/a ' : String(Math.round(r.dh)).padStart(4) + '°'}   ${r.top.inPant ? 'YES' : 'no'}`);
}

const distinctAnchors = new Set(results.map(r => r.top.n));
console.log(`\nDistinct anchor colours that gain a shorts option this way: ${distinctAnchors.size}`);
console.log([...distinctAnchors].join(', '));

writeFileSync('tonal-results.json', JSON.stringify({ shorts, anchors, results }, null, 2));
