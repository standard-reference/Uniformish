/**
 * The range, the size chart and the standing editorial copy.
 *
 * Everything here is brand content that outlives any one Shopify product.
 * Prices marked `confirmed: false` are indicative and render with a `~` — they
 * are roadmap figures, not commerce data, and the Shop page says so.
 *
 * `handle` is the Shopify product handle a piece will be sold under. A piece
 * whose product does not exist in the connected storefront is simply not
 * rendered as buyable; nothing here fabricates a variant.
 */
export type Piece = {
  key: string;
  name: string;
  fit: string;
  /** AUD. Indicative unless `confirmed`. */
  price: number;
  confirmed: boolean;
  /** Shopify product handle, once the piece is listed. */
  handle: string;
};

export const PIECES: Piece[] = [
  {
    key: 'tee',
    name: 'Boxy Tee',
    fit: 'Relaxed',
    price: 59,
    confirmed: false,
    handle: 'boxy-tee',
  },
  {
    key: 'crew',
    name: 'Oversized Crewneck',
    fit: 'Oversized',
    price: 89,
    confirmed: true,
    handle: 'oversized-crewneck',
  },
  {
    key: 'jogger',
    name: 'Tapered Jogger',
    fit: 'Lean',
    price: 99,
    confirmed: false,
    handle: 'tapered-jogger',
  },
  {
    key: 'short',
    name: 'Mid Short',
    fit: 'Lean',
    price: 79,
    confirmed: false,
    handle: 'mid-short',
  },
];

/** The launch piece. Every "shop" call to action points here. */
export const HERO_PIECE = PIECES[1];

/** Pieces offered as the second half of a look, in display order. */
export const COMPANION_KEYS = ['tee', 'jogger', 'short'] as const;

/** Pieces bundled into a three-piece kit. */
export const KIT_KEYS = ['crew', 'tee', 'jogger'] as const;

/** Minimum pieces in one hue per order. The rule the range is built on. */
export const MIN_PIECES_PER_ORDER = 2;

export function getPiece(key: string): Piece | undefined {
  return PIECES.find((piece) => piece.key === key);
}

export function pieceByHandle(handle: string): Piece | undefined {
  return PIECES.find((piece) => piece.handle === handle);
}

/** Indicative prices carry a `~`; confirmed ones don't. */
export function indicativePrice(piece: Piece): string {
  return `${piece.confirmed ? '' : '~'}$${piece.price}`;
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

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
 * Oversized crewneck, measured flat, in centimetres with inch equivalents.
 * Tolerance ±2cm. Still to be confirmed against the final blank spec sheet.
 */
export const SIZE_CHART: SizeRow[] = [
  {
    size: 'XS',
    chestCm: 55,
    chestIn: 21.7,
    lengthCm: 64,
    lengthIn: 25.2,
    sleeveCm: 51,
    sleeveIn: 20.1,
  },
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
  'Centimetres / inches · measured flat · ±2cm · pending final blank spec';

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
    body: 'Sublimated poly knit, brushed on the inside face, with a ribbed crew neck, cuffs and hem. Sublimation puts the dye inside the fibre rather than on top of it, which is exactly why the six hues land on their specified values instead of drifting between batches — and why the colour can’t crack, peel or wash out. A cotton line follows once the same colour tolerances hold on it.',
  },
  {
    key: 'fit',
    label: 'Fit notes',
    body: 'Oversized and boxy through the body with a dropped shoulder, and a slightly shorter, wider line than a classic crew. It’s the one deliberately generous cut in a range that otherwise sits lean. Take your usual size for the full relaxed look; size down for something closer to regular fit while keeping the shoulder drop. Model is 183cm / 6′0″ wearing a size L.',
  },
  {
    key: 'care',
    label: 'Care',
    body: 'Cold machine wash inside out with like colours, mild detergent, no bleach or fabric softener. Line dry in shade or tumble dry low. Warm iron on the reverse only. Because the colour is dyed into the fibre there’s no print layer to protect — treated normally it holds its hue for the life of the garment.',
  },
  {
    key: 'ship',
    label: 'Shipping & production',
    body: 'Made to order: nothing exists until you buy it. Production takes 2–5 business days, then 3–7 business days in transit within Australia — roughly 7–12 business days door to door. Pieces in one order may ship separately. Flat $9 shipping in Australia, free over $150, which a duo clears.',
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
    a: 'Nothing here is made until you order it. Rather than guess a season of sizes and colours into a warehouse, we’ve built the whole operation around made-to-order production: each piece is printed, cut and finished once your order lands. That’s 2–5 business days to make, then 3–7 in transit. The pipeline is genuinely new and we’re still tuning it, so expect those windows to tighten as we go. What the wait buys is no overproduction, no dead stock and no end-of-season clearance pile.',
  },
  {
    q: 'Can I return a duo?',
    a: 'Duos are final sale. They’re two separately-sold pieces grouped at the cart rather than one bundled product, so there’s nothing to partially unwind if only one comes back. Kits are a single product and can be returned whole within 30 days. Since every piece is made to order we can’t resell a return, which is why the window sits on kits rather than on everything — the size guide is the thing to spend two minutes on before you order.',
  },
  {
    q: 'What’s the fabric?',
    a: 'The launch range is a sublimated poly knit — the route that gets the hues onto their exact specified values, since the dye becomes part of the fibre. It’s smooth-faced, brushed inside, and holds colour through washing far better than a printed cotton would. Cotton is planned for a later phase, not this one.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. A tracking link is emailed when the parcel leaves the production facility — not when the label is generated, which is why the first email sometimes takes a few days longer than you’d expect from a stock-holding store. Pieces made on different machines may arrive in separate parcels.',
  },
];

export type ShippingWindow = {region: string; window: string; intl?: boolean};

export const SHIPPING_WINDOWS: ShippingWindow[] = [
  {region: 'Production', window: '2–5 business days'},
  {region: 'Australia', window: '3–7 business days'},
  {region: 'New Zealand', window: '5–10 business days', intl: true},
  {region: 'UK / Europe', window: '7–14 business days', intl: true},
  {region: 'United States', window: '6–12 business days', intl: true},
];

export const SHIPPING_TOTAL = {
  region: 'Typical total, AU',
  window: '7–12 business days',
};

/**
 * The standing promises shown on the PDP and in the cart drawer.
 * Kept in one place so the two never drift apart.
 */
export const ORDER_TERMS = [
  {
    title: 'Made to order:',
    body: '2–5 business days to make, 3–7 days to ship. Tracking lands when it leaves the facility.',
    short: 'Made to order: 2–5 days to make, 3–7 to ship.',
  },
  {
    title: 'Kits return within 30 days.',
    body: 'Duos are two separately-sold pieces, so they’re final sale. Faulty or misprinted pieces are replaced or refunded in full, always.',
    short: 'Kits return within 30 days; duos are final sale.',
  },
  {
    title: 'Secure checkout',
    body: '— Shop Pay, Apple Pay, card. Australian-owned, GST included.',
    short: 'Secure checkout · Shop Pay, Apple Pay, card.',
  },
];
