import { EnvService } from '@env/env';
import { Request } from 'express';
import { ShortUrl } from '../entities/short-url.entity';
import { buildShortUrl } from './url-builder';

export class ShortererPresenter {
  static toHTTP(shortUrl: ShortUrl, req?: Request, envService?: EnvService) {
    const shortUrlFull =
      req && envService
        ? buildShortUrl(shortUrl.shortCode, req, envService)
        : undefined;
    return {
      id: shortUrl.id.toString(),
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      shortUrl: shortUrlFull,
      userId: shortUrl.userId,
      clickCount: shortUrl.clickCount,
      createdAt: shortUrl.createdAt,
      updatedAt: shortUrl.updatedAt,
      deletedAt: shortUrl.deletedAt,
    };
  }
}
