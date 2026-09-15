import type {CSSProperties} from 'react';
import {Link} from 'react-router';
import {CartForm, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {useAside} from '~/components/Aside';
import {useVariantUrl} from '~/lib/variants';
import {findHue, isHueOption} from '~/data/hues';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * One line in the cart. The swatch behind the thumbnail is the line's hue, so
 * a cart of one colourway reads as one colourway even before photography lands.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise, quantity, isOptimistic} = line;
  const {product, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const colour = selectedOptions.find((option) =>
    isHueOption(option.name),
  )?.value;
  const size = selectedOptions.find(
    (option) => option.name.toLowerCase() === 'size',
  )?.value;
  const hue = findHue(colour);

  const optionSummary = [colour, size ? `Size ${size}` : null, `Qty ${quantity}`]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="cart-line">
      <div
        className="cart-line-media"
        style={hue ? ({'--hue': hue.hex} as CSSProperties) : undefined}
      >
        {image ? (
          <img src={image.url} alt={image.altText ?? ''} loading="lazy" />
        ) : null}
      </div>

      <div className="cart-line-body">
        <Link
          className="cart-line-name"
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') close();
          }}
        >
          {product.title}
        </Link>

        <span className="cart-line-opts">{optionSummary}</span>
        <span className="cart-line-group">Made to order</span>

        <CartLineQuantity line={line} />

        <CartForm
          fetcherKey={getUpdateKey([id])}
          route="/cart"
          action={CartForm.ACTIONS.LinesRemove}
          inputs={{lineIds: [id]}}
        >
          <button className="link-remove" disabled={!!isOptimistic} type="submit">
            Remove
          </button>
        </CartForm>
      </div>

      <span className="cart-line-price">
        {line?.cost?.totalAmount ? <Money data={line.cost.totalAmount} /> : null}
      </span>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="qty">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          type="submit"
        >
          −
        </button>
      </CartLineUpdateButton>

      <span className="count" aria-live="polite">
        {quantity}
      </span>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          type="submit"
        >
          +
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lines.map((line) => line.id))}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Keys concurrent updates to the same line so rapid +/- clicks cancel each
 * other rather than racing.
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
