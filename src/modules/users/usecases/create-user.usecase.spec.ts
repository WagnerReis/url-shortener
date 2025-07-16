import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './create-user.usecase';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

let inMemoryUserRepository: InMemoryUserRepository;
let SUT: CreateUserUseCase;

describe('Create user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    SUT = new CreateUserUseCase(inMemoryUserRepository);
  });

  it('should be able to create a user', async () => {
    const result = await SUT.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.users).toHaveLength(1);
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
