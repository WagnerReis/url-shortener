import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '../entities/user.entity';

export class PrismaUserMapper {
  static toDomain(raw: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
