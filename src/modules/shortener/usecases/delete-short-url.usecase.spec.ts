import { Logger } from 'nestjs-pino';
import { mockLogger } from 'test/mocks/logger.mock';
import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { DeleteShortUrlUseCase } from './delete-short-url.usecase';
import { NotFoundError } from './errors/not-found.error';

describe('DeleteShortUrlUseCase', () => {
  let shortUrlRepository: InMemoryShortUrlRepository;
  let sut: DeleteShortUrlUseCase;

  beforeEach(() => {
    shortUrlRepository = new InMemoryShortUrlRepository();
    sut = new DeleteShortUrlUseCase(shortUrlRepository, mockLogger as Logger);
  });

  it('should logically delete a shortUrl', async () => {
    const shortUrl = ShortUrl.create({
      originalUrl: 'http://to-delete.com',
      shortCode: 'del123',
    });

    await shortUrlRepository.create(shortUrl);

    const result = await sut.execute({ shortCode: 'del123' });

    expect(result.isRight()).toBeTruthy();
    expect(shortUrlRepository.shortUrls[0].deletedAt).toBeInstanceOf(Date);
  });

  it('should return NotFoundError if shortUrl does not exist', async () => {
    const result = await sut.execute({ shortCode: 'not-exist' });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotFoundError);
    }
  });
});
