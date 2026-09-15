import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  useAnalytics,
  useOptimisticCart,
  type CartViewPayload,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

/**
 * Site navigation. Fixed rather than driven by a Shopify menu: these five
 * destinations are the brand's own structure, not merchandising, and they
 * should not change because someone reorders a menu in the admin.
 */
export const NAV = [
  {to: '/shop', label: 'Shop'},
  {to: '/size-and-fit', label: 'Size & Fit'},
  {to: '/about', label: 'About'},
  {to: '/shipping-and-faq', label: 'Shipping & FAQ'},
] as const;

export const ANNOUNCEMENT =
  'Made to order in six colour-matched hues — nothing sits in a warehouse';

export function Header({
  cart,
  showAnnouncement,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  showAnnouncement: boolean;
}) {
  const {open} = useAside();

  return (
    <header className={`site-header${showAnnouncement ? ' has-announcement' : ''}`}>
      <NavLink className="wordmark" to="/" prefetch="intent" end>
        Uniform-ish
      </NavLink>

      <nav className="nav-desktop" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            className="nav-link"
            to={item.to}
            prefetch="intent"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <CartToggle cart={cart} />

      <button
        className="nav-toggle"
        onClick={() => open('mobile')}
        aria-label="Open menu"
        type="button"
      >
        ☰
      </button>
    </header>
  );
}

export function MobileNav() {
  const {close} = useAside();
  return (
    <nav className="nav-mobile" aria-label="Primary">
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} onClick={close} prefetch="intent">
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function CartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<CartButton count={0} />}>
      <Await resolve={cart} errorElement={<CartButton count={0} />}>
        <OptimisticCartButton />
      </Await>
    </Suspense>
  );
}

function OptimisticCartButton() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartButton count={cart?.totalQuantity ?? 0} />;
}

function CartButton({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="cart-toggle"
      type="button"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart
      <span className="cart-toggle-count" aria-label={`${count} items in cart`}>
        {count}
      </span>
    </button>
  );
}
