import { ListUsersUseCase } from '../../../../application/use-cases/users/list-users.use-case.js';
import { MongoUserRepository } from '../../../../infrastructure/db/repositories/mongo-user.repository.js';

const userRepository = new MongoUserRepository();
const listUsersUseCase = new ListUsersUseCase({ userRepository });

class ListUsersController {
  async handle() {
    const users = await listUsersUseCase.execute();
    return users.map(u => u.snapshot);
  }
}

export const listUsersController = new ListUsersController();
