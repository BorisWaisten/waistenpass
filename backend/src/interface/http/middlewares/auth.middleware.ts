import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../../../infrastructure/security/jwt.service.js';

const jwtService = new JwtService();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyAccessToken<{ sub: string; role: string }>(token);

    req.user = {
      id: payload.sub,
      role: payload.role
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
