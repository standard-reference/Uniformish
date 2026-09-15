import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

/**
 * Buyer locale for the Storefront API's `@inContext` directive.
 *
 * The store sells worldwide from one EUR base price and lets Shopify Markets
 * convert per buyer — local currencies are enabled on both non-primary markets
 * and 20 presentment currencies are active. So the app must NOT pin a country:
 * whatever we pass here is the currency the buyer is quoted, and pinning one
 * would show every visitor on earth the same wrong currency.
 *
 * Language stays EN everywhere for now — translations are a deliberate later
 * step, and asking the Storefront API for a language with no published
 * translations returns the primary language anyway.
 */

/** Primary market. Buyers outside every configured market resolve here. */
const DEFAULT_COUNTRY: CountryCode = 'ES';

const DEFAULT_LANGUAGE: LanguageCode = 'EN';

/**
 * Countries covered by a configured market, so a buyer is quoted in their own
 * currency. Mirrors Shopify admin → Settings → Markets; if a market gains a
 * region, add it here or that buyer silently falls back to EUR.
 */
const MARKET_COUNTRIES = new Set<string>([
  // Spain (primary)
  'ES',
  // European Union
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DE', 'DK', 'EE', 'FI', 'FR', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'SE',
  // International
  'AE', 'AU', 'CA', 'CH', 'GB', 'HK', 'IL', 'JP', 'KR', 'MY', 'NO', 'NZ',
  'SG', 'US',
]);

export type Locale = {language: LanguageCode; country: CountryCode};

/**
 * Oxygen resolves the buyer's country at the edge and passes it on this header.
 * Locally it is absent, so dev runs as the primary market.
 */
export function getLocaleFromRequest(request: Request): Locale {
  const header = request.headers.get('oxygen-buyer-country');
  const country = header?.trim().toUpperCase();

  return {
    language: DEFAULT_LANGUAGE,
    country:
      country && MARKET_COUNTRIES.has(country)
        ? (country as CountryCode)
        : DEFAULT_COUNTRY,
  };
}
