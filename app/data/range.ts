/**
 * The range, the size chart and the standing editorial copy.
 *
 * Everything here is brand content that outlives any one Shopify product.
 *
 * `handle` and `basePrice` mirror the live catalogue on smsg1t-j1.myshopify.com.
 * Prices shown to a buyer always come from the Storefront API via `<Money>`, so
 * they arrive already converted to that buyer's currency by Shopify Markets —
 * `basePrice` is the EUR base, used only for roadmap figures on the Shop page
 * and for ordering the range. Never render it as the price of a listed product.
 */
export type Piece = {
  key: string;
  name: string;
  fit: string;
  /** EUR base price. Buyers see a Markets-converted figure from Shopify. */
  basePrice: number;
  /** True once the piece is listed and buyable in the store. */
  listed: boolean;
  /** Shopify product handle. */
  handle: string;
  /** Sizes the live product offers, for reference in the fit guide. */
  sizes: readonly string[];
};

export const PIECES: Piece[] = [
  {
    key: 'crew',
    name: 'Oversized Crewneck',
    fit: 'Oversized',
    basePrice: 62,
    listed: true,
    handle: 'uniform-ish-embroidered-crewneck-sweatshirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    key: 'tee',
    name: 'Heavyweight Tee',
    fit: 'Regular',
    basePrice: 42,
    listed: true,
    handle: 'uniform-ish-embroidered-tee',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
  },
  {
    key: 'sweatpant',
    name: 'Tapered Sweatpant',
    fit: 'Lean',
    basePrice: 64,
    listed: true,
    handle: 'uniform-ish-embroidered-sweatpants',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    key: 'short',
    name: 'Fleece Short',
    fit: 'Relaxed',
    basePrice: 54,
    listed: true,
    handle: 'uniform-ish-embroidered-shorts',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    key: 'sock',
    name: 'Crew Sock',
    fit: 'Cushioned',
    basePrice: 46,
    listed: true,
    handle: 'uniform-ish-embroidered-socks',
    sizes: ['S/M', 'L/XL'],
  },
];

/** The launch piece. Every "shop" call to action points here. */
export const HERO_PIECE = PIECES[0];

/** Pieces offered as the second half of a look, in display order. */
export const COMPANION_KEYS = ['tee', 'sweatpant', 'short', 'sock'] as const;

/** Pieces bundled into a three-piece kit. */
export const KIT_KEYS = ['crew', 'tee', 'sweatpant'] as const;

/** Minimum pieces in one hue per order. The rule the range is built on. */
export const MIN_PIECES_PER_ORDER = 2;

export function getPiece(key: string): Piece | undefined {
  return PIECES.find((piece) => piece.key === key);
}

export function pieceByHandle(handle: string): Piece | undefined {
  return PIECES.find((piece) => piece.handle === handle);
}

/** EUR base total for a set of pieces — a "from" figure, not a quoted price. */
export function baseTotal(keys: readonly string[]): number {
  return keys.reduce((sum, key) => sum + (getPiece(key)?.basePrice ?? 0), 0);
}

export type SizeRow = {
  size: string;
  chestCm: number;
  chestIn: number;
  lengthCm: number;
  lengthIn: number;
  sleeveCm: number;
  sleeveIn: number;
};

/**
 * Oversized crewneck, measured flat, centimetres with inch equivalents.
 * Tolerance ±2cm. Still provisional — to be confirmed against the AS Colour
 * 5160 spec sheet the live product is built on.
 */
export const SIZE_CHART: SizeRow[] = [
  {
    size: 'S',
    chestCm: 57.5,
    chestIn: 22.6,
    lengthCm: 66,
    lengthIn: 26,
    sleeveCm: 52.5,
    sleeveIn: 20.7,
  },
  {
    size: 'M',
    chestCm: 60,
    chestIn: 23.6,
    lengthCm: 68,
    lengthIn: 26.8,
    sleeveCm: 54,
    sleeveIn: 21.3,
  },
  {
    size: 'L',
    chestCm: 62.5,
    chestIn: 24.6,
    lengthCm: 70,
    lengthIn: 27.6,
    sleeveCm: 55.5,
    sleeveIn: 21.9,
  },
  {
    size: 'XL',
    chestCm: 65,
    chestIn: 25.6,
    lengthCm: 72,
    lengthIn: 28.3,
    sleeveCm: 57,
    sleeveIn: 22.4,
  },
  {
    size: '2XL',
    chestCm: 67.5,
    chestIn: 26.6,
    lengthCm: 74,
    lengthIn: 29.1,
    sleeveCm: 58.5,
    sleeveIn: 23,
  },
  {
    size: '3XL',
    chestCm: 70,
    chestIn: 27.6,
    lengthCm: 76,
    lengthIn: 29.9,
    sleeveCm: 60,
    sleeveIn: 23.6,
  },
];

/** Sizes shown in the condensed chart on the home page. */
export const SIZE_CHART_PREVIEW = SIZE_CHART.filter((row) =>
  ['S', 'M', 'L', 'XL'].includes(row.size),
);

export const SIZE_CHART_FOOTNOTE =
  'Centimetres / inches · measured flat · ±2cm · provisional against the blank spec';

export type ProductTab = {key: string; label: string; body: string};

/**
 * PDP accordion copy for the crewneck. Lives here rather than in the Shopify
 * description because it is the same voice across the site and gets edited as
 * copy, not as merchandising.
 */
export const PRODUCT_TABS: ProductTab[] = [
  {
    key: 'details',
    label: 'Details & fabric',
    body: 'Built on AS Colour’s 5160 blank — 80% cotton, 20% recycled polyester, 320 g/m² heavyweight fleece with a relaxed, drop-shouldered cut and ribbed crew neck, cuffs and hem. Heavy enough to hold its shape through a winter rather than going soft after a month.',
  },
  {
    key: 'fit',
    label: 'Fit notes',
    body: 'Oversized and boxy through the body with a dropped shoulder, and a slightly shorter, wider line than a classic crew. It’s the one deliberately generous cut in a range that otherwise sits lean. Take your usual size for the full relaxed look; size down for something closer to regular fit while keeping the shoulder drop. Model is 183cm / 6′0″ wearing a size L.',
  },
  {
    key: 'care',
    label: 'Care',
    body: 'Cold machine wash inside out with like colours, mild detergent, no bleach or fabric softener. Line dry in shade or tumble dry low. Warm iron on the reverse, avoiding the embroidery. Heavyweight fleece takes a few washes to settle — that is the loft relaxing, not the garment wearing out.',
  },
  {
    key: 'ship',
    label: 'Shipping & production',
    body: 'Made to order: nothing exists until you buy it. Production takes 2–5 business days, then 3–6 business days in transit within the EU and 7–15 further afield. Pieces in one order may ship separately. Shipping is a flat rate by destination and is calculated at checkout.',
  },
];

export type Faq = {q: string; a: string};

export const FAQS: Faq[] = [
  {
    q: 'Why do I have to buy two pieces?',
    a: 'Because one piece on its own can’t do what the brand is for. The whole idea is a single hue head to toe, which needs at least two pieces to exist — so orders come as a duo or a three-piece kit. It’s a styling rule, not a checkout trick, and it stops at the register: nothing polices what you actually wear afterwards.',
  },
  {
    q: 'What’s the difference between the colour options?',
    a: 'Every hue is matched to every other one on the same lightness and chroma band, so any two pieces you put together read as intentional. Within a hue you can go exact — every piece the same colour, hex for hex — or step it, keeping the hue family but going one deliberate shade lighter toward the feet. Both are looks you’d choose on purpose.',
  },
  {
    q: 'Why does it take two weeks?',
    a: 'Nothing here is made until you order it. Rather than guess a season of sizes and colours into a warehouse, we’ve built the whole operation around made-to-order production: each piece is finished once your order lands. That’s 2–5 business days to make, then 3–6 in transit inside the EU and longer further out. The pipeline is genuinely new and we’re still tuning it, so expect those windows to tighten as we go. What the wait buys is no overproduction, no dead stock and no end-of-season clearance pile.',
  },
  {
    q: 'What currency will I be charged in?',
    a: 'Yours, wherever we sell. Prices are set once and converted to your local currency automatically — the figure you see on the product page is the figure you pay, and checkout confirms it before you commit. Any duties or taxes for your destination are shown at checkout too, so there is nothing to work out afterwards.',
  },
  {
    q: 'Can I return part of an order?',
    a: 'Yes — keep what works, send back what doesn’t. Every piece is sold and refunded individually, so a duo or a kit is never all-or-nothing. You have 14 days from delivery to change your mind in the EU and UK, 30 days elsewhere, and return postage is yours unless the piece arrived faulty or wrong. The size guide is still worth two minutes first: it is the cheapest return there is.',
  },
  {
    q: 'Where does it ship from?',
    a: 'Orders are produced at the fulfilment centre closest to you and shipped from there, which is why a parcel to the US does not travel from Europe to reach you. We are based in Spain and ship worldwide. Pieces made at different facilities may arrive in separate parcels, each with its own tracking.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. A tracking link is emailed when the parcel leaves the production facility — not when the label is generated, which is why the first email sometimes takes a few days longer than you’d expect from a stock-holding store.',
  },
];

export type ShippingWindow = {region: string; window: string; rate: string};

/**
 * Transit windows come from the store's published Shipping policy; rates come
 * from the default delivery profile's zones. Keep both in step with Shopify —
 * the published policy is the authoritative version, and a mismatch between it
 * and this table is a consumer-law problem, not a copy inconsistency.
 *
 * Rates are quoted in EUR, the store's base currency, and converted at checkout
 * like everything else.
 */
export const SHIPPING_WINDOWS: ShippingWindow[] = [
  {region: 'Production', window: '2–5 business days', rate: '—'},
  {region: 'Spain', window: '3–6 business days', rate: '€6.99'},
  {region: 'European Union', window: '3–6 business days', rate: '€8.99'},
  {region: 'United Kingdom', window: '4–7 business days', rate: '€12.99'},
  {region: 'Rest of world', window: '7–15 business days', rate: '€12.99'},
];

export const SHIPPING_NOTE =
  'Rates are flat by destination and confirmed at checkout in your own currency, along with any duties or taxes for where it is going.';

/**
 * The standing promises shown on the PDP and in the cart drawer.
 * Kept in one place so the two never drift apart.
 */
export const ORDER_TERMS = [
  {
    title: 'Made to order:',
    body: '2–5 business days to make, then 3–6 days to ship inside the EU and up to 15 further afield. Tracking lands when it leaves the facility.',
    short: 'Made to order: 2–5 days to make, then 3–15 to ship.',
  },
  {
    title: 'Returns, per piece:',
    body: '14 days to change your mind in the EU and UK, 30 days elsewhere — on any single piece, not the whole order. Return postage is yours; anything faulty or wrong is ours.',
    short: 'Returns per piece — 14 days EU/UK, 30 elsewhere.',
  },
  {
    title: 'Secure checkout',
    body: '— Shop Pay, Apple Pay, card. Priced in your local currency, with duties and taxes shown before you commit.',
    short: 'Secure checkout · priced in your local currency.',
  },
];
