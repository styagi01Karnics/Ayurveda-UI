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
  detailId: string;
  name: string;
  phone: string;
  doctor: string;
  visitType: VisitType;
  appointmentDate: string;
  dosha: Dosha;
  status: PatientStatus;
  isActive: boolean;
}

export interface PatientPersonalInfo {
  gender: string;
  age: string;
  dob: string;
  serviceType: string;
  registrationDate: string;
  assignedDoctor: string;
  therapyDuration: string;
  email: string;
  city: string;
  state: string;
  address: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  idProofType: string;
  idProofNumber: string;
  occupation: string;
  insuranceDetails: string;
}

export interface PatientMedicalAssessment {
  bodyConstitution: string;
  currentImbalance: string;
  previousPanchakarma: string;
  weight: string;
  height: string;
  ibw: string;
  pulse: string;
  bp: string;
  pallor: string;
  temperature: string;
  acidityGas: string;
  oedema: string;
  sensorium: string;
  icterus: string;
  cyanosis: string;
  motion: string;
  micturition: string;
  lymphNodes: string;
  presentConditions: string;
  pastConditions: string;
  pastSurgeries: string;
  currentMedication: string;
  allergies: string;
  familyHistory: string;
  diet: string;
  sleep: string;
  exercise: string;
  reports: { name: string; size: string; time: string; type: 'folder' | 'file' }[];
}

export interface PatientTreatmentFollowUp {
  treatmentName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  sessionsCompleted: number;
  remainingSessions: number;
  assignedTherapist: string;
  nextFollowUp: string;
  followUpDoctor: string;
  reminder: string;
  appointmentHistory: {
    visitType: VisitType;
    date: string;
    status: PatientStatus;
  }[];
}

export interface PatientBillingMembership {
  packageName: string;
  validity: string;
  membershipStatus: PatientStatus;
  discountApplied: number;
  registrationFees: number;
  paymentMode: string;
  partialPayment: string;
  outstandingAmount: number;
  serviceType: string;
  serviceFees: number;
  packageType: string;
  packageCharges: number;
  discount: number;
  taxRate: string;
}

export interface PatientInvoice {
  clinicName: string;
  gstNo: string;
  doctorName: string;
  doctorCredentials: string;
  workingHours: string;
  doctorPhone: string;
  invoiceNo: string;
  invoiceDate: string;
  paymentMode: string;
  amountDue: number;
  items: { detail: string; description: string; amount: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  total: number;
  conditions: string;
  address: string;
  email: string;
  website: string;
}

export interface PatientDetail extends PatientRecord {
  treatmentStatus: 'Under Treatment' | 'Discharged' | 'Pending';
  personalInfo: PatientPersonalInfo;
  medicalAssessment: PatientMedicalAssessment;
  treatmentFollowUp: PatientTreatmentFollowUp;
  billing: PatientBillingMembership;
  invoice: PatientInvoice;
}

export interface DoctorScheduleItem {
  id: string;
  time: string;
  patient: string;
  patientDetailId: string;
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
