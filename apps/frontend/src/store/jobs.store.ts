import type { GetJobsResponse, JobDetailsResponse, JobStatus } from '@url-checker/contracts';
import { create } from 'zustand';

import { jobsApi } from '../api/jobs-api';

interface JobsState {
  jobs: GetJobsResponse;
  activeJobId: string | null;
  activeJob: JobDetailsResponse | null;
  isCreating: boolean;
  isJobsLoading: boolean;
  isDetailsLoading: boolean;
  isCancelling: boolean;
  error: string | null;
  createJob: (urls: string[]) => Promise<void>;
  loadJobs: (signal?: AbortSignal) => Promise<void>;
  selectJob: (id: string) => Promise<void>;
  loadActiveJob: (signal?: AbortSignal) => Promise<void>;
  cancelActiveJob: () => Promise<void>;
  clearError: () => void;
}

const TERMINAL_JOB_STATUSES = new Set<JobStatus>(['completed', 'cancelled', 'failed']);

export const isTerminalJobStatus = (status: JobStatus): boolean =>
  TERMINAL_JOB_STATUSES.has(status);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  activeJob: null,
  isCreating: false,
  isJobsLoading: false,
  isDetailsLoading: false,
  isCancelling: false,
  error: null,

  async createJob(urls) {
    set({ isCreating: true, error: null });

    try {
      const { jobId } = await jobsApi.createJob({ urls });

      set({ activeJobId: jobId, activeJob: null });

      await Promise.all([get().loadJobs(), get().loadActiveJob()]);
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isCreating: false });
    }
  },

  async loadJobs(signal) {
    set({ isJobsLoading: true, error: null });

    try {
      const jobs = await jobsApi.getJobs(signal);

      set({ jobs });
    } catch (error) {
      if (!isAbortError(error)) {
        set({ error: getErrorMessage(error) });
      }
    } finally {
      set({ isJobsLoading: false });
    }
  },

  async selectJob(id) {
    set({ activeJobId: id, activeJob: null, error: null });
    await get().loadActiveJob();
  },

  async loadActiveJob(signal) {
    const jobId = get().activeJobId;

    if (!jobId) {
      return;
    }

    set({ isDetailsLoading: true, error: null });

    try {
      const activeJob = await jobsApi.getJob(jobId, signal);

      if (get().activeJobId !== jobId) {
        return;
      }

      set({ activeJob });
    } catch (error) {
      if (!isAbortError(error)) {
        set({ error: getErrorMessage(error) });
      }
    } finally {
      if (get().activeJobId === jobId) {
        set({ isDetailsLoading: false });
      }
    }
  },

  async cancelActiveJob() {
    const jobId = get().activeJobId;

    if (!jobId) {
      return;
    }

    set({ isCancelling: true, error: null });

    try {
      const activeJob = await jobsApi.cancelJob(jobId);

      if (get().activeJobId === jobId) {
        set({ activeJob });
      }

      await get().loadJobs();
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isCancelling: false });
    }
  },

  clearError() {
    set({ error: null });
  },
}));
