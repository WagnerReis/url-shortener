import { DatabaseError } from '@/core/errors/database.error';
import { Logger } from 'nestjs-pino';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { mockLogger } from 'test/mocks/logger.mock';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';
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
    const result = await SUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    if (result.isRight()) {
      expect(result.value.user.name).toEqual('John Doe');
      expect(result.value.user.email).toEqual('johndoe@example.com');
      expect(result.value.user.password).toEqual('123456-hashed');
    }
  });

  it('should return UserAlreadyExistsError if user already exists', async () => {
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

  it('should return DatabaseError when repository fails', async () => {
    const mockRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockRejectedValue(new Error('Database connection failed')),
    };

    const testSUT = new CreateUserUseCase(
      mockRepository as any,
      hashGenerator,
      mockLogger as Logger,
    );

    const result = await testSUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(DatabaseError);
      expect(result.value.message).toContain('Error creating user');
    }
  });

  it('should return DatabaseError when hasher fails', async () => {
    const mockHasher = {
      hash: vi.fn().mockRejectedValue(new Error('Hashing failed')),
    };

    const testSUT = new CreateUserUseCase(
      inMemoryUserRepository,
      mockHasher as any,
      mockLogger as Logger,
    );

    const result = await testSUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(DatabaseError);
      expect(result.value.message).toContain('Error creating user');
    }
  });
});
