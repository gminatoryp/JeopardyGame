import { useState } from 'react'
import './QuestionModal.css'

export default function QuestionModal({ question, teams, onScore, onClose }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [isDailyDoubleActive, setIsDailyDoubleActive] = useState(question.isDailyDouble)
  const [wagerAmount, setWagerAmount] = useState(question.points)
  const [wagerConfirmed, setWagerConfirmed] = useState(!question.isDailyDouble)
  const [scoringTeamId, setScoringTeamId] = useState(null)

  const effectivePoints = question.isDailyDouble ? wagerAmount : question.points

  const handleScore = (teamId, correct) => {
    setScoringTeamId(teamId)
    onScore(teamId, correct ? effectivePoints : -effectivePoints)
  }

  const isVideoQuestion = question.videoUrl && question.videoUrl.trim() !== ''

  if (isDailyDoubleActive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card daily-double-splash" onClick={(e) => e.stopPropagation()}>
          <div className="dd-star-bg">★</div>
          <h2 className="dd-title">DAILY DOUBLE!</h2>
          <p className="dd-subtitle">Category: <strong>{question.category}</strong></p>
          <p className="dd-points">Base value: <strong>${question.points}</strong></p>

          <div className="wager-section">
            <label className="wager-label">Enter Wager Amount</label>
            <input
              className="wager-input"
              type="number"
              min={100}
              value={wagerAmount}
              onChange={(e) => setWagerAmount(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <button
            className="dd-confirm-btn"
            onClick={() => {
              setIsDailyDoubleActive(false)
              setWagerConfirmed(true)
            }}
          >
            CONFIRM WAGER — ${wagerAmount}
          </button>

          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-points">
          {question.isDailyDouble && <span className="dd-badge">DAILY DOUBLE</span>}
          <span className="points-label">${effectivePoints}</span>
        </div>

        <div className="question-text">{question.question}</div>

        {isVideoQuestion && (
          <div className="video-container">
            <video
              controls
              autoPlay
              src={question.videoUrl}
              className="question-video"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <p className="video-error" style={{ display: 'none' }}>
              Video could not be loaded. Check the URL in jeopardyData.json.
            </p>
          </div>
        )}

        {!showAnswer ? (
          <button className="reveal-btn" onClick={() => setShowAnswer(true)}>
            REVEAL ANSWER
          </button>
        ) : (
          <div className="answer-section">
            <div className="answer-text">{question.answer}</div>
            <div className="scoring-section">
              <p className="scoring-label">Who answered?</p>
              <div className="team-score-buttons">
                {teams.map((team) => (
                  <div key={team.id} className="team-score-row">
                    <span className="team-score-name">{team.name}</span>
                    <div className="score-action-btns">
                      <button
                        className={`score-btn correct ${scoringTeamId === team.id ? 'used' : ''}`}
                        onClick={() => handleScore(team.id, true)}
                        disabled={scoringTeamId !== null}
                      >
                        +${effectivePoints}
                      </button>
                      <button
                        className={`score-btn wrong ${scoringTeamId === team.id ? 'used' : ''}`}
                        onClick={() => handleScore(team.id, false)}
                        disabled={scoringTeamId !== null}
                      >
                        −${effectivePoints}
                      </button>
                    </div>
                  </div>
                ))}
                <button className="no-answer-btn" onClick={onClose} disabled={scoringTeamId !== null}>
                  No one answered
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
