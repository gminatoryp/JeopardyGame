import type { Category } from './types';

export const gameData: Category[] = [
  {
    title: 'New Testament',
    questions: [
      { points: 100, question: 'Who betrayed Jesus for 30 pieces of silver?', answer: 'Judas Iscariot' },
      { points: 200, question: 'What is the first book of the New Testament?', answer: 'Matthew' },
      { points: 300, question: 'Which disciple walked on water with Jesus?', answer: 'Peter' },
      { points: 400, question: 'What was the name of the river where Jesus was baptized?', answer: 'Jordan River' },
      { points: 500, question: 'Which apostle wrote the majority of the letters in the New Testament?', answer: 'Paul' },
    ],
  },
  {
    title: 'Old Testament',
    questions: [
      { points: 100, question: 'Who was the first king of Israel?', answer: 'Saul' },
      { points: 200, question: 'What giant did David defeat with a sling and stone?', answer: 'Goliath' },
      { points: 300, question: 'What was the name of Moses\' sister?', answer: 'Miriam' },
      { points: 400, question: 'Which prophet was swallowed by a great fish?', answer: 'Jonah' },
      { points: 500, question: 'What are the first five books of the Old Testament called?', answer: 'The Torah' },
    ],
  },
  {
    title: 'Sports',
    questions: [
      { points: 100, question: 'Which country hosted the 2016 Summer Olympics?', answer: 'Brazil' },
      { points: 200, question: 'Who is known as the “Great One” in ice hockey?', answer: 'Wayne Gretzky' },
      { points: 300, question: 'Which sport uses terms like “love” and “deuce”?', answer: 'Tennis' },
      { points: 400, question: 'What is the maximum score you can achieve in a single frame in bowling?', answer: '300' },
      { points: 500, question: 'Which country won the FIFA World Cup in 2018?', answer: 'France' },
    ],
  },
  {
    title: 'Fashion',
    questions: [
      { points: 100, question: 'Which French fashion designer is known for the little black dress?', answer: 'Coco Chanel' },
      { points: 200, question: 'Which brand is famous for its logo featuring a swoosh?', answer: 'Nike' },
      { points: 300, question: 'Which fashion designer is known for his red soles on shoes?', answer: 'Christian Louboutin' },
      { points: 400, question: 'Which famous designer created the iconic "wrap dress"?', answer: 'Diane von Furstenberg' },
      { points: 500, question: 'Which color is associated with the fashion label Valentino?', answer: 'Red' },
    ],
  },
  {
    title: 'Books',
    questions: [
      { points: 100, question: 'Who wrote "Harry Potter and the Sorcerer\'s Stone"?', answer: 'J.K. Rowling' },
      { points: 200, question: 'Which book begins with the line "Call me Ishmael"?', answer: 'Moby-Dick' },
      { points: 300, question: 'Which novel features the character Atticus Finch?', answer: 'To Kill a Mockingbird' },
      { points: 400, question: 'Who wrote "The Great Gatsby"?', answer: 'F. Scott Fitzgerald' },
      { points: 500, question: 'Which author is known for writing "The Lord of the Rings" trilogy?', answer: 'J.R.R. Tolkien' },
    ],
  },
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
];
