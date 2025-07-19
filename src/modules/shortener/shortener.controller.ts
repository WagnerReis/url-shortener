import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwt-optional-auth.guard';
import { ShortererPresenter } from './presenters/shorterer-presenter';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { DeleteShortUrlUseCase } from './usecases/delete-short-url.usecase';
import { MaxRetriesGenerateCodeError } from './usecases/errors/max-retries-generate-code.error';
import { ListShortUrlsUseCase } from './usecases/list-short-urls.usecase';
import { UpdateOriginalUrlUseCase } from './usecases/update-original-url.usecase';

const createUrlBodySchema = z.object({
  url: z.string(),
});

type CreateUrlBody = z.infer<typeof createUrlBodySchema>;

const updateUrlBodySchema = createUrlBodySchema;
type UpdateUrlBody = CreateUrlBody;

@ApiTags('shortener')
@ApiBearerAuth('accessToken')
@Controller('shortener')
export class ShortenerController {
  private readonly logger = new Logger(ShortenerController.name);

  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateOriginalUrlUseCase: UpdateOriginalUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria uma nova URL encurtada' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.exemplo.com' },
      },
      required: ['url'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada criada com sucesso',
    schema: {
      example: {
        success: true,
        message: 'Url created successfully',
        data: {
          shortCode: 'abc123',
          originalUrl: 'https://www.exemplo.com',
          createdAt: '2025-07-18T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erro ao gerar shortCode' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
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

    const { shortUrl } = result.value;

    return {
      success: true,
      message: 'Url created successfully',
      data: ShortererPresenter.toHTTP(shortUrl),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Lista todas as URLs encurtadas do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs encurtadas',
    schema: {
      example: {
        success: true,
        message: 'Urls fetched successfully',
        data: [
          {
            id: 'a1ae1ce4-6d10-4ca1-8cf1-8207529a5123',
            shortCode: 'abc123',
            originalUrl: 'https://www.exemplo.com',
            userId: '18400d8b-53dd-4ea0-8a59-bd46a4328123',
            clickCount: 2,
            createdAt: '2025-07-18T12:42:08.034Z',
            updatedAt: '2025-07-18T22:32:27.008Z',
            deletedAt: null,
          },
        ],
      },
    },
  })
  async list(@CurrentUser('sub') userId: string) {
    this.logger.log(`Listing short urls for user ${userId}`);
    const result = await this.listShortUrlsUseCase.execute({ userId });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error);
    }

    const { shortUrls } = result.value;

    return {
      success: true,
      message: 'Urls fetched successfully',
      data: shortUrls.map((url) => ShortererPresenter.toHTTP(url)),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':shortCode')
  @ApiOperation({ summary: 'Atualiza a URL original de um shortCode' })
  @ApiParam({
    name: 'shortCode',
    description: 'Código curto da URL',
    example: 'abc123',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.novaurl.com' },
      },
      required: ['url'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'URL atualizada com sucesso',
    schema: { example: { success: true, message: 'Url updated successfully' } },
  })
  @ApiResponse({
    status: 400,
    description: 'ShortCode inválido ou erro de validação',
  })
  async update(
    @Param('shortCode') shortCode: string,
    @Body(new ZodValidationPipe(updateUrlBodySchema)) body: UpdateUrlBody,
  ) {
    this.logger.log(`Updating short url ${shortCode}`);

    const result = await this.updateOriginalUrlUseCase.execute({
      shortCode,
      originalUrl: body.url,
    });

    if (result.isLeft()) {
      const error = result.value as Error;

      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Url updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortCode')
  @ApiOperation({ summary: 'Remove uma URL encurtada pelo shortCode' })
  @ApiParam({
    name: 'shortCode',
    description: 'Código curto da URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'URL deletada com sucesso',
    schema: { example: { success: true, message: 'Url deleted successfully' } },
  })
  @ApiResponse({
    status: 400,
    description: 'ShortCode inválido ou erro de validação',
  })
  async delete(@Param('shortCode') shortCode: string) {
    this.logger.log(`Deleting short url ${shortCode}`);

    const result = await this.deleteShortUrlUseCase.execute({ shortCode });

    if (result.isLeft()) {
      const error = result.value as Error;

      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Url deleted successfully',
    };
  }
}
