import { Encrypter } from '@/core/cryptography/encrypter';
import { HashCompare } from '@/core/cryptography/hash-comparer';
import { Either, left, right } from '@/core/either';
import { UserRepositoryInterface } from '@/modules/users/repositories/user-repository.interface';
import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { UnauthorizedError } from './errors/unauthorized.error';

type SignInResponse = Either<
  UnauthorizedError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashComparer: HashCompare,
    private readonly encrypter: Encrypter<JwtSignOptions>,
  ) {}

  async execute(email: string, password: string): Promise<SignInResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return left(new UnauthorizedError('User not found.'));
    }

    const isPasswordValid = this.hashComparer.compare(password, user.password);

    if (!isPasswordValid) {
      return left(new UnauthorizedError('Invalid password.'));
    }

    const payload = { sub: user.id };

    const accessToken = await this.encrypter.encrypt(payload, {
      expiresIn: '1d',
    });

    return right({
      accessToken,
    });
  }
}
