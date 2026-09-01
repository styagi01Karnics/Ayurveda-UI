import type { AuthUser } from '@/types';
import type { AuthTokenResponse, UserResponse } from '@/lib/api/auth';
import { clearStoredClinicLocation } from '@/lib/clinicLocations';

const AUTH_KEY = 'ganesha_auth_user';
const TOKEN_KEY = 'ganesha_auth_token';

export const MOCK_AUTH_TOKEN = 'mock-dev-token';

/** Default credentials for local UI login (no API). */
export const DUMMY_LOGIN_CREDENTIALS = {
  emailOrUsername: 'admin@clinic.com',
  password: 'Secret@123',
} as const;

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  TENANT_ADMIN: 'Tenant Admin',
  DOCTOR: 'Doctor',
  THERAPIST: 'Therapist',
  STAFF: 'Staff',
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

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setAuthSession(token: string, user: AuthUser): void {
  setStoredToken(token);
  setStoredUser(user);
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAuthSession(): void {
  clearStoredToken();
  clearStoredUser();
  clearStoredClinicLocation();
}

export function formatAuthRole(role: string): string {
  return ROLE_LABELS[role] ?? role.replace(/_/g, ' ');
}

export function mapUserResponseToAuthUser(user: UserResponse): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    role: formatAuthRole(user.role),
    email: user.email,
    username: user.username,
    tenantId: user.tenantId,
    tenantCode: user.tenantCode,
  };
}

export function mapAuthTokenToSession(response: AuthTokenResponse): {
  token: string;
  user: AuthUser;
} {
  return {
    token: response.accessToken,
    user: mapUserResponseToAuthUser(response.user),
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
      role: 'Super Admin',
      email,
      username: trimmed.includes('@') ? trimmed.split('@')[0] : trimmed,
      tenantId: '00000000-0000-4000-8000-000000000002',
      tenantCode: 'GAN',
    },
  };
}

/** Local login without calling the auth API. Password must be at least 6 characters. */
export function mockLogin(emailOrUsername: string, password: string): AuthUser | null {
  if (password.length < 6) return null;
  const session = createMockAuthSession({ emailOrUsername });
  setAuthSession(session.token, session.user);
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
