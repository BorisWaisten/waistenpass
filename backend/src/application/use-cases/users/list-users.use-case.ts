import { User } from '../../../domain/entities/user.js';
import { UserRepository } from '../../ports/user-repository.js';

interface Dependencies {
  userRepository: UserRepository;
}

export class ListUsersUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(): Promise<User[]> {
    return this.deps.userRepository.findAll();
  }
}
