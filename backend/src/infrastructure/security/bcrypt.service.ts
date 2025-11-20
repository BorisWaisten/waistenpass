import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { HashService } from '../../application/ports/hash-service.js';

export class BcryptHashService implements HashService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
