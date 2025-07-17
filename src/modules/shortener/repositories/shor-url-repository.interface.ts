import { ShortUrl } from '../entities/short-url.entity';

export abstract class ShortUrlRepositoryInterface {
  abstract create(shortUrl: ShortUrl): Promise<void>;
  abstract findByShortCode(shortCode: string): Promise<ShortUrl | null>;
  abstract findByUserId(userId: string): Promise<ShortUrl[]>;
  abstract save(shortUrl: ShortUrl): Promise<void>;
}
