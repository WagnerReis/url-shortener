import { Either, left, right } from '@/core/either';
import { DatabaseError } from '@/core/errors/database.error';
import { Injectable } from '@nestjs/common';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { NotFoundError } from './errors/not-found.error';

interface UpdateOriginalUrlUseCaseRequest {
  shortCode: string;
  originalUrl: string;
}

type UpdateOriginalUrlUseCaseResponse = Either<NotFoundError, null>;

@Injectable()
export class UpdateOriginalUrlUseCase {
  constructor(private shortUrlRepository: ShortUrlRepositoryInterface) {}

  async execute({
    shortCode,
    originalUrl,
  }: UpdateOriginalUrlUseCaseRequest): Promise<UpdateOriginalUrlUseCaseResponse> {
    try {
      const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);

      if (!shortUrl) {
        return left(new NotFoundError('ShortUrl not found'));
      }

      shortUrl.originalUrl = originalUrl;
      await this.shortUrlRepository.save(shortUrl);

      return right(null);
    } catch (error) {
      return left(new DatabaseError('Error updating original url', error));
    }
  }
}
