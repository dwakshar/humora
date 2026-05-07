const dev = process.env.NODE_ENV !== 'production';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (dev) console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.message });
  }

  if (err.name?.includes('JWT')) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (err.type?.startsWith('Stripe')) {
    return res.status(402).json({ error: err.message, code: err.code });
  }

  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found', path: req.path });
}
