import { calculateVerificationScore } from '../../shared/verification.js';

const PASS_LINES = [
  "Chaotically empathetic. Definitely not a bot.",
  "Gloriously irrational. Verified human.",
  "Delightfully overthinking it. As expected.",
  "Suspiciously relatable. In a good way.",
  "Emotionally complex. Bots wish they were you.",
  "Beautifully unpredictable. That's very human.",
];

const BORDERLINE_LINES = [
  "Interesting. The jury's still out.",
  "Somewhere between spark and circuit.",
  "Ambiguously organic. We'll allow it.",
];

const FAIL_LINES = [
  "Hmm. Very... efficient. Suspiciously so.",
  "No shade, but have you tried feeling things?",
  "The machines are flattered by the resemblance.",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTimingBonus(tracker, questionIds) {
  return questionIds.reduce((sum, id) => sum + tracker.getTimingScore(id), 0);
}

export function calculateScore(answers, tracker) {
  const questionIds = answers.map((answer) => answer.questionId);
  const score = calculateVerificationScore(answers, tracker.getSummary(questionIds));

  let verdict;
  let personalityLine;

  if (score.totalScore >= 50) {
    verdict = "pass";
    personalityLine = pickRandom(PASS_LINES);
  } else if (score.totalScore >= 35) {
    verdict = "borderline";
    personalityLine = pickRandom(BORDERLINE_LINES);
  } else {
    verdict = "fail";
    personalityLine = pickRandom(FAIL_LINES);
  }

  return {
    answerScore: score.answerScore,
    timingBonus: score.timingBonus,
    behaviorBonus: score.behaviorBonus,
    totalScore: score.totalScore,
    verdict,
    personalityLine,
  };
}
