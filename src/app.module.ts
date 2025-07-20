import { CryptographyModule } from '@app/cryptography';
import { LoggerModule } from '@app/logger';
import { EnvModule } from '@env/env';
import { envSchema } from '@env/env/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ShortenerModule } from './modules/shortener/shortener.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    EnvModule,
    CryptographyModule,
    UsersModule,
    AuthModule,
    ShortenerModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
