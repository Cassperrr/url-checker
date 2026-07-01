import type { ConfigModuleOptions } from '@nestjs/config';
import z from 'zod';

type ConfigValidateFn = NonNullable<ConfigModuleOptions['validate']>;

export function validateSchema<T extends z.ZodTypeAny>(schema: T) {
  const validateConfig: ConfigValidateFn = config => {
    const result = schema.safeParse(config);

    if (!result.success) {
      throw new Error(
        `ENV validation error:\n${result.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join('\n')}`,
      );
    }

    return result.data as ReturnType<ConfigValidateFn>;
  };

  return validateConfig;
}
