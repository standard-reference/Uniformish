import {Link} from 'react-router';
import type {Route} from './+types/shipping-and-faq';
import {Accordion} from '~/components/Accordion';
import {FAQS, SHIPPING_NOTE, SHIPPING_WINDOWS} from '~/data/range';

export const meta: Route.MetaFunction = () => [
  {title: 'Shipping, returns & FAQ — Uniform-ish'},
  {
    name: 'description',
    content:
      'Production and transit windows, the returns policy on kits and duos, and answers to the questions that come up most.',
  },
];

export default function ShippingAndFaq() {
  return (
    <main>
      <section
        style={{
          padding:
            'clamp(40px, 6vw, 96px) var(--gutter) clamp(28px, 3vw, 44px)',
        }}
      >
        <span className="eyebrow">Shipping, returns &amp; FAQ</span>
        <h1 className="h1" style={{margin: '16px 0 0', maxWidth: '22ch'}}>
          The full detail, no fine print
        </h1>
      </section>

      <section className="split" style={{borderTop: '1px solid var(--rule)'}}>
        <div className="split-pad" style={{gap: 18, borderRight: '1px solid var(--rule)'}}>
          <span className="eyebrow-sm">Shipping</span>
          <h2 className="h3">Two windows, added together</h2>

          <div className="window-table">
            <div className="window-row" style={{background: 'var(--ink)', color: 'var(--ink-inverse)'}}>
              <span>Destination</span>
              <span style={{color: 'inherit'}}>Transit</span>
              <span style={{color: 'inherit'}}>Rate</span>
            </div>
            {SHIPPING_WINDOWS.map((row) => (
              <div className="window-row" key={row.region}>
                <span>{row.region}</span>
                <span>{row.window}</span>
                <span>{row.rate}</span>
              </div>
            ))}
          </div>

          <p className="body-copy" style={{fontSize: 16}}>
            {SHIPPING_NOTE} Orders are produced at the facility closest to the
            delivery address, so a parcel does not cross the world to reach you.
            Pieces made at different facilities may arrive separately, each with
            its own tracking.
          </p>
        </div>

        <div className="split-pad" style={{gap: 18}}>
          <span className="eyebrow-sm">Returns &amp; exchanges</span>
          <h2 className="h3">Kits return within 30 days</h2>

          <p className="body-copy" style={{fontSize: 16}}>
            Every piece is made for you specifically, which means we can&rsquo;t
            resell a return — so the return window sits on kits, where there is a
            single bundled product to send back whole.
          </p>

          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <p>
                Email us within 30 days of delivery with your order number. Kits
                come back whole, unworn and unwashed.
              </p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <p>
                We confirm and send return instructions the same day, then refund
                to the original payment method once the kit arrives.
              </p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <p>
                Faulty or misprinted pieces are replaced or refunded in full,
                always — that one has no window on it.
              </p>
            </div>
          </div>

          <div className="callout">
            <span className="eyebrow-sm" style={{letterSpacing: '0.12em'}}>
              Kits vs duos
            </span>
            <p>
              <strong>Kits</strong> are one bundled product, so they can come back
              whole within 30 days for a refund. <strong>Duos</strong> are two
              separately-sold pieces — there&rsquo;s nothing to partially unwind,
              so they&rsquo;re final sale.
            </p>
            <Link className="link-rule" to="/size-and-fit" prefetch="intent">
              Check the size guide first
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" style={{padding: 'clamp(36px, 5vw, 80px) var(--gutter)'}}>
        <span className="eyebrow-sm">Frequently asked</span>
        <Accordion
          className="faq"
          defaultOpen={FAQS[0].q}
          items={FAQS.map((faq) => ({key: faq.q, label: faq.q, body: faq.a}))}
        />
      </section>
    </main>
  );
}
