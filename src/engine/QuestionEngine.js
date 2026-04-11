import data from "../data/questions.json";

const questions = data.questions;

function groupByCategory() {
  return questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});
}

export function selectQuestions() {
  const grouped = groupByCategory();
  return Object.keys(grouped).map((category) => {
    const pool = grouped[category];
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

export function getCategories() {
  return [...new Set(questions.map((q) => q.category))];
}
