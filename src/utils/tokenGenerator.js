const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function generateSessionId() {
  const suffix = Array.from({ length: 5 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('');
  return `hr_${suffix}`;
}
