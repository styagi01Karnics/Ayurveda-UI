import { apiConfig } from './config';
import { apiRequest, apiRequestList, apiRequestPage, type PagedResult } from './client';
import { apiEndpoints } from './endpoints';
import type { CreatePatientPayload, PatientDto } from './types';
import { DEFAULT_PAGE_SIZE } from '@/components/ui/Pagination';

const url = (path: string) => `${apiConfig.patient}${path}`;

export function getAllPatientsPaged(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
): Promise<PagedResult<PatientDto>> {
  return apiRequestPage<PatientDto>(
    url(`${apiEndpoints.patients.getAll}?page=${page}&size=${size}`),
  );
}

export function getAllPatients(page = 0, size = 100) {
  return getAllPatientsPaged(page, size).then((result) => result.content);
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

export interface NewPatientsByMonthDto {
  month?: string;
  monthLabel?: string;
  count?: number;
  newPatients?: number;
  [key: string]: unknown;
}

export function getNewPatientsByMonth() {
  return apiRequestList<NewPatientsByMonthDto>(
    url(apiEndpoints.patients.newPatientsByMonth),
  );
}
