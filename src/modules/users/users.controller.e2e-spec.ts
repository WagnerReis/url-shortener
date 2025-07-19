import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-lib';
import request from 'supertest';

describe('Users (E2E)', () => {
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

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: { email: 'john@email.com' },
    });
  });

  it('[POST] /users - should create a new user', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: 'User created successfully',
      data: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@email.com',
        createdAt: expect.any(String),
      },
    });
  });

  it('[POST] /users - should return 409 if user already exists', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'password123',
      },
    });

    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBeDefined();
  });
});
