"use client";

<<<<<<< HEAD
import { useState } from "react";
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
=======
import type { Category, Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9

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
<<<<<<< HEAD
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
=======

  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9

  const getQuestionId = (catIdx: number, qIdx: number) => `${catIdx}-${qIdx}`;

  const handleQuestionClick = (categoryIndex: number, questionIndex: number) => {
<<<<<<< HEAD
    const selectedQuestion = categories[categoryIndex].questions[questionIndex];
    const questionId = getQuestionId(categoryIndex, questionIndex);

    if (selectedQuestions.has(questionId)) return;

    onQuestionSelect(categoryIndex, questionIndex);
    setCurrentQuestion(selectedQuestion);
    setShowAnswer(false); // Reset when opening a new question
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-6 gap-2 md:gap-4">
      {/* Category headers */}
      {categories.map((category, index) => (
        <Card
          key={`header-${index}`}
=======
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
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9
          className="bg-primary text-primary-foreground text-center font-bold p-2 md:p-4 rounded-lg shadow-md flex items-center justify-center"
        >
          <span className="text-sm sm:text-base md:text-lg">{category.title}</span>
        </Card>
      ))}

<<<<<<< HEAD
      {/* Question cards */}
      {Array.from({ length: 5 }).map((_, qIndex) =>
=======
      {/* Questions Grid */}
      {Array.from({ length: 5 }).map((_, qIndex) => (
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9
        categories.map((category, catIndex) => {
          const question = category.questions[qIndex];
          const questionId = getQuestionId(catIndex, qIndex);
          const isSelected = selectedQuestions.has(questionId);

          return (
            <Card
              key={questionId}
<<<<<<< HEAD
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
              aria-label={`${category.title} for ${question.points} points ${isSelected ? '(already selected)' : ''}`}
            >
              <span className="text-lg sm:text-xl md:text-2xl">${question.points}</span>
            </Card>
          );
        })
      )}

      {/* Dialog for showing question and answer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showAnswer ? "Answer" : "Question"}</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <>
              <DialogDescription className="text-lg text-foreground mb-4">
                {showAnswer ? currentQuestion.answer : currentQuestion.question}
              </DialogDescription>
              <Button onClick={() => setShowAnswer((prev) => !prev)} variant="outline">
                {showAnswer ? "Show Question" : "Show Answer"}
              </Button>
            </>
=======
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
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
