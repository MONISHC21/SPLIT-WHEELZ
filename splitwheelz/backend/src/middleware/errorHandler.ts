import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: unknown[];

  constructor(message: string, statusCode: number = 500, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Prisma errors
  const prismaError = err as { code?: string; meta?: { target?: string[] } };
  if (prismaError.code === 'P2002') {
    const field = prismaError.meta?.target?.[0] || 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
    return;
  }

  if (prismaError.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Record not found',
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
