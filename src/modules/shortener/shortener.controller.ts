import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { Public } from '../auth/decorators/public.decorator';
import { ShortererPresenter } from './presenters/shorterer-presenter';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { MaxRetriesGenerateCodeError } from './usecases/errors/max-retries-generate-code.error';

const createUrlBodySchema = z.object({
  url: z.string(),
});

type CreateUrlBody = z.infer<typeof createUrlBodySchema>;

@Controller('shortener')
export class ShortenerController {
  private readonly logger = new Logger(ShortenerController.name);

  constructor(private readonly createShortUrlUseCase: CreateShortUrlUseCase) {}

  @Public()
  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(createUrlBodySchema)) body: CreateUrlBody,
  ) {
    const { url } = body;

    this.logger.log(`Creating short url for ${url}`);

    const result = await this.createShortUrlUseCase.execute({
      originalUrl: url,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof MaxRetriesGenerateCodeError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('An error occurred');
    }

    const shortUrl = result.value.shortUrl;

    return {
      success: true,
      message: 'Url created successfully',
      data: ShortererPresenter.toHTTP(shortUrl),
    };
  }
}
