import { z } from 'zod';

export const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_HOST: z.string().nonempty(),
  APP_PORT: z.coerce.number().int().min(1).max(65535),
  CORS_ORIGINS: z
    .string()
    .nonempty()
    .transform(value =>
      value
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean),
    ),

  JOB_CONCURRENCY: z.coerce.number().int().min(1),
  HEAD_TIMEOUT_MS: z.coerce.number().int().min(3000),
});

export type schema = z.infer<typeof schema>;
