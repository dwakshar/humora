import { Router } from 'express';
import { verifyWidgetToken } from '../lib/jwt.js';
import { getSiteByKey, hasUsedToken, addUsedToken, incrementSiteCounters, createVerification } from '../db/index.js';
import { verifyLimiter } from '../middleware/rateLimit.js';

const router = Router();

function errorResponse(res, status, code) {
  return res.status(status).json({ success: false, error: code, errorCodes: [code] });
}

router.post('/', verifyLimiter, async (req, res, next) => {
  try {
    const { token, sitekey } = req.body;

    if (!token) return errorResponse(res, 400, 'invalid-token');
    if (!sitekey) return errorResponse(res, 400, 'invalid-sitekey');

    const site = await getSiteByKey(sitekey);
    if (!site) return errorResponse(res, 400, 'invalid-sitekey');
    if (!site.active) return errorResponse(res, 400, 'invalid-sitekey');

    let payload;
    let jti;
    try {
      ({ payload, jti } = await verifyWidgetToken(token));
    } catch (err) {
      const code = err.code === 'expired-token' ? 'expired-token' : 'invalid-token';
      return errorResponse(res, 400, code);
    }

    if (await hasUsedToken(jti)) return errorResponse(res, 400, 'duplicate-token');

    await addUsedToken(jti);
    await incrementSiteCounters(sitekey);

    const timestamp = new Date().toISOString();
    await createVerification({
      sessionId: payload.sessionId,
      sitekey,
      score:     payload.score,
      verdict:   payload.verdict,
      token,
      used:      true,
      timestamp,
      domain:    site.domain,
    });

    return res.status(200).json({
      success:   true,
      score:     payload.score,
      verdict:   payload.verdict,
      timestamp,
      sessionId: payload.sessionId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
