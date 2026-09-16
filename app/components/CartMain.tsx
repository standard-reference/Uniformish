import {Link} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from '~/components/CartSummary';
import {MIN_PIECES_PER_ORDER} from '~/data/range';
import {findHue, isHueOption} from '~/data/hues';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // Applies pending mutations so the drawer reacts before the server replies.
  const cart = useOptimisticCart(originalCart);

  const lines = cart?.lines?.nodes ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const isEmpty = lines.length === 0;

  // The rule the range is built on: no orphan pieces leave the register.
  const needsPair = totalQuantity > 0 && totalQuantity < MIN_PIECES_PER_ORDER;

  // Whatever hue is already in the cart is the one we nudge toward.
  const firstHue = findHue(
    lines[0]?.merchandise?.selectedOptions?.find((option) =>
      isHueOption(option.name),
    )?.value,
  );

  const body = (
    <>
      <div className={layout === 'aside' ? 'cart-scroll' : undefined}>
        {isEmpty ? (
          <CartEmpty />
        ) : (
          <ul aria-label="Cart line items">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        )}

        {needsPair ? (
          <div className="cart-nudge">
            <span className="eyebrow-sm">One more to complete the look</span>
            <p>
              Pieces come in twos
              {firstHue ? <> — add one more in {firstHue.name}</> : null} and
              you&rsquo;re set. Same hue, matched exactly.
            </p>
            <Link className="btn btn-outline btn-sm" to="/shop">
              Browse the range
            </Link>
          </div>
        ) : null}
      </div>

      {!isEmpty ? (
        <CartSummary cart={cart} layout={layout} needsPair={needsPair} />
      ) : null}
    </>
  );

  return layout === 'aside' ? (
    body
  ) : (
    <section className="cart-page" aria-label="Cart">
      <h1 className="h1" style={{marginBottom: 24}}>
        Your cart
      </h1>
      {body}
    </section>
  );
}

function CartEmpty() {
  const {close} = useAside();
  return (
    <div className="cart-empty">
      <p>Nothing in here yet.</p>
      <Link
        className="link-rule"
        style={{marginTop: 10}}
        to="/shop"
        onClick={close}
        prefetch="viewport"
      >
        Shop the range
      </Link>
    </div>
  );
}
