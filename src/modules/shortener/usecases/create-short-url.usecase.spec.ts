import { left } from '@/core/either';
import { DatabaseError } from '@/core/errors/database.error';
import { Logger } from 'nestjs-pino';
import { mockLogger } from 'test/mocks/logger.mock';
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
      mockLogger as Logger,
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

  it('should return DatabaseError when repository fails', async () => {
    const mockRepository = {
      create: vi.fn().mockRejectedValue(new Error('DB error')),
      findByShortCode: vi.fn().mockResolvedValue(null),
    };
    const SUT = new CreateShortUrlUseCase(
      mockRepository as any,
      generateShortCodeUseCase,
      mockLogger as Logger,
    );

    const result = await SUT.execute({
      originalUrl: 'https://www.google.com',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(DatabaseError);
      expect(result.value.message).toContain('Error creating short url');
    }
  });
});
