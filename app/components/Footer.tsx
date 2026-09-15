import {Link} from 'react-router';
import {HERO_PIECE} from '~/data/range';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div className="footer-col">
          <span className="footer-wordmark">Uniform-ish</span>
          <p className="footer-blurb">
            One hue, head to toe. Six matched earth tones, made to order,
            shipped worldwide.
          </p>
        </div>

        <div className="footer-col">
          <span className="footer-head">Shop</span>
          <Link to={`/products/${HERO_PIECE.handle}`} prefetch="intent">
            The Oversized Crewneck
          </Link>
          <Link to="/shop" prefetch="intent">
            Kits &amp; duos
          </Link>
          <Link to="/size-and-fit" prefetch="intent">
            Size &amp; fit guide
          </Link>
        </div>

        <div className="footer-col">
          <span className="footer-head">Help</span>
          <Link to="/shipping-and-faq" prefetch="intent">
            Shipping &amp; returns
          </Link>
          <Link to="/shipping-and-faq#faq" prefetch="intent">
            FAQ
          </Link>
          <Link to="/about" prefetch="intent">
            About
          </Link>
          <a href="mailto:hello@uniformish.store">hello@uniformish.store</a>
        </div>

        <div className="footer-col">
          <span className="footer-head">New hues</span>
          <p className="footer-note">
            One email when a hue or a piece goes live. Nothing else — no
            discount codes, because we don&rsquo;t run them.
          </p>
          {/*
            Not wired to a list provider yet. Left as a plain form rather than a
            fake success state so nobody is told they subscribed when they
            haven't — see the storefront notes in CLAUDE.md.
          */}
          <form
            className="signup"
            action="/shipping-and-faq"
            method="get"
            aria-label="Notify me when a hue goes live"
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              placeholder="you@email.com"
              autoComplete="email"
            />
            <button type="submit">Notify me</button>
          </form>
        </div>
      </div>

      <div className="footer-base">
        <span>© {YEAR} Uniform-ish</span>
        <Link to="/policies/privacy-policy">Privacy</Link>
        <Link to="/policies/terms-of-service">Terms</Link>
        <span className="payment-marks">
          <span>Shop Pay</span>
          <span>Apple Pay</span>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Amex</span>
        </span>
      </div>
    </footer>
  );
}
