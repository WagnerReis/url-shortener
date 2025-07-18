import { Either, left, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { NotFoundError } from './errors/not-found.error';

interface DeleteShortUrlUseCaseRequest {
  shortCode: string;
}

type DeleteShortUrlUseCaseResponse = Either<NotFoundError, null>;

@Injectable()
export class DeleteShortUrlUseCase {
  private readonly logger = new Logger(DeleteShortUrlUseCase.name);
  constructor(private shortUrlRepository: ShortUrlRepositoryInterface) {}

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
