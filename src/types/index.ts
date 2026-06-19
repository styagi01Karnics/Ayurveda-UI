export type Dosha = 'Vata' | 'Pitta' | 'Kapha';

export type PatientStatus =
  | 'Completed'
  | 'Pending'
  | 'Cancelled'
  | 'Follow-Up'
  | 'Scheduled'
  | 'Upcoming'
  | 'Missed';

export type VisitType = 'Consultation' | 'Follow-Up' | 'Treatment' | 'Therapy';

export interface PatientRecord {
  id: string;
  secondaryId: string;
  name: string;
  phone: string;
  doctor: string;
  visitType: VisitType;
  appointmentDate: string;
  dosha: Dosha;
  status: PatientStatus;
  isActive: boolean;
}

export interface DoctorScheduleItem {
  id: string;
  time: string;
  patient: string;
  visitType: VisitType;
  status: 'Scheduled' | 'Completed';
}

export interface DoctorStats {
  totalPatients: number;
  completedPatients: number;
  ongoingPatients: number;
  activeTreatmentPlans: number;
  completedTreatmentPlans: number;
  ongoingTreatmentPlans: number;
  completedTreatments: number;
  consultationCount: number;
  therapyCount: number;
  followUpsDue: number;
  followUpsScheduled: number;
  followUpsPending: number;
}

export interface AppointmentRecord {
  id: string;
  uhid: string;
  patient: string;
  doctor: string;
  visitType: VisitType;
  appointmentDate: string;
  dateCreated: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface FollowUpRecord {
  id: string;
  uhid: string;
  patient: string;
  doctor: string;
  visitType: VisitType;
  appointmentDate: string;
  dateCreated: string;
  status: 'Upcoming' | 'Missed' | 'Completed';
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  startHour: number;
  durationHours: number;
  color: string;
}

export interface DashboardStats {
  totalPatients: number;
  patientGrowth: number;
  patientsToday: number;
  activePatients: number;
  inactivePatients: number;
  totalAppointments: number;
  appointmentGrowth: number;
  appointmentsToday: number;
  billingTotal: number;
  billsGenerated: number;
  pendingPayments: number;
  collectedPayments: number;
}

export interface ScheduleAppointment {
  patientName: string;
  time: string;
  reason: string;
}

export interface LowStockItem {
  name: string;
  quantity: number;
}

export interface AuthUser {
  fullName: string;
  role: string;
  email: string;
}

export interface SignupFormData {
  clinicName: string;
  clinicType: string;
  state: string;
  city: string;
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
  registrationNumber: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  userId: string;
  password: string;
  confirmPassword: string;
}
