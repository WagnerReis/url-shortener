import { CryptographyModule } from '@app/cryptography';
import { EnvModule, EnvService } from '@env/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@prisma-lib';
import { PrismaUserRepository } from '../users/repositories/prisma/user-repository';
import { UserRepositoryInterface } from '../users/repositories/user-repository.interface';
import { AuthController } from './auth.controller';
import { JwtOptionalAuthGuard } from './guards/jwt-optional-auth.guard';
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
    JwtOptionalAuthGuard,
    {
      provide: UserRepositoryInterface,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtOptionalAuthGuard],
})
export class AuthModule {}
