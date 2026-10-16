import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/healthRoutes.js';
import { contentRouter } from './routes/contentRoutes.js';
import { quizRouter } from './routes/quizRoutes.js';
import { feedbackRouter } from './routes/feedbackRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';

export const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible embedding for local dev
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration supporting cookies and headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Supertest)
      if (!origin) return callback(null, true);
      // Allow localhost Vite frontend on any standard port (5173, 5174, etc.)
      if (/^http:\/\/localhost:[0-9]+$/.test(origin) || origin === env.CORS_ORIGIN) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local CEP demonstration
    },
    credentials: true,
  })
);

// Body parsers with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Rate limiting
app.use(apiLimiter);

// Privacy-conscious structured request logging
if (env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// Mount API routes
const prefix = env.API_PREFIX;
app.use(prefix, healthRouter);
app.use(prefix, contentRouter);
app.use(prefix, quizRouter);
app.use(prefix, feedbackRouter);
app.use(prefix, adminRouter);

// Root informational endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Digital Suraksha API',
    description: 'Cyber Fraud Awareness Platform for Rural Communities (College CEP Project)',
    version: '1.0.0',
    documentation: `${prefix}/health`,
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
    },
  });
});

// Centralized error handler
app.use(errorHandler);
