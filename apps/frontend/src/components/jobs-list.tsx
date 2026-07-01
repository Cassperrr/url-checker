import { useJobsStore } from '../store/jobs.store';

import { JobStatusBadge } from './job-status-badge';

export function JobsList() {
  const jobs = useJobsStore(state => state.jobs);
  const activeJobId = useJobsStore(state => state.activeJobId);
  const isJobsLoading = useJobsStore(state => state.isJobsLoading);
  const selectJob = useJobsStore(state => state.selectJob);

  return (
    <section className='panel-section'>
      <div className='section-header'>
        <h2 className='section-title'>Jobs</h2>
        {isJobsLoading && jobs.length > 0 ? <span className='inline-loader'>Updating</span> : null}
      </div>
      {isJobsLoading && jobs.length === 0 ? (
        <div className='empty-state'>Loading jobs...</div>
      ) : null}
      {!isJobsLoading && jobs.length === 0 ? <div className='empty-state'>No jobs yet.</div> : null}
      <div className='jobs-list'>
        {jobs.map(job => (
          <button
            className={
              job.id === activeJobId ? 'job-list-item job-list-item--active' : 'job-list-item'
            }
            key={job.id}
            type='button'
            onClick={() => void selectJob(job.id)}
          >
            <span className='job-list-item__header'>
              <span>{job.id.slice(0, 8)}</span>
              <JobStatusBadge status={job.status} />
            </span>
            <span>{new Date(job.createdAt).toLocaleString()}</span>
            <span>
              {job.stats.success} success, {job.stats.error} error, {job.stats.cancelled} cancelled
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
