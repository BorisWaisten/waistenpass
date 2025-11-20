import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { TokenPayload, TokenService } from '../../application/ports/token-service.js';

export class JwtService implements TokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
  }

  verifyAccessToken<T = TokenPayload>(token: string): T {
    return jwt.verify(token, env.JWT_SECRET) as T;
  }
}
