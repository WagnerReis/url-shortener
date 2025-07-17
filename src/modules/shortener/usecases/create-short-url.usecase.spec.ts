import { left } from '@/core/either';
import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { CreateShortUrlUseCase } from './create-short-url.usecase';
import { MaxRetriesGenerateCodeError } from './errors/max-retries-generate-code.error';
import { GenerateShortCodeUseCase } from './short-code-generator.usecase';

let inMemoryShortUrlRepository: InMemoryShortUrlRepository;
let generateShortCodeUseCase: GenerateShortCodeUseCase;
let SUT: CreateShortUrlUseCase;

describe('CreateShortUrlUseCase', () => {
  beforeEach(() => {
    inMemoryShortUrlRepository = new InMemoryShortUrlRepository();
    generateShortCodeUseCase = new GenerateShortCodeUseCase(
      inMemoryShortUrlRepository,
    );
    SUT = new CreateShortUrlUseCase(
      inMemoryShortUrlRepository,
      generateShortCodeUseCase,
    );
  });

  it('should be able to create a short url', async () => {
    const result = await SUT.execute({
      originalUrl: 'https://www.google.com',
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
  });

  it('should throw if max retries exceeded', async () => {
    const spy = vi.spyOn(generateShortCodeUseCase, 'execute');

    spy.mockReturnValue(
      Promise.resolve(left(new MaxRetriesGenerateCodeError())),
    );

    const result = await SUT.execute({
      originalUrl: 'https://www.google.com',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MaxRetriesGenerateCodeError);
  });
});
