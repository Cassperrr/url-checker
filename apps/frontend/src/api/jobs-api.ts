import type {
  CancelJobResponse,
  CreateJobRequest,
  CreateJobResponse,
  GetJobsResponse,
  JobDetailsResponse,
} from '@url-checker/contracts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function withSignal(signal?: AbortSignal): RequestInit {
  return signal ? { signal } : {};
}

function getRequestHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: getRequestHeaders(init),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export const jobsApi = {
  createJob(payload: CreateJobRequest): Promise<CreateJobResponse> {
    return request<CreateJobResponse>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getJobs(signal?: AbortSignal): Promise<GetJobsResponse> {
    return request<GetJobsResponse>('/jobs', withSignal(signal));
  },

  getJob(id: string, signal?: AbortSignal): Promise<JobDetailsResponse> {
    return request<JobDetailsResponse>(`/jobs/${id}`, withSignal(signal));
  },

  cancelJob(id: string): Promise<CancelJobResponse> {
    return request<CancelJobResponse>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};
