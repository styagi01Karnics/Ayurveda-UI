import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';
import type { UserResponse } from './auth';

const url = (path: string) => `${apiConfig.auth}${path}`;
const ep = apiEndpoints;

export interface UiPageResponse {
  id?: string;
  pageCode: string;
  pageName: string;
  description?: string | null;
  sortOrder?: number;
  active?: boolean;
}

export interface TenantRoleResponse {
  id: string;
  roleCode?: string;
  roleName: string;
  description?: string | null;
  pageCodes: string[];
  active?: boolean;
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTenantRolePayload {
  roleCode?: string;
  roleName: string;
  description?: string;
  pageCodes: string[];
  active?: boolean;
}

export interface UpdateTenantRolePayload {
  roleName: string;
  description?: string;
  pageCodes: string[];
  active?: boolean;
}

export function getUiPages() {
  return apiRequestList<UiPageResponse>(url(ep.uiPages));
}

export function getRoles() {
  return apiRequestList<TenantRoleResponse>(url(ep.roles.base));
}

export function getRoleById(roleId: string) {
  return apiRequest<TenantRoleResponse>(url(ep.roles.byId(roleId)));
}

export function createRole(payload: CreateTenantRolePayload) {
  return apiRequest<TenantRoleResponse>(url(ep.roles.base), {
    method: 'POST',
    body: payload,
  });
}

export function updateRole(roleId: string, payload: UpdateTenantRolePayload) {
  return apiRequest<TenantRoleResponse>(url(ep.roles.byId(roleId)), {
    method: 'PUT',
    body: payload,
  });
}

export function deleteRole(roleId: string) {
  return apiRequest<void>(url(ep.roles.byId(roleId)), {
    method: 'DELETE',
  });
}

export interface CreateHospitalPayload {
  clinicName: string;
  clinicType: string;
  state: string;
  city: string;
  pinCode: string;
  addressLine1: string;
  addressLine2?: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  logoUrl?: string;
}

export interface PlatformHospitalDto {
  id: string;
  tenantCode?: string;
  name?: string;
  clinicName?: string;
  schemaName?: string;
  status?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  provisionMessage?: string | null;
  platform?: boolean;
}

export interface HospitalOnboardResponse {
  hospital?: PlatformHospitalDto;
  admin?: UserResponse;
  tenantCode?: string;
  schemaName?: string;
}

export interface BootstrapSuperAdminPayload {
  fullName: string;
  email: string;
  password: string;
}

export function bootstrapSuperAdmin(payload: BootstrapSuperAdminPayload) {
  return apiRequest<UserResponse>(url(ep.platform.bootstrapSuperAdmin), {
    method: 'POST',
    body: payload,
  });
}

export function createHospital(payload: CreateHospitalPayload) {
  return apiRequest<HospitalOnboardResponse>(url(ep.platform.hospitals), {
    method: 'POST',
    body: payload,
  });
}

export function getHospitals() {
  return apiRequestList<PlatformHospitalDto>(url(ep.platform.hospitals));
}

export function getHospitalById(hospitalId: string) {
  return apiRequest<PlatformHospitalDto>(
    url(ep.platform.hospitalById(hospitalId)),
  );
}

export function updateHospitalStatus(hospitalId: string, status: string) {
  return apiRequest<PlatformHospitalDto>(
    url(ep.platform.hospitalStatus(hospitalId)),
    {
      method: 'PUT',
      body: { status },
    },
  );
}

export function retryHospitalProvision(hospitalId: string) {
  return apiRequest<PlatformHospitalDto>(
    url(ep.platform.hospitalRetryProvision(hospitalId)),
    { method: 'POST' },
  );
}
