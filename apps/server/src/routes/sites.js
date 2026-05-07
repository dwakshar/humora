import { Router } from 'express';
import { getSiteByKey, getSitesByUserId, createSite, updateSite, getVerifications } from '../db/index.js';
import { generateSitekey } from '../lib/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = Router();
router.use(apiLimiter, authenticate);

const DOMAIN_RE = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const PLAN_LIMITS = { free: 1, starter: 3 };

function checkPlanLimit(plan, currentCount) {
  const limit = PLAN_LIMITS[plan];
  return limit === undefined || currentCount < limit;
}

function siteSummary({ sitekey, domain, environment, active, verificationsThisMonth, totalVerifications, createdAt }) {
  return { sitekey, domain, environment, active, verificationsThisMonth, totalVerifications, createdAt };
}

// GET /api/sites
router.get('/', async (req, res, next) => {
  try {
    const userSites = (await getSitesByUserId(req.userId)).map(siteSummary);
    res.status(200).json({ sites: userSites });
  } catch (err) { next(err); }
});

// POST /api/sites
router.post('/', async (req, res, next) => {
  try {
    const { domain, environment } = req.body ?? {};

    if (!domain?.trim()) {
      return res.status(400).json({ error: 'domain is required' });
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    if (!DOMAIN_RE.test(cleanDomain)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    if (!['production', 'testing'].includes(environment)) {
      return res.status(400).json({ error: 'environment must be "production" or "testing"' });
    }

    const userSites = await getSitesByUserId(req.userId);
    if (!checkPlanLimit(req.user.plan, userSites.length)) {
      return res.status(403).json({
        error: 'upgrade-required',
        message: 'Upgrade your plan to add more sites',
      });
    }

    const sitekey = generateSitekey(environment);
    const now = new Date().toISOString();
    const site = await createSite({
      sitekey,
      domain: cleanDomain,
      environment,
      userId: req.userId,
      active: true,
      verificationsThisMonth: 0,
      totalVerifications: 0,
      createdAt: now,
    });

    return res.status(201).json({
      site: siteSummary(site),
      message: 'Save this sitekey — shown once',
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sites/:sitekey
router.delete('/:sitekey', async (req, res, next) => {
  try {
    const site = await getSiteByKey(req.params.sitekey);
    if (!site || site.userId !== req.userId) {
      return res.status(404).json({ error: 'Site not found' });
    }
    await updateSite(req.params.sitekey, { active: false });
    res.status(200).json({ success: true });
  } catch (err) { next(err); }
});

// GET /api/sites/:sitekey/stats
router.get('/:sitekey/stats', async (req, res, next) => {
  try {
    const site = await getSiteByKey(req.params.sitekey);
    if (!site || site.userId !== req.userId) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const rows = await getVerifications([site.sitekey], cutoff);

    let passed = 0, failed = 0, borderline = 0, scoreSum = 0;
    for (const v of rows) {
      scoreSum += v.score ?? 0;
      if (v.verdict === 'pass') passed++;
      else if (v.verdict === 'fail') failed++;
      else if (v.verdict === 'borderline') borderline++;
    }

    const total = passed + failed + borderline;
    const recent = rows
      .map(({ sessionId, score, verdict, timestamp }) => ({ sessionId, score, verdict, timestamp }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);

    res.status(200).json({
      site: siteSummary(site),
      stats: {
        total,
        passed,
        failed,
        borderline,
        avgScore: total > 0 ? Math.round(scoreSum / total) : 0,
        passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      },
      recentVerifications: recent,
    });
  } catch (err) { next(err); }
});

export default router;
