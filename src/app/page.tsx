"use client";

import React, { useState, useCallback } from 'react';
import { Scoreboard } from '@/components/scoreboard';
import { GameBoard } from '@/components/game-board';
import { AlreadySelectedDialog } from '@/components/already-selected-dialog';
import { gameData } from '@/lib/game-data';
import type { TeamScores } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const [scores, setScores] = useState<TeamScores>([0, 0]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lastSelectedPoints, setLastSelectedPoints] = useState<number | null>(null);

  const getQuestionId = (catIdx: number, qIdx: number): string => `${catIdx}-${qIdx}`;

  const handleScoreChange = useCallback((teamIndex: number, delta: number) => {
    setScores(prevScores => {
      const newScores = [...prevScores] as TeamScores;
      newScores[teamIndex] = Math.max(0, newScores[teamIndex] + delta); // Prevent negative scores
      return newScores;
    });
  }, []);

 const handleQuestionSelect = useCallback((categoryIndex: number, questionIndex: number) => {
    const questionId = getQuestionId(categoryIndex, questionIndex);
    const questionPoints = gameData[categoryIndex]?.questions[questionIndex]?.points;

    if (selectedQuestions.has(questionId)) {
      setIsAlertOpen(true);
    } else {
      setSelectedQuestions(prevSelected => new Set(prevSelected).add(questionId));
      setLastSelectedPoints(questionPoints ?? null); // Store points for score update
      // Optional: Automatically open a question detail view or mark it for scoring
      console.log(`Selected: ${gameData[categoryIndex].title} for ${questionPoints}`);
    }
  }, [selectedQuestions]);


  const handleScoreUpdateWithLastPoints = (teamIndex: number, multiplier: 1 | -1) => {
    if (lastSelectedPoints !== null) {
      handleScoreChange(teamIndex, lastSelectedPoints * multiplier);
      setLastSelectedPoints(null); // Reset after applying points
    }
  };


  const resetGame = () => {
    setScores([0, 0]);
    setSelectedQuestions(new Set());
    setIsAlertOpen(false);
    setLastSelectedPoints(null);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Jeopardy Scoreboard</h1>
         <Button onClick={resetGame} variant="outline" className="mb-6 mx-auto flex items-center gap-2 shadow-sm">
          <RotateCcw className="h-4 w-4" />
          Reset Game
        </Button>
      </header>

       {/* Score Update Controls tied to last selected question */}
      {lastSelectedPoints !== null && (
        <div className="my-4 p-4 bg-secondary rounded-lg shadow-md flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-lg font-semibold text-secondary-foreground">
            Award points for last question (${lastSelectedPoints}):
          </p>
          <div className="flex gap-4">
             <Button onClick={() => handleScoreUpdateWithLastPoints(0, 1)} className="bg-primary hover:bg-primary/90">
              Team 1 Correct
            </Button>
             <Button onClick={() => handleScoreUpdateWithLastPoints(0, -1)} variant="destructive">
              Team 1 Incorrect
            </Button>
             <Button onClick={() => handleScoreUpdateWithLastPoints(1, 1)} className="bg-primary hover:bg-primary/90">
              Team 2 Correct
            </Button>
             <Button onClick={() => handleScoreUpdateWithLastPoints(1, -1)} variant="destructive">
              Team 2 Incorrect
            </Button>
          </div>

        </div>
      )}

      <Scoreboard scores={scores} onScoreChange={handleScoreChange} />

      <div className="flex-grow">
        <GameBoard
          categories={gameData}
          selectedQuestions={selectedQuestions}
          onQuestionSelect={handleQuestionSelect}
        />
      </div>

      <AlreadySelectedDialog isOpen={isAlertOpen} onClose={closeAlert} />

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        Built with Next.js and ShadCN UI
      </footer>
    </main>
  );
}
