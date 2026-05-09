import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getUserByEmail, createUser } from '../db/index.js';
import { upsertOAuthUser } from '../db/index.js';
import { signAuthToken } from '../lib/jwt.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hash) {
  return (await hashPassword(password)) === hash;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeUser({ id, name, email, plan, role, createdAt }) {
  return { id, name, email, plan, role, createdAt };
}

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const SUPABASE_ISSUER = SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : null;
const supabaseJwks = SUPABASE_URL
  ? createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`))
  : null;

async function verifySupabaseAccessToken(accessToken) {
  if (!SUPABASE_ISSUER || !supabaseJwks) {
    throw Object.assign(new Error('Supabase OAuth is not configured on the server'), { status: 500 });
  }

  const { payload } = await jwtVerify(accessToken, supabaseJwks, {
    issuer: SUPABASE_ISSUER,
  });

  return payload;
}

router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (await getUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const now = new Date().toISOString();
    const user = await createUser({
      id:           uuidv4(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash: await hashPassword(password),
      plan:         'free',
      role:         'user',
      createdAt:    now,
      updatedAt:    now,
    });

    const token = await signAuthToken(user.id, user.role);
    return res.status(201).json({ user: safeUser(user), token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body ?? {};

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await signAuthToken(user.id, user.role, rememberMe ? '30d' : undefined);
    return res.status(200).json({ user: safeUser(user), token });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({ user: safeUser(req.user) });
});

router.post('/logout', authenticate, (_req, res) => {
  res.status(200).json({ success: true });
});

router.post('/oauth/supabase', authLimiter, async (req, res, next) => {
  try {
    const { accessToken } = req.body ?? {};

    if (!accessToken) {
      return res.status(400).json({ error: 'Supabase access token is required' });
    }

    const payload = await verifySupabaseAccessToken(accessToken);
    const email = typeof payload.email === 'string' ? payload.email : null;
    const provider = payload.app_metadata?.provider || 'supabase';
    const oauthId = typeof payload.sub === 'string' ? payload.sub : null;
    const displayName =
      payload.user_metadata?.full_name ||
      payload.user_metadata?.name ||
      (email ? email.split('@')[0] : 'User');

    if (!oauthId) {
      return res.status(400).json({ error: 'Invalid Supabase user payload' });
    }

    const user = await upsertOAuthUser({
      provider,
      oauthId,
      email,
      name: displayName,
    });

    const token = await signAuthToken(user.id, user.role);
    return res.status(200).json({ user: safeUser(user), token });
  } catch (err) {
    next(err);
  }
});

export default router;
