import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../../../infrastructure/logging/logger.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';
import { ConflictError } from '../../../domain/errors/conflict.error.js';
import { DomainError } from '../../../domain/errors/domain-error.js';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON format', error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', issues: err.flatten() });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({ message: err.message });
  }

  if (err instanceof DomainError) {
    return res.status(400).json({ message: err.message });
  }

  logger.error({ err }, 'Unhandled error');

  return res.status(500).json({ message: 'Internal server error' });
};
