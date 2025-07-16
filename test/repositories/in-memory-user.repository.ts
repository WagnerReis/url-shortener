import { User } from '@/modules/users/entities/user.entity';
import { UserRepositoryInterface } from '@/modules/users/repositories/user-repository.interface';

export class InMemoryUserRepository implements UserRepositoryInterface {
  public users: User[] = [];

  async create(user: User): Promise<void> {
    await Promise.resolve(this.users.push(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }
}
