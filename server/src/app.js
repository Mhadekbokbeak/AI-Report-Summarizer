import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/report.route.js';

dotenv.config();

const app = express();
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
const allowedOrigins = new Set([
  ...configuredOrigins,
  ...(process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']),
]);
const localDevelopmentOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+$/;

if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
  console.warn('CORS_ORIGIN is not set; cross-origin browser requests will be rejected.');
}

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevelopmentOrigin =
        process.env.NODE_ENV !== 'production' &&
        localDevelopmentOriginPattern.test(origin || '');

      callback(
        null,
        !origin ||
          allowedOrigins.has(origin.replace(/\/+$/, '')) ||
          isLocalDevelopmentOrigin,
      );
    },
    credentials: true,
  }),
);

app.use((req, res, next) => {
  const origin = req.get('origin');
  const isLocalDevelopmentOrigin =
    process.env.NODE_ENV !== 'production' &&
    localDevelopmentOriginPattern.test(origin || '');
  const normalizedOrigin = origin?.replace(/\/+$/, '');

  if (
    !origin ||
    (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) ||
    isLocalDevelopmentOrigin
  ) {
    next();
    return;
  }

  res.status(403).json({
    error: 'Origin not allowed by CORS. Set CORS_ORIGIN to the exact frontend origin.',
    code: 'CORS_ORIGIN_NOT_ALLOWED',
  });
});

app.use(express.json({ limit: '1mb' }));
app.use('/api/reports', reportRoutes);

export default app;
