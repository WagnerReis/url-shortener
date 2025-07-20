import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-lib';
import { ShortUrl } from '../../entities/short-url.entity';
import { PrismaShortUrlMapper } from '../mappers/prisma-short-url.mapper';
import {
  PaginationOptions,
  PaginationResult,
  ShortUrlRepositoryInterface,
} from '../short-url-repository.interface';

@Injectable()
export class PrismaShortUrlRepository implements ShortUrlRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(shortUrl: ShortUrl): Promise<void> {
    const data = PrismaShortUrlMapper.toPrisma(shortUrl);

    await this.prisma.shortUrl.create({ data });
  }

  async findByUserId(userId: string): Promise<ShortUrl[]> {
    const shortUrls = await this.prisma.shortUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
    return shortUrls.map((shortUrl) => PrismaShortUrlMapper.toDomain(shortUrl));
  }

  async findByUserIdWithPagination(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginationResult> {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    const [shortUrls, total] = await Promise.all([
      this.prisma.shortUrl.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.shortUrl.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      shortUrls: shortUrls.map((shortUrl) =>
        PrismaShortUrlMapper.toDomain(shortUrl),
      ),
      total,
    };
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const shortUrl = await this.prisma.shortUrl.findFirst({
      where: {
        shortCode,
        deletedAt: null,
      },
    });
    return shortUrl ? PrismaShortUrlMapper.toDomain(shortUrl) : null;
  }

  async save(shortUrl: ShortUrl): Promise<void> {
    const data = PrismaShortUrlMapper.toPrisma(shortUrl);

    await this.prisma.shortUrl.update({
      where: {
        id: shortUrl.id.toString(),
      },
      data,
    });
  }
}
