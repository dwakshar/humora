import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, createUser } from '../db/index.js';
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
    const { email, password } = req.body ?? {};

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await signAuthToken(user.id, user.role);
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

export default router;
