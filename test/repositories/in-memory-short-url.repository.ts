import { ShortUrl } from '@/modules/shortener/entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '@/modules/shortener/repositories/shor-url-repository.interface';

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

  async save(shortUrl: ShortUrl): Promise<void> {
    const index = this.shortUrls.findIndex((item) => item.id === shortUrl.id);

    this.shortUrls[index] = shortUrl;
    await Promise.resolve();
  }
}
