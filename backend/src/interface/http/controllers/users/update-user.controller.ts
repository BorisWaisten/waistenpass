import { Request } from 'express';
import { UpdateUserUseCase } from '../../../../application/use-cases/users/update-user.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';
import { BcryptHashService } from '../../../../infrastructure/security/bcrypt.service.js';

const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const updateUserUseCase = new UpdateUserUseCase({ userRepository, hashService });

class UpdateUserController {
  async handle(req: Request) {
    const user = await updateUserUseCase.execute(req.params.id, req.body);
    return user.snapshot;
  }
}

export const updateUserController = new UpdateUserController();
