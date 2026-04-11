import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode('humora-secret-key-mvp');
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export async function generateToken(sessionData) {
  try {
    const token = await new SignJWT({ ...sessionData, iss: 'humora', verified: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(SECRET);
    return token;
  } catch (err) {
    console.error('Failed to generate token:', err);
    throw err;
  }
}

export function generateSessionId() {
  const suffix = Array.from({ length: 5 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('');
  return `hr_${suffix}`;
}