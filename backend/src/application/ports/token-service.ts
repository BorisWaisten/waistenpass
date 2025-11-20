export interface TokenPayload {
  sub: string;
  role: string;
  [key: string]: unknown;
}

export interface TokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyAccessToken<T = TokenPayload>(token: string): T;
}
