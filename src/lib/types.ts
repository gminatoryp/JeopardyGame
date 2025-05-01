export interface Question {
  points: number;
<<<<<<< HEAD
  question: string;
  answer: string;
=======
  // In a real app, you'd likely have question and answer properties here
  // question: string;
  // answer: string;
>>>>>>> 769c4d6fae974d41b242b193c64ca1b73d7c45a9
}

export interface Category {
  title: string;
  questions: Question[];
}

export type TeamScores = [number, number];
