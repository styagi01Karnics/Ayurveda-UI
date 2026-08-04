import type { AuthUser } from '@/types';
import type { AuthTokenResponse, UserResponse } from '@/lib/api/auth';

const AUTH_KEY = 'ganesha_auth_user';
const TOKEN_KEY = 'ganesha_auth_token';

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

/** @deprecated Use login() from @/lib/api/auth */
export function mockLogin(emailOrUsername: string, password: string): AuthUser | null {
  if (password.length >= 6) {
    const user: AuthUser = {
      fullName: 'Rahul Sharma',
      role: 'Super Admin',
      email: emailOrUsername.includes('@')
        ? emailOrUsername
        : 'rahul@ganeshaayurvedaa.com',
    };
    setStoredUser(user);
    return user;
  }
  return null;
}

/** @deprecated Use registerTenant() + login() from @/lib/api/auth */
export function mockSignup(data: {
  fullName: string;
  email: string;
  userId: string;
}): AuthUser {
  const user: AuthUser = {
    fullName: data.fullName,
    role: 'Super Admin',
    email: data.email,
  };
  setStoredUser(user);
  return user;
}
