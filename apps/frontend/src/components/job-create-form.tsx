import { type FormEvent, useState } from 'react';

import { useJobsStore } from '../store/jobs.store';

export function JobCreateForm() {
  const [value, setValue] = useState('');
  const createJob = useJobsStore(state => state.createJob);
  const isCreating = useJobsStore(state => state.isCreating);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const urls = value
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      return;
    }

    void createJob(urls).then(() => {
      setValue('');
    });
  };

  return (
    <form className='panel-section' onSubmit={handleSubmit}>
      <label className='field-label' htmlFor='urls'>
        URLs
      </label>
      <textarea
        className='url-input'
        id='urls'
        name='urls'
        placeholder='https://example.com&#10;https://github.com'
        rows={8}
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <button className='primary-button' type='submit' disabled={isCreating}>
        {isCreating ? 'Starting...' : 'Start check'}
      </button>
    </form>
  );
}
