import { Encrypter } from '@/core/cryptography/encrypter';
import { HashCompare } from '@/core/cryptography/hash-comparer';
import { HashGenerator } from '@/core/cryptography/hash-generator';
import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypter-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashCompare, HashGenerator],
})
export class CryptographyModule {}
