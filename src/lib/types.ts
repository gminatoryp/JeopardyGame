export interface Question {
  points: number;
  question: string;
  answer: string;
}

export interface Category {
  title: string;
  questions: Question[];
}

export type TeamScores = [number, number];
