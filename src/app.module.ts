import { EnvModule } from '@env/env';
import { envSchema } from '@env/env/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptographyModule } from './modules/cryptography/cryptography.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
