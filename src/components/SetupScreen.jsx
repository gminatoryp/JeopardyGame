import { useState } from 'react'
import './SetupScreen.css'

export default function SetupScreen({ onStart }) {
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2', 'Team 3', 'Team 4'])

  const handleNameChange = (index, value) => {
    const updated = [...teamNames]
    updated[index] = value
    setTeamNames(updated)
  }

  const handleStart = () => {
    const teams = teamNames.slice(0, teamCount).map((name, i) => ({
      id: i,
      name: name.trim() || `Team ${i + 1}`,
      score: 0,
    }))
    onStart(teams)
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1 className="setup-title">JEOPARDY!</h1>
        <p className="setup-subtitle">Game Setup</p>

        <div className="setup-section">
          <label className="setup-label">Number of Teams</label>
          <div className="team-count-buttons">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={`count-btn ${teamCount === n ? 'active' : ''}`}
                onClick={() => setTeamCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <label className="setup-label">Team Names</label>
          <div className="team-names-list">
            {Array.from({ length: teamCount }).map((_, i) => (
              <input
                key={i}
                className="team-name-input"
                value={teamNames[i]}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`Team ${i + 1}`}
                maxLength={20}
              />
            ))}
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          START GAME
        </button>
      </div>
    </div>
  )
}
