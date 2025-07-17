import { Either, left, right } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '../repositories/shor-url-repository.interface';
import { MaxRetriesGenerateCodeError } from './errors/max-retries-generate-code.error';
import { GenerateShortCodeUseCase } from './short-code-generator.usecase';

interface CreateShortUrlUseCaseRequest {
  originalUrl: string;
  userId?: string;
}

type CreateShortUrlUseCaseResponse = Either<
  MaxRetriesGenerateCodeError,
  {
    shortUrl: ShortUrl;
  }
>;

@Injectable()
export class CreateShortUrlUseCase {
  private readonly logger = new Logger(CreateShortUrlUseCase.name);
  constructor(
    private readonly shortUrlsRepository: ShortUrlRepositoryInterface,
    private readonly generateShortCodeUseCase: GenerateShortCodeUseCase,
  ) {}

  async execute(
    data: CreateShortUrlUseCaseRequest,
  ): Promise<CreateShortUrlUseCaseResponse> {
    const { originalUrl, userId } = data;

    this.logger.log('Generating short url...');

    const shortCodeResult = await this.generateShortCodeUseCase.execute();

    if (shortCodeResult.isLeft()) {
      return left(shortCodeResult.value);
    }

    const shortCode = shortCodeResult.value.shortCode;

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
  }
}
