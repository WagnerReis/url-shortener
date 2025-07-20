import { Logger } from 'nestjs-pino';
import { mockLogger } from 'test/mocks/logger.mock';
import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { ListShortUrlsUseCase } from './list-short-urls.usecase';

let inMemoryShortUrlRepository: InMemoryShortUrlRepository;
let SUT: ListShortUrlsUseCase;

describe('ListShortUrlsUseCase', () => {
  beforeEach(() => {
    inMemoryShortUrlRepository = new InMemoryShortUrlRepository();
    SUT = new ListShortUrlsUseCase(
      inMemoryShortUrlRepository,
      mockLogger as Logger,
    );
  });

  it('should be able to list short urls with pagination', async () => {
    const shortUrls = [
      ShortUrl.create({
        originalUrl: 'https://www.google.com',
        shortCode: '123456',
        userId: 'user-1',
      }),
      ShortUrl.create({
        originalUrl: 'https://www.github.com',
        shortCode: '789012',
        userId: 'user-1',
      }),
      ShortUrl.create({
        originalUrl: 'https://www.stackoverflow.com',
        shortCode: '345678',
        userId: 'user-1',
      }),
    ];

    for (const shortUrl of shortUrls) {
      await inMemoryShortUrlRepository.create(shortUrl);
    }

    const result = await SUT.execute({
      userId: 'user-1',
      page: 1,
      limit: 2,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.shortUrls).toHaveLength(2);
      expect(result.value.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
    }
  });

  it('should return empty list when user has no short urls', async () => {
    const result = await SUT.execute({
      userId: 'user-with-no-urls',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.shortUrls).toHaveLength(0);
      expect(result.value.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    }
  });

  it('should handle pagination correctly on second page', async () => {
    for (let i = 1; i <= 5; i++) {
      const shortUrl = ShortUrl.create({
        originalUrl: `https://www.example${i}.com`,
        shortCode: `code${i}`,
        userId: 'user-1',
      });
      await inMemoryShortUrlRepository.create(shortUrl);
    }

    const result = await SUT.execute({
      userId: 'user-1',
      page: 2,
      limit: 2,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.shortUrls).toHaveLength(2);
      expect(result.value.pagination).toEqual({
        page: 2,
        limit: 2,
        total: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    }
  });

  it('should sort by clickCount correctly', async () => {
    const shortUrls = [
      ShortUrl.create({
        originalUrl: 'https://www.google.com',
        shortCode: '123456',
        userId: 'user-1',
        clickCount: 5,
      }),
      ShortUrl.create({
        originalUrl: 'https://www.github.com',
        shortCode: '789012',
        userId: 'user-1',
        clickCount: 10,
      }),
      ShortUrl.create({
        originalUrl: 'https://www.stackoverflow.com',
        shortCode: '345678',
        userId: 'user-1',
        clickCount: 1,
      }),
    ];

    for (const shortUrl of shortUrls) {
      await inMemoryShortUrlRepository.create(shortUrl);
    }

    const result = await SUT.execute({
      userId: 'user-1',
      page: 1,
      limit: 3,
      sortBy: 'clickCount',
      sortOrder: 'desc',
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.shortUrls[0].clickCount).toBe(10);
      expect(result.value.shortUrls[1].clickCount).toBe(5);
      expect(result.value.shortUrls[2].clickCount).toBe(1);
    }
  });
});
