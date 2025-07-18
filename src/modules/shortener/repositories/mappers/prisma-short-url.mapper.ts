import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ShortUrl } from '../../entities/short-url.entity';

import { Prisma, ShortUrl as PrismaPrismaShortUrl } from '@prisma/client';

export class PrismaShortUrlMapper {
  static toDomain(raw: PrismaPrismaShortUrl): ShortUrl {
    return ShortUrl.create(
      {
        originalUrl: raw.originalUrl,
        shortCode: raw.shortCode,
        userId: raw.userId || '',
        clickCount: raw.clickCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(shortUrl: ShortUrl): Prisma.ShortUrlUncheckedCreateInput {
    return {
      id: shortUrl.id.toString(),
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      ...(shortUrl.userId ? { userId: shortUrl.userId } : {}),
      clickCount: shortUrl.clickCount,
      createdAt: shortUrl.createdAt,
      updatedAt: shortUrl.updatedAt,
      deletedAt: shortUrl.deletedAt || undefined,
    };
  }
}
