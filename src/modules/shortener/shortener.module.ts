import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-lib';
import { PrismaShortUrlRepository } from './repositories/prisma/short-url-repository';
import { ShortUrlRepositoryInterface } from './repositories/short-url-repository.interface';
import { ShortenerController } from './shortener.controller';
import { CreateShortUrlUseCase } from './usecases/create-short-url.usecase';
import { ListShortUrlsUseCase } from './usecases/list-short-urls.usecase';
import { GenerateShortCodeUseCase } from './usecases/short-code-generator.usecase';
import { UpdateOriginalUrlUseCase } from './usecases/update-original-url.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [ShortenerController],
  providers: [
    {
      provide: ShortUrlRepositoryInterface,
      useClass: PrismaShortUrlRepository,
    },
    CreateShortUrlUseCase,
    GenerateShortCodeUseCase,
    ListShortUrlsUseCase,
    UpdateOriginalUrlUseCase,
  ],
})
export class ShortenerModule {}
