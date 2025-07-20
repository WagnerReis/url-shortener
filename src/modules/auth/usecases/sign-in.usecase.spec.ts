import { User } from '@/modules/users/entities/user.entity';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';
import { HashingError } from './errors/hashing.error';
import { UnauthorizedError } from './errors/unauthorized.error';
import { SignInUseCase } from './sign-in.usecase';

let inMemoryUserRepository: InMemoryUserRepository;
let hashComparer: FakeHasher;
let encrypter: FakeEncrypter;
let SUT: SignInUseCase;

describe('SignInUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    encrypter = new FakeEncrypter();
    hashComparer = new FakeHasher();

    SUT = new SignInUseCase(inMemoryUserRepository, hashComparer, encrypter);
  });

  it('should return a access token', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password-hashed',
    });

    await inMemoryUserRepository.create(user);

    const result = await SUT.execute('any_email', 'any_password');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveProperty('accessToken');
    }
  });

  it('should return unauthorized error if email is invalid', async () => {
    const result = await SUT.execute('invalid_email', 'any_password');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError);
    }
  });

  it('should return unauthorized error if password is invalid', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password-hashed',
    });

    await inMemoryUserRepository.create(user);

    const result = await SUT.execute('any_email', 'invalid_password');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError);
    }
  });

  it('should return HashingError when repository fails', async () => {
    const mockRepository = {
      findByEmail: vi
        .fn()
        .mockRejectedValue(new Error('Database connection failed')),
    };

    const testSUT = new SignInUseCase(
      mockRepository as any,
      hashComparer,
      encrypter,
    );

    const result = await testSUT.execute('any_email', 'any_password');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(HashingError);
      expect(result.value.message).toContain('Error signing in');
    }
  });

  it('should return HashingError when encrypter fails', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password-hashed',
    });

    await inMemoryUserRepository.create(user);

    const mockEncrypter = {
      encrypt: vi.fn().mockRejectedValue(new Error('JWT signing failed')),
    };

    const testSUT = new SignInUseCase(
      inMemoryUserRepository,
      hashComparer,
      mockEncrypter as any,
    );

    const result = await testSUT.execute('any_email', 'any_password');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(HashingError);
      expect(result.value.message).toContain('Error signing in');
    }
  });
});
