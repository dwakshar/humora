import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import analyticsRouter from './routes/analytics.js';
import assessRouter from './routes/assess.js';
import authRouter from './routes/auth.js';
import billingRouter from './routes/billing.js';
import dashboardRouter from './routes/dashboard.js';
import healthRouter from './routes/health.js';
import keysRouter from './routes/keys.js';
import registerRouter from './routes/register.js';
import sitesRouter from './routes/sites.js';
import verifyRouter from './routes/verify.js';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.HUMORA_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean);

function isLocal(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isLocal(origin)) {
      return cb(null, true);
    }
    cb(Object.assign(new Error('origin-not-allowed'), { status: 403 }));
  },
}));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

app.use('/api/health',    healthRouter);
app.use('/api/auth',      authRouter);
app.use('/api/assess',    assessRouter);
app.use('/api/verify',    verifyRouter);
app.use('/api/register',  registerRouter);
app.use('/api/dashboard',  dashboardRouter);
app.use('/api/analytics',  analyticsRouter);
app.use('/api/sites',      sitesRouter);
app.use('/api/keys',       keysRouter);
app.use('/api/billing',    billingRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;
