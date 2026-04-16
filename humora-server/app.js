import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import assessRouter from './routes/assess.js';
import registerRouter from './routes/register.js';
import verifyRouter from './routes/verify.js';

dotenv.config();

const app = express();
const allowedOrigins = (process.env.HUMORA_ALLOWED_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

function isLocalDevelopmentOrigin(origin) {
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
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin) ||
      isLocalDevelopmentOrigin(origin)
    ) {
      callback(null, true);
      return;
    }

    const error = new Error('origin-not-allowed');
    error.status = 403;
    callback(error);
  },
}));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/assess', assessRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/register', registerRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;
