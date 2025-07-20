import { EnvService } from '@env/env';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Url Shortener')
    .setDescription(
      'API para encurtamento e redirecionamento de URLs, com autenticação, gerenciamento de usuários e geração de links curtos personalizados. Permite criar, listar, atualizar e deletar URLs encurtadas.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, documentFactory);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));

  await app.listen(port);

  app.get(Logger).log(`Server is running on port:${port}`);
}
void bootstrap();
