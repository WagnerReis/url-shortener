import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import { EnvService } from '@env/env';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Logger } from 'nestjs-pino';
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

const listUrlsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'clickCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

type ListUrlsQuery = z.infer<typeof listUrlsQuerySchema>;

@ApiTags('shortener')
@ApiBearerAuth('accessToken')
@Controller('shortener')
export class ShortenerController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly listShortUrlsUseCase: ListShortUrlsUseCase,
    private readonly updateOriginalUrlUseCase: UpdateOriginalUrlUseCase,
    private readonly deleteShortUrlUseCase: DeleteShortUrlUseCase,
    private readonly envService: EnvService,
    private readonly logger: Logger,
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
          shortUrl: 'https://mydomain.com/abc123',
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
    @Req() req: Request,
  ) {
    const { url } = body;

    this.logger.log(`Creating short url for`);

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
      data: ShortererPresenter.toHTTP(shortUrl, req, this.envService),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Lista URLs encurtadas do usuário autenticado com paginação',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página (padrão: 10, máximo: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenação',
    enum: ['createdAt', 'updatedAt', 'clickCount'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Ordem da ordenação',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs encurtadas com metadados de paginação',
    schema: {
      example: {
        success: true,
        message: 'Urls fetched successfully',
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
        },
        data: [
          {
            id: 'a1ae1ce4-6d10-4ca1-8cf1-8207529a5123',
            shortCode: 'abc123',
            originalUrl: 'https://www.exemplo.com',
            shortUrl: 'https://mydomain.com/abc123',
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
  async list(
    @CurrentUser('sub') userId: string,
    @Req() req: Request,
    @Query(new ZodValidationPipe(listUrlsQuerySchema)) query: ListUrlsQuery,
  ) {
    const { page, limit, sortBy, sortOrder } = query;

    this.logger.log(`Listing short urls for user ${userId}`, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    const result = await this.listShortUrlsUseCase.execute({
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error);
    }

    const { shortUrls, pagination } = result.value;

    return {
      success: true,
      message: 'Urls fetched successfully',
      pagination,
      data: shortUrls.map((url) =>
        ShortererPresenter.toHTTP(url, req, this.envService),
      ),
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
