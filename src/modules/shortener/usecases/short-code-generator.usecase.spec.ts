import { InMemoryShortUrlRepository } from 'test/repositories/in-memory-short-url.repository';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlRepositoryInterface } from '../repositories/shor-url-repository.interface';
import { MaxRetriesGenerateCodeError } from './errors/max-retries-generate-code.error';
import { GenerateShortCodeUseCase } from './short-code-generator.usecase';

let shortUrlRepository: ShortUrlRepositoryInterface;
let SUT: GenerateShortCodeUseCase;

describe('Generate short code use case', () => {
  beforeEach(() => {
    shortUrlRepository = new InMemoryShortUrlRepository();
    SUT = new GenerateShortCodeUseCase(shortUrlRepository);
  });

  it('should be able to generate a short code', async () => {
    const result = await SUT.execute();

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.shortCode).toHaveLength(6);
    }
  });

  it('should be able to generate a unique short code', async () => {
    const firstResult = await SUT.execute();
    const secondResult = await SUT.execute();

    expect(firstResult.isRight()).toBeTruthy();
    expect(secondResult.isRight()).toBeTruthy();

    if (firstResult.isRight() && secondResult.isRight()) {
      expect(firstResult.value.shortCode).not.toEqual(
        secondResult.value.shortCode,
      );
    }
  });

  it('should throw if max retries exceeded', async () => {
    const spy = vi.spyOn(shortUrlRepository, 'findByShortCode');
    const shortUrl = ShortUrl.create({
      originalUrl: 'http://test.com',
    });

    spy.mockReturnValue(Promise.resolve(shortUrl));

    const result = await SUT.execute(2);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MaxRetriesGenerateCodeError);
  });
});
