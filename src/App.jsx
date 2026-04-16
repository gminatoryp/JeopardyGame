// App.jsx — root component
// Owns all game state and wires together Scoreboard, Board, and ClueModal.
import { useState }   from 'react';
import { CONFIG, TEAM_NAMES } from './config';
import CATEGORIES     from './data/categories';
import Scoreboard     from './components/Scoreboard';
import Board          from './components/Board';
import ClueModal      from './components/ClueModal';

import './styles/global.css';
import './styles/scoreboard.css';
import './styles/board.css';
import './styles/modal.css';

export default function App() {
  // Which cells have already been played (keyed as "colIdx-rowIdx")
  const [usedCells,  setUsedCells]  = useState(new Set());

  // Running scores for each team
  const [scores,     setScores]     = useState([0, 0, 0]);

  // Short-lived delta shown on the score card after a point change
  const [deltas,     setDeltas]     = useState([null, null, null]);

  // The clue currently being shown, or null if the board is visible
  const [activeClue, setActiveClue] = useState(null);

  // Open a clue when a board cell is clicked
  const handleCellClick = (colIdx, rowIdx) => {
    const key = `${colIdx}-${rowIdx}`;
    if (usedCells.has(key)) return;

    setActiveClue({
      key,
      clue:          CATEGORIES[colIdx].clues[rowIdx],
      category:      CATEGORIES[colIdx].title,
      isDailyDouble: CONFIG.DAILY_DOUBLE_CELL === key,
    });
  };

  // Add or deduct points and flash the delta on the score card
  const handleScore = (teamIdx, delta) => {
    setScores((prev) => {
      const next = [...prev];
      next[teamIdx] += delta;
      return next;
    });
    setDeltas((prev) => {
      const next = [...prev];
      next[teamIdx] = delta;
      return next;
    });
    setTimeout(() => {
      setDeltas((prev) => {
        const next = [...prev];
        next[teamIdx] = null;
        return next;
      });
    }, 1800);
  };

  // Mark the cell used and close the modal
  const handleClose = () => {
    if (activeClue) {
      setUsedCells((prev) => new Set([...prev, activeClue.key]));
    }
    setActiveClue(null);
  };

  return (
    <div className="jp-app">
      <div className="jp-inner">

        <Scoreboard
          teamNames={TEAM_NAMES}
          scores={scores}
          deltas={deltas}
        />

        <Board
          categories={CATEGORIES}
          usedCells={usedCells}
          onCellClick={handleCellClick}
        />

      </div>

      {activeClue && (
        <ClueModal
          clue={activeClue.clue}
          category={activeClue.category}
          isDailyDouble={activeClue.isDailyDouble}
          teamNames={TEAM_NAMES}
          onScore={handleScore}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
