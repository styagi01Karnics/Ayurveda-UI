import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  ConsultationTypeMasterDto,
  CreateConsultationTypeMasterPayload,
} from './types';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments.consultationTypes;

export function getAllConsultationTypes() {
  return apiRequestList<ConsultationTypeMasterDto>(url(ep.getAll));
}

export function getActiveConsultationTypes() {
  return apiRequestList<ConsultationTypeMasterDto>(url(ep.getActive));
}

export function getConsultationTypeById(id: string) {
  return apiRequest<ConsultationTypeMasterDto>(url(ep.getById(id)));
}

export function createConsultationType(
  payload: CreateConsultationTypeMasterPayload,
) {
  return apiRequest<ConsultationTypeMasterDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}
