import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreateTreatmentPayload,
  TreatmentDto,
  TreatmentStatusApi,
  UpdateTreatmentPayload,
} from './types';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments.treatments;

export function getAllTreatments() {
  return apiRequestList<TreatmentDto>(url(ep.getAll));
}

export function getTreatmentsByPatientId(patientId: string) {
  return apiRequestList<TreatmentDto>(url(ep.getByPatientId(patientId)));
}

export function createTreatment(payload: CreateTreatmentPayload) {
  return apiRequest<TreatmentDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}

export function updateTreatment(
  treatmentId: string,
  payload: UpdateTreatmentPayload,
) {
  return apiRequest<TreatmentDto>(url(ep.update(treatmentId)), {
    method: 'PUT',
    body: payload,
  });
}

export function updateTreatmentStatus(
  treatmentId: string,
  treatmentStatus: TreatmentStatusApi,
) {
  return apiRequest<TreatmentDto>(url(ep.updateStatus(treatmentId)), {
    method: 'PUT',
    body: { treatmentStatus },
  });
}
