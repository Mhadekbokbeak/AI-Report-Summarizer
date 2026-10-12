import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/report.route.js';

dotenv.config();

const app = express();
const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins =
  process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);
const localDevelopmentOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevelopmentOrigin =
        process.env.NODE_ENV !== 'production' &&
        localDevelopmentOriginPattern.test(origin || '');

      if (
        !origin ||
        allowedOrigins.has(origin) ||
        allowedOrigins.has('*') ||
        isLocalDevelopmentOrigin
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use('/api/reports', reportRoutes);

export default app;
