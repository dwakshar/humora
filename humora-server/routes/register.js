import { randomBytes } from 'crypto';
import { Router } from 'express';

const router = Router();
export const registeredSites = new Map();

function generateSitekey() {
  return 'sk_live_' + randomBytes(16).toString('hex');
}

router.post('/', (req, res, next) => {
  try {
    const { domain, email } = req.body;

    if (!domain || !email) {
      return res.status(400).json({
        success: false,
        error: 'domain and email are required',
      });
    }

    for (const [sitekey, site] of registeredSites.entries()) {
      if (site.domain === domain) {
        return res.json({ sitekey, domain });
      }
    }

    const sitekey = generateSitekey();
    registeredSites.set(sitekey, { domain, email, createdAt: Date.now() });

    return res.status(201).json({ sitekey, domain });
  } catch (err) {
    next(err);
  }
});

export default router;