import { Injectable } from '@nestjs/common';

import type { Job } from './types';

@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, Job>();

  public save(job: Job): Job {
    this.jobs.set(job.id, job);
    return job;
  }

  public findAll(): Job[] {
    return [...this.jobs.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public findById(id: string): Job | null {
    return this.jobs.get(id) ?? null;
  }
}
