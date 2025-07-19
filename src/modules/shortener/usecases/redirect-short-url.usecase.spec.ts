import { Logger } from 'nestjs-pino';
import { mockLogger } from 'test/mocks/logger.mock';
import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { NotFoundError } from './errors/not-found.error';
import { RedirectShortUrlUseCase } from './redirect-short-url.usecase';

describe('RedirectShortUrlUseCase', () => {
  let shortUrlRepository: InMemoryShortUrlRepository;
  let sut: RedirectShortUrlUseCase;

  beforeEach(() => {
    shortUrlRepository = new InMemoryShortUrlRepository();
    sut = new RedirectShortUrlUseCase(shortUrlRepository, mockLogger as Logger);
  });

  it('should increment the clickCount and return the original URL', async () => {
    const shortUrl = ShortUrl.create({
      originalUrl: 'https://www.google.com',
      shortCode: 'abc123',
    });

    await shortUrlRepository.create(shortUrl);

    const result = await sut.execute({ shortCode: 'abc123' });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.originalUrl).toBe('https://www.google.com');
    }
    expect(shortUrlRepository.shortUrls[0].clickCount).toBe(1);
  });

  it('should return NotFoundError if the shortCode does not exist', async () => {
    const result = await sut.execute({ shortCode: 'not-exist' });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotFoundError);
    }
  });
});
