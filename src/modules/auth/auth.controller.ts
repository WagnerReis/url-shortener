import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import z from 'zod';
import { Public } from './decorators/public.decorator';
import { UnauthorizedError } from './usecases/errors/unauthorized.error';
import { SignInUseCase } from './usecases/sign-in.usecase';

const signInBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type SignInBody = z.infer<typeof signInBodySchema>;

@Controller('auth')
export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  private readonly logger: Logger = new Logger(AuthController.name);

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
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
