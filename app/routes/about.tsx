import type {CSSProperties} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/about';
import {HueBlock} from '~/components/HueBlock';
import {HUES} from '~/data/hues';
import {seoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: 'About',
    description:
      'One hue, head to toe. Why the colour system came before the clothes, and why every order is at least two pieces.',
    path: '/about',
  });

export default function About() {
  return (
    <main>
      <section
        style={{
          padding:
            'clamp(44px, 7vw, 108px) var(--gutter) clamp(32px, 4vw, 56px)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span className="eyebrow">The idea</span>
        <h1 className="h1" style={{margin: '18px 0 0', maxWidth: '20ch', fontSize: 'clamp(34px, 4.6vw, 66px)'}}>
          One hue, head to toe. Not one hex.
        </h1>
        <p
          className="lede"
          style={{margin: '22px 0 0', maxWidth: '58ch', fontSize: 18, color: 'var(--ink-body)'}}
        >
          Stay inside a single hue family across everything you&rsquo;re wearing
          and the whole fit reads as monotone — exact match or stepped lighter
          toward the feet, both work. That rule is the product. The garments are
          just how you apply it.
        </p>
      </section>

      <section className="split">
        <div className="split-pad" style={{gap: 20, borderRight: '1px solid var(--rule)'}}>
          <span className="eyebrow-sm">Why six hues</span>
          <p className="body-copy">
            Jet, Bone, Moss, Clay, Slate and Umber aren&rsquo;t a colour chart,
            they&rsquo;re a styling system. Each hue is matched to the others with
            actual colour maths — OKLCh hue, chroma and lightness held inside set
            tolerances — instead of being eyeballed against a swatch book.
          </p>
          <p className="body-copy">
            The practical result: cross the range however you like. A Clay top
            over an Umber bottom, Moss over Slate. It reads as intentional because
            the colours are close enough to belong together, which is a much
            better reason to offer six options than &ldquo;available in six
            colours&rdquo;.
          </p>
        </div>

        <div className="split-pad" style={{gap: 20}}>
          <span className="eyebrow-sm">Why we don&rsquo;t sell single pieces</span>
          <p className="body-copy">
            One piece on its own can&rsquo;t do the thing the brand is for. So
            every order is at least two pieces in the same hue — a duo, or a
            three-piece kit. That&rsquo;s enforced at the register, and nowhere
            else: what you wear afterwards is entirely your business. A rule you
            have to keep obeying after you&rsquo;ve paid isn&rsquo;t a brand,
            it&rsquo;s a nag.
          </p>
          <p className="body-copy">
            Patterns exist for the same reason and work the opposite way — one
            printed piece against the plain ones. A considered fit with one thing
            going on in it.
          </p>
        </div>
      </section>

      <section className="split">
        <div className="split-pad" style={{gap: 20, borderRight: '1px solid var(--rule)'}}>
          <span className="eyebrow-sm">Founder note</span>
          <p className="body-copy" style={{fontSize: 18, color: 'var(--ink-body)'}}>
            I kept getting dressed the same way — one colour, top to bottom,
            because it takes ten seconds and always looks deliberate. What I
            couldn&rsquo;t buy was a range where the pieces actually matched each
            other. Close-ish isn&rsquo;t matched. So I built the colour system
            first and the clothes second.
          </p>
          <p className="body-copy">
            The fits aren&rsquo;t uniform and aren&rsquo;t meant to be — some
            pieces sit generous, some sit lean. What holds across all of them is
            the colour, which is the part that has to match.
          </p>
        </div>

        <div className="split-pad" style={{gap: 20}}>
          <span className="eyebrow-sm">Why made to order</span>
          <p className="body-copy">
            Nothing is made until you order it. Our print partner produces each
            piece in 2–5 business days and ships it direct, so there&rsquo;s no
            warehouse, no minimum run of 300 units in sizes nobody wanted, and no
            end-of-season pile to discount or bin.
          </p>
          <p className="body-copy">
            The launch range is built on heavyweight cotton blanks — AS Colour
            and Cotton Heritage bodies, embroidered rather than printed, so the
            mark is thread in the fabric rather than a layer sitting on top of
            it. The constraint that comes with it is honest: a hue ships when a
            blank exists in it and lands inside our tolerances, which is why
            the range grows a hue at a time rather than all six at once.
          </p>
          <p className="body-copy">
            The trade-off is real and worth stating: you wait about two weeks
            instead of two days.
          </p>
        </div>
      </section>

      <section className="split">
        <HueBlock
          hue={HUES[3]}
          caption="Process shot · colour proofs / packing table"
          style={{minHeight: 'clamp(280px, 36vw, 440px)'} as CSSProperties}
        />
        <div
          className="split-pad"
          style={{gap: 20, borderLeft: '1px solid var(--rule)', background: 'var(--panel)'}}
        >
          <span className="eyebrow-sm">The measurable part</span>
          <h2 className="h2" style={{fontSize: 'clamp(24px, 2.8vw, 36px)'}}>
            Matched is a measurement, not an opinion.
          </h2>
          <p className="body-copy">
            Every hue in the range is held inside set OKLCh tolerances for
            lightness, chroma and hue angle, so &ldquo;these go together&rdquo; is
            something we can check rather than something you have to take our word
            for — and a blank that misses the band doesn&rsquo;t ship, which is
            the whole reason the range grows slowly. And if a piece isn&rsquo;t
            what you pictured it goes back on its own — keep what works, send
            back what doesn&rsquo;t.
          </p>
          <Link className="link-rule" to="/shipping-and-faq" prefetch="intent">
            Read the policy in full
          </Link>
        </div>
      </section>
    </main>
  );
}
