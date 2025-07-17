import { EnvService } from '@env/env';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');
  const logger = new Logger('NestApplication');

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);

  logger.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
