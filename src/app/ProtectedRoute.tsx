import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredUser, isSuperAdmin } from '@/lib/auth';
import {
  firstAllowedPath,
  hasPageAccess,
  pageCodeForPath,
  type PageCode,
} from '@/lib/pagePermissions';

export const PLATFORM_CLINICS_PATH = '/platform/clinics';

interface PageProtectedRouteProps {
  pageCode: PageCode;
  children: React.ReactNode;
}

export function PageProtectedRoute({
  pageCode,
  children,
}: PageProtectedRouteProps) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Super Admin has full Admin access.
  if (!isSuperAdmin(user) && !hasPageAccess(user.pageCodes, pageCode)) {
    return <Navigate to={firstAllowedPath(user.pageCodes)} replace />;
  }
  return <>{children}</>;
}

/** Super Admin only — clinic onboard / platform console. */
export function SuperAdminRoute() {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isSuperAdmin(user)) {
    return <Navigate to={firstAllowedPath(user.pageCodes)} replace />;
  }
  return <Outlet />;
}

export function ProtectedRoute() {
  const user = getStoredUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const pageCode = pageCodeForPath(location.pathname);
  if (
    !isSuperAdmin(user) &&
    pageCode &&
    !hasPageAccess(user.pageCodes, pageCode)
  ) {
    return <Navigate to={firstAllowedPath(user.pageCodes)} replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const user = getStoredUser();
  if (user) {
    return <Navigate to={firstAllowedPath(user.pageCodes)} replace />;
  }
  return <Outlet />;
}
