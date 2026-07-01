import { useEffect } from 'react';

import { JobCreateForm } from './components/job-create-form';
import { JobDetails } from './components/job-details';
import { JobsList } from './components/jobs-list';
import { useJobsStore } from './store/jobs.store';

export function App() {
  const loadJobs = useJobsStore(state => state.loadJobs);
  const error = useJobsStore(state => state.error);
  const clearError = useJobsStore(state => state.clearError);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  return (
    <main className='app-shell'>
      <section className='workspace-panel'>
        {error ? (
          <button className='error-banner' type='button' onClick={clearError}>
            {error}
          </button>
        ) : null}
        <JobCreateForm />
        <JobsList />
      </section>
      <section className='workspace-main'>
        <JobDetails />
      </section>
    </main>
  );
}
