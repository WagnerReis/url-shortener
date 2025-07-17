import { EnvModule } from '@env/env';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-lib';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { PrismaUserRepository } from './repositories/prisma/user-repository';
import { UserRepositoryInterface } from './repositories/user-repository.interface';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UsersController } from './users.controller';

@Module({
  imports: [CryptographyModule, PrismaModule, EnvModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepositoryInterface,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UsersModule {}
