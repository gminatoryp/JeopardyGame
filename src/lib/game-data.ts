import type { Category } from './types';

export const gameData: Category[] = [
  {
    title: 'History',
    questions: [
      { points: 100, question: 'Who was the first President of the United States?', answer: 'George Washington' },
      { points: 200, question: 'What year did World War II end?', answer: '1945' },
      { points: 300, question: 'Which empire built the Colosseum?', answer: 'The Roman Empire' },
      { points: 400, question: 'Who was known as the Iron Lady?', answer: 'Margaret Thatcher' },
      { points: 500, question: 'In which country did the Industrial Revolution begin?', answer: 'United Kingdom' },
    ],
  },
  {
    title: 'Science',
    questions: [
      { points: 100, question: 'What planet is known as the Red Planet?', answer: 'Mars' },
      { points: 200, question: 'What gas do plants absorb from the atmosphere?', answer: 'Carbon dioxide' },
      { points: 300, question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
      { points: 400, question: 'What is H2O commonly known as?', answer: 'Water' },
      { points: 500, question: 'What law explains why objects fall to the ground?', answer: 'Law of Gravity' },
    ],
  },
  {
    title: 'Literature',
    questions: [
      { points: 100, question: 'Who wrote "Romeo and Juliet"?', answer: 'William Shakespeare' },
      { points: 200, question: 'What is the name of the hobbit played by Elijah Wood in the Lord of the Rings?', answer: 'Frodo Baggins' },
      { points: 300, question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee' },
      { points: 400, question: 'What novel begins with "Call me Ishmael"?', answer: 'Moby-Dick' },
      { points: 500, question: 'Who is the author of "1984"?', answer: 'George Orwell' },
    ],
  },
  {
    title: 'Movies',
    questions: [
      { points: 100, question: 'What movie features the quote “I’ll be back”?', answer: 'The Terminator' },
      { points: 200, question: 'Who directed "Jurassic Park"?', answer: 'Steven Spielberg' },
      { points: 300, question: 'What movie won Best Picture in 1994?', answer: 'Forrest Gump' },
      { points: 400, question: 'Which actor played the Joker in "The Dark Knight"?', answer: 'Heath Ledger' },
      { points: 500, question: 'In what film does a character say “Here’s looking at you, kid”?', answer: 'Casablanca' },
    ],
  },
  {
    title: 'Music',
    questions: [
      { points: 100, question: 'Who is known as the King of Pop?', answer: 'Michael Jackson' },
      { points: 200, question: 'What band wrote the album "Abbey Road"?', answer: 'The Beatles' },
      { points: 300, question: 'Which artist is known for "Shape of You"?', answer: 'Ed Sheeran' },
      { points: 400, question: 'Who composed the Four Seasons?', answer: 'Antonio Vivaldi' },
      { points: 500, question: 'What genre is associated with Beethoven?', answer: 'Classical' },
    ],
  },
  {
    title: 'Geography',
    questions: [
      { points: 100, question: 'What is the capital of France?', answer: 'Paris' },
      { points: 200, question: 'Which continent is the Sahara Desert in?', answer: 'Africa' },
      { points: 300, question: 'What is the largest ocean on Earth?', answer: 'Pacific Ocean' },
      { points: 400, question: 'Mount Everest lies between which two countries?', answer: 'Nepal and China' },
      { points: 500, question: 'What river runs through Baghdad?', answer: 'Tigris River' },
    ],
  },
];
