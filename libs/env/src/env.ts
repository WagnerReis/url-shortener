import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.coerce
    .number()
    .optional()
    .default(60 * 60 * 24),
  BASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
