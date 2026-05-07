import { Router } from 'express';
import { isAllowedRegistrationDomain, normalizeDomain } from '../lib/domain.js';
import { createSite } from '../db/index.js';
import { getUserByEmail } from '../db/index.js';
import { generateSitekey } from '../lib/jwt.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { domain, email } = req.body;
    const normalizedDomain = normalizeDomain(domain);
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedDomain || !normalizedEmail) {
      return res.status(400).json({
        success: false,
        error: 'domain and email are required',
      });
    }

    if (!isAllowedRegistrationDomain(normalizedDomain)) {
      return res.status(400).json({
        success: false,
        error: 'invalid-domain',
      });
    }

    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'user-not-found' });
    }

    const site = await createSite({
      sitekey: generateSitekey('production'),
      domain: normalizedDomain,
      environment: 'production',
      userId: user.id,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      sitekey: site.sitekey,
      domain: site.domain,
      createdAt: site.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
