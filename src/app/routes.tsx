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
import { BillingPage } from '@/pages/BillingPage';
import { GenerateInvoicePage } from '@/pages/GenerateInvoicePage';
import { ActivityLogsPage } from '@/pages/ActivityLogsPage';
import { MedicinesPage } from '@/pages/MedicinesPage';
import { SalesPage } from '@/pages/SalesPage';
import { TreatmentPatientDetailPage } from '@/pages/TreatmentPatientDetailPage';
import { TreatmentsPage } from '@/pages/TreatmentsPage';
import { SettingsPage } from '@/pages/SettingsPage';
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
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/treatments/patient/:patientId" element={<TreatmentPatientDetailPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing/generate" element={<GenerateInvoicePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
