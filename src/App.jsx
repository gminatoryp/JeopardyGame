import { useState, useCallback } from 'react'
import SetupScreen from './components/SetupScreen'
import Board from './components/Board'
import QuestionModal from './components/QuestionModal'
import ScorePanel from './components/ScorePanel'
import TimerOverlay from './components/TimerOverlay'
import boardData from './data/jeopardyData.json'
import './App.css'

export default function App() {
  const [gameState, setGameState] = useState('setup') // 'setup' | 'playing'
  const [teams, setTeams] = useState([])
  const [answeredCells, setAnsweredCells] = useState(new Set())
  const [pendingQuestion, setPendingQuestion] = useState(null) // showing timer
  const [activeQuestion, setActiveQuestion] = useState(null)  // showing modal
  const [dailyDoubleKeys, setDailyDoubleKeys] = useState(new Set())

  const generateDailyDoubles = () => {
    const numCols = boardData.categories.length
    const numRows = boardData.categories[0].questions.length
    const all = []
    for (let c = 0; c < numCols; c++)
      for (let r = 0; r < numRows; r++)
        all.push(`${c}-${r}`)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]]
    }
    return new Set(all.slice(0, 2))
  }

  const handleStart = (newTeams) => {
    setTeams(newTeams)
    setAnsweredCells(new Set())
    setDailyDoubleKeys(generateDailyDoubles())
    setGameState('playing')
  }

  const handleReset = () => {
    setGameState('setup')
    setTeams([])
    setAnsweredCells(new Set())
    setDailyDoubleKeys(new Set())
    setPendingQuestion(null)
    setActiveQuestion(null)
  }

  const handleCellClick = (colIndex, rowIndex) => {
    const question = boardData.categories[colIndex].questions[rowIndex]
    const key = `${colIndex}-${rowIndex}`
    const enriched = {
      colIndex,
      rowIndex,
      question: {
        ...question,
        isDailyDouble: dailyDoubleKeys.has(key),
        category: boardData.categories[colIndex].name,
      },
    }
    if (dailyDoubleKeys.has(key)) {
      setActiveQuestion(enriched)
    } else {
      setPendingQuestion(enriched)
    }
  }

  const handleTimerDone = useCallback(() => {
    setPendingQuestion((current) => {
      setActiveQuestion(current)
      return null
    })
  }, [])

  const handleScore = (teamId, delta) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t))
    )
    if (activeQuestion) {
      const key = `${activeQuestion.colIndex}-${activeQuestion.rowIndex}`
      setAnsweredCells((prev) => new Set([...prev, key]))
    }
    setActiveQuestion(null)
  }

  const handleModalClose = () => {
    const q = activeQuestion || pendingQuestion
    if (q) {
      const key = `${q.colIndex}-${q.rowIndex}`
      setAnsweredCells((prev) => new Set([...prev, key]))
    }
    setPendingQuestion(null)
    setActiveQuestion(null)
  }

  if (gameState === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  return (
    <div className="game-layout">
      <header className="game-header">
        <h1 className="game-title">JEOPARDY!</h1>
      </header>

      <Board
        categories={boardData.categories}
        answeredCells={answeredCells}
        onCellClick={handleCellClick}
      />

      <ScorePanel teams={teams} onReset={handleReset} />

      {pendingQuestion && (
        <TimerOverlay
          question={pendingQuestion.question}
          onDone={handleTimerDone}
        />
      )}

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion.question}
          teams={teams}
          onScore={handleScore}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
