import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type {
  CancelJobResponse,
  CreateJobResponse,
  GetJobsResponse,
  JobDetailsResponse,
} from '@url-checker/contracts';

import { CreateJobRequestDto, JobIdParamRequestDto } from './dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  public constructor(private readonly jobsService: JobsService) {}

  @Post()
  public create(@Body() dto: CreateJobRequestDto): CreateJobResponse {
    return this.jobsService.create(dto);
  }

  @Get()
  public findAll(): GetJobsResponse {
    return this.jobsService.findAll();
  }

  @Get(':id')
  public findById(@Param() param: JobIdParamRequestDto): JobDetailsResponse {
    return this.jobsService.findById(param.id);
  }

  @Delete(':id')
  public cancel(@Param() param: JobIdParamRequestDto): CancelJobResponse {
    return this.jobsService.cancel(param.id);
  }
}
