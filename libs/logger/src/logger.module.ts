import { Module } from '@nestjs/common';
import { LoggerModule as PinoLogger } from 'nestjs-pino';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    PinoLogger.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: ['req.headers.authorization'],
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
