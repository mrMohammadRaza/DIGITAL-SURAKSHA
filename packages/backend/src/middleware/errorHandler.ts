import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isZod = err instanceof ZodError || err.name === 'ZodError';
  const statusCode = err.statusCode || (isZod ? 400 : 500);
  const code = err.code || (isZod ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');
  const message = isZod ? 'Invalid request data' : err.message || 'An unexpected error occurred';
  const details = isZod ? (err as any).errors : err.details;

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}
