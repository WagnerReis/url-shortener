import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';

interface ListShortUrlsUseCaseRequest {
  userId: string;
}

type ListShortUrlsUseCaseResponse = Either<
  [],
  {
    shortUrls: ShortUrl[];
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
  }: ListShortUrlsUseCaseRequest): Promise<ListShortUrlsUseCaseResponse> {
    this.logger.log('Listing short URLs');

    const shortUrls = await this.shortUrlRepository.findByUserId(userId);

    this.logger.debug(`${shortUrls.length} shortUrls found.`);

    return right({ shortUrls });
  }
}
