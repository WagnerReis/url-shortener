import { HashGenerator } from '@/core/cryptography/hash-generator';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from '../repositories/user-repository.interface';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

type CreateUserResponse = Either<UserAlreadyExistsError, { user: User }>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private hasher: HashGenerator,
  ) {}

  async execute(data: CreateUserRequest): Promise<CreateUserResponse> {
    const { name, email, password } = data;

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    const hashedPassword = await this.hasher.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return right({ user });
  }
}
