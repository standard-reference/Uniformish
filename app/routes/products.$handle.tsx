import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import type {Route} from './+types/products.$handle';
import {Accordion} from '~/components/Accordion';
import {HueBlock} from '~/components/HueBlock';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {COMPANION_PRODUCTS_QUERY, handleQuery} from '~/lib/queries';
import {hueValue} from '~/lib/companions';
import {seoMeta} from '~/lib/seo';
import {DEFAULT_HUE, findHue} from '~/data/hues';
import {
  COMPANION_KEYS,
  getPiece,
  ORDER_TERMS,
  PRODUCT_TABS,
} from '~/data/range';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) {
    return seoMeta({
      title: 'Product',
      description: 'One hue, head to toe.',
      path: '/',
    });
  }

  return seoMeta({
    title: product.seo?.title ?? product.title,
    description:
      product.seo?.description ?? product.description?.slice(0, 160) ?? '',
    // Canonical is the bare product path: variant query params are the same
    // page, and pointing every colourway at itself would split the ranking.
    path: `/products/${product.handle}`,
    image: product.selectedOrFirstAvailableVariant?.image?.url ?? undefined,
    type: 'product',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const companionHandles = COMPANION_KEYS.map(
    (key) => getPiece(key)?.handle,
  ).filter((value): value is string => Boolean(value));

  const [{product}, companionResult] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Pieces that pair with this one. A companion that isn't listed yet simply
    // doesn't come back, and the pairing UI hides itself accordingly.
    storefront
      .query(COMPANION_PRODUCTS_QUERY, {
        variables: {query: handleQuery(companionHandles)},
        cache: storefront.CacheShort(),
      })
      .catch(() => null),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  // Keep only pieces that are actually in the range. The Storefront `query`
  // filter is a search, not an exact match — a backend that ignores or loosely
  // interprets it would otherwise surface unrelated products as companions.
  const companions = (companionResult?.products?.nodes ?? [])
    .filter((candidate) => candidate.handle !== handle)
    .filter((candidate) => companionHandles.includes(candidate.handle))
    .sort(
      (a, b) =>
        companionHandles.indexOf(a.handle) - companionHandles.indexOf(b.handle),
    );

  return {product, companions};
}

export default function Product() {
  const {product, companions} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const colour = selectedVariant ? hueValue(selectedVariant) : undefined;
  const hue = findHue(colour) ?? DEFAULT_HUE;
  const hueLabel = colour ?? hue.name;

  return (
    <main>
      <section className="pdp">
        <div className="pdp-media">
          <HueBlock
            className="pdp-media-main"
            hue={hue}
            frame
            caption={`Flat-lay · ${hueLabel} · front`}
            image={selectedVariant?.image ?? undefined}
          />
          <div className="pdp-media-pair">
            <HueBlock hue={hue} caption="Knit detail" />
            <HueBlock hue={hue} caption="Full look · size L" />
          </div>
        </div>

        <div className="pdp-main">
          <div className="field" style={{gap: 12}}>
            <span className="eyebrow">Made to order · {hueLabel}</span>
            <h1 className="pdp-title">{product.title}</h1>
            <span className="pdp-price">
              {selectedVariant?.compareAtPrice ? (
                <s>
                  <Money data={selectedVariant.compareAtPrice} />
                </s>
              ) : null}
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : null}
            </span>
          </div>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            companions={companions}
          />

          <div className="terms">
            {ORDER_TERMS.map((term, index) => (
              <div className="term" key={term.title}>
                <span className="num">{String(index + 1).padStart(2, '0')}</span>
                <p>
                  <strong>{term.title}</strong> {term.body}
                </p>
              </div>
            ))}
          </div>

          <Accordion items={PRODUCT_TABS} defaultOpen="details" />

          {product.descriptionHtml ? (
            <div
              className="accordion-panel"
              style={{padding: 0}}
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          ) : null}
        </div>
      </section>

      {companions.length > 0 ? (
        <section className="section-sm">
          <div className="section-head" style={{gap: '12px 32px', marginBottom: 26}}>
            <h2 className="h3">Complete the colourway — {hueLabel}</h2>
            <span className="meta push-right">Same hue, matched exactly</span>
          </div>
          <div className="companion-grid">
            {companions.map((companion) => (
              <div className="companion-card" key={companion.handle}>
                <HueBlock
                  hue={hue}
                  image={companion.featuredImage ?? undefined}
                />
                <p>{companion.title}</p>
                <div className="companion-card-foot">
                  <span>
                    <Money data={companion.priceRange.minVariantPrice} />
                  </span>
                  <span>Add to duo</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </main>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
