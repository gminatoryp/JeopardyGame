"use client";

import type { Category, Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";

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

  const getQuestionId = (catIdx: number, qIdx: number) => `${catIdx}-${qIdx}`;

  const handleQuestionClick = (categoryIndex: number, questionIndex: number) => {
        onQuestionSelect(categoryIndex, questionIndex);
        const selectedQuestion = categories[categoryIndex].questions[questionIndex];
        setCurrentQuestion(selectedQuestion);
        setOpen(true);
      };

  return (
    <div className="grid grid-cols-6 gap-2 md:gap-4">
      {/* Category Headers */}
      {categories.map((category, catIndex) => (
        <Card
          key={catIndex}
          className="bg-primary text-primary-foreground text-center font-bold p-2 md:p-4 rounded-lg shadow-md flex items-center justify-center"
        >
          <span className="text-sm sm:text-base md:text-lg">{category.title}</span>
        </Card>
      ))}

      {/* Questions Grid */}
      {Array.from({ length: 5 }).map((_, qIndex) => (
        categories.map((category, catIndex) => {
          const question = category.questions[qIndex];
          const questionId = getQuestionId(catIndex, qIndex);
          const isSelected = selectedQuestions.has(questionId);

          return (
            <Card
              key={questionId}
              onClick={() => {handleQuestionClick(catIndex, qIndex)}}
              className={cn(
                "bg-muted text-muted-foreground text-center font-bold p-4 md:p-6 rounded-lg shadow-md cursor-pointer transition-colors duration-200 flex items-center justify-center h-20 md:h-28",
                isSelected
                  ? "bg-accent text-accent-foreground opacity-50 cursor-not-allowed"
                  : "hover:bg-accent hover:text-accent-foreground",
                 "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
               tabIndex={isSelected ? -1 : 0} // Make selectable items focusable
               role="button"
               aria-pressed={isSelected}
               aria-label={`${category.title} for ${question.points} points ${isSelected ? '(already selected)' : ''}`}
            >
              <span className="text-lg sm:text-xl md:text-3xl">${question.points}</span>
            </Card>
          );
        })
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <div>
              <DialogDescription className="mb-4">
                {currentQuestion.question}
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
