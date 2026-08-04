import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateDoctorPayload, DoctorDto } from './types';

const url = (path: string) => `${apiConfig.doctor}${path}`;

export function getAllDoctors() {
  return apiRequestList<DoctorDto>(url(apiEndpoints.doctors.getAll));
}

/** ACTIVE doctors only — use for appointment booking dropdowns. */
export function getActiveDoctors() {
  return apiRequestList<DoctorDto>(url(apiEndpoints.doctors.getActive));
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

export function deleteDoctor(doctorId: string) {
  return apiRequest<void>(url(apiEndpoints.doctors.getById(doctorId)), {
    method: 'DELETE',
  });
}

export function updateDoctorStatus(doctorId: string, status: string) {
  return apiRequest<DoctorDto>(url(apiEndpoints.doctors.updateStatus(doctorId)), {
    method: 'PATCH',
    body: { status },
  });
}
