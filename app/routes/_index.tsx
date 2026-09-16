import type {CSSProperties} from 'react';
import {Link, useLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/_index';
import {HueBlock} from '~/components/HueBlock';
import {SizeChartPreview, SizeChartTrigger} from '~/components/SizeChart';
import {DEFAULT_HUE, HUES} from '~/data/hues';
import {HERO_PIECE, PIECES} from '~/data/range';
import {HERO_PRODUCT_QUERY} from '~/lib/queries';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Uniform-ish — One hue, head to toe',
    description:
      'Six earth tones matched to each other with real colour maths, made to order and shipped worldwide. Tees, crewnecks, sweatpants, shorts and socks, all built to be worn together.',
    path: '/',
  });

export async function loader({context}: Route.LoaderArgs) {
  // The hero price comes from Shopify when the product is listed; until then the
  // page falls back to the indicative figure rather than inventing one.
  const hero = await context.storefront
    .query(HERO_PRODUCT_QUERY, {
      variables: {handle: HERO_PIECE.handle},
      cache: context.storefront.CacheShort(),
    })
    .then((result) => result.product)
    .catch(() => null);

  return {hero};
}

export default function Home() {
  const {hero} = useLoaderData<typeof loader>();
  const price = hero?.priceRange?.minVariantPrice;
  const productPath = `/products/${HERO_PIECE.handle}`;
  const look = DEFAULT_HUE;

  return (
    <main>
      {/* ─────────── Hero ─────────── */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Six matched hues · Made to order</span>
          <h1 className="display">One hue, head to toe. Not one hex.</h1>
          <p className="lede">
            Stay inside a single hue family and the whole fit reads as monotone —
            whether every piece matches exactly or steps lighter toward the feet.
            Six earth tones, matched to each other with real colour maths, so
            nothing in the range clashes with anything else in it.
          </p>
          <div className="row-actions">
            <Link className="btn btn-solid" to="/shop" prefetch="intent">
              Shop the range
            </Link>
            <span className="meta" style={{letterSpacing: '0.06em'}}>
              {PIECES.length} pieces · XS–4XL
            </span>
          </div>
        </div>
        <HueBlock
          className="hero-art"
          hue={look}
          caption={`Hero · ${look.name}, full look · on-body 4:5`}
        />
      </section>

      {/* ─────────── Three standing facts ─────────── */}
      <h2 className="sr-only">Colour-matched streetwear, made to order</h2>
      <section className="facts">
        <div className="fact">
          <span className="eyebrow-sm">01 / Production</span>
          <p>
            Made in 2–5 business days, then 3–6 in transit inside the EU.
            Roughly two weeks, honestly stated.
          </p>
        </div>
        <div className="fact">
          <span className="eyebrow-sm">02 / Sizing</span>
          <p>
            Every size published as garment-flat measurements, so you can check
            them against something you already own.
          </p>
        </div>
        <div className="fact">
          <span className="eyebrow-sm">03 / Colour</span>
          <p>
            Heavyweight cotton blanks, every hue matched to every other in OKLCh
            — not by eye.
          </p>
        </div>
      </section>

      {/* ─────────── The range ─────────── */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-copy">
            <span className="eyebrow">The range · six hues</span>
            <h2 className="h2">Everything here is built to be worn together.</h2>
            <p className="lede" style={{fontSize: 16.5}}>
              Not &ldquo;available in six colours&rdquo; — six hues sitting on the
              same lightness and chroma band, so a Clay top over an Umber bottom
              reads as deliberate instead of accidental. Any two pieces make a
              matching set; pick the hue you want to live in.
            </p>
          </div>
          <span className="meta push-right">
            From {price ? <Money data={price} /> : `€${HERO_PIECE.basePrice}`}
          </span>
        </div>

        <div className="hue-grid">
          {HUES.map((hue) => (
            <Link
              className="hue-card"
              key={hue.code}
              to={`${productPath}?Color=${encodeURIComponent(hue.name)}`}
              prefetch="intent"
            >
              <HueBlock hue={hue} caption="Flat-lay" />
              <div className="hue-card-foot">
                <span>{hue.name}</span>
                <span className="hue-card-code">{hue.code}</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{display: 'flex', justifyContent: 'center', marginTop: 'clamp(28px, 4vw, 48px)'}}>
          <Link className="btn btn-solid" to="/shop" prefetch="intent">
            Shop the range
          </Link>
        </div>
      </section>

      {/* ─────────── How a colourway wears ─────────── */}
      <section className="section" style={{background: 'var(--panel)'}}>
        <div className="section-head-copy">
          <span className="eyebrow">How a colourway wears</span>
          <h2 className="h2">Two ways to wear one hue. Both on purpose.</h2>
          <p className="lede" style={{fontSize: 16.5, maxWidth: '58ch'}}>
            Two monochrome outfit ideas that aren&rsquo;t the same idea twice —
            one exact, one stepped.
          </p>
        </div>

        <div className="looks">
          <div className="look">
            <span className="look-title">Look 01 — exact match</span>
            <div className="look-stack" aria-hidden="true">
              <span className="bar-top" style={{background: look.hex}} />
              <span className="bar-mid" style={{background: look.hex}} />
              <span className="bar-foot" style={{background: look.hex}} />
            </div>
            <p>
              Every piece the same colour, hex for hex. The tightest version of
              the rule — reads as one continuous garment from a distance.
            </p>
          </div>

          <div className="look">
            <span className="look-title">Look 02 — stepped lighter</span>
            <div className="look-stack" aria-hidden="true">
              <span className="bar-top" style={{background: look.dark}} />
              <span className="bar-mid" style={{background: look.hex}} />
              <span className="bar-foot" style={{background: look.light}} />
            </div>
            <p>
              Same hue family, one deliberate lightness break moving down the
              body. A matched-family look rather than a flat colour — chosen, not
              settled for.
            </p>
          </div>

          <div className="look">
            <span className="look-title">And one pop</span>
            <div className="look-stack" aria-hidden="true">
              <span className="bar-top" style={{background: look.hex}} />
              <span
                className="bar-mid"
                style={{
                  background: `repeating-linear-gradient(135deg, ${look.hex} 0 10px, ${look.light} 10px 20px)`,
                }}
              />
              <span className="bar-foot" style={{background: look.hex}} />
            </div>
            <p>
              Patterns are the same six hues printed together — made to go{' '}
              <em>with</em> the plain pieces, one at a time. Put-together, with a
              sense of humour about it.
            </p>
          </div>
        </div>

        <p className="placeholder-note">
          Colour blocks stand in for look photography — replace with full-look
          shots, same crop and lighting per hue
        </p>
      </section>

      {/* ─────────── The short version ─────────── */}
      <section className="split">
        <HueBlock
          hue={HUES[5]}
          caption="Studio · folded stack, Umber · 3:2"
          style={{minHeight: 'clamp(280px, 38vw, 470px)'} as CSSProperties}
        />
        <div className="split-pad" style={{borderLeft: '1px solid var(--rule)'}}>
          <span className="eyebrow">The short version</span>
          <h2 className="h2" style={{fontSize: 'clamp(26px, 3vw, 40px)'}}>
            One colour rule, and no warehouse behind it.
          </h2>
          <p className="lede" style={{maxWidth: '50ch'}}>
            Every piece is made after you order it, so nothing is produced on a
            guess and nothing ends the season in a clearance bin. And we
            don&rsquo;t sell orphan pieces — every order is at least two pieces in
            one hue, because a single garment can&rsquo;t do the thing the range
            is for.
          </p>
          <Link className="link-rule" to="/about" prefetch="intent">
            Read the full story
          </Link>
        </div>
      </section>

      {/* ─────────── Size & fit ─────────── */}
      <section
        className="section"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(28px, 5vw, 72px)',
        }}
      >
        <div className="stack">
          <span className="eyebrow">Size &amp; fit</span>
          <h2 className="h2" style={{fontSize: 'clamp(26px, 3vw, 40px)'}}>
            Every number is the garment, not you.
          </h2>
          <p className="lede" style={{maxWidth: '46ch'}}>
            Measurements are taken flat off the piece itself, so you can hold
            them against something already in your wardrobe instead of guessing
            from a body chart. Where a cut runs generous or lean, its own
            product page says so.
          </p>
          <div className="row-actions" style={{gap: '12px 20px', marginTop: 4}}>
            <SizeChartTrigger className="btn btn-outline btn-sm">
              Open size chart
            </SizeChartTrigger>
            <Link className="link-quiet" to="/size-and-fit" prefetch="intent">
              Full fit guide
            </Link>
          </div>
        </div>

        <SizeChartPreview />
      </section>
    </main>
  );
}
