import { Request } from 'express';
import { CreateUserUseCase } from '../../../../application/use-cases/users/create-user.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';
import { BcryptHashService } from '../../../../infrastructure/security/bcrypt.service.js';

const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const createUserUseCase = new CreateUserUseCase({ userRepository, hashService });

class CreateUserController {
  async handle(req: Request) {
    const user = await createUserUseCase.execute(req.body);
    return user.snapshot;
  }
}

export const createUserController = new CreateUserController();
