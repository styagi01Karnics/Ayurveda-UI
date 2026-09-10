import type { AuthUser } from '@/types';
import type { AuthTokenResponse, TenantResponse, UserResponse } from '@/lib/api/auth';
import { clearStoredClinicLocation } from '@/lib/clinicLocations';
import { CLINIC_BRANDING } from '@/lib/clinicBranding';
import { ALL_PAGE_CODES } from '@/lib/pagePermissions';

const AUTH_KEY = 'ganesha_auth_user';
const TOKEN_KEY = 'ganesha_auth_token';
const TENANT_KEY = 'ganesha_auth_tenant';

export const MOCK_AUTH_TOKEN = 'mock-dev-token';

/** Default credentials for local UI login (no API). */
export const DUMMY_LOGIN_CREDENTIALS = {
  emailOrUsername: 'admin@clinic.com',
  password: 'Secret@123',
  tenantCode: 'GAN-DL',
} as const;

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  DIETICIAN: 'Dietician',
  DOCTOR: 'Doctor',
  CHEMIST: 'Chemist',
};

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredTenant(): TenantResponse | null {
  const raw = localStorage.getItem(TENANT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TenantResponse;
  } catch {
    return null;
  }
}

/** Clinic/hospital name from the logged-in tenant session. */
export function getClinicDisplayName(): string {
  const tenant = getStoredTenant();
  const name = (tenant?.clinicName || tenant?.name || '').trim();
  return name || CLINIC_BRANDING.name;
}

export function getClinicLogoUrl(): string | null {
  const logo = getStoredTenant()?.logoUrl?.trim();
  return logo || null;
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setStoredTenant(tenant: unknown): void {
  localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
}

export function setAuthSession(
  token: string,
  user: AuthUser,
  tenant?: unknown,
): void {
  setStoredToken(token);
  setStoredUser(user);
  if (tenant !== undefined) {
    setStoredTenant(tenant);
  }
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearStoredTenant(): void {
  localStorage.removeItem(TENANT_KEY);
}

export function clearAuthSession(): void {
  clearStoredToken();
  clearStoredUser();
  clearStoredTenant();
  clearStoredClinicLocation();
}

export function formatAuthRole(role: string): string {
  return ROLE_LABELS[role] ?? role.replace(/_/g, ' ');
}

export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  const raw = (user.apiRole || user.role || '').toUpperCase().replace(/\s+/g, '_');
  return raw === 'SUPER_ADMIN';
}

/** Hospital ADMIN (or platform SUPER_ADMIN) — can edit clinic/tenant details. */
export function isHospitalAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  const raw = (user.apiRole || user.role || '').toUpperCase().replace(/\s+/g, '_');
  return raw === 'ADMIN' || raw === 'SUPER_ADMIN';
}

export function mapUserResponseToAuthUser(user: UserResponse): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    role: formatAuthRole(user.role),
    apiRole: user.role,
    email: user.email,
    username: user.username,
    tenantId: user.tenantId,
    tenantCode: user.tenantCode,
    schemaName: user.schemaName,
    mobileNumber: user.mobileNumber,
    tenantRoleId: user.tenantRoleId,
    tenantRoleCode: user.tenantRoleCode,
    tenantRoleName: user.tenantRoleName,
    pageCodes: user.pageCodes ?? [],
    status: user.status,
  };
}

export function mapAuthTokenToSession(response: AuthTokenResponse): {
  token: string;
  user: AuthUser;
  tenant?: TenantResponse;
} {
  return {
    token: response.accessToken,
    user: mapUserResponseToAuthUser(response.user),
    tenant: response.tenant ?? undefined,
  };
}

export function createMockAuthSession(input: {
  emailOrUsername: string;
  fullName?: string;
}): { token: string; user: AuthUser } {
  const trimmed = input.emailOrUsername.trim();
  const email = trimmed.includes('@')
    ? trimmed
    : `${trimmed}@ganeshaayurvedaa.com`;

  return {
    token: MOCK_AUTH_TOKEN,
    user: {
      id: '00000000-0000-4000-8000-000000000001',
      fullName: input.fullName ?? 'Rahul Sharma',
      role: 'Admin',
      email,
      username: trimmed.includes('@') ? trimmed.split('@')[0] : trimmed,
      tenantId: '00000000-0000-4000-8000-000000000002',
      tenantCode: DUMMY_LOGIN_CREDENTIALS.tenantCode,
      pageCodes: [...ALL_PAGE_CODES],
      status: 'ACTIVE',
    },
  };
}

/** Local login without calling the auth API. Password must be at least 6 characters. */
export function mockLogin(emailOrUsername: string, password: string): AuthUser | null {
  if (password.length < 6) return null;
  const session = createMockAuthSession({ emailOrUsername });
  setAuthSession(session.token, session.user, {
    id: session.user.tenantId ?? '00000000-0000-4000-8000-000000000002',
    tenantCode: DUMMY_LOGIN_CREDENTIALS.tenantCode,
    name: CLINIC_BRANDING.name,
    clinicName: CLINIC_BRANDING.name,
    status: 'ACTIVE',
  });
  return session.user;
}

/** Local signup session without calling the auth API. */
export function mockSignup(data: {
  fullName: string;
  email: string;
  userId: string;
}): AuthUser {
  const session = createMockAuthSession({
    emailOrUsername: data.userId || data.email,
    fullName: data.fullName,
  });
  setAuthSession(session.token, session.user);
  return session.user;
}

export function isMockAuthToken(token: string | null | undefined): boolean {
  return token === MOCK_AUTH_TOKEN;
}

export function getStoredPageCodes(): string[] {
  return getStoredUser()?.pageCodes ?? [];
}
