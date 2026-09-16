import {Link, useLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/shop';
import {HueBlock} from '~/components/HueBlock';
import {DEFAULT_HUE, HUES} from '~/data/hues';
import {
  baseTotal,
  HERO_PIECE,
  KIT_KEYS,
  LIVE_HUES,
  PIECES,
} from '~/data/range';
import {handleQuery, RANGE_PRICES_QUERY} from '~/lib/queries';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Shop',
    description:
      'Start with a hue, not a garment. Six matched earth tones across the range, sold as duos and three-piece kits.',
    path: '/shop',
  });

export async function loader({context}: Route.LoaderArgs) {
  // Live prices for whichever pieces are actually listed. Anything missing
  // falls back to the indicative figure and is labelled as such.
  const listed = await context.storefront
    .query(RANGE_PRICES_QUERY, {
      variables: {query: handleQuery(PIECES.map((piece) => piece.handle))},
      cache: context.storefront.CacheShort(),
    })
    .then((result) =>
      // Same reason as the PDP: the Storefront `query` filter is a search, so
      // narrow to the exact handles the range defines.
      result.products.nodes.filter((product) =>
        PIECES.some((piece) => piece.handle === product.handle),
      ),
    )
    .catch(() => []);

  return {listed};
}

export default function Shop() {
  const {listed} = useLoaderData<typeof loader>();
  const productPath = `/products/${HERO_PIECE.handle}`;

  const priceFor = (handle: string) =>
    listed.find((product) => product.handle === handle)?.priceRange
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
          Everything in the range is matched to everything else, so the decision
          that matters is which hue you want to live in. Pieces come in twos and
          threes — we don&rsquo;t sell orphans.
        </p>
      </section>

      <section style={{padding: '0 var(--gutter) clamp(36px, 4vw, 56px)'}}>
        <div className="hue-grid">
          {HUES.map((hue) => {
            const live = LIVE_HUES.includes(hue.name);
            const body = (
              <>
                <HueBlock hue={hue} frame caption="Full look" />
                <p className="hue-card-name">{hue.name}</p>
                <div
                  className="hue-card-foot"
                  style={{fontSize: 10.5, marginTop: 6}}
                >
                  <span className="hue-card-code">{hue.code}</span>
                  <span className="hue-card-code">
                    {live ? 'Shop hue' : 'In production'}
                  </span>
                </div>
              </>
            );

            return live ? (
              <Link
                className="hue-card"
                key={hue.code}
                to={`${productPath}?Color=${encodeURIComponent(hue.name)}`}
                prefetch="intent"
              >
                {body}
              </Link>
            ) : (
              <div className="hue-card is-upcoming" key={hue.code}>
                {body}
              </div>
            );
          })}
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

        <div className="range-list">
          {PIECES.map((piece) => {
            const live = priceFor(piece.handle);
            return (
              <div className="range-row" key={piece.key}>
                <span
                  className="thumb"
                  style={{background: DEFAULT_HUE.hex}}
                  aria-hidden="true"
                />
                <span className="name">
                  {live ? (
                    <Link to={`/products/${piece.handle}`} prefetch="intent">
                      {piece.name}
                    </Link>
                  ) : (
                    piece.name
                  )}
                </span>
                <span className="fit">{piece.fit}</span>
                <span className="price">
                  {live ? <Money data={live} /> : `from €${piece.basePrice}`}
                </span>
                <span className="status">{live ? 'Available' : 'Coming soon'}</span>
              </div>
            );
          })}
        </div>

        <p className="lede" style={{margin: '20px 0 0', maxWidth: '56ch', fontSize: 15}}>
          Slip-ons and socks round out the hue system and land next. Patterns —
          the same six hues printed together — arrive as single accent pieces,
          not a separate line.
        </p>
      </section>
    </main>
  );
}
