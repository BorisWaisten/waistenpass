import { Request } from 'express';
import { LoginUseCase } from '../../../../application/use-cases/auth/login.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';
import { BcryptHashService } from '../../../../infrastructure/security/bcrypt.service.js';
import { JwtService } from '../../../../infrastructure/security/jwt.service.js';

const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const tokenService = new JwtService();
const loginUseCase = new LoginUseCase({ userRepository, hashService, tokenService });

class LoginController {
  async handle(req: Request) {
    return loginUseCase.execute(req.body);
  }
}

export const loginController = new LoginController();
