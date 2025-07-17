# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
