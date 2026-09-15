import type {CSSProperties, ReactNode} from 'react';
import {captionInk, hairline, type Hue} from '~/data/hues';

/**
 * A flat area of a hue, carrying the diagonal weave and an optional inset
 * hairline. Used wherever photography will eventually go — the caption names
 * the shot it is standing in for, so no placeholder ships unlabelled.
 *
 * Pass `image` once real photography exists and the colour becomes the
 * loading backdrop rather than the subject.
 */
export function HueBlock({
  hue,
  caption,
  frame = false,
  className = '',
  style,
  image,
  children,
}: {
  hue: Hue;
  caption?: string;
  /** Draw the inset hairline rectangle. */
  frame?: boolean;
  className?: string;
  style?: CSSProperties;
  image?: {url: string; altText?: string | null};
  children?: ReactNode;
}) {
  return (
    <div
      className={`hue-block${frame ? ' has-frame' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--hue': hue.hex,
          '--hue-ink': captionInk(hue),
          '--hue-hair': hairline(hue),
          ...style,
        } as CSSProperties
      }
    >
      {image ? (
        <img src={image.url} alt={image.altText ?? ''} loading="lazy" />
      ) : null}
      {caption ? <span className="hue-caption">{caption}</span> : null}
      {children}
    </div>
  );
}

/** Inline style block that exposes a hue to CSS via custom properties. */
export function hueVars(hue: Hue): CSSProperties {
  return {
    '--hue': hue.hex,
    '--hue-ink': captionInk(hue),
    '--hue-hair': hairline(hue),
  } as CSSProperties;
}
