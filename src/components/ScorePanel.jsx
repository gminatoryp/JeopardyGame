import './ScorePanel.css'

const TEAM_COLORS = ['#f0c040', '#60c0ff', '#ff6060', '#60ff90']

export default function ScorePanel({ teams, onReset }) {
  return (
    <div className="score-panel">
      <div className="score-teams">
        {teams.map((team, i) => (
          <div key={team.id} className="score-team" style={{ '--team-color': TEAM_COLORS[i] }}>
            <div className="team-name-display">{team.name}</div>
            <div className={`team-score-display ${team.score < 0 ? 'negative' : ''}`}>
              {team.score < 0 ? '-' : ''}${Math.abs(team.score).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <button className="reset-btn" onClick={onReset}>
        NEW GAME
      </button>
    </div>
  )
}
