import { randomUUID } from 'node:crypto';
import { User } from '../../../domain/entities/user.js';
import { ConflictError } from '../../../domain/errors/conflict.error.js';
import { CreateUserDto } from '../../dto/users/create-user.dto.js';
import { UserRepository } from '../../ports/user-repository.js';
import { HashService } from '../../ports/hash-service.js';

interface Dependencies {
  userRepository: UserRepository;
  hashService: HashService;
  idGenerator?: () => string;
  now?: () => Date;
}

export class CreateUserUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(input: CreateUserDto): Promise<User> {
    const existing = await this.deps.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await this.deps.hashService.hash(input.password);
    const user = User.create({
      id: (this.deps.idGenerator ?? randomUUID)(),
      email: input.email,
      passwordHash,
      role: input.role,
      createdAt: (this.deps.now ?? (() => new Date()))()
    });

    await this.deps.userRepository.save(user);
    return user;
  }
}
