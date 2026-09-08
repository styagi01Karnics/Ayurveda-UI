import { apiConfig } from './config';
import { apiRequest, apiRequestList } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.auth}${path}`;
const ep = apiEndpoints.auth;
const tenants = apiEndpoints.tenants;

export interface UserResponse {
  id: string;
  tenantId?: string;
  tenantCode?: string;
  schemaName?: string;
  username?: string;
  email: string;
  fullName: string;
  mobileNumber?: string;
  role: string;
  tenantRoleId?: string;
  tenantRoleCode?: string;
  tenantRoleName?: string;
  pageCodes?: string[];
  status: string;
}

export interface TenantResponse {
  id: string;
  tenantCode: string;
  name: string;
  clinicName?: string;
  clinicType?: string;
  state?: string;
  stateCode?: string;
  city?: string;
  pinCode?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  address?: string;
  registrationNumberGst?: string | null;
  logoUrl?: string | null;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  phone?: string;
  photoUrl?: string | null;
  schemaName?: string;
  platform?: boolean;
  status: string;
  provisionMessage?: string | null;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserResponse;
  tenant?: TenantResponse | null;
}

export interface LoginPayload {
  tenantCode?: string;
  usernameOrEmail: string;
  password: string;
  /** Hospital city, e.g. "New Delhi". */
  city?: string;
}

/** @deprecated Public signup removed — use platform hospital onboard. */
export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenantCode: string;
}

/** @deprecated Tenants/register removed — use POST /platform/hospitals. */
export interface RegisterTenantPayload {
  tenantCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  adminFullName: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
}

export interface ForgotPasswordPayload {
  tenantCode?: string;
  usernameOrEmail: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
  tenantRoleId?: string;
  username?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  role?: string;
  tenantRoleId?: string;
  status?: string;
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthTokenResponse>(url(ep.login), {
    method: 'POST',
    body: payload,
  });
}

/** @deprecated Do not call — public signup removed. */
export function signup(payload: SignupPayload) {
  return apiRequest<AuthTokenResponse>(url(ep.signup), {
    method: 'POST',
    body: payload,
  });
}

/** @deprecated Do not call — use platform hospitals. */
export function registerTenant(payload: RegisterTenantPayload) {
  return apiRequest<TenantResponse>(url(tenants.register), {
    method: 'POST',
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<{ message: string; resetToken?: string; expiresAt?: string }>(
    url(ep.forgotPassword),
    { method: 'POST', body: payload },
  );
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<void>(url(ep.resetPassword), {
    method: 'POST',
    body: payload,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiRequest<void>(url(ep.changePassword), {
    method: 'PUT',
    body: payload,
  });
}

export function validateToken() {
  return apiRequest<{
    valid: boolean;
    userId?: string;
    tenantId?: string;
    tenantCode?: string;
    email?: string;
    role?: string;
  }>(url(ep.validate), { method: 'POST' });
}

export function registerUser(payload: RegisterUserPayload) {
  return apiRequest<UserResponse>(url(ep.registerUser), {
    method: 'POST',
    body: payload,
  });
}

export function getMe() {
  return apiRequest<UserResponse>(url(ep.me));
}

export function updateMe(payload: { fullName?: string }) {
  return apiRequest<UserResponse>(url(ep.me), {
    method: 'PUT',
    body: payload,
  });
}

export function getUsers() {
  return apiRequestList<UserResponse>(url(ep.users));
}

export function getUserById(userId: string) {
  return apiRequest<UserResponse>(url(ep.userById(userId)));
}

export function updateUser(userId: string, payload: UpdateUserPayload) {
  return apiRequest<UserResponse>(url(ep.userById(userId)), {
    method: 'PUT',
    body: payload,
  });
}

export function updateUserStatus(userId: string, status: string) {
  return apiRequest<UserResponse>(url(ep.userStatus(userId)), {
    method: 'PUT',
    body: { status },
  });
}

export function deleteUser(userId: string) {
  return apiRequest<void>(url(ep.userById(userId)), {
    method: 'DELETE',
  });
}

export function getTenant() {
  return apiRequest<TenantResponse>(url(ep.tenant));
}
