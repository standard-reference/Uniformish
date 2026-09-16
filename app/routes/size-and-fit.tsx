import {Link} from 'react-router';
import type {Route} from './+types/size-and-fit';
import {SizeChartTable} from '~/components/SizeChart';
import {HERO_PIECE} from '~/data/range';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Size & fit guide',
    description:
      'Garment-flat measurements for the oversized crewneck, in centimetres and inches, with how to measure and which size to take.',
    path: '/size-and-fit',
  });

export default function SizeAndFit() {
  return (
    <main>
      <section
        style={{
          padding:
            'clamp(40px, 6vw, 96px) var(--gutter) clamp(28px, 3vw, 44px)',
        }}
      >
        <span className="eyebrow">Size &amp; fit guide</span>
        <h1 className="h1" style={{margin: '16px 0 0', maxWidth: '24ch'}}>
          Oversized crewneck measurements
        </h1>
        <p className="lede" style={{margin: '20px 0 0', maxWidth: '54ch'}}>
          These are garment measurements taken flat, not body measurements.
          Compare them to a sweatshirt you already own and like — it&rsquo;s the
          most reliable way to get this right first time.
        </p>
      </section>

      <section style={{padding: '0 var(--gutter) clamp(40px, 5vw, 72px)'}}>
        <SizeChartTable />
      </section>

      <section
        className="split"
        style={{borderTop: '1px solid var(--rule)'}}
      >
        <div className="split-pad" style={{gap: 22, borderRight: '1px solid var(--rule)'}}>
          <span className="eyebrow-sm">How to measure</span>

          <div className="measure-steps">
            <div className="measure-step">
              <span className="key">A</span>
              <p>
                <strong>Half chest.</strong> Lay the garment flat, measure
                straight across 2cm below the armhole seam.
              </p>
            </div>
            <div className="measure-step">
              <span className="key">B</span>
              <p>
                <strong>Body length.</strong> From the highest point of the
                shoulder straight down to the hem.
              </p>
            </div>
            <div className="measure-step">
              <span className="key">C</span>
              <p>
                <strong>Sleeve.</strong> From the centre back neck along the
                shoulder to the cuff edge.
              </p>
            </div>
          </div>

          <div className="schematic" aria-hidden="true">
            <i className="body" />
            <i className="sleeve-l" />
            <i className="sleeve-r" />
            <i className="rule-a" />
            <i className="rule-b" />
            <b className="label-a">A</b>
            <b className="label-b">B</b>
            <b className="label-c">C</b>
            <span className="caption">
              Schematic — replace with measurement diagram
            </span>
          </div>
        </div>

        <div className="split-pad" style={{gap: 22}}>
          <span className="eyebrow-sm">Which size</span>
          <h2 className="h2" style={{fontSize: 'clamp(24px, 2.8vw, 34px)'}}>
            True to size for the full relaxed look. Down one for closer.
          </h2>
          <p className="body-copy">
            The crewneck is cut wide through the body with a dropped shoulder —
            the one intentionally oversized piece in a range that otherwise sits
            lean. Taking your usual size gives you the boxy look in the photos.
            Sizing down keeps the drop shoulder but reads closer to regular fit.
          </p>
          <p className="body-copy">
            Pairing it into a duo or kit? The bottoms are true to size — size the
            crewneck for the look you want, not to match.
          </p>
          <p className="body-copy">
            Between two sizes? The half-chest column decides it. Take the larger
            for the full boxy look, the smaller for something closer to regular
            fit — and check both against a sweatshirt you already wear.
          </p>

          <div className="row-actions" style={{gap: '12px 18px', marginTop: 4}}>
            <Link
              className="btn btn-solid"
              to={`/products/${HERO_PIECE.handle}`}
              prefetch="intent"
              style={{minHeight: 52, padding: '0 26px'}}
            >
              Shop the Crewneck
            </Link>
            <Link className="link-quiet" to="/shipping-and-faq" prefetch="intent">
              Shipping &amp; returns
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
