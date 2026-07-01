import { useEffect } from 'react';

import { isTerminalJobStatus, useJobsStore } from '../store/jobs.store';

import { JobStatusBadge } from './job-status-badge';

const POLLING_INTERVAL_MS = 1500;

export function JobDetails() {
  const activeJobId = useJobsStore(state => state.activeJobId);
  const activeJob = useJobsStore(state => state.activeJob);
  const isDetailsLoading = useJobsStore(state => state.isDetailsLoading);
  const isCancelling = useJobsStore(state => state.isCancelling);
  const loadActiveJob = useJobsStore(state => state.loadActiveJob);
  const loadJobs = useJobsStore(state => state.loadJobs);
  const cancelActiveJob = useJobsStore(state => state.cancelActiveJob);

  useEffect(() => {
    if (!activeJobId) {
      return;
    }

    const controller = new AbortController();
    let intervalId: number | undefined;

    const poll = () => {
      void loadActiveJob(controller.signal).then(() => {
        void loadJobs(controller.signal);
      });
    };

    poll();

    if (!activeJob || !isTerminalJobStatus(activeJob.status)) {
      intervalId = window.setInterval(poll, POLLING_INTERVAL_MS);
    }

    return () => {
      controller.abort();

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeJobId, activeJob?.status, loadActiveJob, loadJobs]);

  if (!activeJobId) {
    return (
      <section className='details-panel'>
        <h1 className='page-title'>Job details</h1>
        <div className='empty-state'>Select a job or start a new check.</div>
      </section>
    );
  }

  if (!activeJob) {
    return (
      <section className='details-panel'>
        <h1 className='page-title'>Job details</h1>
        <div className='empty-state'>
          {isDetailsLoading ? 'Loading job...' : 'No job selected.'}
        </div>
      </section>
    );
  }

  const processedCount =
    activeJob.stats.success + activeJob.stats.error + activeJob.stats.cancelled;
  const canCancel = !isTerminalJobStatus(activeJob.status);

  return (
    <section className='details-panel'>
      <div className='details-header'>
        <div>
          <h1 className='page-title'>Job details</h1>
          <div className='muted-text'>{activeJob.id}</div>
        </div>
        <JobStatusBadge status={activeJob.status} />
      </div>

      <div className='summary-row'>
        <span>
          {processedCount} of {activeJob.totalUrls} processed
        </span>
        <span>
          {activeJob.stats.success} success / {activeJob.stats.error} error /{' '}
          {activeJob.stats.cancelled} cancelled
        </span>
      </div>

      {canCancel ? (
        <button
          className='secondary-button'
          type='button'
          disabled={isCancelling}
          onClick={() => void cancelActiveJob()}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel job'}
        </button>
      ) : null}

      <div className='url-results'>
        {activeJob.items.map(item => (
          <article className='url-result' key={item.url}>
            <div className='url-result__main'>
              <span className='url-text'>{item.url}</span>
              <JobStatusBadge status={item.status} />
            </div>
            <div className='url-result__meta'>
              <span>HTTP: {item.httpStatusCode ?? '-'}</span>
              <span>Duration: {item.durationMs === null ? '-' : `${item.durationMs} ms`}</span>
              {item.errorMessage ? <span>Error: {item.errorMessage}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
