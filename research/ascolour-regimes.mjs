import { readFileSync, readdirSync } from 'node:fs';

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
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function ok(hex) {
  const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(.4122214708*r + .5363325363*g + .0514459929*b);
  const m = Math.cbrt(.2119034982*r + .6806995451*g + .1073969566*b);
  const s = Math.cbrt(.0883024619*r + .2817188376*g + .6299787005*b);
  return {
    L: .2104542553*l + .7936177850*m - .0040720468*s,
    C: Math.hypot(1.9779984951*l - 2.4285922050*m + .4505937099*s, .0259040371*l + .7827717662*m - .8086757660*s),
    h: (Math.atan2(.0259040371*l + .7827717662*m - .8086757660*s, 1.9779984951*l - 2.4285922050*m + .4505937099*s) * 180 / Math.PI + 360) % 360,
  };
}
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const NEUTRAL_C = 0.025;

const byCat = {};
for (const f of readdirSync('.').filter(f => f.startsWith('as_') && f.endsWith('.html'))) {
  const cat = CAT[f.slice(3, -5)];
  if (!cat) continue;
  for (const [, n, h] of readFileSync(f, 'utf8').matchAll(RE)) {
    (byCat[cat] ??= new Map()).set(n.trim().toUpperCase(), h.toUpperCase());
  }
}
const asList = c => [...byCat[c]].map(([n, hex]) => ({ n, hex, ...ok(hex) }));

// "Same colour family" — the hue/chroma half of the rule, shared by every regime.
function sameFamily(a, b) {
  if (Math.abs(a.C - b.C) > 0.045) return false;
  if (a.C < NEUTRAL_C && b.C < NEUTRAL_C) return true;
  return gap(a.h, b.h) <= 22;
}

const DEAD_LO = 0.10;   // below this a step reads as a mistake, not a decision
const STEP_LO = 0.13, STEP_HI = 0.22;  // the band that reads as deliberate
const STEP_MAX = 0.34;

/**
 * Which pieces in `cat` can serve for anchor colour `a` under a given regime?
 * `dir` is +1 when this garment should sit lighter than the anchor.
 */
function candidates(a, cat, regime, dir) {
  return asList(cat).filter(p => {
    if (p.n === a.n) return true;                       // exact match always allowed
    if (regime === 'strict') return false;
    if (!sameFamily(a, p)) return false;
    const dL = (p.L - a.L) * dir;
    if (dL <= 0) return false;
    if (regime === 'safe') return dL >= STEP_LO && dL <= STEP_HI;
    return dL >= DEAD_LO && dL <= STEP_MAX;             // 'wide'
  });
}

function report(label, regime, stepCats) {
  const anchors = asList('TEE');
  const fits = [];
  for (const a of anchors) {
    const parts = {};
    let complete = true;
    for (const cat of ['CREW', 'PANT', 'SHORT']) {
      const reg = stepCats.includes(cat) ? regime : 'strict';
      const c = candidates(a, cat, reg, +1);
      if (!c.length) { complete = false; break; }
      parts[cat] = c;
    }
    if (!complete) continue;
    const exact = ['CREW', 'PANT', 'SHORT'].every(c => parts[c].some(p => p.n === a.n));
    fits.push({ a, parts, exact });
  }
  const solid = fits.filter(f => f.exact).length;
  console.log(`${label.padEnd(42)} complete core-four fits: ${String(fits.length).padStart(2)}   (solid ${solid}, stepped ${fits.length - solid})`);
  return fits;
}

console.log('=== COMPLETE CORE-FOUR FITS (tee+crew+pant+short, one hue family) ===\n');
report('1. Strict — exact hex everywhere', 'strict', []);
report('2. Step on SHORT only, safe band', 'safe', ['SHORT']);
report('3. Step on SHORT only, wide band', 'wide', ['SHORT']);
report('4. Step anywhere, safe band (0.13-0.22)', 'safe', ['CREW', 'PANT', 'SHORT']);
const wide = report('5. Step anywhere, wide band (0.10-0.34)', 'wide', ['CREW', 'PANT', 'SHORT']);

console.log('\n=== REGIME 4 (step anywhere, safe band) — the buildable fits ===');
for (const f of report('', 'safe', ['CREW', 'PANT', 'SHORT'])) {
  const pick = c => { const e = f.parts[c].find(p => p.n === f.a.n); return e ? `${e.n}*` : f.parts[c][0].n; };
  console.log(`  ${f.a.n.padEnd(18)} ${f.a.hex}  crew:${pick('CREW').padEnd(20)} pant:${pick('PANT').padEnd(20)} short:${pick('SHORT')}`);
}
console.log('\n  (* = exact match on that piece)');

console.log('\n=== HOW MANY ANCHORS SIT IN THE DEAD BAND (0.06-0.10) FOR SHORTS ===');
let dead = 0;
for (const a of asList('TEE')) {
  for (const s of asList('SHORT')) {
    if (s.n === a.n || !sameFamily(a, s)) continue;
    const dL = s.L - a.L;
    if (dL > 0.06 && dL < DEAD_LO) { dead++; console.log(`  ${a.n} -> ${s.n}  ΔL=${dL.toFixed(3)}`); }
  }
}
console.log(`  total pairings that must be excluded: ${dead}`);
