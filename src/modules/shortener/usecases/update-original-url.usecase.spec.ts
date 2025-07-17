import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { NotFoundError } from './errors/not-found.error';
import { UpdateOriginalUrlUseCase } from './update-original-url.usecase';

describe('UpdateOriginalUrlUseCase', () => {
  let shortUrlRepository: InMemoryShortUrlRepository;
  let sut: UpdateOriginalUrlUseCase;

  beforeEach(() => {
    shortUrlRepository = new InMemoryShortUrlRepository();
    sut = new UpdateOriginalUrlUseCase(shortUrlRepository);
  });

  it('deve atualizar o originalUrl de um shortUrl existente', async () => {
    const shortUrl = ShortUrl.create({
      originalUrl: 'http://old.com',
      shortCode: 'abc123',
    });
    await shortUrlRepository.create(shortUrl);

    const result = await sut.execute({
      shortCode: 'abc123',
      originalUrl: 'http://new.com',
    });

    expect(result.isRight()).toBeTruthy();
    expect(shortUrlRepository.shortUrls[0].originalUrl).toBe('http://new.com');
  });

  it('should throw NotFoundError if shortUrl does not exist', async () => {
    const result = await sut.execute({
      shortCode: 'not-exist',
      originalUrl: 'http://new.com',
    });
    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotFoundError);
    }
  });
});
