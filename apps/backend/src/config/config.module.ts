import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { schema } from './config.schema';
import { getEnvPath } from './get-env-path';
import { validateSchema } from './validate-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
      validate: validateSchema(schema),
    }),
  ],
})
export class AppConfigModule {}
