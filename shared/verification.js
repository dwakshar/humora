export function getTimingScoreForMs(ms) {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return 0;
  if (ms < 300) return 0;
  if (ms <= 800) return 1;
  if (ms <= 4000) return 2;
  if (ms <= 8000) return 1;
  return 0;
}

export function calculateMovementEntropy(mouseMovements = []) {
  if (!Array.isArray(mouseMovements) || mouseMovements.length < 3) return 0;

  const angles = [];
  for (let i = 1; i < mouseMovements.length - 1; i += 1) {
    const prev = mouseMovements[i - 1];
    const current = mouseMovements[i];
    const next = mouseMovements[i + 1];
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;
    angles.push(Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1));
  }

  if (angles.length === 0) return 0;

  const mean = angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
  const variance = angles.reduce((sum, angle) => sum + ((angle - mean) ** 2), 0) / angles.length;

  return Math.min(1, variance / (Math.PI * Math.PI));
}

function getHoverScore(count) {
  if (count <= 0) return 0;
  if (count === 1) return 0.3;
  if (count === 2) return 0.7;
  return 1;
}

export function calculateBehaviorScore(interactionSummary = {}, questionIds = []) {
  const entropyScore = calculateMovementEntropy(interactionSummary.mouseMovements || []);
  const hoverMap = interactionSummary.hoveredOptionsByQuestion || {};
  const hoverScores = questionIds.map((questionId) => {
    const values = Array.isArray(hoverMap[questionId]) ? hoverMap[questionId] : [];
    return getHoverScore(values.length);
  });

  const averageHoverScore = hoverScores.length === 0
    ? 0
    : hoverScores.reduce((sum, value) => sum + value, 0) / hoverScores.length;

  return Math.min(10, Math.round((entropyScore * 7) + (averageHoverScore * 3)));
}

export function calculateVerificationScore(answerRecords = [], interactionSummary = {}) {
  const answerScore = answerRecords.reduce((sum, answer) => sum + (answer.humanScore || 0), 0);
  const questionIds = answerRecords.map((answer) => answer.questionId);
  const responseTimes = interactionSummary.responseTimes || {};
  const timingBonus = questionIds.reduce(
    (sum, questionId) => sum + getTimingScoreForMs(responseTimes[questionId]),
    0
  );
  const behaviorBonus = calculateBehaviorScore(interactionSummary, questionIds);
  const totalScore = answerScore + timingBonus + behaviorBonus;

  let verdict = 'fail';
  if (totalScore >= 50) {
    verdict = 'pass';
  } else if (totalScore >= 35) {
    verdict = totalScore >= 40 ? 'pass' : 'fail';
  }

  return {
    answerScore,
    timingBonus,
    behaviorBonus,
    totalScore,
    verdict,
  };
}
