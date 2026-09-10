import { apiConfig } from './config';
import { apiRequest } from './client';
import { apiEndpoints } from './endpoints';
import { getDashboardBillingSummary } from './billing';

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

export function getAppointmentStats() {
  return apiRequest<AppointmentStatsDto>(
    appointmentUrl(apiEndpoints.appointments.bookings.getStats),
  );
}

export { getDashboardBillingSummary };
