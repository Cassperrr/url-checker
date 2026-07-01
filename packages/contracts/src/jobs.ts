export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type UrlCheckStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface CreateJobRequest {
  urls: string[];
}

export interface CreateJobResponse {
  jobId: string;
}

export interface JobStatsResponse {
  pending: number;
  inProgress: number;
  success: number;
  error: number;
  cancelled: number;
}

export interface JobListItemResponse {
  id: string;
  createdAt: string;
  status: JobStatus;
  totalUrls: number;
  stats: JobStatsResponse;
}

export type GetJobsResponse = JobListItemResponse[];

export interface UrlCheckItemResponse {
  url: string;
  status: UrlCheckStatus;
  httpStatusCode: number | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
}

export interface JobDetailsResponse {
  id: string;
  createdAt: string;
  status: JobStatus;
  totalUrls: number;
  stats: JobStatsResponse;
  items: UrlCheckItemResponse[];
}

export type CancelJobResponse = JobDetailsResponse;
