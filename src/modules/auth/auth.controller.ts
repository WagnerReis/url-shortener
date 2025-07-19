import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import z from 'zod';
import { Public } from './decorators/public.decorator';
import { UnauthorizedError } from './usecases/errors/unauthorized.error';
import { SignInUseCase } from './usecases/sign-in.usecase';

const signInBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type SignInBody = z.infer<typeof signInBodySchema>;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly logger: Logger,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Realiza login e retorna um accessToken' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'usuario@email.com',
        },
        password: { type: 'string', minLength: 6, example: 'senha123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: { example: { accessToken: 'jwt.token.aqui' } },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async signIn(
    @Body(new ZodValidationPipe(signInBodySchema)) signInBody: SignInBody,
  ) {
    this.logger.log(`Login attempt for email: ${signInBody.email}`);

    const result = await this.signInUseCase.execute(
      signInBody.email,
      signInBody.password,
    );

    if (result.isLeft()) {
      const error = result.value;
      this.logger.warn(`Login failed for email: ${signInBody.email}`);

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }

      throw new InternalServerErrorException('An error occurred');
    }

    const { accessToken } = result.value;

    return {
      accessToken,
    };
  }
}
