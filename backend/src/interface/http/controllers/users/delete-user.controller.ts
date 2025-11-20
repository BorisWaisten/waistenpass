import { Request } from 'express';
import { DeleteUserUseCase } from '../../../../application/use-cases/users/delete-user.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';

const userRepository = new MongoUserRepository();
const deleteUserUseCase = new DeleteUserUseCase({ userRepository });

class DeleteUserController {
  async handle(req: Request) {
    const user = await deleteUserUseCase.execute(req.params.id);
    return user.snapshot;
  }
}

export const deleteUserController = new DeleteUserController();
