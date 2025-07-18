# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/WagnerReis/url-shortener/compare/v0.1.2...v0.2.0) (2025-07-18)


### Features

* **auth:** add CurrentUser decorator for user context extraction ([141482a](https://github.com/WagnerReis/url-shortener/commit/141482a32f2aaa762c34073a57c151651f904d57))
* **shortener:** add delete functionality and update presenter ([edfd673](https://github.com/WagnerReis/url-shortener/commit/edfd67356b239830e8da82fe4bcafca6540da22e))
* **shortener:** add list short URLs endpoint ([302c8d2](https://github.com/WagnerReis/url-shortener/commit/302c8d24a32d3e59eb9a178b1aa4b86405b48cfe))
* **shortener:** add ShortererPresenter for HTTP response formatting ([590c4e3](https://github.com/WagnerReis/url-shortener/commit/590c4e3e26bdb9f4b7d69f4e99aadda897d05ea2))
* **shortener:** add update original URL functionality ([205cfc9](https://github.com/WagnerReis/url-shortener/commit/205cfc9ac44e8493ebbb0d4891317a0e4fb3ac47))
* **shortener:** implement short URL creation and update schema ([c9bcabc](https://github.com/WagnerReis/url-shortener/commit/c9bcabc92b6c300a14e023e0b7f1d20f2df6fb4d))


### Bug Fixes

* **shortener:** create short url with deletedAt as null, and update query to filter ([e5dde5e](https://github.com/WagnerReis/url-shortener/commit/e5dde5e827e209a7992c306dfedf13cff192fd9c))
* **shortener:** handle optional userId in PrismaShortUrlMapper ([1f61415](https://github.com/WagnerReis/url-shortener/commit/1f61415f895c90665390666a83086f87ba465464))

### [0.1.2](https://github.com/WagnerReis/url-shortener/compare/v0.1.1...v0.1.2) (2025-07-18)


### Features

* **schema:** add ShortUrl and Click models, update User model ([5214092](https://github.com/WagnerReis/url-shortener/commit/52140922438a6be94ef04f24d5ee7e1cffc7cfaa))
* **shortener:** add list short URLs functionality ([fdd9c6e](https://github.com/WagnerReis/url-shortener/commit/fdd9c6e09671f03f39bb2992845b54495081b004))
* **shortener:** add NotFoundError class for handling not found scenarios ([5454a99](https://github.com/WagnerReis/url-shortener/commit/5454a996de47ad8144bcc89f169a98c3e007cb2d))
* **shortener:** add PrismaShortUrlMapper for domain-prisma conversion ([0a67709](https://github.com/WagnerReis/url-shortener/commit/0a677090cb199859a8a1d38ae1770d9c4f9bbcb7))
* **shortener:** add UpdateOriginalUrlUseCase ([a24fdb0](https://github.com/WagnerReis/url-shortener/commit/a24fdb0042b3a3c372f2927436921455ccad8f3d))
* **shortener:** implement PrismaShortUrlRepository ([29defef](https://github.com/WagnerReis/url-shortener/commit/29defef65a8bbaebe793dad6beed303259fe20a0))


### Bug Fixes

* **shortener:** correct typo in short-url-repository filename ([ab96e1f](https://github.com/WagnerReis/url-shortener/commit/ab96e1fd405dc8eb4538d568bf3f574fc81fc674))

### [0.1.1](https://github.com/WagnerReis/url-shortener/compare/v0.1.0...v0.1.1) (2025-07-17)


### Features

* **auth:** implement global JWT auth guard and public route decorator ([c9f4c24](https://github.com/WagnerReis/url-shortener/commit/c9f4c24ffff0bf4c4438608029ef7788d6343b62))
* **docker:** add Dockerfile and docker-compose configuration ([e3d0c2b](https://github.com/WagnerReis/url-shortener/commit/e3d0c2b3d38231b932d0fce8055c7093edc9f321))
* **shortener:** add create-short-url usecase ([2276dc2](https://github.com/WagnerReis/url-shortener/commit/2276dc22cddfad2e765116347500a42e648924fb))
* **shortener:** add GenerateShortCodeUseCase ([1cbf5e5](https://github.com/WagnerReis/url-shortener/commit/1cbf5e5acc7ad8d62fa712fce90f317429e4f733))
* **shortener:** add MaxRetriesGenerateCodeError class ([8a57ad4](https://github.com/WagnerReis/url-shortener/commit/8a57ad497faf4fd82b980ea122cd2d58433c80ff))
* **shortener:** add ShortUrl entity ([a84a2f3](https://github.com/WagnerReis/url-shortener/commit/a84a2f35c14548e84676a0f47ba3f0df01c728fa))
* **shortener:** add ShortUrlRepositoryInterface ([260a6fc](https://github.com/WagnerReis/url-shortener/commit/260a6fc4c7ac744d105ea1b0a7c781fead508ffb))
* **test:** add in-memory short URL repository for testing ([ddaabb3](https://github.com/WagnerReis/url-shortener/commit/ddaabb3b3475ba3ba349c7b2ef353267fb63d591))

## [0.1.0](https://github.com/WagnerReis/url-shortener/compare/v0.0.3...v0.1.0) (2025-07-17)


### Features

* **auth:** add SignInUseCase for user authentication ([183fd4b](https://github.com/WagnerReis/url-shortener/commit/183fd4bc42370fe0502a51e5ed5ed29010514763))
* **auth:** add UnauthorizedError class ([a47260c](https://github.com/WagnerReis/url-shortener/commit/a47260c897be66fd4ec072e24b83a1fd7e47ca66))
* **auth:** implement authentication module and JWT strategy ([acb79fa](https://github.com/WagnerReis/url-shortener/commit/acb79fa7834d53d5d8ca30389d5e7d2bd89bdfe2))
* **cryptography:** enable JWT encrypter in module ([4911dfa](https://github.com/WagnerReis/url-shortener/commit/4911dfa36765b3dde80012e49cea838478f4e049))
* **error-handling:** implement HttpExceptionFilter and enhance server bootstrap ([4e4ad5a](https://github.com/WagnerReis/url-shortener/commit/4e4ad5abb1a6fa604a82793cb2d27c5e3c28850c))
* **users:** add logging and error handling to user creation ([6a40ad6](https://github.com/WagnerReis/url-shortener/commit/6a40ad617865fd6e9505e5683e127f7f5acbd6f9))

### [0.0.3](https://github.com/WagnerReis/url-shortener/compare/v0.0.2...v0.0.3) (2025-07-17)

### 0.0.2 (2025-07-17)


### Features

* **core:** add Either type and utility functions ([7c8d199](https://github.com/WagnerReis/url-shortener/commit/7c8d1991b144ec4968dcaba0b225a72c137cf1c9))
* **core:** add Entity and UniqueEntityId classes ([f328c00](https://github.com/WagnerReis/url-shortener/commit/f328c000f60e0bcb8f954e40f339536af9af73c8))
* **cryptography:** add abstract classes for encryption and hashing ([3b8d20d](https://github.com/WagnerReis/url-shortener/commit/3b8d20d41648e2f35732cd3ab315bec671c32dff))
* **cryptography:** add bcrypt hasher and cryptography module ([cd5c2f8](https://github.com/WagnerReis/url-shortener/commit/cd5c2f8bf0cd06d241363f8c4a9bd25fd88d3250))
* **env:** add DATABASE_URL to environment schema ([0836465](https://github.com/WagnerReis/url-shortener/commit/0836465936e419ecbbee2bf038fa47d9516ec3b6))
* **env:** add environment configuration module ([33a18df](https://github.com/WagnerReis/url-shortener/commit/33a18dfd1531bce6a70c36c0a615c4b0599c0e0d))
* **errors:** add ConflictError and InternalServerError classes ([a95e23c](https://github.com/WagnerReis/url-shortener/commit/a95e23c603a8b894dff3b5536444ba85eca4f971))
* **prisma:** add Prisma module and service for database integration ([a7f1d62](https://github.com/WagnerReis/url-shortener/commit/a7f1d62bb23a7707206f66068d576e01c90de9cc))
* **prisma:** create User and Url models ([0493f46](https://github.com/WagnerReis/url-shortener/commit/0493f4687ff11a9bdf05a678eb0194c5004775b9))
* **test:** add fake encrypter and hasher for testing ([a15ca83](https://github.com/WagnerReis/url-shortener/commit/a15ca8344a62b2349ba2ca13883bb00cc57e5bd3))
* **test:** add InMemoryUserRepository for testing ([cb3b987](https://github.com/WagnerReis/url-shortener/commit/cb3b987c101f100979996dfb07ed301472b43805))
* **users:** add create user use case and error handling ([ad9b52c](https://github.com/WagnerReis/url-shortener/commit/ad9b52c7236d68875f8cb2f3247f98869892f304))
* **users:** add user creation endpoint and related modules ([88232c9](https://github.com/WagnerReis/url-shortener/commit/88232c96ea644d29d02ddd029330c158b9a8e7ab))
* **users:** add User entity and repository interface ([5d17f65](https://github.com/WagnerReis/url-shortener/commit/5d17f658d1afcdfbea21d68301e9f18cc954be49))
* **users:** add UserPresenter for HTTP response formatting ([e7291fb](https://github.com/WagnerReis/url-shortener/commit/e7291fbf2e041241fc8e64668d0b17da31b80e44))
* **validation:** add ZodValidationPipe and zod-validation-error dependency ([78d699e](https://github.com/WagnerReis/url-shortener/commit/78d699ed7b0412c257a641534bb8dddb9fdbf749))
