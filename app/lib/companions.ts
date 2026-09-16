import type {CompanionProductFragment} from 'storefrontapi.generated';
import {isHueOption} from '~/data/hues';

export type CompanionVariant =
  CompanionProductFragment['variants']['nodes'][number];

/** Read one selected option off a variant, case-insensitively. */
export function optionValue(
  variant: {selectedOptions: Array<{name: string; value: string}>},
  name: string,
): string | undefined {
  return variant.selectedOptions.find(
    (option) => option.name.toLowerCase() === name.toLowerCase(),
  )?.value;
}

/** The variant's colour value under either spelling of the option. */
export function hueValue(variant: {
  selectedOptions: Array<{name: string; value: string}>;
}): string | undefined {
  return variant.selectedOptions.find((option) => isHueOption(option.name))
    ?.value;
}

export type CompanionMatch = {
  /** The variant to add to the cart, when one can be chosen. */
  variant?: CompanionVariant;
  /** The companion isn't made in the requested hue at all. */
  missingHue: boolean;
  /** The chosen variant's size isn't the one selected on this page. */
  sizeDiffers: boolean;
};

/**
 * Pick the variant of a companion product that goes with the colourway (and
 * size, where both products use the same size scale) chosen on this page.
 *
 * The three outcomes are kept distinct on purpose, because they are not the
 * same thing and the UI has to say which happened:
 *
 * - **Not made in this hue.** A real answer. The pairing is refused rather than
 *   substituting a near-miss, since a near-miss is the thing the colour system
 *   exists to avoid.
 * - **Made in this hue, different size scale.** Also a real answer, and NOT a
 *   refusal. Socks are sized S/M and L/XL; a short is sized M. An exact string
 *   match fails there, and an earlier version of this function treated that as
 *   "not in Jet" — telling the customer a colour was unavailable when only the
 *   size scale differed, and blocking a pairing that is perfectly valid.
 * - **Nothing available.** Every variant is sold out.
 */
export function matchCompanionVariant(
  product: CompanionProductFragment,
  {colour, size}: {colour?: string; size?: string},
): CompanionMatch {
  const nothing = {variant: undefined, missingHue: false, sizeDiffers: false};

  // Only offer something a customer can actually buy.
  const pool = product.variants.nodes.filter(
    (variant) => variant.availableForSale,
  );
  if (pool.length === 0) return nothing;

  let candidates = pool;

  // Narrow to the hue only when both sides have one. A product with no colour
  // option (a plain tee, say) pairs with any colourway, and a page with no
  // colour of its own can't ask the companion for a particular one.
  const companionHasHue = pool.some((variant) => hueValue(variant));
  if (companionHasHue && colour) {
    const inHue = pool.filter((variant) => hueValue(variant) === colour);
    if (inHue.length === 0) {
      return {variant: undefined, missingHue: true, sizeDiffers: false};
    }
    candidates = inHue;
  }

  // Same size scale: take the exact size.
  const exact = size
    ? candidates.find((variant) => optionValue(variant, 'Size') === size)
    : undefined;
  if (exact) return {variant: exact, missingHue: false, sizeDiffers: false};

  // No size option at all on the companion — nothing to reconcile.
  const unsized = candidates.find((variant) => !optionValue(variant, 'Size'));
  if (unsized) return {variant: unsized, missingHue: false, sizeDiffers: false};

  // Different size scale. Offer the first one and let the UI show which size
  // it is, rather than pretending the piece is unavailable.
  return {variant: candidates[0], missingHue: false, sizeDiffers: true};
}
