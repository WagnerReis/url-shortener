import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ShortUrlRepositoryInterface } from '../repositories/short-url-repository.interface';
import { MaxRetriesGenerateCodeError } from './errors/max-retries-generate-code.error';

type GenerateShortCodeUseCaseResponse = Either<
  MaxRetriesGenerateCodeError,
  {
    shortCode: string;
  }
>;

@Injectable()
export class GenerateShortCodeUseCase {
  constructor(
    private readonly shortUrlRepository: ShortUrlRepositoryInterface,
  ) {}

  async execute(maxAttempts = 10): Promise<GenerateShortCodeUseCaseResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const shortCode = this.generateShortCode();
      const exists = await this.shortUrlRepository.findByShortCode(shortCode);

      if (!exists) {
        return right({ shortCode });
      }
    }
    return left(new MaxRetriesGenerateCodeError());
  }

  private generateShortCode() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortCode += characters.charAt(randomIndex);
    }

    return shortCode;
  }
}
