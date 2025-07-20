import { Either, left, right } from '@/core/either';
import { DatabaseError } from '@/core/errors/database.error';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { NotFoundError } from './errors/not-found.error';

interface DeleteShortUrlUseCaseRequest {
  shortCode: string;
}

type DeleteShortUrlUseCaseResponse = Either<
  NotFoundError | DatabaseError,
  null
>;

@Injectable()
export class DeleteShortUrlUseCase {
  constructor(
    private shortUrlRepository: ShortUrlRepositoryInterface,
    private readonly logger: Logger,
  ) {}

  async execute({
    shortCode,
  }: DeleteShortUrlUseCaseRequest): Promise<DeleteShortUrlUseCaseResponse> {
    try {
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
    } catch (error) {
      this.logger.error('Error deleting short url', error);
      return left(new DatabaseError('Error deleting short url', error));
    }
  }
}
