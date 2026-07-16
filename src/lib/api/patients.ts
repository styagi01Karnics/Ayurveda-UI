import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import type { CreatePatientPayload, PatientDto } from './types';

const base = () => `${apiConfig.patient}/api/v1/patients`;

export function getAllPatients() {
  return apiRequestList<PatientDto>(`${base()}/get-all-patients`);
}

export function getPatientById(patientId: string) {
  return apiRequest<PatientDto>(`${base()}/get-patient/${patientId}`);
}

export function createPatient(payload: CreatePatientPayload) {
  return apiRequest<PatientDto>(`${base()}/create-patient`, {
    method: 'POST',
    body: payload,
  });
}
