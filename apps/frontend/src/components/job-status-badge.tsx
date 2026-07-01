import type { JobStatus, UrlCheckStatus } from '@url-checker/contracts';

interface JobStatusBadgeProps {
  status: JobStatus | UrlCheckStatus;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}
