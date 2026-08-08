import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type {
  CreatePackageMasterPayload,
  PackageMasterDto,
} from './types';

const url = (path: string) => `${apiConfig.billing}${path}`;
const ep = apiEndpoints.billing.packageMasters;

export function getAllPackageMasters() {
  return apiRequestList<PackageMasterDto>(url(ep.getAll));
}

export function getActivePackageMasters() {
  return apiRequestList<PackageMasterDto>(url(ep.getActive));
}

export function getPackageMasterById(id: string) {
  return apiRequest<PackageMasterDto>(url(ep.getById(id)));
}

export function createPackageMaster(payload: CreatePackageMasterPayload) {
  return apiRequest<PackageMasterDto>(url(ep.base), {
    method: 'POST',
    body: payload,
  });
}
