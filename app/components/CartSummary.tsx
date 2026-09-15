import {Money, type OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {MIN_PIECES_PER_ORDER, ORDER_TERMS} from '~/data/range';

/**
 * Cart totals and the checkout hand-off.
 *
 * No discount or gift-card fields: the brand states in the footer that it does
 * not run discount codes, so rendering a code box would contradict the copy.
 * Re-add `CartForm.ACTIONS.DiscountCodesUpdate` here if that ever changes — the
 * `/cart` action already handles it.
 */
export function CartSummary({
  cart,
  layout,
  needsPair,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
  needsPair: boolean;
}) {
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="cart-foot">
      {layout === 'aside' ? (
        <div className="cart-terms">
          {ORDER_TERMS.map((term, index) => (
            <div className="cart-term" key={term.title}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <p>{term.short}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="cart-totals">
        <div className="subtotal">
          <span>Subtotal</span>
          <span className="amount">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              '—'
            )}
          </span>
        </div>

        <p className="tax-note">
          Shipping, duties and taxes calculated at checkout
        </p>

        {needsPair ? (
          <button
            className="btn btn-block add-to-cart checkout-blocked"
            type="button"
            disabled
            aria-describedby="pair-rule"
          >
            Add one more to check out
          </button>
        ) : (
          <a
            className="btn btn-solid btn-block add-to-cart"
            href={checkoutUrl ?? '#'}
            aria-disabled={!checkoutUrl}
          >
            Checkout
          </a>
        )}

        {needsPair ? (
          <p className="tax-note" id="pair-rule" style={{marginBottom: 0}}>
            Minimum {MIN_PIECES_PER_ORDER} pieces in one hue
          </p>
        ) : null}
      </div>
    </div>
  );
}
