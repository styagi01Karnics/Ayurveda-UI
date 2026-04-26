import { RecentPatientRecord, LowStockMedicine, DashboardStats } from '../types';

export const MOCK_SCHEDULE = [
  { patientName: 'Rahul Patel',  phone: '+91-9876543210', complaint: 'Back Pain',        time: '10:30 AM', type: 'Consultation' },
  { patientName: 'Priya Sharma', phone: '+91-9205061331', complaint: 'Digestion Issues', time: '11:15 AM', type: 'Follow Up'    },
];

export const MOCK_RECENT_RECORDS: RecentPatientRecord[] = [
  { patientId: 'PT458653', ganId: 'GAN2025-001', patientName: 'Khushi Shroff',  phone: '+91-9205061331', doctorName: 'Dr. Sheekha Verma', visitType: 'CONSULTATION', appointmentDate: '2025-04-24T09:00', dosha: 'Vata',       status: 'COMPLETED' },
  { patientId: 'PT458654', ganId: 'GAN2025-002', patientName: 'Rahul Patel',    phone: '+91-9205061332', doctorName: 'Dr. Arjun Mehta',   visitType: 'FOLLOW_UP',    appointmentDate: '2025-04-24T10:30', dosha: 'Pitta',      status: 'CONFIRMED' },
  { patientId: 'PT458655', ganId: 'GAN2025-003', patientName: 'Priya Sharma',   phone: '+91-9205061333', doctorName: 'Dr. Sheekha Verma', visitType: 'CONSULTATION', appointmentDate: '2025-04-24T11:00', dosha: 'Kapha',      status: 'PENDING'   },
  { patientId: 'PT458656', ganId: 'GAN2025-004', patientName: 'Amit Kumar',     phone: '+91-9205061334', doctorName: 'Dr. Arjun Mehta',   visitType: 'TREATMENT',    appointmentDate: '2025-04-24T12:00', dosha: 'Vata-Pitta', status: 'COMPLETED' },
  { patientId: 'PT458657', ganId: 'GAN2025-005', patientName: 'Sneha Gupta',    phone: '+91-9205061335', doctorName: 'Dr. Sheekha Verma', visitType: 'FOLLOW_UP',    appointmentDate: '2025-04-24T14:00', dosha: 'Pitta',      status: 'CONFIRMED' },
];

export const MOCK_LOW_STOCK: LowStockMedicine[] = [
  { id: 1, name: 'Tab OCRIS 200',  type: 'TABLET', quantity: 3 },
  { id: 2, name: 'Neem Powder',    type: 'POWDER', quantity: 5 },
  { id: 3, name: 'Dashmool Kadha', type: 'KADHA',  quantity: 8 },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalPatients: 1000, activePatients: 200, inactivePatients: 800, newPatientsToday: 100,
  totalAppointments: 1000, confirmedAppointments: 600, cancelledAppointments: 200, followUpAppointments: 200,
  totalBilling: 450492, pendingPayments: 228000, collectedPayments: 222492, totalBillsGenerated: 12,
  totalMedicines: 442, tablets: 300, syrups: 100, powders: 42,
  recentPatientRecords: MOCK_RECENT_RECORDS,
  lowStockMedicines: MOCK_LOW_STOCK,
};
