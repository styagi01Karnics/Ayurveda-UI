import { Navigate, Outlet } from 'react-router-dom';
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  isMockAuthToken,
} from '@/lib/auth';

function hasValidSession(): boolean {
  const user = getStoredUser();
  const token = getStoredToken();
  if (!user || !token) {
    return false;
  }
  // Old demo sessions used mock-dev-token and cause API 401s.
  if (isMockAuthToken(token)) {
    clearAuthSession();
    return false;
  }
  return true;
}

export function ProtectedRoute() {
  if (!hasValidSession()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function PublicRoute() {
  if (hasValidSession()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
