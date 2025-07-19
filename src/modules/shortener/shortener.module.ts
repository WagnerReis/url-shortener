import { EnvModule } from '@env/env';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-lib';
import { RedirectController } from './redirect.controller';
import { PrismaShortUrlRepository } from './repositories/prisma/short-url-repository';
import { ShortUrlRepositoryInterface } from './repositories/short-url-repository.interface';
import { ShortenerController } from './shortener.controller';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { DeleteShortUrlUseCase } from './usecases/delete-short-url.usecase';
import { ListShortUrlsUseCase } from './usecases/list-short-urls.usecase';
import { RedirectShortUrlUseCase } from './usecases/redirect-short-url.usecase';
import { GenerateShortCodeUseCase } from './usecases/short-code-generator.usecase';
import { UpdateOriginalUrlUseCase } from './usecases/update-original-url.usecase';

@Module({
  imports: [PrismaModule, EnvModule],
  controllers: [ShortenerController, RedirectController],
  providers: [
    {
      provide: ShortUrlRepositoryInterface,
      useClass: PrismaShortUrlRepository,
    },
    CreateShortUrlUseCase,
    GenerateShortCodeUseCase,
    ListShortUrlsUseCase,
    UpdateOriginalUrlUseCase,
    DeleteShortUrlUseCase,
    RedirectShortUrlUseCase,
  ],
})
export class ShortenerModule {}
