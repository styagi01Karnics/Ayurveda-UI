import type { AuthUser } from '@/types';

const AUTH_KEY = 'ganesha_auth_user';

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

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
