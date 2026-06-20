import type {
  DashboardStats,
  LowStockItem,
  ScheduleAppointment,
} from '@/types';
import { allPatients } from './patients';

export const dashboardStats: DashboardStats = {
  totalPatients: 1000,
  patientGrowth: 20,
  patientsToday: 100,
  activePatients: 200,
  inactivePatients: 800,
  totalAppointments: 1000,
  appointmentGrowth: 20,
  appointmentsToday: 100,
  billingTotal: 450492,
  billsGenerated: 12,
  pendingPayments: 228000,
  collectedPayments: 228000,
};

export const patientTrendsData = [
  { month: 'Sep', newPatients: 120, followUps: 80 },
  { month: 'Oct', newPatients: 800, followUps: 150 },
  { month: 'Nov', newPatients: 180, followUps: 120 },
  { month: 'Dec', newPatients: 220, followUps: 140 },
];

export const patientTrendsFullYear = [
  { month: 'Jan', newPatients: 80, followUps: 40 },
  { month: 'Feb', newPatients: 95, followUps: 55 },
  { month: 'Mar', newPatients: 110, followUps: 60 },
  { month: 'Apr', newPatients: 130, followUps: 70 },
  { month: 'May', newPatients: 150, followUps: 85 },
  { month: 'Jun', newPatients: 140, followUps: 75 },
  { month: 'Jul', newPatients: 160, followUps: 90 },
  { month: 'Aug', newPatients: 170, followUps: 95 },
  { month: 'Sep', newPatients: 120, followUps: 80 },
  { month: 'Oct', newPatients: 800, followUps: 150 },
  { month: 'Nov', newPatients: 180, followUps: 120 },
  { month: 'Dec', newPatients: 220, followUps: 140 },
];

export const lowStockItems: LowStockItem[] = [
  { name: 'Tab OCRIS 200', quantity: 3 },
  { name: 'Syrup Ashwagandha', quantity: 5 },
  { name: 'Powder Triphala', quantity: 2 },
];

export const ongoingAppointment: ScheduleAppointment = {
  patientName: 'Rahul Patel',
  time: '01:05 AM',
  reason: 'Back Pain Consultation',
};

export const nextAppointment: ScheduleAppointment = {
  patientName: 'Rahul Patel',
  time: '02:30 AM',
  reason: 'Back Pain Consultation',
};

export const recentPatientRecords = allPatients.slice(0, 4);
