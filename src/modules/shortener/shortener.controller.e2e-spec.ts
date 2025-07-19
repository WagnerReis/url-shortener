import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-lib';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Shortener (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  const user = {
    name: 'Shortener User',
    email: 'shortener@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.createNestApplication().get(PrismaService);

    await app.init();

    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await hash(user.password, 8),
      },
    });
    userId = createdUser.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.shortUrl.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await app.close();
  });

  let shortCode: string;

  it('[POST] /shortener - should create a short url', async () => {
    const response = await request(app.getHttpServer())
      .post('/shortener')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ url: 'https://www.example.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.shortCode).toBeDefined();
    expect(response.body.data.originalUrl).toBe('https://www.example.com');
    shortCode = response.body.data.shortCode;
  });

  it('[GET] /shortener - should list all short urls', async () => {
    const response = await request(app.getHttpServer())
      .get('/shortener')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].shortCode).toBe(shortCode);
  });

  it('[PATCH] /shortener/:shortCode - should update the original url', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/shortener/${shortCode}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ url: 'https://www.newurl.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const updated = await prisma.shortUrl.findUnique({ where: { shortCode } });
    expect(updated?.originalUrl).toBe('https://www.newurl.com');
  });

  it('[DELETE] /shortener/:shortCode - should soft delete the short url', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/shortener/${shortCode}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const softDeleted = await prisma.shortUrl.findUnique({
      where: { shortCode },
    });
    expect(softDeleted?.deletedAt).toBeInstanceOf(Date);
  });

  it('[PATCH] /shortener/:shortCode - should return 400 for invalid shortCode', async () => {
    const response = await request(app.getHttpServer())
      .patch('/shortener/invalid')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ url: 'https://www.newurl.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('[DELETE] /shortener/:shortCode - should return 400 for invalid shortCode', async () => {
    const response = await request(app.getHttpServer())
      .delete('/shortener/invalid')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
