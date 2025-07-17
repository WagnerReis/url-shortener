import { User } from '@/modules/users/entities/user.entity';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';
import { UnauthorizedError } from './errors/unauthorized.error';
import { SignInUseCase } from './sign-in.usecase';

let inMemoryUserRepository: InMemoryUserRepository;
let hashComparer: FakeHasher;
let bcryptHasher: FakeEncrypter;
let SUT: SignInUseCase;

describe('SignInUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    bcryptHasher = new FakeEncrypter();
    hashComparer = new FakeHasher();
    bcryptHasher = new FakeEncrypter();

    SUT = new SignInUseCase(inMemoryUserRepository, hashComparer, bcryptHasher);
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
    expect(result.value).toHaveProperty('accessToken');
  });

  it('should return unauthorized error if email is invalid', async () => {
    const result = await SUT.execute('invalid_email', 'any_password');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
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
    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
