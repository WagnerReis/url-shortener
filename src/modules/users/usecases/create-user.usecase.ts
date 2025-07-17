import { HashGenerator } from '@/core/cryptography/hash-generator';
import { Either, left, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    private userRepository: UserRepositoryInterface,
    private hasher: HashGenerator,
  ) {
    this.logger.log('CreateUserUseCase initialized');
  }

  async execute(data: CreateUserRequest): Promise<CreateUserResponse> {
    const { name, email, password } = data;

    this.logger.log(`Starting user creation for email: ${email}`);
    this.logger.debug(`User data: name=${name}, email=${email}`);

    try {
      this.logger.log('Checking if user already exists...');
      const userAlreadyExists = await this.userRepository.findByEmail(email);

      if (userAlreadyExists) {
        return left(new UserAlreadyExistsError());
      }

      this.logger.log('Hashing password...');
      const hashedPassword = await this.hasher.hash(password);

      const user = User.create({
        name,
        email,
        password: hashedPassword,
      });

      this.logger.log('Saving user to repository...');
      await this.userRepository.create(user);

      this.logger.log('User creation completed successfully');
      return right({ user });
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
