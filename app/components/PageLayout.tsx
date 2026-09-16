import {Suspense} from 'react';
import {Await} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {Footer} from '~/components/Footer';
import {ANNOUNCEMENT, Header, MobileNav} from '~/components/Header';
import {SizeChartPanel} from '~/components/SizeChart';

export function PageLayout({
  cart,
  children = null,
  showAnnouncement = true,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  showAnnouncement?: boolean;
}) {
  return (
    <Aside.Provider>
      <div className="shell">
        {showAnnouncement ? (
          <div className="announcement">{ANNOUNCEMENT}</div>
        ) : null}

        <Header cart={cart} />

        {children}

        <Footer />
      </div>

      <Aside type="mobile" heading="Menu">
        <MobileNav />
      </Aside>

      <Aside type="cart" heading={<CartHeading cart={cart} />}>
        <Suspense fallback={<p className="cart-empty">Loading cart…</p>}>
          <Await resolve={cart} errorElement={<CartError />}>
            {(resolved) => <CartMain cart={resolved} layout="aside" />}
          </Await>
        </Suspense>
      </Aside>

      <Aside type="size" heading="Size chart · oversized crewneck" variant="modal">
        <SizeChartPanel />
      </Aside>
    </Aside.Provider>
  );
}

function CartHeading({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<>Your cart</>}>
      <Await resolve={cart} errorElement={<>Your cart</>}>
        {(resolved) => <>Your cart ({resolved?.totalQuantity ?? 0})</>}
      </Await>
    </Suspense>
  );
}

function CartError() {
  return (
    <div className="cart-empty">
      <p>We couldn&rsquo;t load your cart just now. Try again in a moment.</p>
    </div>
  );
}
