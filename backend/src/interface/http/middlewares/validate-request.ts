import { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
