import './Board.css'

const POINT_VALUES = [100, 200, 300, 400, 500]

export default function Board({ categories, answeredCells, onCellClick }) {
  return (
    <div className="board">
      {categories.map((category, colIndex) => (
        <div key={colIndex} className="board-column">
          <div className="category-header">
            <span>{category.name}</span>
          </div>
          {POINT_VALUES.map((points, rowIndex) => {
            const cellKey = `${colIndex}-${rowIndex}`
            const isAnswered = answeredCells.has(cellKey)
            const question = category.questions[rowIndex]
            const isDailyDouble = question?.isDailyDouble

            return (
              <button
                key={rowIndex}
                className={`cell ${isAnswered ? 'answered' : ''} ${isDailyDouble && !isAnswered ? 'daily-double-cell' : ''}`}
                onClick={() => !isAnswered && onCellClick(colIndex, rowIndex)}
                disabled={isAnswered}
              >
                {isAnswered ? '' : (
                  <span className="cell-value">${points}</span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
