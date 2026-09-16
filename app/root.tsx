import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {seoMeta} from '~/lib/seo';

export type RootLoader = typeof loader;

/**
 * Avoids re-fetching root queries on sub-navigations.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // Revalidate after a mutation — add to cart, login, and so on.
  if (formMethod && formMethod !== 'GET') return true;

  // Revalidate when manually revalidating via useRevalidator.
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

// Default for any route that doesn't set its own; React Router merges per-route
// meta over this.
export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Uniform-ish — One hue, head to toe',
    description:
      'Six earth tones matched to each other with real colour maths, made to order and shipped worldwide. Stay inside one hue family and the whole fit reads as monotone.',
  });

export async function loader(args: Route.LoaderArgs) {
  const {storefront, env, cart} = args.context;

  return {
    // Deferred — the cart resolves after first byte.
    cart: cart.get(),
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PageLayout cart={data.cart}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let heading = 'Something went wrong';
  let detail = '';
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    detail = error?.data?.message ?? error.data ?? '';
    if (status === 404) {
      heading = 'That page doesn’t exist';
      detail = '';
    }
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <div className="route-error">
      <span className="eyebrow">Error {status}</span>
      <h1 className="h1">{heading}</h1>
      {detail ? (
        <pre>{detail}</pre>
      ) : (
        <p className="lede">
          The link may be out of date, or the piece may have moved.
        </p>
      )}
      <Link className="btn btn-solid" to="/">
        Back to the home page
      </Link>
    </div>
  );
}
