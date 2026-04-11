export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function weightedAverage(scores, weights) {
  if (scores.length === 0 || scores.length !== weights.length) return 0;
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) return 0;
  const weighted = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
  return weighted / totalWeight;
}

export function pickRandom(array) {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getTimingLabel(ms) {
  if (ms < 300) return "instant";
  if (ms <= 800) return "fast";
  if (ms <= 4000) return "natural";
  if (ms <= 8000) return "thoughtful";
  return "distracted";
}