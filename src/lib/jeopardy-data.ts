export type Question = {
  question: string;
  answer: string;
  value: number;
};

export type Category = {
  categoryName: string;
  questions: Question[];
};

export const jeopardyData: Category[] = [
  {
    categoryName: "US HISTORY",
    questions: [
      {
        question: "In what year did the American Revolution begin?",
        answer: "1775",
        value: 200,
      },
      {
        question: "Who was the primary author of the Declaration of Independence?",
        answer: "Thomas Jefferson",
        value: 400,
      },
      {
        question: "What territory did the United States acquire in the Louisiana Purchase?",
        answer: "Louisiana Territory",
        value: 600,
      },
      {
        question: "Which Civil War battle is considered the turning point of the war?",
        answer: "Gettysburg",
        value: 800,
      },
      {
        question:
          "What was the main cause of the War of 1812?",
        answer: "British impressment of American sailors",
        value: 1000,
      },
    ],
  },
  {
    categoryName: "WORLD GEOGRAPHY",
    questions: [
      {
        question: "What is the capital of France?",
        answer: "Paris",
        value: 200,
      },
      {
        question: "Which river is the longest in the world?",
        answer: "Nile River",
        value: 400,
      },
      {
        question: "What is the smallest country in the world by land area?",
        answer: "Vatican City",
        value: 600,
      },
      {
        question: "Name the mountain range that separates Europe from Asia.",
        answer: "Ural Mountains",
        value: 800,
      },
      {
        question: "Which African country is also an island?",
        answer: "Madagascar",
        value: 1000,
      },
    ],
  },
  {
    categoryName: "SCIENCE",
    questions: [
      {
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        value: 200,
      },
      {
        question: "What is the process by which plants make their own food?",
        answer: "Photosynthesis",
        value: 400,
      },
      {
        question:
          "What is the name of the force that pulls objects toward the Earth?",
        answer: "Gravity",
        value: 600,
      },
      {
        question: "Which gas do humans breathe in?",
        answer: "Oxygen",
        value: 800,
      },
      {
        question: "What is the study of earthquakes called?",
        answer: "Seismology",
        value: 1000,
      },
    ],
  },
  {
    categoryName: "FAMOUS BOOKS",
    questions: [
      {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answer: "Harper Lee",
        value: 200,
      },
      {
        question: "What is the name of the boy wizard in a famous series of books?",
        answer: "Harry Potter",
        value: 400,
      },
      {
        question: "Who wrote the play 'Romeo and Juliet'?",
        answer: "William Shakespeare",
        value: 600,
      },
      {
        question: "What is the name of the great white whale in Herman Melville's novel?",
        answer: "Moby Dick",
        value: 800,
      },
      {
        question: "In George Orwell's '1984', what is the name of the ever-watching dictator?",
        answer: "Big Brother",
        value: 1000,
      },
    ],
  },
  {
    categoryName: "SPORTS",
    questions: [
      {
        question: "How many players are on a basketball team on the court at one time?",
        answer: "Five",
        value: 200,
      },
      {
        question: "Which sport uses a shuttlecock?",
        answer: "Badminton",
        value: 400,
      },
      {
        question: "In baseball, how many outs are in an inning?",
        answer: "Six",
        value: 600,
      },
      {
        question: "What is the term for a perfect score in bowling?",
        answer: "300",
        value: 800,
      },
      {
        question: "What does 'birdie' mean in golf?",
        answer: "One stroke under par",
        value: 1000,
      },
    ],
  },
];