/**
 * Storefront queries shared across routes.
 *
 * **Never filter these by `handle:`.** The Storefront API's product `query`
 * argument supports `available_for_sale`, `created_at`, `product_type`, `tag`,
 * `tag_not`, `title`, `updated_at`, `variants.price` and `vendor` — and nothing
 * else. `handle:` is Admin API syntax; passing it here isn't rejected, it just
 * degrades to a free-text search that matches nothing, so every product
 * silently disappears. That shipped once: the Shop page listed the whole range
 * as unavailable and the PDP's pairing panel never found a companion.
 *
 * Two shapes below, for two different needs:
 * - Looking up specific pieces by handle → alias `product(handle:)` per piece.
 *   Exact, and one round trip.
 * - Listing the range → fetch products and filter locally against the handles
 *   in `app/data/range.ts`.
 */

export const HERO_PRODUCT_QUERY = `#graphql
  query HeroProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

/**
 * A piece offered as the other half of a look.
 *
 * `variants(first: 100)` covers six hues across seven sizes with headroom; if
 * the range ever outgrows that, page it rather than raising the number, since
 * the Storefront API caps a page at 250.
 */
export const COMPANION_PRODUCT_FRAGMENT = `#graphql
  fragment CompanionProduct on Product {
    id
    title
    handle
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

/**
 * The four pieces the crewneck pairs with, looked up by exact handle.
 *
 * Aliased rather than filtered because handle isn't a filterable field. Adding
 * a fifth companion means adding an alias here — explicit, and it fails at
 * codegen rather than silently returning nothing.
 */
export const COMPANION_PRODUCTS_QUERY = `#graphql
  query CompanionProducts(
    $country: CountryCode
    $language: LanguageCode
    $tee: String!
    $sweatpant: String!
    $short: String!
    $sock: String!
  ) @inContext(country: $country, language: $language) {
    tee: product(handle: $tee) {
      ...CompanionProduct
    }
    sweatpant: product(handle: $sweatpant) {
      ...CompanionProduct
    }
    short: product(handle: $short) {
      ...CompanionProduct
    }
    sock: product(handle: $sock) {
      ...CompanionProduct
    }
  }
  ${COMPANION_PRODUCT_FRAGMENT}
` as const;

/** Card fields for the Shop grid — deliberately light, no variants. */
export const RANGE_CARD_FRAGMENT = `#graphql
  fragment RangeCard on Product {
    id
    title
    handle
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

/**
 * Everything in the storefront, filtered locally against the range's handles.
 *
 * 250 is the Storefront API's page cap and far beyond what this catalogue will
 * hold; if it ever isn't, paginate rather than trusting the first page.
 */
export const RANGE_PRODUCTS_QUERY = `#graphql
  query RangeProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 250) {
      nodes {
        ...RangeCard
      }
    }
  }
  ${RANGE_CARD_FRAGMENT}
` as const;
