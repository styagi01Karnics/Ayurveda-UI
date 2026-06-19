import { Navigate, Outlet } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

export function ProtectedRoute() {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function PublicRoute() {
  const user = getStoredUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
