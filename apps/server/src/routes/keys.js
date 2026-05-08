import { Router } from 'express';
import { randomBytes, createHash, randomUUID } from 'crypto';
import { authenticate } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import {
  getApiKeysByUserId,
  getApiKeyById,
  createApiKey,
  revokeApiKey,
} from '../db/index.js';

const router = Router();
router.use(apiLimiter, authenticate);

function hashKey(fullKey) {
  return createHash('sha256').update(fullKey).digest('hex');
}

function safeKey({ id, name, keyPrefix, createdAt, lastUsedAt, revokedAt }) {
  return { id, name, keyPrefix, createdAt, lastUsedAt, active: !revokedAt };
}

// GET /api/keys
router.get('/', async (req, res, next) => {
  try {
    const keys = await getApiKeysByUserId(req.userId);
    res.json({ keys: keys.map(safeKey) });
  } catch (err) { next(err); }
});

// POST /api/keys
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body ?? {};
    if (!name?.trim()) return res.status(400).json({ error: 'name is required' });
    if (name.trim().length > 80) return res.status(400).json({ error: 'name too long' });

    const secret  = randomBytes(24).toString('hex');         // 48 hex chars
    const fullKey = 'hm_live_' + secret;                     // total 56 chars
    const keyHash = hashKey(fullKey);
    const keyPrefix = fullKey.slice(0, 15) + '...';          // "hm_live_" + 7 chars + "..."

    const now = new Date().toISOString();
    const key = await createApiKey({
      id:        randomUUID(),
      userId:    req.userId,
      name:      name.trim(),
      keyHash,
      keyPrefix,
      createdAt: now,
    });

    res.status(201).json({
      key:    safeKey(key),
      secret: fullKey,          // shown exactly once — not stored in plain text
    });
  } catch (err) { next(err); }
});

// DELETE /api/keys/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const key = await getApiKeyById(req.params.id);
    if (!key || key.userId !== req.userId) {
      return res.status(404).json({ error: 'Key not found' });
    }
    if (key.revokedAt) {
      return res.status(400).json({ error: 'Key already revoked' });
    }
    await revokeApiKey(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
