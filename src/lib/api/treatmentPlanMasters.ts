import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreateTreatmentPlanMasterPayload,
  TreatmentPlanMasterDto,
} from './types';

const url = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.appointments.treatmentPlanMasters;

export function getAllTreatmentPlanMasters() {
  return apiRequestList<TreatmentPlanMasterDto>(url(ep.getAll));
}

export function getActiveTreatmentPlanMasters() {
  return apiRequestList<TreatmentPlanMasterDto>(url(ep.getActive));
}

export function getTreatmentPlanMasterById(id: string) {
  return apiRequest<TreatmentPlanMasterDto>(url(ep.getById(id)));
}

export function createTreatmentPlanMaster(
  payload: CreateTreatmentPlanMasterPayload,
) {
  return apiRequest<TreatmentPlanMasterDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}
