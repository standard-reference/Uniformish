import {useState, type CSSProperties} from 'react';
import {Link, useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  CompanionProductFragment,
  ProductFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {SizeChartTrigger} from '~/components/SizeChart';
import {findHue, isHueOption} from '~/data/hues';
import {KIT_KEYS, MIN_PIECES_PER_ORDER, pieceByHandle} from '~/data/range';
import {hueValue, matchCompanionVariant, optionValue} from '~/lib/companions';

type SelectedVariant = ProductFragment['selectedOrFirstAvailableVariant'];
type Path = 'duo' | 'kit';

export function ProductForm({
  productOptions,
  selectedVariant,
  companions,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: SelectedVariant;
  /** Companion products that actually exist in the connected storefront. */
  companions: CompanionProductFragment[];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const colour = selectedVariant ? hueValue(selectedVariant) : undefined;
  const size = selectedVariant ? optionValue(selectedVariant, 'Size') : undefined;

  const hueOption = productOptions.find((option) => isHueOption(option.name));
  const sizeOption = productOptions.find(
    (option) => option.name.toLowerCase() === 'size',
  );
  const otherOptions = productOptions.filter(
    (option) => option !== hueOption && option !== sizeOption,
  );

  // Pairing only exists if there is something to pair with.
  const kitCompanions = companions.filter((product) => {
    const piece = pieceByHandle(product.handle);
    return piece ? (KIT_KEYS as readonly string[]).includes(piece.key) : false;
  });
  const canKit = kitCompanions.length === KIT_KEYS.length - 1;

  const [path, setPath] = useState<Path>('duo');
  const [pairHandle, setPairHandle] = useState<string | undefined>(
    companions[0]?.handle,
  );

  const goToVariant = (variantUriQuery: string) => {
    void navigate(`?${variantUriQuery}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <>
      {hueOption ? (
        <div className="field">
          <span className="eyebrow-sm">
            Hue{colour ? ` — ${colour}` : ''}
            {findHue(colour) ? ` ${findHue(colour)!.code}` : ''}
          </span>
          <div className="swatch-row" role="group" aria-label="Hue">
            {hueOption.optionValues.map((value) => {
              const hue = findHue(value.name);
              const style = {
                '--hue': hue?.hex ?? value.swatch?.color ?? 'transparent',
              } as CSSProperties;

              if (value.isDifferentProduct) {
                return (
                  <Link
                    className={`swatch${value.selected ? ' is-selected' : ''}`}
                    key={value.name}
                    style={style}
                    to={`/products/${value.handle}?${value.variantUriQuery}`}
                    prefetch="intent"
                    preventScrollReset
                    replace
                    title={value.name}
                    aria-label={value.name}
                  >
                    <SwatchFallback swatch={value.swatch} name={value.name} />
                  </Link>
                );
              }

              return (
                <button
                  className="swatch"
                  key={value.name}
                  type="button"
                  style={style}
                  title={value.name}
                  aria-label={value.name}
                  aria-pressed={value.selected}
                  disabled={!value.exists}
                  onClick={() => {
                    if (!value.selected) goToVariant(value.variantUriQuery);
                  }}
                >
                  <SwatchFallback swatch={value.swatch} name={value.name} />
                </button>
              );
            })}
          </div>
          <p className="note">
            Every hue coordinates with every other one in the range.
          </p>
        </div>
      ) : null}

      {sizeOption ? (
        <div className="field">
          <div className="field-head">
            <span className="eyebrow-sm">Size</span>
            <SizeChartTrigger />
          </div>
          <div className="size-row" role="group" aria-label="Size">
            {sizeOption.optionValues.map((value) => (
              <button
                className="size-option"
                key={value.name}
                type="button"
                aria-pressed={value.selected}
                disabled={!value.exists || !value.available}
                onClick={() => {
                  if (!value.selected) goToVariant(value.variantUriQuery);
                }}
              >
                {value.name}
              </button>
            ))}
          </div>
          <p className="note">Runs oversized — size down for a closer fit.</p>
        </div>
      ) : null}

      {otherOptions.map((option) =>
        option.optionValues.length <= 1 ? null : (
          <div className="field" key={option.name}>
            <span className="eyebrow-sm">{option.name}</span>
            <div className="size-row" role="group" aria-label={option.name}>
              {option.optionValues.map((value) => (
                <button
                  className="size-option"
                  key={value.name}
                  type="button"
                  aria-pressed={value.selected}
                  disabled={!value.exists}
                  onClick={() => {
                    if (!value.selected) goToVariant(value.variantUriQuery);
                  }}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
        ),
      )}

      {companions.length > 0 ? (
        <PairingPanel
          colour={colour}
          size={size}
          companions={companions}
          kitCompanions={kitCompanions}
          canKit={canKit}
          path={path}
          setPath={setPath}
          pairHandle={pairHandle}
          setPairHandle={setPairHandle}
        />
      ) : null}

      <AddToCart
        selectedVariant={selectedVariant}
        companions={companions}
        kitCompanions={kitCompanions}
        colour={colour}
        size={size}
        path={companions.length > 0 ? path : null}
        pairHandle={pairHandle}
        onAdded={() => open('cart')}
      />
    </>
  );
}

function PairingPanel({
  colour,
  size,
  companions,
  kitCompanions,
  canKit,
  path,
  setPath,
  pairHandle,
  setPairHandle,
}: {
  colour?: string;
  size?: string;
  companions: CompanionProductFragment[];
  kitCompanions: CompanionProductFragment[];
  canKit: boolean;
  path: Path;
  setPath: (path: Path) => void;
  pairHandle?: string;
  setPairHandle: (handle: string) => void;
}) {
  const paths: Array<{key: Path; label: string; note: string}> = [
    {
      key: 'duo',
      label: 'Duo · 2 pieces',
      note: 'priced separately · final sale',
    },
    {key: 'kit', label: 'Kit · 3 pieces', note: 'one product · 30-day return'},
  ];

  return (
    <div className="pairing">
      <div className="stack" style={{gap: 6}}>
        <span className="eyebrow-sm">Pairs with{colour ? ` — ${colour}` : ''}</span>
        <p>
          The crewneck ships as part of a look, so pick what it goes with.{' '}
          {MIN_PIECES_PER_ORDER} pieces minimum in one hue — that&rsquo;s the
          rule the whole range is built on.
        </p>
      </div>

      {canKit ? (
        <div className="path-row" role="group" aria-label="How many pieces">
          {paths.map((option) => (
            <button
              className="path-option"
              key={option.key}
              type="button"
              aria-pressed={path === option.key}
              onClick={() => setPath(option.key)}
            >
              {option.label}
              <span className="note">{option.note}</span>
            </button>
          ))}
        </div>
      ) : null}

      {path === 'duo' || !canKit ? (
        <div className="companion-list">
          <span className="eyebrow-sm" style={{fontSize: 10}}>
            Choose the second piece
          </span>
          {companions.map((product) => {
            const variant = matchCompanionVariant(product, {colour, size});
            const hue = findHue(colour);
            return (
              <button
                className="companion"
                key={product.handle}
                type="button"
                aria-pressed={pairHandle === product.handle}
                disabled={!variant}
                onClick={() => setPairHandle(product.handle)}
              >
                <span
                  className="thumb"
                  style={hue ? ({'--hue': hue.hex} as CSSProperties) : undefined}
                />
                <span className="name">{product.title}</span>
                <span className="price">
                  {variant ? (
                    <Money data={variant.price} />
                  ) : (
                    `Not in ${colour ?? 'this hue'}`
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="companion-list">
          <span className="eyebrow-sm" style={{fontSize: 10}}>
            In this kit
          </span>
          {kitCompanions.map((product) => {
            const variant = matchCompanionVariant(product, {colour, size});
            const hue = findHue(colour);
            return (
              <div className="kit-piece" key={product.handle}>
                <span
                  className="thumb"
                  style={hue ? ({'--hue': hue.hex} as CSSProperties) : undefined}
                />
                <span className="name">{product.title}</span>
                <span className="price">
                  {variant ? <Money data={variant.price} /> : '—'}
                </span>
              </div>
            );
          })}
          <p className="note">
            One add-to-cart, one colourway, and the only path with a 30-day
            return attached.
          </p>
        </div>
      )}
    </div>
  );
}

function AddToCart({
  selectedVariant,
  companions,
  kitCompanions,
  colour,
  size,
  path,
  pairHandle,
  onAdded,
}: {
  selectedVariant: SelectedVariant;
  companions: CompanionProductFragment[];
  kitCompanions: CompanionProductFragment[];
  colour?: string;
  size?: string;
  path: Path | null;
  pairHandle?: string;
  onAdded: () => void;
}) {
  if (!selectedVariant) {
    return (
      <button className="btn btn-solid btn-block add-to-cart" disabled type="button">
        Unavailable
      </button>
    );
  }

  const pieces =
    path === 'kit'
      ? kitCompanions
      : path === 'duo'
        ? companions.filter((product) => product.handle === pairHandle)
        : [];

  const companionVariants = pieces.map((product) =>
    matchCompanionVariant(product, {colour, size}),
  );
  const missingCompanion = companionVariants.some((variant) => !variant);

  const lines = [
    {merchandiseId: selectedVariant.id, quantity: 1, selectedVariant},
    ...companionVariants
      .filter((variant): variant is NonNullable<typeof variant> => Boolean(variant))
      .map((variant) => ({merchandiseId: variant.id, quantity: 1})),
  ];

  const soldOut = !selectedVariant.availableForSale;
  const label = soldOut
    ? 'Sold out'
    : missingCompanion
      ? `Not made in ${colour ?? 'this hue'} yet`
      : path === 'kit'
        ? 'Add kit to cart'
        : path === 'duo'
          ? 'Add duo to cart'
          : 'Add to cart';

  return (
    <AddToCartButton
      disabled={soldOut || missingCompanion}
      onClick={onAdded}
      lines={lines}
    >
      {label}
    </AddToCartButton>
  );
}

/** Falls back to the option name when a swatch has neither colour nor image. */
function SwatchFallback({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  if (!image) return null;
  return <img src={image} alt={name} />;
}
