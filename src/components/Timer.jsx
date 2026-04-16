// Timer — animated SVG ring countdown

export default function Timer({ seconds, total }) {
  const r      = 31;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / total);
  const color  =
    seconds > total * 0.5  ? '#4ADE80' :
    seconds > total * 0.25 ? '#FACC15' :
    '#F87171';

  return (
    <div className="jp-timer-wrap">
      <div className="jp-timer-ring">
        <svg className="jp-timer-svg" width="78" height="78" viewBox="0 0 78 78">
          <circle className="jp-timer-bg"  cx="39" cy="39" r={r} />
          <circle
            className="jp-timer-arc"
            cx="39" cy="39" r={r}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            stroke={color}
          />
        </svg>
        <div className="jp-timer-num" style={{ color }}>{seconds}</div>
      </div>
    </div>
  );
}
