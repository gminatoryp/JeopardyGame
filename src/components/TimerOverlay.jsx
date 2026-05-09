import { useState, useEffect } from 'react'
import './TimerOverlay.css'

const DURATION = 5

export default function TimerOverlay({ question, onDone }) {
  const [count, setCount] = useState(DURATION)

  useEffect(() => {
    if (count === 0) {
      onDone()
      return
    }
    const id = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [count, onDone])

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - count / DURATION)

  return (
    <div className="timer-overlay">
      <div className="timer-header">
        <div className="timer-category">{question.category}</div>
        <div className="timer-points">${question.isDailyDouble ? '???' : question.points}</div>
      </div>

      <div className="timer-question-text">{question.question}</div>

      <div className="timer-ring-wrap">
        <svg className="timer-svg" viewBox="0 0 120 120">
          <circle className="timer-track" cx="60" cy="60" r={radius} />
          <circle
            className="timer-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span className="timer-number">{count}</span>
      </div>
    </div>
  )
}
