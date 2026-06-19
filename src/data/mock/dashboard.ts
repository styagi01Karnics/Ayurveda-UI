import type {
  DashboardStats,
  LowStockItem,
  PatientRecord,
  ScheduleAppointment,
} from '@/types';

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

export const recentPatientRecords: PatientRecord[] = [
  {
    id: '#PT458652',
    secondaryId: 'GAN2025-0129',
    name: 'Khushi Shroff',
    phone: '+91-9205061339',
    doctor: 'Dr. Sheekha',
    visitType: 'Consultation',
    appointmentDate: '15 Oct 2026, 01:05 AM',
    dosha: 'Vata',
    status: 'Completed',
    isActive: true,
  },
  {
    id: '#PT458653',
    secondaryId: 'GAN2025-0130',
    name: 'Amit Verma',
    phone: '+91-9876543210',
    doctor: 'Dr. Sharma',
    visitType: 'Follow-Up',
    appointmentDate: '14 Oct 2026, 11:30 AM',
    dosha: 'Pitta',
    status: 'Pending',
    isActive: true,
  },
  {
    id: '#PT458654',
    secondaryId: 'GAN2025-0131',
    name: 'Priya Nair',
    phone: '+91-9123456789',
    doctor: 'Dr. Sheekha',
    visitType: 'Consultation',
    appointmentDate: '13 Oct 2026, 04:15 PM',
    dosha: 'Kapha',
    status: 'Completed',
    isActive: false,
  },
  {
    id: '#PT458655',
    secondaryId: 'GAN2025-0132',
    name: 'Rahul Patel',
    phone: '+91-9988776655',
    doctor: 'Dr. Gupta',
    visitType: 'Treatment',
    appointmentDate: '12 Oct 2026, 09:00 AM',
    dosha: 'Vata',
    status: 'Follow-Up',
    isActive: true,
  },
];
