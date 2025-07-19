import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-lib';
import request from 'supertest';

describe('Redirect (E2E)', () => {
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

  let shortCode: string;
  const originalUrl = 'https://www.example.com';

  beforeEach(async () => {
    await prisma.shortUrl.deleteMany({
      where: { originalUrl },
    });

    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl,
        shortCode: 'abc123',
        userId: null,
      },
    });

    shortCode = shortUrl.shortCode;
  });

  it('[GET] /:shortCode - should redirect to original URL', async () => {
    const response = await request(app.getHttpServer())
      .get(`/${shortCode}`)
      .expect(302);

    expect(response.headers.location).toBe(originalUrl);
  });

  it('[GET] /:shortCode - should return 400 if shortCode is not valid', async () => {
    const response = await request(app.getHttpServer())
      .get('/invalid-short-code')
      .expect(400);

    expect(response.body.message).toBeDefined();
  });
});
