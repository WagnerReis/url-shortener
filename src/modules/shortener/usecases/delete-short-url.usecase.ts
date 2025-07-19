import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { NotFoundError } from './errors/not-found.error';

interface DeleteShortUrlUseCaseRequest {
  shortCode: string;
}

type DeleteShortUrlUseCaseResponse = Either<NotFoundError, null>;

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    private shortUrlRepository: ShortUrlRepositoryInterface,
    private readonly logger: Logger,
  ) {}

  async execute({
    shortCode,
  }: DeleteShortUrlUseCaseRequest): Promise<DeleteShortUrlUseCaseResponse> {
    this.logger.debug('Executing DeleteShortUrlUseCase', { shortCode });

    const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

    if (!shortUrl) {
      this.logger.debug('ShortUrl not found', { shortCode });
      return left(new NotFoundError('ShortUrl not found'));
    }

    shortUrl.deleteUrl();
    await this.shortUrlRepository.save(shortUrl);

    this.logger.debug('ShortUrl deleted', { shortCode });
    return right(null);
  }
}
