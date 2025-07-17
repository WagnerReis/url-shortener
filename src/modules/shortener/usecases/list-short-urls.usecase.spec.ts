import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { ListShortUrlsUseCase } from './list-short-urls.usecase';

let inMemoryShortUrlRepository: InMemoryShortUrlRepository;
let SUT: ListShortUrlsUseCase;

describe('ListShortUrlsUseCase', () => {
  beforeEach(() => {
    inMemoryShortUrlRepository = new InMemoryShortUrlRepository();
    SUT = new ListShortUrlsUseCase(inMemoryShortUrlRepository);
  });

  it('should be able to create a short url', async () => {
    const shortUrl = ShortUrl.create({
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
      userId: 'user-1',
    });

    await inMemoryShortUrlRepository.create(shortUrl);

    const result = await SUT.execute({
      userId: 'user-1',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryShortUrlRepository.shortUrls).toHaveLength(1);
  });
});
