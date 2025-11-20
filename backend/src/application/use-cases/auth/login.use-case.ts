import { UserRepository } from '../../ports/user-repository.js';
import { HashService } from '../../ports/hash-service.js';
import { TokenService } from '../../ports/token-service.js';
import { LoginDto } from '../../dto/auth/login.dto.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';
import { DomainError } from '../../../domain/errors/domain-error.js';

interface Dependencies {
  userRepository: UserRepository;
  hashService: HashService;
  tokenService: TokenService;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class LoginUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(input: LoginDto): Promise<LoginResult> {
    const user = await this.deps.userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundError('Invalid credentials');
    }

    const snapshot = user.snapshotWithSensitiveData();
    const isValidPassword = await this.deps.hashService.compare(input.password, snapshot.passwordHash);
    if (!isValidPassword) {
      throw new DomainError('Invalid credentials');
    }

    const accessToken = this.deps.tokenService.signAccessToken({
      sub: snapshot.id,
      role: snapshot.role
    });

    const refreshToken = this.deps.tokenService.signRefreshToken({
      sub: snapshot.id,
      role: snapshot.role
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: snapshot.id,
        email: snapshot.email,
        role: snapshot.role
      }
    };
  }
}
