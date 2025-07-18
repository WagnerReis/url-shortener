import { Either, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ListShortUrlsUseCase.name);

  constructor(
    private readonly shortUrlRepository: ShortUrlRepositoryInterface,
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
