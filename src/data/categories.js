// ─── CATEGORIES & CLUES ───────────────────────────────────────────────────────
// Each category has a title and exactly 5 clues with values 100–500.
// Edit, add, or remove categories here to customise the board.

const CATEGORIES = [
  {
    title: 'Science',
    clues: [
      { value: 100, question: "This gas makes up about 78% of Earth's atmosphere.", answer: 'What is nitrogen?' },
      { value: 200, question: 'The powerhouse of the cell.', answer: 'What is the mitochondria?' },
      { value: 300, question: 'This scientist developed the theory of general relativity.', answer: 'Who is Albert Einstein?' },
      { value: 400, question: 'The chemical symbol for gold.', answer: 'What is Au?' },
      { value: 500, question: 'This planet has the most moons in our solar system.', answer: 'What is Saturn?' },
    ],
  },
  {
    title: 'History',
    clues: [
      { value: 100, question: 'The year World War II ended.', answer: 'What is 1945?' },
      { value: 200, question: 'This ancient wonder was located in Alexandria.', answer: 'What is the Library of Alexandria?' },
      { value: 300, question: 'The first president of the United States.', answer: 'Who is George Washington?' },
      { value: 400, question: 'This empire was ruled by Genghis Khan.', answer: 'What is the Mongol Empire?' },
      { value: 500, question: 'The year the Berlin Wall fell.', answer: 'What is 1989?' },
    ],
  },
  {
    title: 'Pop Culture',
    clues: [
      { value: 100, question: 'The fictional African nation in Black Panther.', answer: 'What is Wakanda?' },
      { value: 200, question: 'This boy wizard attends Hogwarts School.', answer: 'Who is Harry Potter?' },
      { value: 300, question: 'The streaming service that produced Stranger Things.', answer: 'What is Netflix?' },
      { value: 400, question: 'This artist released the album Thriller in 1982.', answer: 'Who is Michael Jackson?' },
      { value: 500, question: 'The highest-grossing film of all time (unadjusted).', answer: 'What is Avatar?' },
    ],
  },
  {
    title: 'Sports',
    clues: [
      { value: 100, question: 'The number of players on a basketball team on the court.', answer: 'What is 5?' },
      { value: 200, question: 'This country has won the most FIFA World Cups.', answer: 'What is Brazil?' },
      { value: 300, question: 'The annual cycling race known as the Grand Boucle.', answer: 'What is the Tour de France?' },
      { value: 400, question: "This city's NFL team is called the Rams.", answer: 'What is Los Angeles?' },
      { value: 500, question: 'The only player to win NBA Finals MVP with three different teams.', answer: 'Who is LeBron James?' },
    ],
  },
  {
    title: 'Technology',
    clues: [
      { value: 100, question: 'The language used to structure web pages.', answer: 'What is HTML?' },
      { value: 200, question: 'This company created the iPhone.', answer: 'What is Apple?' },
      { value: 300, question: "The name of the world's first programmable computer.", answer: 'What is ENIAC?' },
      { value: 400, question: 'This open-source platform is owned by Microsoft.', answer: 'What is GitHub?' },
      { value: 500, question: 'The encryption protocol that HTTPS relies on.', answer: 'What is TLS?' },
    ],
  },
];

export default CATEGORIES;
