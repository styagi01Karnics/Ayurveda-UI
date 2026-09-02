import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { CreatePatientPayload, PatientDto } from './types';

const url = (path: string) => `${apiConfig.patient}${path}`;

export function getAllPatients() {
  return apiRequestList<PatientDto>(url(apiEndpoints.patients.getAll));
}

export function getPatientById(patientId: string) {
  return apiRequest<PatientDto>(url(apiEndpoints.patients.getById(patientId)));
}

export function createPatient(payload: CreatePatientPayload) {
  return apiRequest<PatientDto>(url(apiEndpoints.patients.create), {
    method: 'POST',
    body: payload,
  });
}

export function deletePatient(patientId: string) {
  return apiRequest<void>(url(apiEndpoints.patients.delete(patientId)), {
    method: 'DELETE',
  });
}

export interface PatientCountDto {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
}

export function getPatientCount() {
  return apiRequest<PatientCountDto>(url(apiEndpoints.patients.getCount));
}
