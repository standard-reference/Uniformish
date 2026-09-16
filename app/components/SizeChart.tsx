import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {
  SIZE_CHART,
  SIZE_CHART_FOOTNOTE,
  SIZE_CHART_PREVIEW,
  type SizeRow,
} from '~/data/range';

/** The full chart, centimetres with inch equivalents. */
export function SizeChartTable({rows = SIZE_CHART}: {rows?: SizeRow[]}) {
  return (
    <div className="chart">
      <table>
        <caption className="sr-only">
          Measurements, taken flat
        </caption>
        <thead>
          <tr>
            <th scope="col">Size</th>
            <th scope="col">½ Chest</th>
            <th scope="col">Body length</th>
            <th scope="col">Sleeve</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size}>
              <th scope="row">{row.size}</th>
              <td>
                {row.chestCm}{' '}
                <span className="alt-unit">/ {row.chestIn}&Prime;</span>
              </td>
              <td>
                {row.lengthCm}{' '}
                <span className="alt-unit">/ {row.lengthIn}&Prime;</span>
              </td>
              <td>
                {row.sleeveCm}{' '}
                <span className="alt-unit">/ {row.sleeveIn}&Prime;</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="chart-foot">{SIZE_CHART_FOOTNOTE}</p>
    </div>
  );
}

/** Condensed chart for the home page — four sizes, centimetres only. */
export function SizeChartPreview() {
  return (
    <div className="chart chart-compact">
      <table>
        <caption className="sr-only">
          Measurements for the four middle sizes
        </caption>
        <thead>
          <tr>
            <th scope="col">Size</th>
            <th scope="col">½ Chest</th>
            <th scope="col">Length</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART_PREVIEW.map((row) => (
            <tr key={row.size}>
              <th scope="row">{row.size}</th>
              <td>{row.chestCm} cm</td>
              <td>{row.lengthCm} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="chart-foot">
        Centimetres, flat · ±2cm · pending final blank spec
      </p>
    </div>
  );
}

/** Contents of the size-chart modal. */
export function SizeChartPanel() {
  const {close} = useAside();

  return (
    <div className="modal-body">
      <SizeChartTable />
      <p style={{margin: '16px 0 0', fontSize: 15.5, lineHeight: 1.6}}>
        The half-chest column is the one to check: compare it against a
        garment you already own and like the fit of. Between two sizes, that
        number decides it.
      </p>
      <p className="chart-foot" style={{padding: '10px 0 0'}}>
        {SIZE_CHART_FOOTNOTE}
      </p>
      <Link
        to="/size-and-fit"
        onClick={close}
        className="link-rule"
        style={{marginTop: 10}}
      >
        How to measure →
      </Link>
    </div>
  );
}

/** Button that opens the size-chart modal from anywhere. */
export function SizeChartTrigger({
  className = 'field-link',
  children = 'Size guide',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const {open} = useAside();
  return (
    <button className={className} type="button" onClick={() => open('size')}>
      {children}
    </button>
  );
}
