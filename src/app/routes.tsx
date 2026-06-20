import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DoctorPatientDetailPage } from '@/pages/DoctorPatientDetailPage';
import { DoctorsPage } from '@/pages/DoctorsPage';
import { LoginPage } from '@/pages/LoginPage';
import { MyProfilePage } from '@/pages/MyProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PatientDetailPage } from '@/pages/PatientDetailPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { SignupPage } from '@/pages/SignupPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:patientId" element={<PatientDetailPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/patient/:patientId" element={<DoctorPatientDetailPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route
              path="/treatments"
              element={
                <PlaceholderPage
                  title="Treatments"
                  description="Treatment management coming soon."
                />
              }
            />
            <Route
              path="/medicines"
              element={
                <PlaceholderPage
                  title="Medicines"
                  description="Medicine inventory will be available after API integration."
                />
              }
            />
            <Route
              path="/sales"
              element={
                <PlaceholderPage
                  title="Sales"
                  description="Sales tracking coming soon."
                />
              }
            />
            <Route
              path="/activity-logs"
              element={
                <PlaceholderPage
                  title="Activity Logs"
                  description="Activity logs will be available after API integration."
                />
              }
            />
            <Route
              path="/billing"
              element={
                <PlaceholderPage
                  title="Billing"
                  description="Billing module coming soon."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <PlaceholderPage
                  title="Settings"
                  description="Clinic settings will be available after API integration."
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
