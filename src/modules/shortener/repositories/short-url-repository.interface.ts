import { ShortUrl } from '../entities/short-url.entity';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'clickCount';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationResult {
  shortUrls: ShortUrl[];
  total: number;
}

export abstract class ShortUrlRepositoryInterface {
  abstract create(shortUrl: ShortUrl): Promise<void>;
  abstract findByShortCode(shortCode: string): Promise<ShortUrl | null>;
  abstract findByUserId(userId: string): Promise<ShortUrl[]>;
  abstract findByUserIdWithPagination(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginationResult>;
  abstract save(shortUrl: ShortUrl): Promise<void>;
}
