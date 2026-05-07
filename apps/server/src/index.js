import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import verifyRouter from './routes/verify.js';
import registerRouter from './routes/register.js';
import sitesRouter from './routes/sites.js';
import dashboardRouter from './routes/dashboard.js';
import billingRouter from './routes/billing.js';
import oauthRouter, { passport } from './routes/oauth.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

const PgStore = connectPgSimple(session);
const isProd = process.env.NODE_ENV === 'production';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()),
  credentials: true,
}));

// Session backed by Postgres so it survives across serverless invocations
app.use(session({
  store: new PgStore({
    conString: process.env.DATABASE_URL,
    ssl: isProd ? { rejectUnauthorized: false } : false,
    createTableIfMissing: true,
    tableName: 'session',
    pruneSessionInterval: 60 * 10, // prune expired sessions every 10 min
  }),
  secret: process.env.SESSION_SECRET || 'humora-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// Raw body for billing webhook — must come before express.json()
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(apiLimiter);

app.use('/api/health',     healthRouter);
app.use('/api/auth',       authRouter);
app.use('/api/verify',     verifyRouter);
app.use('/api/register',   registerRouter);
app.use('/api/sites',      sitesRouter);
app.use('/api/dashboard',  dashboardRouter);
app.use('/api/analytics',  dashboardRouter);
app.use('/api/billing',    billingRouter);
app.use('/api/auth/oauth', oauthRouter);

app.use(notFound);
app.use(errorHandler);

export default app;

// Start the HTTP server only when running directly (not imported by Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Humora API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => { console.log('Server closed'); process.exit(0); });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}
