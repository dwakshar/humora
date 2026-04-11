import { Router } from 'express';
import { jwtVerify } from 'jose';
import { registeredSites } from './register.js';

const router = Router();
const usedTokens = new Set();
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'humora-secret-key-mvp'
);

router.post('/', async (req, res, next) => {
  try {
    const { token, sitekey } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'invalid-token' });
    }

    if (!sitekey || !registeredSites.has(sitekey)) {
      return res.status(400).json({ success: false, error: 'invalid-sitekey' });
    }

    if (usedTokens.has(token)) {
      return res.status(400).json({ success: false, error: 'duplicate-token' });
    }

    let payload;
    try {
      const result = await jwtVerify(token, SECRET, {
        issuer: 'humora',
      });
      payload = result.payload;
    } catch (err) {
      if (err.code === 'ERR_JWT_EXPIRED') {
        return res.status(400).json({ success: false, error: 'expired-token' });
      }
      return res.status(400).json({ success: false, error: 'invalid-token' });
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return res.status(400).json({ success: false, error: 'expired-token' });
    }

    const issuedAt = payload.iat || 0;
    if (now - issuedAt > 300) {
      return res.status(400).json({ success: false, error: 'expired-token' });
    }

    usedTokens.add(token);

    return res.json({
      success: true,
      score: payload.score,
      verdict: payload.verdict,
      timestamp: payload.timestamp,
    });
  } catch (err) {
    next(err);
  }
});

export default router;