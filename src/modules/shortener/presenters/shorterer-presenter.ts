import { ShortUrl } from '../entities/short-url.entity';

export class ShortererPresenter {
  static toHTTP(shortUrl: ShortUrl) {
    return {
      id: shortUrl.id.toString(),
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      userId: shortUrl.userId,
      clickCount: shortUrl.clickCount,
      createdAt: shortUrl.createdAt,
      updatedAt: shortUrl.updatedAt,
      deletedAt: shortUrl.deletedAt,
    };
  }
}
