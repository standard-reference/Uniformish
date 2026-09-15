import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {HueBlock} from '~/components/HueBlock';
import {DEFAULT_HUE} from '~/data/hues';

/**
 * Tile used on collection listings. Falls back to a flat hue block when a
 * product has no photography yet, so the grid stays even.
 */
export function ProductItem({
  product,
}: {
  product: CollectionItemFragment | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);

  return (
    <Link className="hue-card" prefetch="intent" to={variantUrl}>
      <HueBlock
        hue={DEFAULT_HUE}
        image={product.featuredImage ?? undefined}
        caption={product.featuredImage ? undefined : 'Photography to come'}
      />
      <p className="hue-card-name">{product.title}</p>
      <div className="hue-card-foot" style={{fontSize: 10.5, marginTop: 6}}>
        <span className="hue-card-code">
          <Money data={product.priceRange.minVariantPrice} />
        </span>
      </div>
    </Link>
  );
}
