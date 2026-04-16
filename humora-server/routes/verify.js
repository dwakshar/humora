import { Router } from 'express';
import { jwtVerify } from 'jose';
import { findSiteByKey } from '../lib/siteStore.js';
import { hasUsedToken, markTokenUsed } from '../lib/tokenStore.js';

const router = Router();
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'humora-production-secret-change-this'
);

router.post('/', async (req, res, next) => {
  try {
    const { token, sitekey } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'invalid-token' });
    }

    const site = await findSiteByKey(sitekey);
    if (!sitekey || !site) {
      return res.status(400).json({ success: false, error: 'invalid-sitekey' });
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

    if (payload.sitekey !== site.sitekey || !payload.jti) {
      return res.status(400).json({ success: false, error: 'invalid-token' });
    }

    if (await hasUsedToken(payload.jti)) {
      return res.status(400).json({ success: false, error: 'duplicate-token' });
    }

    const issuedAt = payload.iat || 0;
    if (now - issuedAt > 300 || payload.verified !== true) {
      return res.status(400).json({ success: false, error: 'expired-token' });
    }

    await markTokenUsed(payload.jti, (payload.exp || now) * 1000);

    return res.json({
      success: true,
      score: payload.score,
      verdict: payload.verdict,
      timestamp: payload.timestamp,
      sessionId: payload.sessionId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
