/**
 * Flat-lay schematic of the oversized crewneck with the three measurements
 * marked, matching the A/B/C steps beside it on the size guide.
 *
 * Inline SVG rather than an image: it inherits the page's colour tokens, stays
 * crisp at any size, and the labels are real text so they survive zoom and are
 * readable by a screen reader through the title/desc pair.
 *
 * Not to scale — it shows *where* to measure, not proportions. The numbers are
 * in the chart; this only has to make "half chest" unambiguous.
 */
export function MeasurementDiagram() {
  return (
    <svg
      className="measure-diagram"
      viewBox="0 0 440 400"
      role="img"
      aria-labelledby="measure-diagram-title measure-diagram-desc"
    >
      <title id="measure-diagram-title">
        Where to measure an oversized crewneck, laid flat
      </title>
      <desc id="measure-diagram-desc">
        A crewneck sweatshirt seen flat from the front. Line A runs straight
        across the body two centimetres below the armhole seam for the half
        chest. Line B runs down the right-hand side from the highest point of
        the shoulder to the hem for the body length. Line C follows the centre
        back neck across the shoulder and down the sleeve to the cuff edge.
      </desc>

      {/* ── Garment ── */}
      <g className="garment">
        <path
          d="M186 92
             Q220 116 254 92
             L300 98 L382 150 L374 182 L300 168
             L304 332 L136 332 L140 168
             L66 182 L58 150 L140 98
             Z"
        />
        {/* Neck rib */}
        <path d="M192 96 Q220 118 248 96" className="rib" />
        {/* Hem rib */}
        <path d="M137 310 L303 310" className="rib" />
        {/* Cuff ribs */}
        <path d="M62 166 L136 156" className="rib" />
        <path d="M378 166 L304 156" className="rib" />
      </g>

      {/* ── A · half chest ── */}
      <g className="dim">
        <path d="M136 200 L304 200" />
        <path d="M136 192 L136 208" className="tick" />
        <path d="M304 192 L304 208" className="tick" />
      </g>

      {/* ── B · body length ── */}
      <g className="dim">
        <path d="M404 92 L404 332" />
        <path d="M396 92 L412 92" className="tick" />
        <path d="M396 332 L412 332" className="tick" />
        {/* Leaders back to the garment */}
        <path d="M300 98 L404 92" className="leader" />
        <path d="M304 332 L404 332" className="leader" />
      </g>

      {/* ── C · sleeve ── */}
      <g className="dim">
        <path d="M220 104 L300 100 L376 164" />
        <circle cx="220" cy="104" r="3.5" className="dot" />
        <circle cx="376" cy="164" r="3.5" className="dot" />
      </g>

      {/* ── Labels ── */}
      <g className="label">
        <circle cx="220" cy="200" r="13" />
        <text x="220" y="205">
          A
        </text>
      </g>
      <g className="label">
        <circle cx="404" cy="212" r="13" />
        <text x="404" y="217">
          B
        </text>
      </g>
      <g className="label">
        <circle cx="316" cy="116" r="13" />
        <text x="316" y="121">
          C
        </text>
      </g>
    </svg>
  );
}
