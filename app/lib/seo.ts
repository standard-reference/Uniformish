/**
 * Canonical identity for the storefront.
 *
 * Canonical URLs are always absolute and always point at the production domain,
 * regardless of which host served the response. That is deliberate: Oxygen
 * preview deployments and the `*.myshopify.com` fallback would otherwise compete
 * with production for the same content in search results.
 *
 * `PUBLIC_STORE_DOMAIN` is a different thing and stays as the myshopify domain —
 * it addresses the Storefront API, not the public site.
 */
export const SITE_URL = 'https://uniformish.store';

export const SITE_NAME = 'Uniform-ish';

export const CONTACT_EMAIL = 'hello@uniformish.store';

/** Absolute URL for a site-relative path. */
export function canonicalUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString();
}

type SeoInput = {
  /** Page title, without the brand suffix. */
  title: string;
  description: string;
  /** Site-relative path, e.g. `/shop`. */
  path?: string;
  /** Absolute image URL for social cards. */
  image?: string;
  /** `product` for PDPs, `website` for everything else. */
  type?: 'website' | 'product';
};

/**
 * One meta block per route, so title, description, canonical and the social
 * cards can never drift apart.
 */
export function seoMeta({
  title,
  description,
  path = '/',
  image,
  type = 'website',
}: SeoInput) {
  const url = canonicalUrl(path);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} — ${SITE_NAME}`;

  return [
    {title: fullTitle},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: url},

    {property: 'og:site_name', content: SITE_NAME},
    {property: 'og:type', content: type},
    {property: 'og:url', content: url},
    {property: 'og:title', content: fullTitle},
    {property: 'og:description', content: description},
    ...(image ? [{property: 'og:image', content: image}] : []),

    {
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    },
    {name: 'twitter:title', content: fullTitle},
    {name: 'twitter:description', content: description},
    ...(image ? [{name: 'twitter:image', content: image}] : []),
  ];
}
