import { apiConfig } from './config';
import { apiRequest } from './client';
import { apiEndpoints } from './endpoints';

const url = (path: string) => `${apiConfig.auth}${path}`;
const ep = apiEndpoints.auth;
const tenants = apiEndpoints.tenants;

export interface UserResponse {
  id: string;
  tenantId: string;
  tenantCode: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}

export interface TenantResponse {
  id: string;
  tenantCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  city?: string;
  state?: string;
  schemaName?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserResponse;
  tenant: TenantResponse;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
  /** Omit for Super Admin; required for hospital users. */
  tenantCode?: string;
}

export interface PublicTenantLocation {
  tenantCode: string;
  state?: string;
  city?: string;
}

export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenantCode: string;
}

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
  usernameOrEmail: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterUserPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export function login(payload: LoginPayload) {
  const body: LoginPayload = {
    usernameOrEmail: payload.usernameOrEmail,
    password: payload.password,
  };
  if (payload.tenantCode?.trim()) {
    body.tenantCode = payload.tenantCode.trim();
  }
  return apiRequest<AuthTokenResponse>(url(ep.login), {
    method: 'POST',
    body,
  });
}

/** Active hospitals for login tenant picker (no auth). */
export function getPublicTenants() {
  return apiRequest<PublicTenantLocation[]>(url('/api/v1/public/tenants'));
}

export function signup(payload: SignupPayload) {
  return apiRequest<AuthTokenResponse>(url(ep.signup), {
    method: 'POST',
    body: payload,
  });
}

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

export function getUsers() {
  return apiRequest<UserResponse[]>(url(ep.users));
}

export function getTenant() {
  return apiRequest<TenantResponse>(url(ep.tenant));
}
