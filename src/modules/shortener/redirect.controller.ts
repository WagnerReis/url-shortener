import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RedirectShortUrlUseCase } from './usecases/redirect-short-url.usecase';

@ApiTags('redirect')
@Controller('')
export class RedirectController {
  constructor(
    private readonly redirectShortUrl: RedirectShortUrlUseCase,
    private readonly logger: Logger,
  ) {}

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redireciona para a URL original a partir do shortCode',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'Código curto gerado para a URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento realizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ShortCode inválido ou não encontrado',
  })
  async redirect(@Res() res, @Param('shortCode') shortCode: string) {
    const result = await this.redirectShortUrl.execute({ shortCode });

    if (result.isLeft()) {
      const error = result.value as Error;

      throw new BadRequestException(error.message);
    }

    const redirectUrl = result.value.originalUrl;

    this.logger.log(`Redirecting to ${redirectUrl}`);
    return res.redirect(redirectUrl);
  }
}
