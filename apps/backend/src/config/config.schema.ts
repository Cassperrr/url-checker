import { z } from 'zod';

export const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_HOST: z.string().nonempty(),
  APP_PORT: z.coerce.number().int().min(1).max(65535),
});

export type schema = z.infer<typeof schema>;
