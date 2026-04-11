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
  const answerScore = answers.reduce((sum, a) => sum + (a.humanScore ?? 0), 0);
  const questionIds = answers.map((a) => a.questionId);
  const timingBonus = getTimingBonus(tracker, questionIds);
  const behaviorBonus = tracker.getBehaviorScore();
  const totalScore = answerScore + timingBonus + behaviorBonus;

  let verdict;
  let personalityLine;

  if (totalScore >= 50) {
    verdict = "pass";
    personalityLine = pickRandom(PASS_LINES);
  } else if (totalScore >= 35) {
    verdict = "borderline";
    personalityLine = pickRandom(BORDERLINE_LINES);
  } else {
    verdict = "fail";
    personalityLine = pickRandom(FAIL_LINES);
  }

  return {
    answerScore,
    timingBonus,
    behaviorBonus,
    totalScore,
    verdict,
    personalityLine,
  };
}