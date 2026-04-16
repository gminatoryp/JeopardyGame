// Board — 5-column grid of category headers and clue cells

export default function Board({ categories, usedCells, onCellClick }) {
  const rows = [0, 1, 2, 3, 4];

  return (
    <div className="jp-board-frame">
      <div className="jp-board">

        {/* Category headers */}
        {categories.map((cat) => (
          <div key={cat.title} className="jp-cat">
            {cat.title}
          </div>
        ))}

        {/* Clue rows */}
        {rows.map((rowIdx) =>
          categories.map((cat, colIdx) => {
            const key    = `${colIdx}-${rowIdx}`;
            const isUsed = usedCells.has(key);

            return (
              <div
                key={key}
                data-col={colIdx}
                className={`jp-cell jp-row-${rowIdx}${isUsed ? ' used' : ''}`}
                onClick={() => onCellClick(colIdx, rowIdx)}
              >
                <div className="jp-cell-bg" />
                <div className="jp-cell-shine" />
                <div className="jp-cell-top-bar" />
                <span className="jp-cell-dollar">${cat.clues[rowIdx].value}</span>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}
