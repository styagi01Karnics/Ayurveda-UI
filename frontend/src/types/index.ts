export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
  avatarUrl?: string;
  active: boolean;
}

export interface Patient {
  id: number;
  patientId: string;
  ganId: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dosha?: 'VATA' | 'PITTA' | 'KAPHA' | 'VATA_PITTA' | 'PITTA_KAPHA' | 'VATA_KAPHA' | 'TRIDOSHA';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization?: string;
  qualification?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  available: boolean;
  createdAt?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId?: number;
  doctorName?: string;
  appointmentDate: string;
  visitType: 'CONSULTATION' | 'FOLLOW_UP' | 'TREATMENT' | 'PANCHAKARMA';
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING' | 'FOLLOW_UP';
  notes?: string;
  chiefComplaint?: string;
  createdAt?: string;
}

export interface Medicine {
  id: number;
  name: string;
  type: 'TABLET' | 'SYRUP' | 'POWDER' | 'OIL' | 'CAPSULE' | 'CHURNA' | 'KADHA';
  quantity: number;
  lowStockThreshold: number;
  price?: number;
  manufacturer?: string;
  batchNumber?: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  createdAt?: string;
}

export interface Bill {
  id: number;
  billNumber: string;
  patientId?: number;
  patientName?: string;
  appointmentId?: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  paymentMode?: string;
  paidAt?: string;
  createdAt?: string;
}

export interface Treatment {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId?: number;
  doctorName?: string;
  treatmentType: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: 'ONGOING' | 'COMPLETED' | 'PAUSED';
  medicines?: string;
  notes?: string;
  createdAt?: string;
}

export interface ActivityLog {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: string;
  createdAt: string;
}

export interface LowStockMedicine {
  id: number;
  name: string;
  quantity: number;
  type: string;
}

export interface RecentPatientRecord {
  patientId: string;
  ganId: string;
  patientName: string;
  phone?: string;
  doctorName?: string;
  visitType?: string;
  appointmentDate?: string;
  dosha?: string;
  status?: string;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  newPatientsToday: number;
  totalAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  followUpAppointments: number;
  totalBilling: number;
  pendingPayments: number;
  collectedPayments: number;
  totalBillsGenerated: number;
  totalMedicines: number;
  tablets: number;
  syrups: number;
  powders: number;
  recentPatientRecords: RecentPatientRecord[];
  lowStockMedicines: LowStockMedicine[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  message: string;
  status: number;
}
