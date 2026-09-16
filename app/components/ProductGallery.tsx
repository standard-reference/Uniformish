import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {HueBlock} from '~/components/HueBlock';
import type {Hue} from '~/data/hues';

type ProductImage = ProductFragment['images']['nodes'][number];

/**
 * Product gallery: every image the product has, with the variant's own image
 * leading so the gallery agrees with the swatch that was just clicked.
 *
 * Falls back to a labelled hue block when a product has no photography, which
 * is the same placeholder used everywhere else rather than an empty frame.
 *
 * Alt text is generated rather than trusted: Printful writes "Product mockup"
 * on every image it syncs, which is worthless to a screen reader and to search.
 * A real alt on the image always wins — this only fills the gap.
 */
export function ProductGallery({
  images,
  variantImage,
  title,
  colour,
  hue,
}: {
  images: ProductImage[];
  variantImage?: ProductImage | null;
  title: string;
  colour?: string;
  hue: Hue;
}) {
  // The variant's image first, then the rest, de-duplicated by id.
  const ordered = [
    ...(variantImage ? [variantImage] : []),
    ...images.filter((image) => image.id !== variantImage?.id),
  ];

  const [active, setActive] = useState(0);
  const current = ordered[active] ?? ordered[0];

  if (!current) {
    return (
      <div className="pdp-media">
        <HueBlock
          className="pdp-media-main"
          hue={hue}
          caption={`Flat-lay · ${colour ?? hue.name} · front`}
        />
      </div>
    );
  }

  const describe = (image: ProductImage, index: number) => {
    if (image.altText && !/^product mockup$/i.test(image.altText)) {
      return image.altText;
    }
    const subject = colour ? `${title} in ${colour}` : title;
    return index === 0 ? subject : `${subject}, view ${index + 1}`;
  };

  return (
    <div className="pdp-media">
      <div className="pdp-media-main">
        <Image
          data={current}
          alt={describe(current, active)}
          aspectRatio="4/5"
          sizes="(min-width: 860px) 50vw, 100vw"
          loading="eager"
        />
      </div>

      {ordered.length > 1 ? (
        <ul className="pdp-thumbs" aria-label={`${title} images`}>
          {ordered.map((image, index) => (
            <li key={image.id ?? index}>
              <button
                type="button"
                className="pdp-thumb"
                aria-label={describe(image, index)}
                aria-current={index === active}
                onClick={() => setActive(index)}
              >
                <Image
                  data={image}
                  alt=""
                  aspectRatio="1/1"
                  sizes="120px"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
