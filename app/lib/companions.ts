import type {CompanionProductFragment} from 'storefrontapi.generated';
import {isHueOption} from '~/data/hues';

export type CompanionVariant = CompanionProductFragment['variants']['nodes'][number];

/** Read one selected option off a variant, case-insensitively. */
/** The variant's colour value under either spelling of the option. */
export function hueValue(variant: {
  selectedOptions: Array<{name: string; value: string}>;
}): string | undefined {
  return variant.selectedOptions.find((option) => isHueOption(option.name))
    ?.value;
}

export function optionValue(
  variant: {selectedOptions: Array<{name: string; value: string}>},
  name: string,
): string | undefined {
  return variant.selectedOptions.find(
    (option) => option.name.toLowerCase() === name.toLowerCase(),
  )?.value;
}

/**
 * Find the variant of a companion product that matches the colourway (and size,
 * where the product has one) currently chosen on the crewneck.
 *
 * Returns undefined when the companion isn't made in that hue — which is a real
 * answer, not an error. The UI disables the pairing rather than substituting a
 * near-miss, because a near-miss is the one thing the colour system exists to
 * avoid.
 */
export function matchCompanionVariant(
  product: CompanionProductFragment,
  {colour, size}: {colour?: string; size?: string},
): CompanionVariant | undefined {
  const candidates = product.variants.nodes.filter((variant) => {
    const variantColour = hueValue(variant);
    // A product without a colour option pairs with any hue.
    if (variantColour && colour && variantColour !== colour) return false;
    if (variantColour && !colour) return false;
    return true;
  });

  if (candidates.length === 0) return undefined;

  // Prefer an exact size match, then fall back to the product's only variant
  // when it isn't sized (a sock, say).
  const sized = candidates.find((variant) => {
    const variantSize = optionValue(variant, 'Size');
    if (!variantSize) return true;
    return size ? variantSize === size : false;
  });

  return sized ?? (candidates.length === 1 ? candidates[0] : undefined);
}
