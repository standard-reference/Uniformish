/**
 * Storefront queries shared across routes.
 *
 * Product/variant queries that belong to a single route live with that route;
 * these are the ones more than one page needs.
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
 * `variants(first: 100)` is enough for six hues across seven sizes (42) with
 * headroom; if the range ever outgrows that, page it rather than raising the
 * number, since the Storefront API caps a page at 250.
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

export const COMPANION_PRODUCTS_QUERY = `#graphql
  query CompanionProducts(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...CompanionProduct
      }
    }
  }
  ${COMPANION_PRODUCT_FRAGMENT}
` as const;

/** Prices for every piece in the range that is actually listed. */
export const RANGE_PRICES_QUERY = `#graphql
  query RangePrices(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 20, query: $query) {
      nodes {
        id
        handle
        title
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

/** Builds a Storefront search filter matching any of the given handles. */
export function handleQuery(handles: readonly string[]): string {
  return handles.map((handle) => `handle:${handle}`).join(' OR ');
}
