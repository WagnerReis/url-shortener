import { ShortUrl } from '@/modules/shortener/entities/short-url.entity';
import {
  PaginationOptions,
  PaginationResult,
  ShortUrlRepositoryInterface,
} from '@/modules/shortener/repositories/short-url-repository.interface';

export class InMemoryShortUrlRepository implements ShortUrlRepositoryInterface {
  public shortUrls: ShortUrl[] = [];

  async create(shortUrl: ShortUrl): Promise<void> {
    await Promise.resolve(this.shortUrls.push(shortUrl));
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const shortUrl = this.shortUrls.find(
      (item) => item.shortCode === shortCode,
    );

    if (!shortUrl) {
      return Promise.resolve(null);
    }

    return Promise.resolve(shortUrl);
  }

  async findByUserId(userId: string): Promise<ShortUrl[]> {
    const shortUrls = this.shortUrls.filter((item) => item.userId === userId);

    return Promise.resolve(shortUrls);
  }

  async findByUserIdWithPagination(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginationResult> {
    const { page, limit, sortBy, sortOrder } = options;

    const filteredUrls = this.shortUrls.filter(
      (item) => item.userId === userId,
    );

    filteredUrls.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUrls = filteredUrls.slice(startIndex, endIndex);

    return Promise.resolve({
      shortUrls: paginatedUrls,
      total: filteredUrls.length,
    });
  }

  async save(shortUrl: ShortUrl): Promise<void> {
    const index = this.shortUrls.findIndex((item) => item.id === shortUrl.id);

    this.shortUrls[index] = shortUrl;
    await Promise.resolve();
  }
}
