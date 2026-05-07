import { verifyAuthToken } from '../lib/jwt.js';
import { getUserById } from '../db/index.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const token = header.slice(7);
    const payload = await verifyAuthToken(token);
    const user = await getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      const payload = await verifyAuthToken(token);
      const user = await getUserById(payload.userId);
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    } catch {
      // invalid token — proceed unauthenticated
    }
  }
  next();
}
