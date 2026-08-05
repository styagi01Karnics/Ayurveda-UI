import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreateFollowUpPayload,
  FollowUpDto,
  FollowUpStatusApi,
} from './types';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments.followUps;

export function getAllFollowUps() {
  return apiRequestList<FollowUpDto>(url(ep.getAll));
}

export function getFollowUpsByPatientId(patientId: string) {
  return apiRequestList<FollowUpDto>(url(ep.getByPatientId(patientId)));
}

export function createFollowUp(payload: CreateFollowUpPayload) {
  return apiRequest<FollowUpDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}

export function updateFollowUpStatus(
  followUpId: string,
  status: FollowUpStatusApi,
) {
  return apiRequest<FollowUpDto>(url(ep.updateStatus(followUpId)), {
    method: 'PUT',
    body: { status },
  });
}

export function cancelFollowUp(followUpId: string) {
  return apiRequest<FollowUpDto>(url(ep.cancel(followUpId)), {
    method: 'PUT',
  });
}
