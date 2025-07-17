import { EnvModule, EnvService } from '@env/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@prisma-lib';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { PrismaUserRepository } from '../users/repositories/prisma/user-repository';
import { UserRepositoryInterface } from '../users/repositories/user-repository.interface';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SignInUseCase } from './usecases/sign-in.usecase';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    CryptographyModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: envService.get('JWT_EXPIRATION') + 'd',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignInUseCase,
    {
      provide: UserRepositoryInterface,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
