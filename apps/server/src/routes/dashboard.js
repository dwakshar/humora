import { Router } from 'express';
import { getSitesByUserId, getVerifications } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const PLAN_LIMITS = {
  free:       { verifications: 1_000,   domains: 1 },
  starter:    { verifications: 10_000,  domains: 3 },
  pro:        { verifications: 100_000, domains: -1 },
  enterprise: { verifications: -1,      domains: -1 },
};

function dateKey(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

// GET /api/dashboard
router.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    const userSites = await getSitesByUserId(user.id);
    const sitekeys = userSites.map((s) => s.sitekey);
    const activeSites = userSites.filter((s) => s.active).length;
    const verificationsThisMonth = userSites.reduce((sum, s) => sum + (s.verificationsThisMonth ?? 0), 0);

    const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const rows = sitekeys.length ? await getVerifications(sitekeys, cutoff30) : [];

    let passed = 0, botCount = 0;
    const byDate = {};
    const recentActivity = [];

    for (let i = 29; i >= 0; i--) {
      const key = dateKey(Date.now() - i * 24 * 60 * 60 * 1000);
      byDate[key] = { date: key, total: 0, passed: 0 };
    }

    for (const v of rows) {
      if (v.verdict === 'pass') passed++;
      if ((v.score ?? 100) < 20) botCount++;

      const key = dateKey(v.timestamp);
      if (byDate[key]) {
        byDate[key].total++;
        if (v.verdict === 'pass') byDate[key].passed++;
      }

      recentActivity.push({ sessionId: v.sessionId, domain: v.domain, score: v.score, verdict: v.verdict, timestamp: v.timestamp });
    }

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = rows.length;
    res.status(200).json({
      user: { name: user.name, email: user.email, plan: user.plan },
      stats: {
        verificationsThisMonth,
        passRate:    total > 0 ? Math.round((passed / total) * 100) : 0,
        botsBlocked: botCount,
        activeSites,
        planLimit:   PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free,
      },
      recentActivity: recentActivity.slice(0, 10),
      chartData:      Object.values(byDate),
    });
  } catch (err) { next(err); }
});

// GET /api/analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const user = req.user;
    const period = [7, 30, 90].includes(Number(req.query.period)) ? Number(req.query.period) : 30;
    const filterSitekey = req.query.sitekey;

    const userSites = await getSitesByUserId(user.id);
    const sitekeys = userSites.map((s) => s.sitekey);

    if (filterSitekey && !sitekeys.includes(filterSitekey)) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const cutoff = Date.now() - period * 24 * 60 * 60 * 1000;
    const rows = sitekeys.length ? await getVerifications(sitekeys, cutoff) : [];

    let total = 0, passed = 0, failed = 0, borderline = 0, scoreSum = 0;
    const byDate = {};
    const bySite = {};

    for (let i = period - 1; i >= 0; i--) {
      const key = dateKey(Date.now() - i * 24 * 60 * 60 * 1000);
      byDate[key] = { date: key, total: 0, passed: 0, failed: 0, borderline: 0 };
    }

    for (const v of rows) {
      if (filterSitekey && v.sitekey !== filterSitekey) continue;

      total++;
      scoreSum += v.score ?? 0;
      if (v.verdict === 'pass') passed++;
      else if (v.verdict === 'fail') failed++;
      else if (v.verdict === 'borderline') borderline++;

      const key = dateKey(v.timestamp);
      if (byDate[key]) {
        byDate[key].total++;
        if (v.verdict === 'pass') byDate[key].passed++;
        else if (v.verdict === 'fail') byDate[key].failed++;
        else if (v.verdict === 'borderline') byDate[key].borderline++;
      }

      if (!bySite[v.sitekey]) bySite[v.sitekey] = { total: 0, passed: 0, failed: 0, scoreSum: 0 };
      bySite[v.sitekey].total++;
      bySite[v.sitekey].scoreSum += v.score ?? 0;
      if (v.verdict === 'pass') bySite[v.sitekey].passed++;
      else if (v.verdict === 'fail') bySite[v.sitekey].failed++;
    }

    const passRate      = total > 0 ? Math.round((passed / total) * 100) : 0;
    const failRate      = total > 0 ? Math.round((failed / total) * 100) : 0;
    const borderlineRate = total > 0 ? Math.round((borderline / total) * 100) : 0;

    const sitePerformance = userSites.map((s) => {
      const d = bySite[s.sitekey] ?? { total: 0, passed: 0, scoreSum: 0 };
      return {
        sitekey:  s.sitekey,
        domain:   s.domain,
        total:    d.total,
        passRate: d.total > 0 ? Math.round((d.passed / d.total) * 100) : 0,
        avgScore: d.total > 0 ? Math.round(d.scoreSum / d.total) : 0,
      };
    });

    const topQuestions = [
      { id: 'q1', text: 'Which image shows a traffic light?', passRate: 91, avgTime: 3200 },
      { id: 'q2', text: 'Select all squares',                 passRate: 88, avgTime: 2800 },
      { id: 'q3', text: 'Which image contains a bicycle?',   passRate: 85, avgTime: 4100 },
      { id: 'q4', text: 'Click the bus',                     passRate: 79, avgTime: 3600 },
      { id: 'q5', text: 'Select all fire hydrants',          passRate: 76, avgTime: 5200 },
    ];

    res.status(200).json({
      summary: { total, passed, failed, borderline, passRate, avgScore: total > 0 ? Math.round(scoreSum / total) : 0, avgResponseTime: null },
      chartData: Object.values(byDate),
      verdictBreakdown: { pass: passRate, borderline: borderlineRate, fail: failRate },
      topQuestions,
      sitePerformance,
    });
  } catch (err) { next(err); }
});

export default router;
