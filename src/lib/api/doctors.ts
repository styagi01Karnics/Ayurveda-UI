import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import type { CreateDoctorPayload, DoctorDto } from './types';

const base = () => `${apiConfig.doctor}/api/v1/doctors`;

export function getAllDoctors() {
  return apiRequestList<DoctorDto>(base());
}

export function getDoctorById(doctorId: string) {
  return apiRequest<DoctorDto>(`${base()}/${doctorId}`);
}

export function createDoctor(payload: CreateDoctorPayload) {
  return apiRequest<DoctorDto>(base(), {
    method: 'POST',
    body: payload,
  });
}
