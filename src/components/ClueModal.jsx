// ClueModal — full-screen overlay shown when a board cell is clicked
// Phases: dd (daily double reveal) → question (timer + clue) → answer (scoring)
import { useState, useEffect, useRef, useCallback } from 'react';
import { CONFIG, TEAM_COLORS } from '../config';
import Timer              from './Timer';
import DailyDoubleReveal  from './DailyDoubleReveal';

export default function ClueModal({ clue, category, isDailyDouble, teamNames, onScore, onClose }) {
  const [phase,      setPhase]      = useState(isDailyDouble ? 'dd' : 'question');
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft,   setTimeLeft]   = useState(CONFIG.TIMER_SECONDS);
  const [active,     setActive]     = useState(false);
  const timerRef = useRef(null);

  // Start the timer whenever we enter the question phase
  const startTimer = useCallback(() => {
    setActive(true);
    setTimeLeft(CONFIG.TIMER_SECONDS);
  }, []);

  useEffect(() => {
    if (phase === 'question') startTimer();
  }, [phase, startTimer]);

  // Tick down every second
  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) { setActive(false); return; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [active, timeLeft]);

  const handleReveal = () => {
    setActive(false);
    setShowAnswer(true);
    setPhase('answer');
  };

  // Close backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="jp-backdrop" onClick={handleBackdropClick}>
      <div className="jp-clue-card">

        {/* Daily Double phase */}
        {phase === 'dd' && (
          <DailyDoubleReveal
            clue={clue}
            category={category}
            onProceed={() => setPhase('question')}
          />
        )}

        {/* Question + Answer phase */}
        {phase !== 'dd' && (
          <>
            {phase === 'question' && (
              <Timer seconds={timeLeft} total={CONFIG.TIMER_SECONDS} />
            )}

            <div className="jp-clue-cat">{category}</div>
            <div className="jp-clue-val">${clue.value}</div>
            <div className="jp-clue-q">{clue.question}</div>

            {!showAnswer ? (
              <button className="jp-reveal-btn" onClick={handleReveal}>
                Reveal Answer
              </button>
            ) : (
              <div className="jp-answer-box">{clue.answer}</div>
            )}

            {showAnswer && (
              <>
                <div className="jp-scoring-div" />
                <div className="jp-scoring-hd">Award or deduct points</div>

                {teamNames.map((name, i) => (
                  <div
                    className="jp-team-row"
                    key={i}
                    style={{ '--tc': TEAM_COLORS[i] }}
                  >
                    <div className="jp-team-pip" />
                    <div className="jp-team-nm">{name}</div>
                    <button
                      className="jp-sbtn jp-sbtn-y"
                      onClick={() => onScore(i,  clue.value)}
                    >
                      +${clue.value}
                    </button>
                    <button
                      className="jp-sbtn jp-sbtn-n"
                      onClick={() => onScore(i, -clue.value)}
                    >
                      −${clue.value}
                    </button>
                  </div>
                ))}

                <button className="jp-no-score-btn" onClick={onClose}>
                  No score · close
                </button>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
