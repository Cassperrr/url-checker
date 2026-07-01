import type {
  JobDetailsResponse,
  JobListItemResponse,
  JobStatsResponse,
  UrlCheckItemResponse,
} from '@url-checker/contracts';

import type { Job, UrlCheckItem } from './types';

export function toJobListItemResponse(job: Job): JobListItemResponse {
  return {
    id: job.id,
    createdAt: job.createdAt.toISOString(),
    status: job.status,
    totalUrls: job.items.length,
    stats: getJobStats(job),
  };
}

export function toJobDetailsResponse(job: Job): JobDetailsResponse {
  return {
    ...toJobListItemResponse(job),
    items: job.items.map(toUrlCheckItemResponse),
  };
}

export function getJobStats(job: Job): JobStatsResponse {
  return job.items.reduce<JobStatsResponse>(
    (stats, item) => {
      switch (item.status) {
        case 'pending':
          stats.pending += 1;
          break;
        case 'in_progress':
          stats.inProgress += 1;
          break;
        case 'success':
          stats.success += 1;
          break;
        case 'error':
          stats.error += 1;
          break;
        case 'cancelled':
          stats.cancelled += 1;
          break;
      }

      return stats;
    },
    {
      pending: 0,
      inProgress: 0,
      success: 0,
      error: 0,
      cancelled: 0,
    },
  );
}

function toUrlCheckItemResponse(item: UrlCheckItem): UrlCheckItemResponse {
  return {
    url: item.url,
    status: item.status,
    httpStatusCode: item.httpStatusCode,
    errorMessage: item.errorMessage,
    startedAt: toIsoStringOrNull(item.startedAt),
    finishedAt: toIsoStringOrNull(item.finishedAt),
    durationMs: item.durationMs,
  };
}

function toIsoStringOrNull(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}
