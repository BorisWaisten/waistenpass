import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validateParam = (param: string, schema: z.ZodTypeAny = z.string().uuid()) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params[param] = schema.parse(req.params[param]);
      next();
    } catch (error) {
      next(error);
    }
  };
};
