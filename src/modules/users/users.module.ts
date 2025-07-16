import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateUserUseCase } from './usecases/create-user.usecase';

@Module({
  imports: [CryptographyModule],
  providers: [CreateUserUseCase],
})
export class UsersModule {}
