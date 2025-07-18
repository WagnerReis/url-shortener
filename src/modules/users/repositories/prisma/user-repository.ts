import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-lib';
import { User } from '../../entities/user.entity';
import { PrismaUserMapper } from '../mapper.ts/prisma-user.mapper';
import { UserRepositoryInterface } from '../user-repository.interface';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
