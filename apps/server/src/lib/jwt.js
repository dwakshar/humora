import { SignJWT, jwtVerify } from 'jose';
import { randomUUID, randomBytes } from 'crypto';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function signWidgetToken(payload) {
  const jti = randomUUID();
  const token = await new SignJWT({ ...payload, jti, iss: 'humora' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '5m')
    .sign(getSecret());
  return { token, jti };
}

export async function verifyWidgetToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { payload, jti: payload.jti };
  } catch (err) {
    if (err.code === 'ERR_JWT_EXPIRED') throw Object.assign(new Error('expired-token'), { code: 'expired-token' });
    throw Object.assign(new Error('invalid-token'), { code: 'invalid-token' });
  }
}

export async function signAuthToken(userId, role, expiresIn) {
  const jti = randomUUID();
  return new SignJWT({ userId, role, jti })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn ?? process.env.AUTH_JWT_EXPIRES_IN ?? '7d')
    .sign(getSecret());
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    throw Object.assign(new Error('invalid-auth-token'), { code: 'invalid-auth-token' });
  }
}

export function generateSitekey(environment) {
  const prefix = environment === 'production' ? 'sk_live_' : 'sk_test_';
  return prefix + randomBytes(20).toString('hex');
}
