import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import Board from './components/Board'
import QuestionModal from './components/QuestionModal'
import ScorePanel from './components/ScorePanel'
import boardData from './data/jeopardyData.json'
import './App.css'

export default function App() {
  const [gameState, setGameState] = useState('setup') // 'setup' | 'playing'
  const [teams, setTeams] = useState([])
  const [answeredCells, setAnsweredCells] = useState(new Set())
  const [activeQuestion, setActiveQuestion] = useState(null) // { colIndex, rowIndex, question }

  const handleStart = (newTeams) => {
    setTeams(newTeams)
    setAnsweredCells(new Set())
    setGameState('playing')
  }

  const handleReset = () => {
    setGameState('setup')
    setTeams([])
    setAnsweredCells(new Set())
    setActiveQuestion(null)
  }

  const handleCellClick = (colIndex, rowIndex) => {
    const question = boardData.categories[colIndex].questions[rowIndex]
    setActiveQuestion({
      colIndex,
      rowIndex,
      question: {
        ...question,
        category: boardData.categories[colIndex].name,
      },
    })
  }

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
    if (activeQuestion) {
      const key = `${activeQuestion.colIndex}-${activeQuestion.rowIndex}`
      setAnsweredCells((prev) => new Set([...prev, key]))
    }
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
