import { Logger } from 'nestjs-pino';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { mockLogger } from 'test/mocks/logger.mock';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';
import { User } from '../entities/user.entity';
import { CreateUserUseCase } from './create-user.usecase';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

let inMemoryUserRepository: InMemoryUserRepository;
let hashGenerator: FakeHasher;
let SUT: CreateUserUseCase;

describe('Create user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    hashGenerator = new FakeHasher();
    SUT = new CreateUserUseCase(
      inMemoryUserRepository,
      hashGenerator,
      mockLogger as Logger,
    );
  });

  it('should be able to create a user', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const result = await SUT.execute(user);

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    if (result.isRight()) {
      expect(result.value.user.name).toEqual(user.name);
      expect(result.value.user.email).toEqual(user.email);
      expect(result.value.user.password).toEqual(`${user.password}-hashed`);
    }
  });

  it('should throw an error if user already exists', async () => {
    await SUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const result = await SUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });
});
