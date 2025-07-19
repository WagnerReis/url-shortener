import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { z } from 'zod';
import { Public } from '../auth/decorators/public.decorator';
import { UserPresenter } from './presenters/user-presenter';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UserAlreadyExistsError } from './usecases/errors/user-already-exists.error';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateUserBody = z.infer<typeof createUserBodySchema>;

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private readonly logger: Logger,
  ) {}

  @Public()
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', format: 'email', example: 'john@email.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@email.com',
          createdAt: '2025-07-18T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
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
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException('An error occurred');
    }

    const { user } = result.value;

    this.logger.log(`User created: ${JSON.stringify(user.email)}`);

    return {
      success: true,
      message: 'User created successfully',
      data: UserPresenter.toHTTP(user),
    };
  }
}
