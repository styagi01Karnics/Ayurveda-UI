import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.activityLog}${path}`;
const ep = apiEndpoints.activityLogs;

export type ActivityActionApi =
  | 'VIEWED'
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED';

export interface ActivityLogDto {
  id: string;
  page: string;
  action: ActivityActionApi;
  target: string;
  before?: string;
  after?: string;
  timestamp: string;
  performedByUserId?: string;
  performedByUserName?: string;
  performedByRole?: string;
}

export interface CreateActivityLogPayload {
  page: string;
  action: ActivityActionApi;
  target: string;
  beforeValue?: string;
  afterValue?: string;
  activityTimestamp: string;
  performedByUserId?: string;
  performedByUserName?: string;
  performedByRole?: string;
}

export interface ActivityLogsQuery {
  page?: string;
  action?: ActivityActionApi;
  search?: string;
}

export function getActivityLogs(query: ActivityLogsQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', query.page);
  if (query.action) params.set('action', query.action);
  if (query.search) params.set('search', query.search);
  const qs = params.toString();
  return apiRequestList<ActivityLogDto>(
    url(`${ep.base}${qs ? `?${qs}` : ''}`),
  );
}

export function getActivityLogById(id: string) {
  return apiRequest<ActivityLogDto>(url(ep.byId(id)));
}

export function createActivityLog(payload: CreateActivityLogPayload) {
  return apiRequest<ActivityLogDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}
