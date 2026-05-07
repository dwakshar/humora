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
  for (let i = 1; i < mouseMovements.length - 1; i++) {
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
  const mean = angles.reduce((s, a) => s + a, 0) / angles.length;
  const variance = angles.reduce((s, a) => s + (a - mean) ** 2, 0) / angles.length;
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
  const hoverScores = questionIds.map((id) => {
    const values = Array.isArray(hoverMap[id]) ? hoverMap[id] : [];
    return getHoverScore(values.length);
  });
  const avgHover = hoverScores.length === 0
    ? 0
    : hoverScores.reduce((s, v) => s + v, 0) / hoverScores.length;
  return Math.min(10, Math.round((entropyScore * 7) + (avgHover * 3)));
}

export function calculateVerificationScore(answerRecords = [], interactionSummary = {}) {
  const answerScore = answerRecords.reduce((s, a) => s + (a.humanScore || 0), 0);
  const questionIds = answerRecords.map((a) => a.questionId);
  const responseTimes = interactionSummary.responseTimes || {};
  const timingBonus = questionIds.reduce(
    (s, id) => s + getTimingScoreForMs(responseTimes[id]),
    0
  );
  const behaviorBonus = calculateBehaviorScore(interactionSummary, questionIds);
  const totalScore = answerScore + timingBonus + behaviorBonus;

  let verdict = 'fail';
  if (totalScore >= 50) {
    verdict = 'pass';
  } else if (totalScore >= 40) {
    verdict = 'pass';
  }

  return { answerScore, timingBonus, behaviorBonus, totalScore, verdict };
}
