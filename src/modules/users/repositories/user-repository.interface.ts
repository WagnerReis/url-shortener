import { User } from '../entities/user.entity';

export abstract class UserRepositoryInterface {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
}
