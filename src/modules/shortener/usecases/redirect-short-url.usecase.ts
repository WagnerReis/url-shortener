import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
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
  constructor(
    private shortUrlRepository: ShortUrlRepositoryInterface,
    private readonly logger: Logger,
  ) {}

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
