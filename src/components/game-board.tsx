"use client";

import { useEffect, useState } from "react";
import type { Category, Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameBoardProps {
  categories: Category[];
  selectedQuestions: Set<string>;
  onQuestionSelect: (categoryIndex: number, questionIndex: number) => void;
}

export function GameBoard({
  categories,
  selectedQuestions,
  onQuestionSelect,
}: GameBoardProps) {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const getQuestionId = (catIdx: number, qIdx: number) => `${catIdx}-${qIdx}`;

  const handleQuestionClick = (categoryIndex: number, questionIndex: number) => {
    const selectedQuestion = categories[categoryIndex].questions[questionIndex];
    const questionId = getQuestionId(categoryIndex, questionIndex);

    if (selectedQuestions.has(questionId)) return;

    onQuestionSelect(categoryIndex, questionIndex);
    setCurrentQuestion(selectedQuestion);
    setShowAnswer(false);
    setTimer(15);
    setTimeUp(false);
    setTimerActive(true);
    setOpen(true);
  };

  useEffect(() => {
    if (!timerActive || !open) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [timerActive, open]);

  const closeDialog = () => {
    setOpen(false);
    setTimerActive(false);
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-2 md:gap-4">
        {/* Category headers */}
        {categories.map((category, index) => (
          <Card
            key={`header-${index}`}
            className="bg-primary text-primary-foreground text-center font-bold p-2 md:p-4 rounded-lg shadow-md flex items-center justify-center"
          >
            <span className="text-sm sm:text-base md:text-lg">{category.title}</span>
          </Card>
        ))}

        {/* Questions */}
        {Array.from({ length: 5 }).map((_, qIndex) =>
          categories.map((category, catIndex) => {
            const question = category.questions[qIndex];
            const questionId = getQuestionId(catIndex, qIndex);
            const isSelected = selectedQuestions.has(questionId);

            return (
              <Card
                key={questionId}
                onClick={() => handleQuestionClick(catIndex, qIndex)}
                className={cn(
                  "text-center font-bold p-4 md:p-6 rounded-lg shadow-md h-20 md:h-28 flex items-center justify-center cursor-pointer transition-colors duration-200",
                  isSelected
                    ? "bg-accent text-accent-foreground opacity-50 cursor-not-allowed"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                tabIndex={isSelected ? -1 : 0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${category.title} for ${question.points} points ${isSelected ? "(already selected)" : ""}`}
              >
                <span className="text-lg sm:text-xl md:text-2xl">
                  ${question.points}
                </span>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {timeUp && !showAnswer ? "Time's up!" : showAnswer ? "Answer" : "Question"}
            </DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <>
              <DialogDescription className="text-lg text-foreground mb-4">
                {timeUp && !showAnswer
                  ? "You ran out of time!"
                  : showAnswer
                  ? currentQuestion.answer
                  : currentQuestion.question}
              </DialogDescription>

              {!showAnswer && !timeUp && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Time remaining: <strong>{timer}s</strong>
                </p>
              )}

              <div className="flex gap-2 flex-wrap">
                {!showAnswer && (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    variant="outline"
                  >
                    Show Answer
                  </Button>
                )}
                <Button onClick={closeDialog} variant="secondary">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
