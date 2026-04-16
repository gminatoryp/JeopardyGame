// Scoreboard — title + three team score cards
import { TEAM_COLORS, TEAM_GLOWS } from '../config';

export default function Scoreboard({ teamNames, scores, deltas }) {
  return (
    <>
      {/* Title */}
      <div className="jp-title-wrap">
        <div className="jp-eyebrow">Welcome to</div>
        <div className="jp-title">Jeopardy!</div>
        <div className="jp-title-bar" />
      </div>

      {/* Score cards */}
      <div className="jp-scores">
        {teamNames.map((name, i) => (
          <div
            key={i}
            className="jp-score-card"
            style={{ '--accent': TEAM_COLORS[i], '--glow': TEAM_GLOWS[i] }}
          >
            <div className="jp-score-label">{name}</div>
            <div className={`jp-score-num${scores[i] < 0 ? ' neg' : ''}`}>
              {scores[i] < 0 ? `-$${Math.abs(scores[i])}` : `$${scores[i]}`}
            </div>
            <div
              className={`jp-score-delta${deltas[i] !== null ? ' show' : ''}`}
              style={{ color: deltas[i] > 0 ? '#34D399' : '#F87171' }}
            >
              {deltas[i] !== null
                ? deltas[i] > 0
                  ? `+$${deltas[i]}`
                  : `-$${Math.abs(deltas[i])}`
                : ''}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
