import {Link} from 'react-router';
import type {Route} from './+types/shipping-and-faq';
import {Accordion} from '~/components/Accordion';
import {FAQS, SHIPPING_NOTE, SHIPPING_WINDOWS} from '~/data/range';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'Shipping, returns & FAQ',
    description:
      'Production and transit windows, the returns policy on kits and duos, and answers to the questions that come up most.',
    path: '/shipping-and-faq',
  });

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
          <span className="eyebrow-sm">Returns &amp; refunds</span>
          <h2 className="h3">Keep what works, send back what doesn&rsquo;t</h2>

          <p className="body-copy" style={{fontSize: 16}}>
            Every piece is sold and refunded individually, including pieces
            bought together as a duo or a kit. You never have to return a whole
            order to return one item.
          </p>

          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <p>
                <strong>14 days in the EU and UK</strong> to change your mind, for
                any reason. 30 days everywhere else. Email us within that window
                with your order number and what&rsquo;s coming back.
              </p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <p>
                We send the return address within two business days. Post it back
                within 14 days of telling us — return postage is yours on a
                change of mind.
              </p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <p>
                Refunded to your original payment method within 14 days of the
                parcel reaching us, or of proof of postage — whichever comes
                first.
              </p>
            </div>
          </div>

          <div className="callout">
            <span className="eyebrow-sm" style={{letterSpacing: '0.12em'}}>
              Faulty, damaged or wrong
            </span>
            <p>
              Photograph it and email within 30 days. Replaced or refunded in
              full, postage both ways on us — <strong>your choice, not ours</strong>.
              A statutory guarantee against lack of conformity also applies for
              three years under Spanish law, and nothing here limits it.
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
