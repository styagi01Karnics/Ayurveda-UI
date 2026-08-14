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
  bookingId: string;
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
  doshaName?: string;
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
  addiction?: string;
  cardiovascular?: string;
  respiratory?: string;
  nervous?: string;
  abdomenGi?: string;
  locomotor?: string;
  investigationPlan?: string;
  planTaken?: string;
  reports: { name: string; size: string; time: string; type: 'folder' | 'file' }[];
}

export interface PatientTreatmentFollowUp {
  treatmentPlanId?: string;
  assignedTherapistId?: string;
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

/** Populated from GET /api/v1/invoices/{invoiceId} for bill download modal. */
export interface BillInvoiceView {
  patientName: string;
  patientId: string;
  contactNumber: string;
  invoice: PatientInvoice;
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
  status: 'Scheduled' | 'Completed' | 'In Consultation';
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

/** Doctor directory row mapped from the doctors API. */
export interface DoctorDirectoryRecord {
  id: string;
  doctorCode: string;
  name: string;
  specialization: string;
  qualification: string;
  department: string;
  consultationRoom: string;
  mobileNumber: string;
  email: string;
  status: ClinicStatus;
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
  patientId?: string;
  assignedDoctorId?: string;
  registrationDate?: string;
  slotTime?: string;
  consultationTypes?: string[];
}

export interface FollowUpRecord {
  id: string;
  uhid: string;
  patient: string;
  doctor: string;
  visitType: VisitType;
  appointmentDate: string;
  dateCreated: string;
  status: 'Upcoming' | 'Missed' | 'Completed' | 'Cancelled';
}

export interface CalendarEvent {
  id: string;
  title: string;
  /** Column index 0–6 within the displayed week (Sun–Sat). */
  day: number;
  startHour: number;
  startMinute?: number;
  timeLabel?: string;
  durationHours: number;
  color: string;
}

export interface CalendarEventDetail {
  id: string;
  title: string;
  appointmentDate: string;
  doctorName: string;
  doctorRole: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  visitType: string;
  dosha: string;
  condition: string;
  lastVisit: string;
  nextVisit: string;
}

export interface TreatmentRecord {
  id: string;
  patient: string;
  patientDetailId: string;
  treatmentPlanName: string;
  treatmentCategory: string;
  therapyType: string;
  assignedTherapist: string;
  therapistSchedule: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  status: 'Scheduled' | 'Ongoing' | 'Completed';
  dateCreated: string;
}

export type MedicineStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface MedicineRecord {
  id: string;
  name: string;
  category: string;
  categoryCode: string;
  stockQuantity: number;
  expiryDate: string;
  price: number;
  status: MedicineStatus;
  manufacturer?: string;
  batchNumber?: string;
  purchasePrice?: number;
  lowStockThreshold?: number;
  lowStockAlertEnabled?: boolean;
}

export type BillingStatus = 'Ongoing' | 'Completed';

export interface BillingRecord {
  /** Invoice UUID for GET /api/v1/invoices/{id}. */
  id: string;
  /** Display invoice number, e.g. INV-1002. */
  invoiceId: string;
  patientId: string;
  secondaryPatientId: string;
  /** Patient master UUID from billing API — use for GET /patients. */
  patientUuid?: string;
  invoiceDate: string;
  totalAmount: number;
  paidAmount: number;
  leftAmount: number;
  status: BillingStatus;
}

export interface SalesInvoiceRecord {
  id: string;
  invoiceId: string;
  invoiceDate: string;
  treatmentCategory: string;
  serviceType: string;
  totalAmount: number;
}

export interface SalesStats {
  totalPatients: number;
  patientsCompleted: number;
  patientsOngoing: number;
  appointmentsThisMonth: number;
  appointmentsCompleted: number;
  appointmentsOngoing: number;
  revenueThisMonth: number;
  revenuePeriod: string;
  completedTreatments: number;
}

export type ActivityLogAction = 'Viewed' | 'Created' | 'Updated' | 'Deleted';

export interface ActivityLogRecord {
  id: string;
  page: string;
  action: ActivityLogAction;
  target: string;
  before: string;
  after: string;
  timestamp: string;
}

export type InvoiceBillType = 'service' | 'medicine' | 'therapy';

/** @deprecated Use InvoiceBillType — summary tab removed; each bill tab has its own summary */
export type InvoiceStep = InvoiceBillType;

export interface InvoiceLineItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  type: InvoiceBillType;
  /** Medicine-service UUID — required for POST /api/v1/invoices medicines[]. */
  medicineId?: string;
  /** Therapist-service UUID — required for therapy line items. */
  assignedTherapistId?: string;
}

export interface TherapyInvoiceLineItem extends InvoiceLineItem {
  type: 'therapy';
  assignedTherapist: string;
  assignedTherapistId?: string;
  scheduleDate: string;
  scheduleTime: string;
  sessionDuration: string;
  sessionFrequency: string;
}

export interface BillSummaryState {
  discount: string;
  applyTax: boolean;
  cgst: string;
  sgst: string;
}

export type PaymentModeId = 'upi' | 'card' | 'wallet' | 'partial' | 'emi';

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
  id?: string;
  fullName: string;
  role: string;
  email: string;
  username?: string;
  tenantId?: string;
  tenantCode?: string;
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

export type SettingsTab = 'clinic' | 'users' | 'roles' | 'system';

export type ClinicStatus = 'Active' | 'Inactive';

export interface ClinicDoctorRecord {
  id: string;
  name: string;
  specialization: string;
  status: ClinicStatus;
  consultationFees: number;
  followUpFees: number;
  availability: string;
}

export interface ClinicTherapyRecord {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  duration: string;
  price: number;
  description: string;
  status: ClinicStatus;
}

export interface ClinicTreatmentCategoryRecord {
  id: string;
  name: string;
  description: string;
}

export interface ClinicConsultationTypeRecord {
  id: string;
  name: string;
  status: ClinicStatus;
}

export interface ClinicTreatmentPlanMasterRecord {
  id: string;
  name: string;
  status: ClinicStatus;
}

export interface ClinicPackageMasterRecord {
  id: string;
  name: string;
  packagePrice: number;
  status: ClinicStatus;
}

export interface ClinicTherapistRecord {
  id: string;
  name: string;
  status: ClinicStatus;
  assignedTherapies: string[];
}

export type UserStatus = 'Active' | 'Inactive';

export interface SettingsUserRecord {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  status: UserStatus;
  assignedRole: string;
}

export interface SettingsRoleRecord {
  id: string;
  name: string;
  status: ClinicStatus;
  accessLevel: string;
  permissions: string[];
  userCount: number;
}

export interface SystemPreferences {
  appointmentSms: boolean;
  appointmentWhatsapp: boolean;
  appointmentEmail: boolean;
  billingGst: boolean;
  billingPartialPayment: boolean;
  notificationAppointmentReminder: boolean;
  notificationFollowUpReminder: boolean;
}
