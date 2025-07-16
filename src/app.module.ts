import { Module } from '@nestjs/common';
import { CryptographyModule } from './modules/cryptography/cryptography.module';

@Module({
  imports: [CryptographyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
