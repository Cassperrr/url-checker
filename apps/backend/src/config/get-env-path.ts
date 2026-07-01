import { join } from 'node:path';

export function getEnvPath() {
  const nodeEnv = process.env.NODE_ENV;
  return [
    ...(nodeEnv
      ? [join(process.cwd(), `.env.${nodeEnv}.local`), join(process.cwd(), `.env.${nodeEnv}`)]
      : []),
    join(process.cwd(), '.env'),
  ];
}
