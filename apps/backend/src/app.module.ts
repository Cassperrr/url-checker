import { Module } from '@nestjs/common';

import { ApiModule } from './api';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, ApiModule],
})
export class AppModule {}
