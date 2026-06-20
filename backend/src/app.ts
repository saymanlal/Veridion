import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { corsOrigins } from './config/env';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import { authRouter } from './modules/auth/auth.routes';
import { portfolioRouter } from './modules/portfolio/portfolio.routes';
import { profileRouter } from './modules/profile/profile.routes';
import { securityRouter } from './modules/security/security.routes';
import { supportRouter } from './modules/support/support.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));
  app.use(apiRateLimiter);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/portfolio', portfolioRouter);
  app.use('/api/security', securityRouter);
  app.use('/api/tickets', supportRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
