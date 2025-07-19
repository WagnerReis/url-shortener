import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-lib';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.createNestApplication().get(PrismaService);

    await app.init();
  });

  test('[POST] /login', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(200);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  test('[POST] /auth/login - invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user-not-exists@example.com',
        password: 'wrong-password',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });
});
