import { apiConfig } from './config';
import { apiRequest } from './client';
import { apiEndpoints } from './endpoints';
import { getDashboardBillingSummary, type BillingPeriod } from './billing';

const medicineUrl = (path: string) => `${apiConfig.medicine}${path}`;
const appointmentUrl = (path: string) => `${apiConfig.appointment}${path}`;
const ep = apiEndpoints.dashboard;
const scheduleEp = apiEndpoints.appointments.schedule;

export interface DashboardLowStockItem {
  id: string;
  medicineName: string;
  category: string;
  stockQuantity: number;
  stockStatus?: string;
}

export interface DashboardMedicineStockResponse {
  totalStock: number;
  tablets: number;
  syrups: number;
  powder: number;
  statusBreakdown?: {
    inStock: number;
    outOfStock: number;
    lowStock: number;
  };
  lowStockItems: DashboardLowStockItem[];
}

export interface ScheduleAppointmentDto {
  bookingId?: string;
  patientId?: string;
  patientName?: string;
  serviceType?: string;
  bookingStatus?: string;
  slotTime?: string;
}

export interface TodaysScheduleDto {
  date: string;
  currentDateTime: string;
  ongoingAppointment?: ScheduleAppointmentDto | null;
  nextAppointment?: ScheduleAppointmentDto | null;
  remainingToday?: number;
}

export interface AppointmentStatsDto {
  currentMonthAppointmentCount?: number;
  completedCount?: number;
  ongoingCount?: number;
  todayAppointmentCount?: number;
  totalAppointments?: number;
  scheduledCount?: number;
  cancelledCount?: number;
  inConsultationCount?: number;
  rescheduledCount?: number;
  [key: string]: unknown;
}

export function getDashboardMedicineStock(lowStockLimit = 5) {
  return apiRequest<DashboardMedicineStockResponse>(
    medicineUrl(`${ep.medicineStock}?lowStockLimit=${lowStockLimit}`),
  );
}

export function getTodaysSchedule(doctorId?: string) {
  const qs = doctorId ? `?doctorId=${encodeURIComponent(doctorId)}` : '';
  return apiRequest<TodaysScheduleDto>(
    appointmentUrl(`${scheduleEp.todaysSchedule}${qs}`),
  );
}

export function getAppointmentStats(period?: string, doctorId?: string) {
  const params = new URLSearchParams();
  if (period) params.set('period', period);
  if (doctorId) params.set('doctorId', doctorId);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<AppointmentStatsDto>(
    appointmentUrl(`${apiEndpoints.appointments.bookings.getStats}${qs}`),
  );
}

export interface PatientTrendPointDto {
  month?: string;
  monthLabel?: string;
  newPatients?: number;
  followUps?: number;
  [key: string]: unknown;
}

export function getPatientTrends(doctorId?: string) {
  const qs = doctorId ? `?doctorId=${encodeURIComponent(doctorId)}` : '';
  return apiRequest<{ points?: PatientTrendPointDto[] }>(
    appointmentUrl(`${apiEndpoints.dashboard.patientTrends}${qs}`),
  ).then((res) => res?.points ?? []);
}

export function getDoctorPatientCount(doctorId: string, period?: BillingPeriod) {
  const params = new URLSearchParams({ doctorId });
  if (period) params.set('period', period);
  return apiRequest<{ totalPatients: number }>(
    appointmentUrl(`${apiEndpoints.dashboard.doctorPatientCount}?${params.toString()}`),
  );
}

export { getDashboardBillingSummary };
