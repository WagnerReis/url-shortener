import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';

interface ListShortUrlsUseCaseRequest {
  userId: string;
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'clickCount';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type ListShortUrlsUseCaseResponse = Either<
  [],
  {
    shortUrls: ShortUrl[];
    pagination: PaginationMeta;
  }
>;

@Injectable()
export class ListShortUrlsUseCase {
  constructor(
    private readonly shortUrlRepository: ShortUrlRepositoryInterface,
    private readonly logger: Logger,
  ) {}

  async execute({
    userId,
    page,
    limit,
    sortBy,
    sortOrder,
  }: ListShortUrlsUseCaseRequest): Promise<ListShortUrlsUseCaseResponse> {
    this.logger.log('Listing short URLs with pagination', {
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const { shortUrls, total } =
      await this.shortUrlRepository.findByUserIdWithPagination(userId, {
        page,
        limit,
        sortBy,
        sortOrder,
      });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };

    this.logger.debug(`${shortUrls.length} shortUrls found for page ${page}`);

    return right({ shortUrls, pagination });
  }
}
