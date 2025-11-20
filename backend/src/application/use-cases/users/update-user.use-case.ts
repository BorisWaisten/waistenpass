import { User } from '../../../domain/entities/user.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';
import { ConflictError } from '../../../domain/errors/conflict.error.js';
import { UserRepository } from '../../ports/user-repository.js';
import { HashService } from '../../ports/hash-service.js';
import { UpdateUserDto } from '../../dto/users/update-user.dto.js';

interface Dependencies {
  userRepository: UserRepository;
  hashService: HashService;
}

export class UpdateUserUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string, input: UpdateUserDto): Promise<User> {
    const user = await this.deps.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (input.email && input.email !== user.email) {
      const existing = await this.deps.userRepository.findByEmail(input.email);
      if (existing && existing.id !== user.id) {
        throw new ConflictError('Email already in use');
      }
      user.updateEmail(input.email);
    }

    if (input.password) {
      const passwordHash = await this.deps.hashService.hash(input.password);
      user.updatePasswordHash(passwordHash);
    }

    if (input.role) {
      user.updateRole(input.role);
    }

    await this.deps.userRepository.save(user);
    return user;
  }
}