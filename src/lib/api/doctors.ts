import { apiConfig } from './config';
import { apiRequest, apiRequestPage, type PagedResult } from './client';
import { apiEndpoints } from './endpoints';
import type { CreateDoctorPayload, DoctorDto } from './types';
import { DEFAULT_PAGE_SIZE } from '@/components/ui/Pagination';

const url = (path: string) => `${apiConfig.doctor}${path}`;

export function getAllDoctorsPaged(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
): Promise<PagedResult<DoctorDto>> {
  return apiRequestPage<DoctorDto>(
    url(`${apiEndpoints.doctors.getAll}?page=${page}&size=${size}`),
  );
}

export function getAllDoctors(page = 0, size = 100) {
  return getAllDoctorsPaged(page, size).then((result) => result.content);
}

/** ACTIVE doctors only — use for appointment booking dropdowns. */
export function getActiveDoctorsPaged(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
): Promise<PagedResult<DoctorDto>> {
  return apiRequestPage<DoctorDto>(
    url(`${apiEndpoints.doctors.getActive}?page=${page}&size=${size}`),
  );
}

export function getActiveDoctors(page = 0, size = 100) {
  return getActiveDoctorsPaged(page, size).then((result) => result.content);
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
