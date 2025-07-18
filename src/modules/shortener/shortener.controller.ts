import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwt-optional-auth.guard';
import { ShortererPresenter } from './presenters/shorterer-presenter';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { MaxRetriesGenerateCodeError } from './usecases/errors/max-retries-generate-code.error';
import { NotFoundError } from './usecases/errors/not-found.error';
import { ListShortUrlsUseCase } from './usecases/list-short-urls.usecase';
import { UpdateOriginalUrlUseCase } from './usecases/update-original-url.usecase';

const createUrlBodySchema = z.object({
  url: z.string(),
});

type CreateUrlBody = z.infer<typeof createUrlBodySchema>;

const updateUrlBodySchema = createUrlBodySchema;
type UpdateUrlBody = CreateUrlBody;

@Controller('shortener')
export class ShortenerController {
  private readonly logger = new Logger(ShortenerController.name);

  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateOriginalUrlUseCase: UpdateOriginalUrlUseCase,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(createUrlBodySchema)) body: CreateUrlBody,
    @CurrentUser('sub') userId: string,
  ) {
    const { url } = body;

    this.logger.log(`Creating short url for ${url}`);

    const result = await this.createShortUrlUseCase.execute({
      originalUrl: url,
      userId: userId ?? null,
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
  async list(@CurrentUser('sub') userId: string) {
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

  @UseGuards(JwtAuthGuard)
  @Patch(':shortCode')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('shortCode') shortCode: string,
    @Body(new ZodValidationPipe(updateUrlBodySchema)) body: UpdateUrlBody,
  ) {
    this.logger.log(`Updating short url ${shortCode} for user ${userId}`);

    const result = await this.updateOriginalUrlUseCase.execute({
      shortCode,
      originalUrl: body.url,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(result.value.message);
    }

    return {
      success: true,
      message: 'Url updated successfully',
    };
  }
}
