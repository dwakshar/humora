import questions from '../data/questions.json';

function groupByCategory(questions) {
  return questions.reduce((acc, question) => {
    const { category } = question;
    if (!acc[category]) acc[category] = [];
    acc[category].push(question);
    return acc;
  }, {});
}

export function getCategories() {
  const grouped = groupByCategory(questions);
  return Object.keys(grouped);
}

export function selectQuestions() {
  const grouped = groupByCategory(questions);
  const categories = Object.keys(grouped);

  return categories.map((category) => {
    const pool = grouped[category];
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  });
}