import { Request } from 'express';
import { GetUserByIdUseCase } from '../../../../application/use-cases/users/get-user-by-id.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';

const userRepository = new MongoUserRepository();
const getUserByIdUseCase = new GetUserByIdUseCase({ userRepository });

class GetUserByIdController {
  async handle(req: Request) {
    const user = await getUserByIdUseCase.execute(req.params.id);
    return user.snapshot;
  }
}

export const getUserByIdController = new GetUserByIdController();
