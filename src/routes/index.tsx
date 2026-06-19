import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import InactivePatientsPage from "../pages/patients/InactivePatientsPage";
import PatientDetailsPage from "../pages/patients/PatientDetailsPage";
import DoctorsPage, { DoctorDetailPage } from "../pages/doctors/DoctorsPage";
import DoctorPatientDetailsPage from "../pages/doctors/DoctorPatientDetailsPage";
import DoctorPatientMedicalAssessmentPage from "../pages/doctors/DoctorPatientMedicalAssessmentPage";
import DoctorPatientTreatmentPage from "../pages/doctors/DoctorPatientTreatmentPage";
import DoctorPatientBillingPage from "../pages/doctors/DoctorPatientBillingPage";
import DoctorPatientDetailsEditPage from "../pages/doctors/DoctorPatientDetailsEditPage";
import DoctorPatientMedicalAssessmentEditPage from "../pages/doctors/DoctorPatientMedicalAssessmentEditPage";
import DoctorPatientTreatmentEditPage from "../pages/doctors/DoctorPatientTreatmentEditPage";
import DoctorPatientBillingEditPage from "../pages/doctors/DoctorPatientBillingEditPage";
import CreatePrescriptionPage from "../pages/doctors/CreatePrescriptionPage";
import { CancelAppointmentPopup } from "../pages/doctors/CancelAppointmentPopupPage";
import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import AppointmentsFollowUpsPage from "../pages/appointments/AppointmentsFollowUpsPage";
import { AppointmentsCalendarPage } from "../pages/appointments/AppointmentsCalendarPage";
import ScheduledAppointmentPopupPage from "../pages/appointments/ScheduledAppointmentPopupPage";
import BookAppointmentStep1Page from "../pages/appointments/BookAppointmentStep1Page";
import BookAppointmentStep2Page from "../pages/appointments/BookAppointmentStep2Page";
import BookAppointmentStep3Page from "../pages/appointments/BookAppointmentStep3Page";
import ConfirmBookingPopupPage from "../pages/appointments/ConfirmBookingPopupPage";
import TreatmentsPage, { TreatmentDetailPage } from "../pages/treatments/TreatmentsPage";
import MedicinesPage from "../pages/medicines/MedicinesPage";
import AddMedicinePopupPage from "../pages/medicines/AddMedicinePopupPage";
import AddMedicineConfirmPopupPage from "../pages/medicines/AddMedicineConfirmPopupPage";
import SalesPage from "../pages/sales/SalesPage";
import ActivityLogPage from "../pages/activity/ActivityLogPage";
import BillingPage, { BillingFlowPage } from "../pages/billing/BillingPage";
import BillingServicePage from "../pages/billing/BillingServicePage";
import BillingMedicinePage from "../pages/billing/BillingMedicinePage";
import BillingTherapyPage from "../pages/billing/BillingTherapyPage";
import BillingSummaryPage from "../pages/billing/BillingSummaryPage";
import SettingsPage, { UserManagementPage } from "../pages/settings/SettingsPage";
import ClinicSettingsPage from "../pages/settings/ClinicSettingsPage";
import RoleManagementPage from "../pages/settings/RoleManagementPage";
import AddUserPopupPage from "../pages/settings/AddUserPopupPage";
import AddRolePopupPage from "../pages/settings/AddRolePopupPage";
import SystemPreferencesPage from "../pages/settings/SystemPreferencesPage";
import {
  AppointmentCancelledToast,
  BillDownloadPage,
  ChangePasswordPage,
  DeleteMedicinePopup,
  ErrorPage,
  FollowUpPopup,
  LogoutPopup,
  MyProfilePage,
  OfferPopup,
  PrescriptionDownloadPage,
  ProfileDropdownPage,
  UploadDocumentPage,
} from "../pages/modals/ModalsPages";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },

  // Dashboard & profile
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/dashboard/profile-dropdown", element: <ProfileDropdownPage /> },
  { path: "/dashboard/offer-popup", element: <OfferPopup /> },
  { path: "/dashboard/logout-popup", element: <LogoutPopup /> },
  { path: "/my-profile", element: <MyProfilePage /> },
  { path: "/change-password", element: <ChangePasswordPage /> },
  { path: "/change-password/success", element: <ChangePasswordPage success /> },

  // Patients
  { path: "/patients", element: <PatientsPage /> },
  { path: "/patients/inactive", element: <InactivePatientsPage /> },
  { path: "/patients/details-1", element: <PatientDetailsPage /> },
  { path: "/patients/details-2", element: <PatientDetailsPage /> },
  { path: "/patients/details-3", element: <PatientDetailsPage /> },
  { path: "/patients/details-4", element: <PatientDetailsPage /> },
  { path: "/patients/bill-download", element: <BillDownloadPage /> },
  { path: "/patients/upload-document", element: <UploadDocumentPage /> },

  // Doctors
  { path: "/doctors", element: <DoctorsPage /> },
  { path: "/doctors/1", element: <DoctorPatientDetailsPage /> },
  { path: "/doctors/1/edit", element: <DoctorPatientDetailsEditPage /> },
  { path: "/doctors/1/medical-assessment", element: <DoctorPatientMedicalAssessmentPage /> },
  { path: "/doctors/1/medical-assessment/edit", element: <DoctorPatientMedicalAssessmentEditPage /> },
  { path: "/doctors/1/treatment", element: <DoctorPatientTreatmentPage /> },
  { path: "/doctors/1/treatment/edit", element: <DoctorPatientTreatmentEditPage /> },
  { path: "/doctors/1/billing", element: <DoctorPatientBillingPage /> },
  { path: "/doctors/1/billing/edit", element: <DoctorPatientBillingEditPage /> },
  { path: "/doctors/2", element: <DoctorDetailPage variant={2} /> },
  { path: "/doctors/3", element: <DoctorDetailPage variant={3} editable={false} /> },
  { path: "/doctors/3/edit", element: <DoctorDetailPage variant={3} editable /> },
  { path: "/doctors/3/edit-male", element: <DoctorDetailPage variant={3} editable /> },
  { path: "/doctors/3/edit-female", element: <DoctorDetailPage variant={3} editable /> },
  { path: "/doctors/4", element: <DoctorDetailPage variant={4} /> },
  { path: "/doctors/4/edit", element: <DoctorDetailPage variant={4} editable /> },
  { path: "/doctors/5", element: <DoctorDetailPage variant={5} /> },
  { path: "/doctors/5/edit", element: <DoctorDetailPage variant={5} editable /> },
  { path: "/doctors/6", element: <DoctorDetailPage variant={6} /> },
  { path: "/doctors/2/edit", element: <DoctorDetailPage variant={2} editable /> },
  { path: "/doctors/schedule", element: <DoctorDetailPage variant={2} /> },
  { path: "/doctors/prescription/create", element: <CreatePrescriptionPage /> },
  { path: "/doctors/prescription/download", element: <PrescriptionDownloadPage /> },
  { path: "/doctors/patient-details-changed", element: <DoctorDetailPage variant={6} editable /> },
  { path: "/doctors/cancel-appointment", element: <CancelAppointmentPopup /> },

  // Appointments
  { path: "/appointments", element: <AppointmentsPage /> },
  { path: "/appointments/follow-ups", element: <AppointmentsFollowUpsPage /> },
  { path: "/appointments/grid-2", element: <AppointmentsPage /> },
  { path: "/appointments/calendar", element: <AppointmentsCalendarPage /> },
  { path: "/appointments/cancel", element: <CancelAppointmentPopup /> },
  { path: "/appointments/cancelled", element: <AppointmentCancelledToast /> },
  { path: "/appointments/follow-up", element: <FollowUpPopup /> },
  { path: "/appointments/schedule", element: <ScheduledAppointmentPopupPage /> },
  { path: "/appointments/create-patient", element: <BookAppointmentStep1Page /> },
  { path: "/appointments/create-patient/step-2", element: <BookAppointmentStep2Page /> },
  { path: "/appointments/create-patient/step-3", element: <BookAppointmentStep3Page /> },
  { path: "/appointments/confirm-booking", element: <ConfirmBookingPopupPage /> },

  // Treatments
  { path: "/treatments", element: <TreatmentsPage /> },
  { path: "/treatments/2", element: <TreatmentDetailPage variant={2} /> },
  { path: "/treatments/3", element: <TreatmentDetailPage variant={3} /> },
  { path: "/treatments/4", element: <TreatmentDetailPage variant={4} /> },
  { path: "/treatments/5", element: <TreatmentDetailPage variant={5} /> },

  // Medicines
  { path: "/medicines", element: <MedicinesPage /> },
  { path: "/medicines/2", element: <MedicinesPage /> },
  { path: "/medicines/add", element: <AddMedicinePopupPage /> },
  { path: "/medicines/add/confirm", element: <AddMedicineConfirmPopupPage /> },
  { path: "/medicines/delete", element: <DeleteMedicinePopup /> },

  // Sales & Activity
  { path: "/sales", element: <SalesPage /> },
  { path: "/activity-log", element: <ActivityLogPage /> },

  // Billing
  { path: "/billing", element: <BillingPage /> },
  { path: "/billing/service", element: <BillingServicePage /> },
  { path: "/billing/medicine", element: <BillingMedicinePage /> },
  { path: "/billing/therapy", element: <BillingTherapyPage /> },
  { path: "/billing/summary", element: <BillingSummaryPage /> },
  { path: "/billing/final", element: <BillingFlowPage step="final" /> },
  { path: "/billing/confirm", element: <BillingFlowPage step="popup" /> },
  { path: "/billing/invoice", element: <BillingFlowPage step="invoice" /> },

  // Settings
  { path: "/settings", element: <SettingsPage /> },
  { path: "/settings/clinic", element: <ClinicSettingsPage /> },
  { path: "/settings/clinic/saved", element: <ClinicSettingsPage showToast /> },
  { path: "/settings/clinic/delete", element: <ClinicSettingsPage showDeletePopup /> },
  { path: "/settings/users", element: <UserManagementPage /> },
  { path: "/settings/users/new", element: <AddUserPopupPage /> },
  { path: "/settings/users/role-change", element: <UserManagementPage showRolePopup /> },
  { path: "/settings/roles", element: <RoleManagementPage /> },
  { path: "/settings/roles/edit", element: <AddRolePopupPage /> },
  { path: "/settings/preferences", element: <SystemPreferencesPage /> },

  // Error
  { path: "/error", element: <ErrorPage /> },
  { path: "*", element: <ErrorPage /> },
]);
