import { Router } from 'express';
import { isAllowedRegistrationDomain, normalizeDomain } from '../lib/domain.js';
import { registerSite } from '../lib/siteStore.js';

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

    const site = await registerSite({
      domain: normalizedDomain,
      email: normalizedEmail,
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
