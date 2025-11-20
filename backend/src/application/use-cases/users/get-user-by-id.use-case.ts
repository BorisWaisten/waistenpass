import { User } from '../../../domain/entities/user.js';
import { UserRepository } from '../../ports/user-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';

interface Dependencies {
  userRepository: UserRepository;
}

export class GetUserByIdUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string): Promise<User> {
    const user = await this.deps.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
