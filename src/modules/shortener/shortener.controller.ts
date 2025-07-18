import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShortererPresenter } from './presenters/shorterer-presenter';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { MaxRetriesGenerateCodeError } from './usecases/errors/max-retries-generate-code.error';
import { ListShortUrlsUseCase } from './usecases/list-short-urls.usecase';

const createUrlBodySchema = z.object({
  url: z.string(),
});

type CreateUrlBody = z.infer<typeof createUrlBodySchema>;

@Controller('shortener')
export class ShortenerController {
  private readonly logger = new Logger(ShortenerController.name);

  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req) {
    const userId = req.user?.sub;

    this.logger.log(`Listing short urls for user ${userId}`);
    const result = await this.listShortUrlsUseCase.execute({ userId });

    if (result.isLeft()) {
      return { success: true, message: 'No URLs found', data: [] };
    }

    const shortUrls = result.value.shortUrls;

    return {
      success: true,
      message: 'Urls fetched successfully',
      data: shortUrls.map((url) => ShortererPresenter.toHTTP(url)),
    };
  }
}
