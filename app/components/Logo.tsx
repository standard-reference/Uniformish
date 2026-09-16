/**
 * The Uniform-ish mark: a uniform horizontal rule with one deliberate
 * deviation in it — a portal stepping up out of the line, its opening cutting
 * clean through. The name, drawn.
 *
 * Traced as geometry rather than shipped as a bitmap, so it inherits
 * `currentColor` (the footer's near-black inverts for free), stays sharp at any
 * size, and costs a couple of hundred bytes instead of a network request.
 *
 * Proportions, if this ever needs redrawing: bar thickness is 0.24 of the
 * portal's outer width, each leg is 0.34 of it, and the portal stands 0.48 of
 * that width above the line.
 */
export function Logo({
  className,
  title = 'Uniform-ish',
}: {
  className?: string;
  /** Accessible name. Pass null-ish only when adjacent text already names it. */
  title?: string | false;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      fill="currentColor"
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        d="M0 88 H850 V40 H950 V88 H1440 V112 H916 V64 H884 V112 H0 Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

/**
 * The portal on its own, squared up. The full mark is 12:1, so at favicon or
 * avatar size it collapses to an invisible hairline — this crops to the part
 * that actually carries the identity.
 */
export function LogoMark({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      role="img"
      aria-label="Uniform-ish"
      focusable="false"
    >
      <path d="M0 36 H14 V19 H50 V36 H64 V45 H38 V28 H26 V45 H0 Z" />
    </svg>
  );
}
