import { randomUUID } from 'crypto';
import { Router } from 'express';
import { SignJWT } from 'jose';
import { calculateVerificationScore } from '../../shared/verification.js';
import { originMatchesDomain, normalizeOrigin } from '../lib/domain.js';
import { getSiteByKey, createVerification, incrementSiteCounters } from '../db/index.js';
import { buildValidatedAnswerSet } from '../lib/questionBank.js';

const router = Router();
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'humora-production-secret-change-this'
);

router.post('/', async (req, res, next) => {
  try {
    const {
      sitekey,
      answers,
      interactionSummary,
      sessionId,
      parentOrigin,
      clientTimestamp,
    } = req.body || {};

    const site = await getSiteByKey(sitekey);
    if (!site) {
      return res.status(400).json({ success: false, error: 'invalid-sitekey' });
    }

    const normalizedOrigin = normalizeOrigin(parentOrigin);
    if (!originMatchesDomain(normalizedOrigin, site.domain)) {
      return res.status(403).json({ success: false, error: 'origin-mismatch' });
    }

    const validatedAnswers = buildValidatedAnswerSet(answers);
    if (!validatedAnswers) {
      return res.status(400).json({ success: false, error: 'invalid-answers' });
    }

    const score = calculateVerificationScore(validatedAnswers, interactionSummary || {});
    if (score.verdict !== 'pass') {
      return res.status(403).json({
        success: false,
        error: 'human-verification-failed',
        score: score.totalScore,
        verdict: score.verdict,
      });
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const tokenId = randomUUID();
    const token = await new SignJWT({
      verified: true,
      score: score.totalScore,
      verdict: score.verdict,
      sitekey,
      sessionId,
      parentOrigin: normalizedOrigin,
      clientTimestamp,
      timestamp: Date.now(),
      jti: tokenId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('humora')
      .setIssuedAt(issuedAt)
      .setExpirationTime('5m')
      .sign(SECRET);

    await Promise.all([
      createVerification({
        sessionId: sessionId ?? randomUUID(),
        sitekey,
        score: score.totalScore,
        verdict: score.verdict,
        token,
        used: false,
        timestamp: new Date().toISOString(),
        domain: site.domain,
      }),
      incrementSiteCounters(sitekey),
    ]);

    return res.status(201).json({
      success: true,
      token,
      score: score.totalScore,
      verdict: score.verdict,
      timestamp: Date.now(),
      expiresIn: 300,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
