import { randomUUID } from 'crypto';
import { SignJWT } from 'jose';
import { calculateVerificationScore } from '../shared/verification.js';
import { buildValidatedAnswerSet } from '../humora-server/lib/questionBank.js';
import { findSiteByKey } from '../humora-server/lib/siteStore.js';
import { originMatchesDomain, normalizeOrigin } from '../humora-server/lib/domain.js';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'humora-production-secret-change-this'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'method-not-allowed' });
  }

  try {
    const {
      sitekey,
      answers,
      interactionSummary,
      sessionId,
      parentOrigin,
      clientTimestamp,
    } = req.body || {};

    // If a sitekey is provided, validate it and check origin.
    // If no sitekey (demo/direct widget access), skip site validation.
    if (sitekey) {
      const site = await findSiteByKey(sitekey);
      if (!site) {
        return res.status(400).json({ success: false, error: 'invalid-sitekey' });
      }

      const normalizedOrigin = normalizeOrigin(parentOrigin);
      if (!originMatchesDomain(normalizedOrigin, site.domain)) {
        return res.status(403).json({ success: false, error: 'origin-mismatch' });
      }
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
      sitekey: sitekey || 'demo',
      sessionId,
      parentOrigin: normalizeOrigin(parentOrigin),
      clientTimestamp,
      timestamp: Date.now(),
      jti: tokenId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('humora')
      .setIssuedAt(issuedAt)
      .setExpirationTime('5m')
      .sign(SECRET);

    return res.status(201).json({
      success: true,
      token,
      score: score.totalScore,
      verdict: score.verdict,
      timestamp: Date.now(),
      expiresIn: 300,
    });
  } catch (error) {
    console.error('assess error:', error);
    return res.status(500).json({ success: false, error: 'internal-error' });
  }
}
