import { Logger } from 'nestjs-pino';

export const mockLogger: Partial<Logger> = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  verbose: vi.fn(),
};
