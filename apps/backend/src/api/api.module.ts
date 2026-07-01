import { Module } from '@nestjs/common';

import { JobsModule } from './v1/jobs/jobs.module';

@Module({
  imports: [JobsModule],
})
export class ApiModule {}
