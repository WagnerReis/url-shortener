import { EnvService } from '@env/env';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Url Shortener')
    .setDescription(
      'API para encurtamento e redirecionamento de URLs, com autenticação, gerenciamento de usuários e geração de links curtos personalizados. Permite criar, listar, atualizar e deletar URLs encurtadas.',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, documentFactory);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');
  const logger = new Logger('NestApplication');

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);

  logger.log(`Server is running on port:${port}`);
}
void bootstrap();
