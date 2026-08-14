// Verify the STEP hexes and the Bone gamut claim in unitsystemflow.html.
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function hexToOklab(hex) {
  const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(.4122214708*r + .5363325363*g + .0514459929*b);
  const m = Math.cbrt(.2119034982*r + .6806995451*g + .1073969566*b);
  const s = Math.cbrt(.0883024619*r + .2817188376*g + .6299787005*b);
  return {
    L: .2104542553*l + .7936177850*m - .0040720468*s,
    a: 1.9779984951*l - 2.4285922050*m + .4505937099*s,
    b: .0259040371*l + .7827717662*m - .8086757660*s,
  };
}
const toLch = o => ({ L: o.L, C: Math.hypot(o.a, o.b), h: (Math.atan2(o.b, o.a) * 180 / Math.PI + 360) % 360 });
const hexToLch = hex => toLch(hexToOklab(hex));

function lchToRgb(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180), b2 = C * Math.sin(h * Math.PI / 180);
  const l_ = L + .3963377774*a + .2158037573*b2;
  const m_ = L - .1055613458*a - .0638541728*b2;
  const s_ = L - .0894841775*a - 1.2914855480*b2;
  const l = l_**3, m = m_**3, s = s_**3;
  return [
    +4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
    -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
    -0.0041960863*l - 0.7034186147*m + 1.7076147010*s,
  ];
}
const inGamut = (L, C, h) => lchToRgb(L, C, h).every(v => v >= -1e-4 && v <= 1 + 1e-4);
const toHex = (L, C, h) => '#' + lchToRgb(L, C, h)
  .map(v => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0').toUpperCase()).join('');

const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

const COLORS = [
  { code:'C1', name:'Jet',   hex:'#443E3A', step:'#70675D' },
  { code:'C2', name:'Bone',  hex:'#E7CEB5', step:null },
  { code:'C3', name:'Moss',  hex:'#7E8873', step:'#B0B695' },
  { code:'C4', name:'Clay',  hex:'#B36A48', step:'#E89768' },
  { code:'C5', name:'Slate', hex:'#425563', step:'#6F8088' },
  { code:'C6', name:'Umber', hex:'#A69F88', step:'#DACEA9' },
];

console.log('=== CLAIMED STEP = +0.15L, hue+chroma held from the anchor ===\n');
console.log('color  anchor   step     ΔL(actual)  claimed  Δhue    ΔC       verdict');
for (const c of COLORS) {
  if (!c.step) continue;
  const A = hexToLch(c.hex), S = hexToLch(c.step);
  const dL = S.L - A.L, dh = hueGap(A.h, S.h), dC = S.C - A.C;
  const ok = Math.abs(dL - 0.15) <= 0.02 && dh <= 22 && Math.abs(dC) <= 0.045;
  const band = dL >= 0.13 && dL <= 0.22;
  console.log(
    `${c.name.padEnd(6)} ${c.hex}  ${c.step}  ${dL >= 0 ? '+' : ''}${dL.toFixed(3)}      +0.150   ` +
    `${dh.toFixed(1).padStart(5)}°  ${(dC >= 0 ? '+' : '') + dC.toFixed(3)}   ` +
    `${ok ? 'OK' : 'MISMATCH'}${band ? '' : '  ⚠ OUTSIDE 0.13–0.22 BAND'}`);
}

console.log('\n=== BONE GAMUT CLAIM: "max achievable ΔL is ~0.12 before hitting gamut white" ===');
const B = hexToLch('#E7CEB5');
console.log(`Bone #E7CEB5 -> L=${B.L.toFixed(4)} C=${B.C.toFixed(4)} h=${B.h.toFixed(1)}°`);

// Hold hue and chroma; push lightness until it leaves sRGB.
let maxL = B.L;
for (let L = B.L; L <= 1.0; L += 0.0005) { if (!inGamut(L, B.C, B.h)) break; maxL = L; }
console.log(`Holding C and h exactly: max in-gamut L = ${maxL.toFixed(4)}  ->  ΔL = ${(maxL - B.L).toFixed(4)}`);
console.log(`  claim "~0.12": ${Math.abs((maxL - B.L) - 0.12) < 0.02 ? 'SUPPORTED' : 'NOT SUPPORTED'}`);
console.log(`  clears 0.13 floor holding chroma? ${(maxL - B.L) >= 0.13 ? 'YES' : 'NO'}`);

// The spec permits chroma to move by up to 0.045, so test the real constraint.
let best = { dL: -1 };
for (let dC = -0.045; dC <= 0.045001; dC += 0.0025) {
  const C2 = Math.max(0, B.C + dC);
  let m = B.L;
  for (let L = B.L; L <= 1.0; L += 0.0005) { if (!inGamut(L, C2, B.h)) break; m = L; }
  if (m - B.L > best.dL) best = { dL: m - B.L, C2, L: m };
}
console.log(`\nAllowing chroma to move within the spec's own ±0.045 tolerance:`);
console.log(`  best ΔL = ${best.dL.toFixed(4)} at C=${best.C2.toFixed(4)} (anchor C=${B.C.toFixed(4)})`);
console.log(`  -> ${best.dL >= 0.13 ? 'A COMPLIANT STEP EXISTS: ' + toHex(best.L, best.C2, B.h) : 'still short of the 0.13 floor'}`);

console.log('\n=== DARKER DIRECTION (the Multi-Step section says Bone works darker) ===');
let minL = B.L;
for (let L = B.L; L >= 0; L -= 0.0005) { if (!inGamut(L, B.C, B.h)) break; minL = L; }
console.log(`  min in-gamut L = ${minL.toFixed(4)} -> ΔL down = ${(B.L - minL).toFixed(4)}`);
console.log(`  a darker step at -0.15L would be ${toHex(B.L - 0.15, B.C, B.h)}`);
