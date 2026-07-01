import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PQueue from 'p-queue';

import { getConfigValue, type schema } from '@/config';

import type { Job, UrlCheckItem } from './types';

@Injectable()
export class JobsProcessor {
  private readonly logger = new Logger(JobsProcessor.name);

  public constructor(@Inject() private readonly config: ConfigService<schema, true>) {}

  public async run(job: Job): Promise<void> {
    job.status = 'in_progress';

    this.logger.log(`Job ${job.id} status -> in_progress`);

    const queue = new PQueue({
      concurrency: getConfigValue(this.config, 'JOB_CONCURRENCY'),
      timeout: getConfigValue(this.config, 'HEAD_TIMEOUT_MS'),
    });

    const tasks = job.items.map(item => this.processItem(job, item, queue));

    await Promise.allSettled(tasks);

    if (!job.abortController.signal.aborted) {
      job.status = 'completed';
      this.logger.verbose(`Job ${job.id} status -> completed`);
    }
  }

  public cancel(job: Job): void {
    if (this.isTerminalJob(job)) {
      return;
    }

    job.status = 'cancelled';
    job.abortController.abort();

    this.logger.warn(`Job ${job.id} status -> cancelled`);

    for (const item of job.items) {
      if (item.status === 'pending') {
        item.status = 'cancelled';
      }
    }
  }

  private async processItem(job: Job, item: UrlCheckItem, queue: PQueue): Promise<void> {
    if (job.abortController.signal.aborted) {
      item.status = 'cancelled';
      return;
    }

    try {
      const response = await queue.add(
        async () => {
          if (job.abortController.signal.aborted) {
            item.status = 'cancelled';
            return null;
          }

          item.status = 'in_progress';
          item.startedAt = new Date();

          return fetch(item.url, {
            method: 'HEAD',
            signal: job.abortController.signal,
          });
        },
        {
          signal: job.abortController.signal,
        },
      );

      if (!response) {
        return;
      }

      await this.delayRandom(job.abortController.signal);

      item.httpStatusCode = response.status;

      if (response.ok) {
        item.status = 'success';
      } else {
        item.status = 'error';
        item.errorMessage = `HTTP status ${response.status}`;
      }
    } catch (error) {
      if (job.abortController.signal.aborted) {
        item.status = 'cancelled';
      } else {
        item.status = 'error';
        item.errorMessage = this.getErrorMessage(error);
      }
    } finally {
      const startedAt = item.startedAt;

      if (startedAt) {
        const finishedAt = new Date();

        item.finishedAt = finishedAt;
        item.durationMs = finishedAt.getTime() - startedAt.getTime();
      }
    }
  }

  private delayRandom(signal: AbortSignal): Promise<void> {
    const delayMs = Math.floor(Math.random() * 10_001);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, delayMs);

      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeout);
          reject(new DOMException('Job was cancelled', 'AbortError'));
        },
        { once: true },
      );
    });
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }

  private isTerminalJob(job: Job): boolean {
    return job.status === 'completed' || job.status === 'cancelled' || job.status === 'failed';
  }
}
