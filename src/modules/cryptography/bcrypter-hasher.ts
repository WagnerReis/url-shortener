import { compareSync, hash } from 'bcrypt';

import { HashCompare } from '@/core/cryptography/hash-comparer';
import { HashGenerator } from '@/core/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasher implements HashCompare, HashGenerator {
  private HASH_SALT_LENGTH = 8;

  compare(plain: string, hash: string): boolean {
    return compareSync(plain, hash);
  }

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }
}
