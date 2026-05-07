import { Router } from 'express';
import { requireAuth } from '../lib/jwtAuth.js';

const router = Router();
router.use(requireAuth);

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function buildChartData(range) {
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      verifications: randomInt(150, 800),
      bots: randomInt(10, 80),
    };
  });
}

router.get('/', (req, res) => {
  const { range = '30d', siteId } = req.query;

  const chart = buildChartData(range);
  const totalVerifications = chart.reduce((s, d) => s + d.verifications, 0);
  const totalBots = chart.reduce((s, d) => s + d.bots, 0);

  res.json({
    range,
    siteId: siteId || null,
    summary: {
      verifications: totalVerifications,
      botsBlocked: totalBots,
      passRate: parseFloat((((totalVerifications - totalBots) / totalVerifications) * 100).toFixed(1)),
      avgResponseTime: parseFloat((0.8 + Math.random() * 1.2).toFixed(2)),
    },
    chart,
    verdictBreakdown: [
      { name: 'Pass', value: 94.2, color: '#10B981' },
      { name: 'Borderline', value: 3.1, color: '#F59E0B' },
      { name: 'Fail', value: 2.7, color: '#EF4444' },
    ],
    topSites: [
      { domain: 'example.com', verifications: randomInt(3000, 5000), passRate: 95.1 },
      { domain: 'shop.example.com', verifications: randomInt(1000, 3000), passRate: 93.4 },
      { domain: 'app.example.com', verifications: randomInt(500, 1500), passRate: 91.8 },
    ],
  });
});

export default router;
