import { ConflictError } from '@/core/errors/conflict.error';
import { InternalServerError } from '@/core/errors/internal-server.error';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';
import { UserPresenter } from './presenters/user-presenter';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UserAlreadyExistsError } from './usecases/errors/user-already-exists.error';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateUserBody = z.infer<typeof createUserBodySchema>;

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(createUserBodySchema)) body: CreateUserBody,
  ) {
    const { name, email, password } = body;

    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictError(error.message);
      }

      throw new InternalServerError('An error occurred');
    }

    const { user } = result.value;

    return {
      success: true,
      message: 'User created successfully',
      data: UserPresenter.toHTTP(user),
    };
  }
}
