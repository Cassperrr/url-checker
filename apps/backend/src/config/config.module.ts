import { Module } from '@nestjs/common';

import { ConfigModuleFactory } from './config.module.factory';
import { schema } from './config.schema';

@Module({
  imports: [ConfigModuleFactory.register(schema)],
})
export class AppConfigModule {}
