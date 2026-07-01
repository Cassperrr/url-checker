import type { JobStatus, UrlCheckStatus } from '@url-checker/contracts';

export interface Job {
  id: string;
  createdAt: Date;
  status: JobStatus;
  items: UrlCheckItem[];
  abortController: AbortController;
}

export interface UrlCheckItem {
  url: string;
  status: UrlCheckStatus;
  httpStatusCode: number | null;
  errorMessage: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  durationMs: number | null;
}
