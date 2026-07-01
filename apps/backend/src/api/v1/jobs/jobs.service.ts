import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type {
  CancelJobResponse,
  CreateJobResponse,
  GetJobsResponse,
  JobDetailsResponse,
} from '@url-checker/contracts';
import { randomUUID } from 'node:crypto';

import type { CreateJobRequestDto } from './dto';
import { toJobDetailsResponse, toJobListItemResponse } from './jobs.mapper';
import { JobsProcessor } from './jobs.processor';
import { JobsRepository } from './jobs.repository';
import type { Job, UrlCheckItem } from './types';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  public constructor(
    @Inject() private readonly repo: JobsRepository,
    @Inject() private readonly processor: JobsProcessor,
  ) {}

  public create(data: CreateJobRequestDto): CreateJobResponse {
    const { urls } = data;

    const jobId = randomUUID();

    const job = this.createJob(jobId, urls);

    this.repo.save(job);

    void this.processor.run(job).catch((error: unknown) => {
      if (job.status !== 'cancelled') {
        job.status = 'failed';
      }

      this.logger.error(`Job ${job.id} failed`, error);
    });

    this.logger.log(`New job created: ${job.id}, urls=${urls.length}`);

    return { jobId };
  }

  public findAll(): GetJobsResponse {
    return this.repo.findAll().map(toJobListItemResponse);
  }

  public findById(id: string): JobDetailsResponse {
    return toJobDetailsResponse(this.getJobOrThrow(id));
  }

  public cancel(id: string): CancelJobResponse {
    const job = this.getJobOrThrow(id);

    this.processor.cancel(job);

    return toJobDetailsResponse(job);
  }

  private getJobOrThrow(id: string): Job {
    const job = this.repo.findById(id);

    if (!job) throw new NotFoundException(`Job ${id} not found`);

    return job;
  }

  private createUrlsItem(urls: string[]): UrlCheckItem[] {
    return urls.map(url => ({
      url,
      status: 'pending',
      httpStatusCode: null,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      durationMs: null,
    }));
  }

  private createJob(jobId: string, urls: string[]): Job {
    return {
      id: jobId,
      createdAt: new Date(),
      status: 'pending',
      items: this.createUrlsItem(urls),
      abortController: new AbortController(),
    };
  }
}
