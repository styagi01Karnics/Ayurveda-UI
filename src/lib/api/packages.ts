import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreatePatientPackagePayload,
  PatientPackageDto,
  PatientPackageStatusApi,
  UpdatePatientPackagePayload,
} from './types';

const url = (path: string) => `${apiConfig.billing}${path}`;
const ep = apiEndpoints.billing.packages;

export function getAllPackages() {
  return apiRequestList<PatientPackageDto>(url(ep.getAll));
}

export function getPackagesByPatientId(patientId: string) {
  return apiRequestList<PatientPackageDto>(url(ep.getByPatientId(patientId)));
}

export function createPackage(payload: CreatePatientPackagePayload) {
  return apiRequest<PatientPackageDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}

export function updatePackage(
  packageId: string,
  payload: UpdatePatientPackagePayload,
) {
  return apiRequest<PatientPackageDto>(url(ep.update(packageId)), {
    method: 'PUT',
    body: payload,
  });
}

export function updatePackageStatus(
  packageId: string,
  status: PatientPackageStatusApi,
) {
  return apiRequest<PatientPackageDto>(url(ep.updateStatus(packageId)), {
    method: 'PUT',
    body: { status },
  });
}
