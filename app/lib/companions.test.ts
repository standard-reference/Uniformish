import assert from 'node:assert/strict';
import {test} from 'node:test';
import {matchCompanionVariant, optionValue} from './companions';

/**
 * Fixtures mirror the live catalogue, because the bug these cover came from
 * real data: socks are sized S/M and L/XL while every garment is sized S–3XL.
 */
type Variant = {
  id: string;
  availableForSale: boolean;
  price: {amount: string; currencyCode: string};
  selectedOptions: Array<{name: string; value: string}>;
};

function product(handle: string, variants: Variant[]) {
  return {
    id: `gid://shopify/Product/${handle}`,
    title: handle,
    handle,
    featuredImage: null,
    priceRange: {minVariantPrice: {amount: '0', currencyCode: 'EUR'}},
    variants: {nodes: variants},
    // The fixture only needs the fields the matcher reads.
  } as unknown as Parameters<typeof matchCompanionVariant>[0];
}

function variant(
  colour: string | null,
  size: string | null,
  availableForSale = true,
): Variant {
  return {
    id: `v:${colour ?? '-'}/${size ?? '-'}`,
    availableForSale,
    price: {amount: '46.0', currencyCode: 'EUR'},
    selectedOptions: [
      ...(colour ? [{name: 'Color', value: colour}] : []),
      ...(size ? [{name: 'Size', value: size}] : []),
    ],
  };
}

const socks = product('socks', [
  variant('Jet', 'S/M'),
  variant('Jet', 'L/XL'),
  variant('Umber', 'S/M'),
  variant('Umber', 'L/XL'),
]);

const tee = product('tee', [
  variant(null, 'S'),
  variant(null, 'M'),
  variant(null, 'L'),
]);

test('a different size scale is not a missing hue', () => {
  // Socks are made in Jet. A short is sized M; socks are sized S/M. The pairing
  // is valid and must not be reported as "Not in Jet".
  const match = matchCompanionVariant(socks, {colour: 'Jet', size: 'M'});

  assert.equal(match.missingHue, false);
  assert.ok(match.variant, 'expected a buyable sock variant');
  assert.equal(optionValue(match.variant, 'Color'), 'Jet');
  assert.equal(match.sizeDiffers, true, 'the UI needs to show which size');
});

test('a hue the companion is not made in is refused', () => {
  const match = matchCompanionVariant(socks, {colour: 'Moss', size: 'M'});

  assert.equal(match.missingHue, true);
  assert.equal(match.variant, undefined, 'must not substitute another hue');
});

test('a shared size scale takes the exact size', () => {
  const crew = product('crew', [
    variant('Jet', 'S'),
    variant('Jet', 'M'),
    variant('Jet', 'L'),
  ]);
  const match = matchCompanionVariant(crew, {colour: 'Jet', size: 'L'});

  assert.equal(match.sizeDiffers, false);
  assert.equal(optionValue(match.variant!, 'Size'), 'L');
});

test('a companion with no colour option pairs with any hue', () => {
  const match = matchCompanionVariant(tee, {colour: 'Slate', size: 'M'});

  assert.equal(match.missingHue, false);
  assert.equal(optionValue(match.variant!, 'Size'), 'M');
});

test('a page with no colour of its own still pairs', () => {
  const match = matchCompanionVariant(socks, {colour: undefined, size: 'M'});

  assert.equal(match.missingHue, false);
  assert.ok(match.variant, 'expected a sock to pair with a colourless page');
});

test('sold-out variants are never offered', () => {
  const soldOut = product('socks', [
    variant('Jet', 'S/M', false),
    variant('Jet', 'L/XL', false),
  ]);
  const match = matchCompanionVariant(soldOut, {colour: 'Jet', size: 'M'});

  assert.equal(match.variant, undefined);
  assert.equal(
    match.missingHue,
    false,
    'sold out is not the same as never made in this hue',
  );
});

test('an available variant is preferred over a sold-out one', () => {
  const mixed = product('socks', [
    variant('Jet', 'S/M', false),
    variant('Jet', 'L/XL', true),
  ]);
  const match = matchCompanionVariant(mixed, {colour: 'Jet', size: 'M'});

  assert.equal(optionValue(match.variant!, 'Size'), 'L/XL');
});
