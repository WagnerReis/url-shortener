import { Either, left, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { NotFoundError } from './errors/not-found.error';

interface RedirectShortUrlUseCaseRequest {
  shortCode: string;
}

type RedirectShortUrlUseCaseResponse = Either<
  NotFoundError,
  { originalUrl: string }
>;

@Injectable()
export class RedirectShortUrlUseCase {
  private readonly logger = new Logger(RedirectShortUrlUseCase.name);
  constructor(private shortUrlRepository: ShortUrlRepositoryInterface) {}

  async execute({
    shortCode,
  }: RedirectShortUrlUseCaseRequest): Promise<RedirectShortUrlUseCaseResponse> {
    this.logger.debug('Validating short code');
    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

    if (!shortUrl) {
      return left(new NotFoundError('ShortUrl not found'));
    }

    this.logger.debug('Incrementing visits');
    shortUrl.incrementVisits();
    await this.shortUrlRepository.save(shortUrl);

    return right({ originalUrl: shortUrl.originalUrl });
  }
}
