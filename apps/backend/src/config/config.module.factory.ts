import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import z from 'zod';

import { validate } from './config.validate';

@Module({})
export class ConfigModuleFactory {
  public static register<T extends z.ZodTypeAny>(schema: T): DynamicModule {
    const nodeEnv = process.env.NODE_ENV;
    const envFilePath = [
      ...(nodeEnv
        ? [join(process.cwd(), `.env.${nodeEnv}.local`), join(process.cwd(), `.env.${nodeEnv}`)]
        : []),
      join(process.cwd(), '.env'),
    ];

    const configModule = ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validate: validate(schema),
    });

    return {
      global: true,
      module: ConfigModuleFactory,
      imports: [configModule],
      exports: [ConfigModule],
    };
  }
}
