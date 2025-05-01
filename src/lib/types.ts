export interface Question {
  points: number;
  // In a real app, you'd likely have question and answer properties here
  // question: string;
  // answer: string;
}

export interface Category {
  title: string;
  questions: Question[];
}

export type TeamScores = [number, number];
