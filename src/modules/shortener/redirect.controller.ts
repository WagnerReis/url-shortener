import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { RedirectShortUrlUseCase } from './usecases/redirect-short-url.usecase';

@Controller('')
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  constructor(private readonly redirectShortUrl: RedirectShortUrlUseCase) {}

  @Get(':shortCode')
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
