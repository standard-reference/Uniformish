import {Link, useLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/shop';
import {HueBlock} from '~/components/HueBlock';
import {DEFAULT_HUE, HUES} from '~/data/hues';
import {baseTotal, HERO_PIECE, KIT_KEYS, PIECES} from '~/data/range';
import {RANGE_PRODUCTS_QUERY} from '~/lib/queries';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Shop the Range — Colour-Matched Basics, Made to Order',
    description:
      'Every piece here is built to be worn together: six colour-matched earth tones across tees, crewnecks, sweatpants, shorts and socks. Made to order, sold as duos and three-piece kits.',
    path: '/shop',
  });

export async function loader({context}: Route.LoaderArgs) {
  // Everything in the storefront, narrowed locally to the range's handles.
  // Handle is not a filterable field on the Storefront API — see lib/queries.
  const listed = await context.storefront
    .query(RANGE_PRODUCTS_QUERY, {cache: context.storefront.CacheShort()})
    .then((result) =>
      result.products.nodes.filter((product) =>
        PIECES.some((piece) => piece.handle === product.handle),
      ),
    )
    .catch(() => []);

  // In the range's own order, so the grid reads the way the line is designed
  // rather than however Shopify happened to return it.
  const products = PIECES.map((piece) =>
    listed.find((product) => product.handle === piece.handle),
  ).filter((product): product is (typeof listed)[number] => Boolean(product));

  return {products};
}

export default function Shop() {
  const {products} = useLoaderData<typeof loader>();
  const productPath = `/products/${HERO_PIECE.handle}`;

  const priceFor = (handle: string) =>
    products.find((product) => product.handle === handle)?.priceRange
      .minVariantPrice;

  // A duo is the crewneck plus the cheapest piece it pairs with.
  const duoFrom =
    HERO_PIECE.basePrice +
    Math.min(
      ...PIECES.filter((piece) => piece.key !== HERO_PIECE.key).map(
        (piece) => piece.basePrice,
      ),
    );

  return (
    <main>
      <section style={{padding: 'clamp(40px, 6vw, 92px) var(--gutter) clamp(24px, 3vw, 40px)'}}>
        <span className="eyebrow">Shop · six hues · kits &amp; duos</span>
        <h1 className="h1" style={{margin: '16px 0 0', fontSize: 'clamp(34px, 4.4vw, 62px)'}}>
          Start with a hue, not a garment
        </h1>
        <p className="lede" style={{margin: '18px 0 0', maxWidth: '54ch'}}>
          Everything here is built to be worn together, so the decision that
          matters is which hue you want to live in — any two pieces in one of
          them already make a matching set. Pieces come in twos and threes; we
          don&rsquo;t sell orphans.
        </p>
      </section>

      <section style={{padding: '0 var(--gutter) clamp(36px, 4vw, 56px)'}}>
        <div className="hue-grid">
          {HUES.map((hue) => (
            <Link
              className="hue-card"
              key={hue.code}
              to={`${productPath}?Color=${encodeURIComponent(hue.name)}`}
              prefetch="intent"
            >
              <HueBlock hue={hue} caption="Full look" />
              <p className="hue-card-name">{hue.name}</p>
              <div className="hue-card-foot" style={{fontSize: 10.5, marginTop: 6}}>
                <span className="hue-card-code">{hue.code}</span>
                <span className="hue-card-code">Shop hue</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="offer-split">
        <div className="offer">
          <span className="eyebrow-sm">Kit · three pieces</span>
          <h2 className="h3">The whole look, one add-to-cart</h2>
          <p>
            Three pieces in one hue, picked together and added in one go.
            It&rsquo;s the cleanest version of the rule — and each piece is still
            refunded on its own, so a kit is never all-or-nothing.
          </p>
          <span className="price">From €{baseTotal(KIT_KEYS)}</span>
          <Link className="btn btn-solid" to={productPath} prefetch="intent">
            Build a kit
          </Link>
        </div>

        <div className="offer">
          <span className="eyebrow-sm">Duo · two pieces</span>
          <h2 className="h3">Two pieces, into what you already own</h2>
          <p>
            Pick two pieces in one hue — priced individually, grouped at the
            cart. Meant to slot into your wardrobe rather than replace it, and
            returnable piece by piece if one of them misses.
          </p>
          <span className="price">From €{duoFrom}</span>
          <Link className="btn btn-outline" to={productPath} prefetch="intent">
            Build a duo
          </Link>
        </div>
      </section>

      <section style={{padding: 'clamp(36px, 5vw, 76px) var(--gutter)'}}>
        <div className="section-head" style={{gap: '12px 32px', marginBottom: 22}}>
          <h2 className="h3">The pieces</h2>
          <span className="meta push-right" style={{fontSize: 10.5}}>
            Prices shown in your local currency
          </span>
        </div>

        <div className="range-grid">
          {PIECES.map((piece) => {
            const live = products.find(
              (product) => product.handle === piece.handle,
            );

            // A piece with no listing yet is shown but not linked — the range
            // is the range, whether or not every piece is buyable today.
            if (!live) {
              return (
                <div className="range-card is-upcoming" key={piece.key}>
                  <HueBlock hue={DEFAULT_HUE} caption="Coming soon" />
                  <p className="hue-card-name">{piece.name}</p>
                  <div className="range-card-foot">
                    <span>{piece.fit}</span>
                    <span>Coming soon</span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                className="range-card"
                key={piece.key}
                to={`/products/${piece.handle}`}
                prefetch="intent"
              >
                <HueBlock
                  hue={DEFAULT_HUE}
                  image={live.featuredImage ?? undefined}
                  caption={live.featuredImage ? undefined : 'Photography to come'}
                />
                <p className="hue-card-name">{live.title}</p>
                <div className="range-card-foot">
                  <span>{piece.fit}</span>
                  <span>
                    <Money data={live.priceRange.minVariantPrice} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="lede" style={{margin: '24px 0 0', maxWidth: '56ch', fontSize: 15}}>
          Slip-ons round out the hue system and land next. Patterns — the same
          six hues printed together — arrive as single accent pieces, not a
          separate line.
        </p>
      </section>
    </main>
  );
}
