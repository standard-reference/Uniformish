/**
 * The six-hue colour system.
 *
 * This is brand data, not commerce data. Shopify owns products, variants and
 * prices; this table owns what a hue *is* — its swatch value, the stepped
 * lighter/darker tones used in look blocks, and whether overlaid text needs to
 * flip to dark ink.
 *
 * A Shopify colour option value is matched to a hue by `name`, case-insensitively
 * (see `findHue`). If a store ever offers a colour that isn't in this table the
 * UI falls back to the Storefront swatch, so an unmapped colour degrades to a
 * plain swatch rather than breaking the page.
 */
export type Hue = {
  /** Display name. Must match the Shopify colour option value. */
  name: string;
  /** Internal reference shown alongside the name, e.g. "M-03". */
  code: string;
  /** The hue itself — what "exact match" means for a full look. */
  hex: string;
  /** One step darker. Top of a stepped look. */
  dark: string;
  /** One step lighter. Bottom of a stepped look. */
  light: string;
  /** Two steps lighter. Used for pattern accents. */
  lighter: string;
  /**
   * True when the hue is light enough that text sitting on it must be dark.
   * Set per hue rather than computed so it stays a deliberate call.
   */
  lightTone: boolean;
};

export const HUES: Hue[] = [
  {
    name: 'Jet',
    code: 'J-01',
    hex: '#1C1B19',
    dark: '#121110',
    light: '#55524B',
    lighter: '#7A766E',
    lightTone: false,
  },
  {
    name: 'Bone',
    code: 'B-02',
    hex: '#E8E2D4',
    dark: '#D6CDB9',
    light: '#F1EDE3',
    lighter: '#F8F5EE',
    lightTone: true,
  },
  {
    name: 'Moss',
    code: 'M-03',
    hex: '#4A4F3C',
    dark: '#3C4030',
    light: '#6B7057',
    lighter: '#8B9074',
    lightTone: false,
  },
  {
    name: 'Clay',
    code: 'C-04',
    hex: '#A9634B',
    dark: '#8E5340',
    light: '#C08067',
    lighter: '#D29C85',
    lightTone: false,
  },
  {
    name: 'Slate',
    code: 'S-05',
    hex: '#5A6470',
    dark: '#48505A',
    light: '#7D8794',
    lighter: '#9CA6B2',
    lightTone: false,
  },
  {
    name: 'Umber',
    code: 'U-06',
    hex: '#5C4636',
    dark: '#4A382B',
    light: '#7C6149',
    lighter: '#9B7E62',
    lightTone: false,
  },
];

/** The hue used wherever a page needs a stand-in before one is chosen. */
export const DEFAULT_HUE = HUES[2];

/** The Shopify product option that carries the hue. */
export const HUE_OPTION_NAME = 'Colour';

/**
 * Both spellings, because which one a storefront uses depends on how the
 * product was created and we don't control every path into the admin.
 */
export function isHueOption(name: string): boolean {
  const lowered = name.trim().toLowerCase();
  return lowered === 'colour' || lowered === 'color';
}

/** Match a Shopify colour option value to a hue. Undefined when unmapped. */
export function findHue(name?: string | null): Hue | undefined {
  if (!name) return undefined;
  const needle = name.trim().toLowerCase();
  return HUES.find((hue) => hue.name.toLowerCase() === needle);
}

/** Ink colour for text sitting directly on a hue. */
export function captionInk(hue: Hue): string {
  return hue.lightTone ? 'rgba(26,26,24,0.72)' : 'rgba(255,255,255,0.88)';
}

/** Hairline colour for the inset rule drawn over a hue. */
export function hairline(hue: Hue): string {
  return hue.lightTone ? 'rgba(26,26,24,0.16)' : 'rgba(255,255,255,0.16)';
}
