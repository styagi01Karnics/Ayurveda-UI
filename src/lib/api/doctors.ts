import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateDoctorPayload, DoctorDto } from './types';

const url = (path: string) => `${apiConfig.doctor}${path}`;

export function getAllDoctors() {
  return apiRequestList<DoctorDto>(url(apiEndpoints.doctors.getAll));
}

export function getDoctorById(doctorId: string) {
  return apiRequest<DoctorDto>(url(apiEndpoints.doctors.getById(doctorId)));
}

export function createDoctor(payload: CreateDoctorPayload) {
  return apiRequest<DoctorDto>(url(apiEndpoints.doctors.create), {
    method: 'POST',
    body: payload,
  });
}
