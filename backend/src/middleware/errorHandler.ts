import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger';
import { AppError } from '../utils/errors';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, 'Unhandled application error');
    }
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  logger.error({ err, path: req.originalUrl }, 'Unexpected error');
  return res.status(500).json({ message: 'Internal server error' });
}
