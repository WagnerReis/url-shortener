import { Either, left, right } from '@/core/either';
import { DatabaseError } from '@/core/errors/database.error';
import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { MaxRetriesGenerateCodeError } from './errors/max-retries-generate-code.error';
import { GenerateShortCodeUseCase } from './short-code-generator.usecase';

interface CreateShortUrlUseCaseRequest {
  originalUrl: string;
  userId?: string;
}

type CreateShortUrlUseCaseResponse = Either<
  MaxRetriesGenerateCodeError | DatabaseError,
  {
    shortUrl: ShortUrl;
  }
>;

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    private readonly shortUrlsRepository: ShortUrlRepositoryInterface,
    private readonly generateShortCodeUseCase: GenerateShortCodeUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(
    data: CreateShortUrlUseCaseRequest,
  ): Promise<CreateShortUrlUseCaseResponse> {
    try {
      const { originalUrl, userId } = data;

      this.logger.log('Generating short url...');

      const shortCodeResult = await this.generateShortCodeUseCase.execute();

      if (shortCodeResult.isLeft()) {
        return left(shortCodeResult.value);
      }

      const { shortCode } = shortCodeResult.value;

      const shortUrl = ShortUrl.create({
        originalUrl,
        userId,
        shortCode,
      });

      await this.shortUrlsRepository.create(shortUrl);

      this.logger.log('Short url created successfully');

      return right({
        shortUrl,
      });
    } catch (error) {
      this.logger.error('Error creating short url', error);
      return left(new DatabaseError('Error creating short url', error));
    }
  }
}
