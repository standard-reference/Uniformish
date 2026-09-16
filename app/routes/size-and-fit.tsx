import {Link} from 'react-router';
import type {Route} from './+types/size-and-fit';
import {MeasurementDiagram} from '~/components/MeasurementDiagram';
import {SizeChartTable} from '~/components/SizeChart';
import {HERO_PIECE} from '~/data/range';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Size & fit guide',
    description:
      'How to measure, and the garment-flat measurements behind every size, in centimetres and inches.',
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
          Every number is the garment, not you
        </h1>
        <p className="lede" style={{margin: '20px 0 0', maxWidth: '54ch'}}>
          These are garment measurements taken flat, not body measurements.
          Compare them to a sweatshirt you already own and like — it&rsquo;s the
          most reliable way to get this right first time.
        </p>
      </section>

      <section style={{padding: '0 var(--gutter) clamp(40px, 5vw, 72px)'}}>
        <div className="section-head" style={{marginBottom: 16}}>
          <span className="eyebrow-sm">{HERO_PIECE.name}</span>
          <span className="meta push-right" style={{fontSize: 10.5}}>
            Charts for the rest of the range follow
          </span>
        </div>
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

          <figure className="diagram-frame">
            <MeasurementDiagram />
            <figcaption>Measured flat · not to scale</figcaption>
          </figure>
        </div>

        <div className="split-pad" style={{gap: 22}}>
          <span className="eyebrow-sm">Which size</span>
          <h2 className="h2" style={{fontSize: 'clamp(24px, 2.8vw, 34px)'}}>
            Measure something you already wear.
          </h2>
          <p className="body-copy">
            It is the one method that works every time. Find the garment in your
            wardrobe that fits the way you want this one to, lay it flat, and
            compare the half-chest. Two minutes with a tape measure beats any
            amount of guessing from a body size.
          </p>
          <p className="body-copy">
            Between two sizes, that half-chest number decides it — larger for
            room, smaller for a closer line. Where a particular cut runs
            generous or lean, its own product page says so.
          </p>
          <p className="body-copy">
            Building a duo or a kit? Size each piece for how you want that piece
            to sit. Nothing needs to match but the colour.
          </p>

          <div className="row-actions" style={{gap: '12px 18px', marginTop: 4}}>
            <Link
              className="btn btn-solid"
              to="/shop"
              prefetch="intent"
              style={{minHeight: 52, padding: '0 26px'}}
            >
              Shop the range
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
