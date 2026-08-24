import type { CreatePatientValues } from '@/lib/validation/patient.schema';
import type {
  AppointmentDto,
  AppointmentStatsDto,
  AppointmentTherapyDto,
  ConsultationTypeRef,
  CreateMedicalAssessmentPayload,
  DoctorDto,
  MedicineDto,
  MedicalAssessmentDto,
  MedicalAssessmentDocuments,
  PatientAppointmentListItemDto,
  PatientDto,
  TherapistDto,
  FollowUpDto,
  TreatmentDto,
  TherapyDto,
  TodayAppointmentItemDto,
  TreatmentCategoryDto,
} from '@/lib/api/types';
import type { InvoiceDto, InvoiceListItemDto } from '@/lib/api/billing';
import type { BillDoctorDetails } from '@/lib/api/loadBillInvoice';
import { CLINIC_BRANDING, formatBillDate } from '@/lib/clinicBranding';
import { parseScheduleDateTime } from '@/lib/appointmentAlerts';
import { normalizeBookingTimeForSelect } from '@/lib/bookingConstraints';
import {
  resolveCalendarEventTitle,
} from '@/lib/calendarEventAvatars';
import type {
  AppointmentRecord,
  BillInvoiceView,
  CalendarEvent,
  CalendarEventDetail,
  ClinicDoctorRecord,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  ClinicTreatmentCategoryRecord,
  DoctorDirectoryRecord,
  DoctorScheduleItem,
  DoctorStats,
  Dosha,
  MedicineRecord,
  MedicineStatus,
  PatientDetail,
  PatientRecord,
  PatientStatus,
  FollowUpRecord,
  TreatmentRecord,
  VisitType,
} from '@/types';
import type { PatientPackageDto } from '@/lib/api/types';

function titleCase(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(/[\s_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDisplayDate(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDisplayDateTime(date?: string | null, time?: string | null): string {
  if (!date && !time) return '—';

  if (date?.includes('T')) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  if (date && time) {
    const combined = new Date(`${date.slice(0, 10)}T${normalizeSlotTimeForDisplay(time)}`);
    if (!Number.isNaN(combined.getTime())) {
      return combined.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return `${date}, ${time}`;
  }
  return formatDisplayDate(date);
}

function normalizeSlotTimeForDisplay(time: string): string {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return time;
}

function splitIsoDateTime(value?: string | null): { date: string; time: string } | null {
  if (!value?.includes('T')) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    date: value.slice(0, 10),
    time: value.slice(11, 19) || '09:00:00',
  };
}

function extractConsultationTypeNames(
  types?: ConsultationTypeRef[] | string[] | null,
): string[] {
  if (!types?.length) return [];
  return types.map((type) =>
    typeof type === 'string' ? type : type.name,
  );
}

function extractConsultationTypeIds(
  types?: ConsultationTypeRef[] | string[] | null,
): string[] {
  if (!types?.length) return [];
  return types.map((type) => (typeof type === 'string' ? type : type.id));
}

function normalizeVisitType(
  raw?: string | string[] | ConsultationTypeRef[] | null,
): VisitType {
  const names = extractConsultationTypeNames(
    Array.isArray(raw) ? raw : raw ? [raw] : null,
  );
  const value = names[0];
  if (!value) return 'Consultation';
  const upper = value.toUpperCase();
  if (upper.includes('THERAPY')) return 'Therapy';
  if (upper.includes('FOLLOW')) return 'Follow-Up';
  if (upper.includes('TREATMENT')) return 'Treatment';
  return 'Consultation';
}

function normalizeAppointmentStatus(
  raw?: string | null,
): AppointmentRecord['status'] {
  const value = (raw ?? 'SCHEDULED').toUpperCase();
  if (value.includes('COMPLETE')) return 'Completed';
  if (value.includes('CANCEL')) return 'Cancelled';
  return 'Scheduled';
}

function normalizeTreatmentStatus(
  raw?: string | null,
): TreatmentRecord['status'] {
  const value = (raw ?? 'ONGOING').toUpperCase();
  if (value.includes('COMPLETE')) return 'Completed';
  if (value.includes('SCHEDULE')) return 'Scheduled';
  return 'Ongoing';
}

function formatIsoDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapFollowUpVisitType(dto: FollowUpDto): VisitType {
  const name = dto.visitTypeName ?? '';
  if (name.toUpperCase().includes('THERAPY')) return 'Therapy';
  return 'Consultation';
}

function mapFollowUpStatus(
  raw?: string | null,
): import('@/types').FollowUpRecord['status'] {
  switch ((raw ?? 'UPCOMING').toUpperCase()) {
    case 'MISSED':
      return 'Missed';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Upcoming';
  }
}

function pickDosha(name?: string | null): Dosha {
  const value = (name ?? '').toLowerCase();
  if (value.includes('pitta')) return 'Pitta';
  if (value.includes('kapha')) return 'Kapha';
  return 'Vata';
}

export function mapPatientToRecord(
  patient: PatientDto,
  extras?: Partial<PatientRecord>,
): PatientRecord {
  const code =
    patient.patientDisplayId ??
    patient.patientCode ??
    patient.id.slice(0, 8);
  return {
    id: code.startsWith('#') ? code : `#${code}`,
    secondaryId: patient.patientCode || patient.id,
    detailId: patient.id,
    bookingId: extras?.bookingId ?? '',
    assignedDoctorId: extras?.assignedDoctorId,
    name: patient.fullName,
    phone: patient.mobileNumber ? `+91-${patient.mobileNumber}` : '—',
    doctor: extras?.doctor ?? '—',
    visitType: extras?.visitType ?? 'Consultation',
    appointmentDate:
      extras?.appointmentDate ?? formatDisplayDate(patient.createdAt),
    dosha: extras?.dosha ?? 'Vata',
    status: extras?.status ?? 'Pending',
    isActive:
      extras?.isActive ??
      (patient.status
        ? patient.status.toUpperCase() === 'ACTIVE'
        : patient.active),
  };
}

export function mapPatientToDetail(
  patient: PatientDto,
  extras?: Partial<Omit<PatientDetail, 'personalInfo'>> & {
    personalInfo?: Partial<PatientDetail['personalInfo']>;
  },
): PatientDetail {
  const summary = mapPatientToRecord(patient, extras);
  return {
    ...summary,
    treatmentStatus: extras?.treatmentStatus ?? 'Pending',
    consultationTypeIds: extras?.consultationTypeIds,
    personalInfo: {
      gender: extras?.personalInfo?.gender ?? titleCase(patient.gender ?? ''),
      age: extras?.personalInfo?.age ?? (patient.age != null ? `${patient.age}yrs` : ''),
      dob: extras?.personalInfo?.dob ?? formatDisplayDate(patient.dateOfBirth),
      serviceType: extras?.personalInfo?.serviceType ?? summary.visitType,
      registrationDate:
        extras?.personalInfo?.registrationDate ??
        formatDisplayDate(patient.createdAt),
      assignedDoctor: extras?.personalInfo?.assignedDoctor ?? summary.doctor,
      therapyDuration: extras?.personalInfo?.therapyDuration ?? '—',
      email: extras?.personalInfo?.email ?? patient.email ?? '',
      city: extras?.personalInfo?.city ?? patient.city ?? '',
      state: extras?.personalInfo?.state ?? patient.state ?? '',
      address: extras?.personalInfo?.address ?? patient.address ?? '',
      emergencyName:
        extras?.personalInfo?.emergencyName ?? patient.emergencyContactName ?? '',
      emergencyRelation:
        extras?.personalInfo?.emergencyRelation ??
        patient.emergencyRelationship ??
        '',
      emergencyPhone:
        extras?.personalInfo?.emergencyPhone ??
        (patient.emergencyPhoneNumber
          ? `+91-${patient.emergencyPhoneNumber}`
          : '—'),
      idProofType:
        extras?.personalInfo?.idProofType ?? titleCase(patient.idProofType ?? ''),
      idProofNumber:
        extras?.personalInfo?.idProofNumber ?? patient.idProofNumber ?? '',
      occupation: extras?.personalInfo?.occupation ?? patient.occupation ?? '',
      insuranceDetails:
        extras?.personalInfo?.insuranceDetails ??
        patient.insuranceDetails ??
        'N/A',
    },
    medicalAssessment: extras?.medicalAssessment ?? {
      bodyConstitution: '—',
      currentImbalance: '—',
      previousPanchakarma: '—',
      weight: '—',
      height: '—',
      ibw: '—',
      pulse: '—',
      bp: '—',
      pallor: '—',
      temperature: '—',
      acidityGas: '—',
      oedema: '—',
      sensorium: '—',
      icterus: '—',
      cyanosis: '—',
      motion: '—',
      micturition: '—',
      lymphNodes: '—',
      presentConditions: '—',
      pastConditions: '—',
      pastSurgeries: '—',
      currentMedication: '—',
      allergies: '—',
      familyHistory: '—',
      diet: '—',
      sleep: '—',
      exercise: '—',
      reports: [],
    },
    treatmentFollowUp: extras?.treatmentFollowUp ?? {
      treatmentName: '—',
      startDate: '—',
      endDate: '—',
      totalSessions: 0,
      sessionsCompleted: 0,
      remainingSessions: 0,
      assignedTherapist: '—',
      nextFollowUp: '—',
      followUpDoctor: '—',
      reminder: '—',
      appointmentHistory: [],
    },
    billing: extras?.billing ?? {
      packageName: '—',
      validity: '—',
      membershipStatus: 'Pending' as PatientStatus,
      discountApplied: 0,
      registrationFees: 0,
      paymentMode: '—',
      partialPayment: '—',
      outstandingAmount: 0,
      serviceType: '—',
      serviceFees: 0,
      packageType: '—',
      packageCharges: 0,
      discount: 0,
      taxRate: '—',
    },
    invoice: extras?.invoice ?? {
      clinicName: 'Ganesha Ayurvedaa',
      gstNo: '—',
      doctorName: summary.doctor,
      doctorCredentials: '—',
      workingHours: '—',
      doctorPhone: '—',
      invoiceNo: '—',
      invoiceDate: formatDisplayDate(patient.createdAt),
      paymentMode: '—',
      amountDue: 0,
      items: [],
      subtotal: 0,
      cgst: 0,
      sgst: 0,
      discount: 0,
      total: 0,
      conditions: '—',
      address: patient.address,
      email: patient.email,
      website: '—',
    },
  };
}

export function mapAppointmentToRecord(
  appointment: AppointmentDto,
  doctorsById: Map<string, DoctorDto> = new Map(),
): AppointmentRecord {
  const doctorId = appointment.assignedDoctorId ?? appointment.doctorId;
  const doctor =
    appointment.doctorName ??
    appointment.assignedDoctor?.doctorName ??
    appointment.assignedDoctor?.name ??
    (doctorId ? doctorsById.get(doctorId)?.name : undefined) ??
    (doctorId ? doctorsById.get(doctorId)?.doctorName : undefined) ??
    '—';

  const patient =
    appointment.patientName ??
    appointment.fullName ??
    appointment.patient?.fullName ??
    '—';

  const patientCode =
    appointment.patient?.patientDisplayId ??
    appointment.patient?.patientCode ??
    (typeof appointment.patientId === 'string'
      ? appointment.patientId.slice(0, 8)
      : 'APT');

  const visitType = normalizeVisitType(
    appointment.consultationTypes ?? appointment.visitType,
  );

  const appointmentDate = formatDisplayDateTime(
    appointment.appointmentDate ??
      appointment.scheduleDate ??
      appointment.registrationDate,
    appointment.scheduleTime ?? appointment.slotTime,
  );

  const isoSchedule =
    splitIsoDateTime(
      appointment.appointmentDate ??
        appointment.scheduleDate ??
        appointment.registrationDate,
    ) ?? null;

  return {
    id: String(appointment.id ?? appointment.bookingId ?? crypto.randomUUID()),
    uhid: patientCode.startsWith('#') ? patientCode : `#${patientCode}`,
    patient,
    doctor,
    visitType,
    appointmentDate,
    dateCreated: (
      appointment.registrationDate ??
      appointment.createdAt?.slice(0, 10) ??
      isoSchedule?.date ??
      ''
    ).slice(0, 10),
    status: normalizeAppointmentStatus(
      appointment.bookingStatus ?? appointment.status,
    ),
    patientId: appointment.patientId ?? appointment.patient?.id,
    assignedDoctorId:
      appointment.assignedDoctorId ??
      appointment.assignedDoctor?.id ??
      doctorId,
    registrationDate:
      appointment.registrationDate ??
      isoSchedule?.date ??
      appointment.appointmentDate ??
      appointment.scheduleDate ??
      '',
    slotTime:
      appointment.slotTime ??
      appointment.scheduleTime ??
      isoSchedule?.time ??
      '',
    consultationTypes: extractConsultationTypeIds(appointment.consultationTypes),
  };
}

export function mapPatientAppointmentListItemToPatientRecord(
  item: PatientAppointmentListItemDto,
  tab: 'active' | 'inactive' = 'active',
): PatientRecord {
  const displayId =
    item.patientDisplayId ??
    item.patientCode ??
    item.patientId.slice(0, 8);

  const bookingStatus = (item.bookingStatus ?? '').toUpperCase();
  let status: PatientRecord['status'] = 'Pending';
  if (bookingStatus.includes('COMPLETE')) status = 'Completed';
  else if (bookingStatus.includes('CANCEL')) status = 'Cancelled';
  else if (bookingStatus.includes('CONSULTATION') || bookingStatus.includes('IN_CONSULTATION'))
    status = 'Pending';

  return {
    id: displayId.startsWith('#') ? displayId : `#${displayId}`,
    secondaryId: item.patientCode ?? item.patientId,
    detailId: item.patientId,
    bookingId: item.bookingId,
    name: item.patientFullName,
    phone: item.patientMobileNumber
      ? item.patientMobileNumber.startsWith('+')
        ? item.patientMobileNumber
        : `+91-${item.patientMobileNumber.replace(/^\+91-?/, '')}`
      : '—',
    doctor: item.doctorName ?? '—',
    visitType: normalizeVisitType(item.consultationTypes),
    appointmentDate: formatDisplayDateTime(
      item.appointmentDate,
      item.slotTime,
    ),
    dosha: pickDosha(item.doshaName),
    status,
    isActive: tab === 'active',
  };
}

export function mapPatientAppointmentListItemToRecord(
  item: PatientAppointmentListItemDto,
): AppointmentRecord {
  const displayId =
    item.patientDisplayId ??
    item.patientCode ??
    item.patientId.slice(0, 8);

  return {
    id: String(item.bookingId),
    uhid: displayId.startsWith('#') ? displayId : `#${displayId}`,
    patient: item.patientFullName,
    doctor: item.doctorName ?? '—',
    visitType: normalizeVisitType(item.consultationTypes),
    appointmentDate: formatDisplayDateTime(
      item.appointmentDate,
      item.slotTime,
    ),
    dateCreated: (item.bookingTime ?? item.appointmentDate ?? '').slice(0, 10),
    status: normalizeAppointmentStatus(item.bookingStatus),
    patientId: item.patientId,
    assignedDoctorId: item.assignedDoctorId,
    registrationDate: item.appointmentDate ?? '',
    slotTime: item.slotTime ?? '',
    consultationTypes: extractConsultationTypeIds(item.consultationTypes),
  };
}

export function mapAppointmentTherapyToTreatment(
  therapy: AppointmentTherapyDto,
  patientName?: string,
): TreatmentRecord {
  const therapyType =
    therapy.therapyNames?.[0] ??
    therapy.therapies?.[0]?.name ??
    therapy.therapies?.[0]?.therapyName ??
    'Therapy';

  const therapistName =
    therapy.therapistName ??
    therapy.assignedTherapist?.name ??
    therapy.assignedTherapist?.therapistName ??
    '—';

  const patientId =
    therapy.patientId ?? therapy.patient?.id ?? '';

  const startDate = (therapy.scheduleDate ?? therapy.createdAt ?? '').slice(
    0,
    10,
  );

  return {
    id: String(therapy.therapyId ?? therapy.id ?? crypto.randomUUID()),
    patient:
      patientName ??
      therapy.patientName ??
      therapy.patient?.fullName ??
      '—',
    patientDetailId: patientId,
    treatmentPlanName: therapyType,
    treatmentCategory:
      therapy.treatmentCategoryName ??
      therapy.categoryName ??
      therapy.treatmentCategory?.categoryName ??
      '—',
    therapyType,
    assignedTherapist: therapistName,
    therapistSchedule: formatDisplayDateTime(
      therapy.scheduleDate,
      therapy.scheduleTime,
    ),
    startDate,
    endDate: startDate,
    totalSessions: therapy.sessionFrequency ?? 0,
    completedSessions: 0,
    remainingSessions: therapy.sessionFrequency ?? 0,
    status: normalizeTreatmentStatus(
      therapy.therapyStatus ?? therapy.status,
    ),
    dateCreated: startDate,
  };
}

export function mapTreatmentDtoToRecord(
  dto: TreatmentDto,
  patientName?: string,
): TreatmentRecord {
  return {
    id: dto.id,
    appointmentTherapyId: dto.appointmentTherapyId,
    patient: patientName ?? '—',
    patientDetailId: dto.patientId,
    treatmentPlanName: dto.treatmentPlanName ?? dto.treatmentPlanId,
    treatmentCategory: '—',
    therapyType: dto.treatmentPlanName ?? dto.treatmentPlanId,
    assignedTherapist: dto.assignedTherapistName ?? '—',
    therapistSchedule: `${formatDisplayDate(dto.startDate)} – ${formatDisplayDate(dto.endDate)}`,
    startDate: dto.startDate,
    endDate: dto.endDate,
    totalSessions: dto.totalSessions,
    completedSessions: dto.completedSessions ?? 0,
    remainingSessions:
      dto.remainingSessions ??
      Math.max(0, dto.totalSessions - (dto.completedSessions ?? 0)),
    status: normalizeTreatmentStatus(dto.treatmentStatus),
    dateCreated: dto.startDate,
  };
}

export function mapFollowUpDtoToRecord(dto: FollowUpDto): FollowUpRecord {
  return {
    id: dto.id,
    uhid: dto.patientDisplayId ?? '—',
    patient: dto.patientName ?? '—',
    doctor: dto.doctorName ?? '—',
    visitType: mapFollowUpVisitType(dto),
    appointmentDate: formatIsoDateTime(dto.appointmentDate),
    dateCreated: dto.appointmentDate?.slice(0, 10) ?? '',
    status: mapFollowUpStatus(dto.status),
    patientId: dto.patientId,
    assignedDoctorId: dto.assignedDoctorId,
    visitTypeId: dto.visitTypeId,
    schedulingOption: dto.schedulingOption,
    scheduleTime: dto.appointmentDate?.includes('T')
      ? dto.appointmentDate.slice(11, 16)
      : '10:00',
    sourceBookingId: dto.sourceBookingId,
    smsReminderEnabled: dto.smsReminderEnabled,
  };
}

export function mapPatientPackageToBillingMembership(
  pkg: PatientPackageDto,
): Partial<import('@/types').PatientBillingMembership> {
  const status = pkg.status.toUpperCase();
  return {
    packageName: pkg.packageName ?? '—',
    packageMasterId: pkg.packageMasterId,
    validity: formatDisplayDate(pkg.validity),
    membershipStatus:
      status === 'COMPLETED'
        ? 'Completed'
        : status === 'ONGOING'
          ? 'Pending'
          : 'Scheduled',
    discountApplied: pkg.discountApplied,
  };
}

function formatFileSize(bytes?: number): string {
  if (bytes == null || !Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function displayOrDash(value: string | number | null | undefined, suffix = ''): string {
  if (value === null || value === undefined || value === '') return '—';
  return `${value}${suffix}`;
}

/** Maps GET /api/v1/medical-assessment/{patientId} → UI medical assessment tab. */
export function mapMedicalAssessmentDtoToUi(
  assessment: MedicalAssessmentDto | null | undefined,
  _gender?: string | null,
): import('@/types').PatientMedicalAssessment {
  const ayur = assessment?.ayurvedicAssessment;
  const phys = assessment?.physicalExamination;
  const hist = assessment?.medicalHistory;
  const life = assessment?.lifestyleInformation;
  const systemic = assessment?.systemicExamination;
  const plan = assessment?.treatmentPlan;
  const docs = assessment?.documents ?? [];

  const pastConditions = displayOrDash(hist?.pastMedicalConditions);
  const pastSurgeries = displayOrDash(hist?.pastSurgeries);
  const currentMedication = displayOrDash(hist?.currentMedications);
  const allergies = displayOrDash(hist?.allergies);

  return {
    bodyConstitution: displayOrDash(ayur?.bodyConstitution),
    currentImbalance: displayOrDash(ayur?.currentImbalances),
    previousPanchakarma: '—',
    doshaName: displayOrDash(ayur?.dosha?.name),
    weight: displayOrDash(phys?.weight, ' kg'),
    height: displayOrDash(phys?.height, ' cm'),
    ibw: displayOrDash(phys?.ibw, ' kg'),
    pulse: displayOrDash(phys?.pulse, ' bpm'),
    bp: displayOrDash(phys?.bp),
    pallor: displayOrDash(phys?.pallor),
    temperature: displayOrDash(phys?.temperature, '°F'),
    acidityGas: displayOrDash(phys?.acidityGas),
    oedema: displayOrDash(phys?.oedema),
    sensorium: displayOrDash(phys?.sensorium),
    icterus: displayOrDash(phys?.icterus),
    cyanosis: displayOrDash(phys?.cyanosis),
    motion: displayOrDash(phys?.motion),
    micturition: displayOrDash(phys?.micturition),
    lymphNodes: displayOrDash(phys?.lymphNodes),
    presentConditions: '—',
    pastConditions,
    pastSurgeries,
    currentMedication,
    allergies,
    familyHistory: displayOrDash(hist?.familyHistory),
    diet: displayOrDash(life?.dietType),
    sleep: displayOrDash(life?.sleepPattern),
    exercise: displayOrDash(life?.exerciseHabits),
    addiction: displayOrDash(life?.addiction),
    cardiovascular: displayOrDash(systemic?.cardiovascular),
    respiratory: displayOrDash(systemic?.respiratory),
    nervous: displayOrDash(systemic?.nervous),
    abdomenGi: displayOrDash(systemic?.abdomenGi),
    locomotor: displayOrDash(systemic?.locomotor),
    investigationPlan: displayOrDash(plan?.investigationAndPlanSuggested),
    planTaken: displayOrDash(plan?.planTaken),
    reports: docs.map((doc) => ({
      name: doc.fileName || titleCase(doc.documentType) || 'Document',
      size: formatFileSize(doc.fileSize),
      time: titleCase(doc.documentType?.replace(/_/g, ' ')) || 'Uploaded',
      type: 'file' as const,
    })),
  };
}

export function mapInvoicesToPatientBilling(
  invoices: InvoiceListItemDto[],
): {
  billing: import('@/types').PatientBillingMembership;
  invoice: import('@/types').PatientInvoice;
} {
  const latest = invoices[0];
  const outstanding = invoices.reduce(
    (sum, inv) => sum + (inv.leftAmount ?? 0),
    0,
  );
  const paid = invoices.reduce((sum, inv) => sum + (inv.paidAmount ?? 0), 0);
  const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);
  const status = latest?.status?.toUpperCase();

  return {
    billing: {
      packageName: '—',
      validity: '—',
      membershipStatus:
        status === 'COMPLETED'
          ? 'Completed'
          : status === 'ONGOING'
            ? 'Pending'
            : 'Pending',
      discountApplied: 0,
      registrationFees: 0,
      paymentMode: '—',
      partialPayment: paid > 0 && outstanding > 0 ? formatCurrencyLike(paid) : '—',
      outstandingAmount: outstanding,
      serviceType: '—',
      serviceFees: total,
      packageType: '—',
      packageCharges: 0,
      discount: 0,
      taxRate: '—',
    },
    invoice: {
      clinicName: 'Ganesha Ayurvedaa',
      gstNo: '—',
      doctorName: '—',
      doctorCredentials: '—',
      workingHours: '—',
      doctorPhone: '—',
      invoiceNo: latest?.invoiceId ?? '—',
      invoiceDate: latest ? formatDisplayDate(latest.invoiceDate) : '—',
      paymentMode: '—',
      amountDue: outstanding,
      items: [],
      subtotal: total,
      cgst: 0,
      sgst: 0,
      discount: 0,
      total,
      conditions: '—',
      address: '—',
      email: '—',
      website: '—',
    },
  };
}

function formatCurrencyLike(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatInvoiceItemDescription(
  item: import('@/lib/api/billing').InvoiceItemDto,
): string {
  const parts: string[] = [];
  if (item.itemType) parts.push(titleCase(item.itemType.replace(/_/g, ' ')));
  if (item.quantity != null) parts.push(`Qty: ${item.quantity}`);
  if (item.assignedTherapistName) {
    parts.push(`Therapist: ${item.assignedTherapistName}`);
  }
  if (item.scheduleDate) parts.push(`Date: ${formatDisplayDate(item.scheduleDate)}`);
  if (item.scheduleTime) parts.push(`Time: ${item.scheduleTime}`);
  return parts.join(' · ') || '—';
}

function mapInvoiceItemDetail(item: import('@/lib/api/billing').InvoiceItemDto): string {
  const type = item.itemType?.toUpperCase();
  if (type === 'SERVICE') return 'Consultation';
  if (type === 'MEDICINE') return 'Medicine';
  if (type === 'THERAPY') return 'Therapy';
  return item.itemName || titleCase(item.itemType?.replace(/_/g, ' ') ?? 'Item');
}

function mapInvoiceItems(
  dto: InvoiceDto,
): import('@/types').PatientInvoice['items'] {
  const rows = (dto.items ?? []).map((item) => ({
    detail: mapInvoiceItemDetail(item),
    description: item.itemName || formatInvoiceItemDescription(item),
    amount: item.amount ?? item.quantity * item.unitPrice,
  }));

  if (rows.length === 0) {
    if (dto.serviceFees && dto.serviceFees > 0) {
      rows.push({
        detail: 'Service Fees',
        description: titleCase((dto.visitType ?? 'Service').replace(/_/g, ' ')),
        amount: dto.serviceFees,
      });
    }
    if (dto.packageCharges && dto.packageCharges > 0) {
      rows.push({
        detail: 'Package Charges',
        description: dto.packageType ?? 'Package',
        amount: dto.packageCharges,
      });
    }
  }

  return rows;
}

export function mapInvoiceDtoToBillView(
  dto: InvoiceDto,
  doctor?: BillDoctorDetails,
): BillInvoiceView {
  const displayPatientId =
    dto.formattedPatientId ??
    dto.patientDisplayId ??
    dto.patientCode ??
    dto.patientId;
  const formattedPatientId = displayPatientId.startsWith('#')
    ? displayPatientId
    : `#${displayPatientId}`;

  const latestPayment = dto.payments?.[0];
  const doctorDetails = doctor ?? {
    doctorName: CLINIC_BRANDING.doctorName,
    doctorCredentials: CLINIC_BRANDING.doctorCredentials,
    workingHours: CLINIC_BRANDING.workingHours,
    doctorPhone: CLINIC_BRANDING.doctorPhone,
  };

  return {
    patientName: dto.patientName,
    patientId: formattedPatientId,
    contactNumber: dto.contactNumber ?? '—',
    invoice: {
      clinicName: CLINIC_BRANDING.name,
      gstNo: CLINIC_BRANDING.gstNo,
      doctorName: doctorDetails.doctorName,
      doctorCredentials: doctorDetails.doctorCredentials,
      workingHours: doctorDetails.workingHours,
      doctorPhone: doctorDetails.doctorPhone,
      invoiceNo: dto.invoiceId,
      invoiceDate: formatBillDate(dto.invoiceDate),
      paymentMode: latestPayment?.paymentMethod ?? 'UPI',
      amountDue: dto.leftAmount ?? Math.max(0, dto.totalAmount - dto.paidAmount),
      items: mapInvoiceItems(dto),
      subtotal: dto.subtotal ?? dto.totalAmount,
      cgst: dto.cgstAmount ?? 0,
      sgst: dto.sgstAmount ?? 0,
      discount: dto.discount ?? 0,
      total: dto.totalAmount,
      notes: latestPayment?.remarks ?? CLINIC_BRANDING.notesDefault,
      conditions: CLINIC_BRANDING.specialties,
      address: CLINIC_BRANDING.address,
      email: CLINIC_BRANDING.email,
      website: CLINIC_BRANDING.website,
    },
  };
}

export function mapDoctorToClinicRecord(doctor: DoctorDto): ClinicDoctorRecord {
  return {
    id: doctor.id,
    name: doctor.name || doctor.doctorName || '—',
    specialization: doctor.specialization || '—',
    qualification: doctor.qualification || '',
    mobileNumber: doctor.mobileNumber || '',
    status: doctor.status === 'ACTIVE' || doctor.active ? 'Active' : 'Inactive',
    consultationFees: doctor.consultationFees ?? 0,
    followUpFees: doctor.followUpFees ?? 0,
    availability: doctor.availability || `${doctor.department || ''} · ${doctor.consultationRoom || ''}`,
  };
}

export function mapDoctorToDirectoryRecord(
  doctor: DoctorDto,
): DoctorDirectoryRecord {
  return {
    id: doctor.id,
    doctorCode: doctor.doctorCode || '',
    name: doctor.name || doctor.doctorName || '—',
    specialization: doctor.specialization || '',
    qualification: doctor.qualification || '',
    department: doctor.department || '',
    consultationRoom: doctor.consultationRoom || '',
    mobileNumber: doctor.mobileNumber || '',
    email: doctor.email || '',
    status: doctor.status === 'ACTIVE' || doctor.active ? 'Active' : 'Inactive',
  };
}

export function mapTherapistToClinicRecord(
  therapist: TherapistDto,
  therapiesById: Map<string, TherapyDto> = new Map(),
): ClinicTherapistRecord {
  const assignedTherapies = (therapist.assignedTherapyIds ?? [])
    .map((id) => {
      const therapy = therapiesById.get(id);
      return therapy?.name || therapy?.therapyName || id;
    })
    .filter(Boolean);

  return {
    id: therapist.id,
    name: therapist.name || therapist.therapistName || '—',
    status:
      therapist.status === 'ACTIVE' || therapist.active ? 'Active' : 'Inactive',
    assignedTherapies,
  };
}

export function mapTherapyToClinicRecord(
  therapy: TherapyDto,
  categoriesById: Map<string, TreatmentCategoryDto>,
): ClinicTherapyRecord {
  const cId = therapy.categoryId || '';
  return {
    id: therapy.id,
    name: therapy.name || therapy.therapyName || '—',
    category: categoriesById.get(cId)?.categoryName ?? cId,
    categoryId: cId,
    duration: therapy.durationMinutes ? `${therapy.durationMinutes} mins` : '—',
    price: therapy.price ?? 0,
    description: therapy.description || '—',
    status:
      therapy.status === 'ACTIVE' || therapy.active ? 'Active' : 'Inactive',
  };
}

export function mapTreatmentCategoryToRecord(
  category: TreatmentCategoryDto,
): ClinicTreatmentCategoryRecord {
  return {
    id: category.id,
    name: category.categoryName,
    description: category.description || '—',
  };
}

function normalizeMedicineStockStatus(
  stockStatus?: string | null,
  stockQuantity?: number,
): MedicineStatus {
  const value = (stockStatus ?? '').toUpperCase().replace(/\s+/g, '_');
  if (value === 'LOW_STOCK') return 'Low Stock';
  if (value === 'OUT_OF_STOCK') return 'Out of Stock';
  if (value === 'IN_STOCK') return 'In Stock';
  if (stockQuantity === 0) return 'Out of Stock';
  return 'In Stock';
}

export function mapMedicineToRecord(medicine: MedicineDto): MedicineRecord {
  const stockQuantity = medicine.stockQuantity ?? medicine.quantity ?? 0;
  const categoryCode = medicine.category.trim().toUpperCase();

  return {
    id: medicine.id,
    name: medicine.medicineName,
    category: titleCase(categoryCode),
    categoryCode,
    stockQuantity,
    expiryDate: formatDisplayDate(medicine.expiryDate),
    price: medicine.sellingPrice ?? medicine.price ?? 0,
    status: normalizeMedicineStockStatus(medicine.stockStatus, stockQuantity),
    manufacturer: medicine.manufacturer,
    batchNumber: medicine.batchNumber,
    purchasePrice: medicine.purchasePrice,
    lowStockThreshold: medicine.lowStockThreshold,
    lowStockAlertEnabled: medicine.lowStockAlertEnabled,
  };
}

export function mapMedicineCategoryOptions(categories: string[]) {
  return categories.map((code) => ({
    value: code,
    label: titleCase(code),
  }));
}

export function toApiMedicineCategory(category: string): string {
  return category.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiGender(gender: string): string {
  return gender.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiIdProofType(idProofType: string): string {
  return idProofType.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiConsultationTypeIds(ids: string[]): string[] {
  return ids.filter(Boolean);
}

/** @deprecated Use consultation type master IDs directly. */
export function toApiConsultationTypes(
  types: string[],
): string[] {
  return types.filter(Boolean);
}

/** Maps stored consultation type IDs to display labels using active masters. */
export function consultationTypeIdsToLabels(
  ids: string[],
  masters: { id: string; name: string }[],
): string[] {
  const byId = new Map(masters.map((m) => [m.id, m.name]));
  return ids.map((id) => {
    const name = byId.get(id) ?? id;
    return name.toUpperCase().includes('THERAPY') ? 'Therapy' : 'Consultation';
  });
}

/** Resolves consultation type IDs from API response objects or legacy strings. */
export function fromApiConsultationTypeIds(
  types?: ConsultationTypeRef[] | string[] | null,
): string[] {
  return extractConsultationTypeIds(types);
}

export function slotTimeForInput(slotTime?: string | null): string {
  if (!slotTime) return '10:00';
  return normalizeBookingTimeForSelect(slotTime);
}

export function normalizeSlotTimeForApi(time: string): string {
  if (!time) return '10:00:00';
  return time.length === 5 ? `${time}:00` : time;
}

export function parseSessionNumber(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function parseNumericField(value: string | undefined, fallback = 0): number {
  if (!value?.trim()) return fallback;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseIntegerField(value: string | undefined, fallback = 0): number {
  if (!value?.trim()) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function joinList(values: string[] | undefined): string {
  return (values ?? []).filter(Boolean).join(', ');
}

export function hasMedicalAssessmentDocuments(
  documents?: MedicalAssessmentDocuments | CreatePatientValues['uploadedDocuments'],
): boolean {
  if (!documents) return false;
  return (
    (documents.pastMedicalReports?.length ?? 0) > 0 ||
    (documents.prescriptions?.length ?? 0) > 0 ||
    (documents.labReports?.length ?? 0) > 0
  );
}

/** Maps Step 3 form values to POST /api/v1/medical-assessment body. */
export function toMedicalAssessmentPayload(
  data: CreatePatientValues,
  patientId: string,
): CreateMedicalAssessmentPayload {
  const weight = parseNumericField(data.weight);
  const height = parseNumericField(data.height);

  return {
    patientId,
    ayurvedicAssessment: {
      patientId,
      doshaId: data.doshaType,
      bodyConstitution: joinList(data.bodyConstitution),
      currentImbalances: data.currentImbalance ?? '',
    },
    physicalExamination: {
      patientId,
      weight,
      height,
      ibw: parseNumericField(data.ibw, weight > 0 ? weight : 60),
      pulse: parseIntegerField(data.pulse, 72),
      bp: data.bp ?? '',
      temperature: parseNumericField(data.temperature, 98.6),
      pallor: data.pallor ?? '',
      icterus: data.icterus ?? '',
      cyanosis: data.cyanosis ?? '',
      lymphNodes: data.lymphNodes ?? '',
      oedema: data.oedema ?? '',
      sensorium: data.sensorium ?? '',
      acidityGas: data.acidityGas ?? '',
      motion: data.motion ?? '',
      micturition: data.micturition ?? '',
    },
    medicalHistory: {
      patientId,
      pastMedicalConditions: joinList(data.pastMedicalConditions),
      pastSurgeries: joinList(data.pastSurgeries),
      currentMedications: joinList(data.currentMedications),
      allergies: joinList(data.allergies),
      familyHistory: data.familyHistory ?? '',
    },
    lifestyleInformation: {
      patientId,
      dietType: data.dietType ?? '',
      sleepPattern: data.sleepPattern ?? '',
      exerciseHabits: data.exerciseHabits ?? '',
      addiction: data.addictions ?? '',
    },
    systemicExamination: {
      patientId,
      cardiovascular: data.cardiovascular ?? '',
      respiratory: data.respiratory ?? '',
      nervous: data.nervous ?? '',
      abdomenGi: data.abdomenGi ?? '',
      locomotor: data.locomotor ?? '',
    },
    treatmentPlan: {
      patientId,
      investigationAndPlanSuggested: data.investigationPlan ?? '',
      planTaken: data.planDetails ?? '',
    },
  };
}

export { pickDosha, titleCase };

function formatInvoiceDate(date: string): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN');
}

function mapInvoiceStatus(status: string): import('@/types').BillingStatus {
  const upper = status.toUpperCase();
  if (upper === 'COMPLETED') return 'Completed';
  if (upper === 'PENDING') return 'Pending';
  if (upper === 'UNPAID') return 'Unpaid';
  return 'Ongoing';
}

export function mapBillingDraftToRecord(
  billing: import('@/lib/api/billing').BillingDto,
  index = 0,
): import('@/types').BillingRecord {
  const displayId =
    billing.patientDisplayId ?? billing.formattedPatientId ?? billing.patientId;
  const secondaryPatientId =
    billing.patientCode &&
    billing.patientCode.replace(/^#/, '') !== displayId.replace(/^#/, '')
      ? billing.patientCode
      : '';
  const serviceTotal = (billing.services ?? []).reduce(
    (sum, item) =>
      sum + (item.serviceFees ?? 0) + (item.packageCharges ?? 0),
    0,
  );
  const status = String(billing.status ?? 'PENDING').toUpperCase();

  return {
    id: billing.id || `billing-${index}`,
    invoiceId: billing.invoiceNumber || billing.invoiceId || '—',
    patientId: displayId.startsWith('#') ? displayId : `#${displayId}`,
    secondaryPatientId,
    patientUuid: billing.patientId,
    invoiceDate: formatInvoiceDate(billing.billingDate ?? ''),
    totalAmount: billing.totalAmount ?? serviceTotal,
    paidAmount: 0,
    leftAmount: billing.totalAmount ?? serviceTotal,
    status: status === 'COMPLETED' ? 'Completed' : 'Pending',
    kind: 'billing-draft',
  };
}

export function mapBillingDraftToPatientBilling(
  billing: import('@/lib/api/billing').BillingDto,
): Partial<import('@/types').PatientBillingMembership> {
  const first = billing.services?.[0];
  return {
    billingDraftId: billing.id,
    billingDraftStatus:
      String(billing.status ?? 'PENDING').toUpperCase() === 'COMPLETED'
        ? 'COMPLETED'
        : 'PENDING',
    serviceType: first?.serviceType ?? '',
    serviceFees: first?.serviceFees ?? 0,
    packageType: first?.packageName ?? first?.packageType ?? '',
    packageCharges: first?.packageCharges ?? 0,
    packageMasterId: first?.packageMasterId ?? undefined,
    billingServices: (billing.services ?? []).map((item) => ({
      serviceType: item.serviceType ?? '',
      serviceFees: item.serviceFees ?? 0,
      packageMasterId: item.packageMasterId ?? undefined,
      packageName: item.packageName ?? undefined,
      packageType: item.packageType ?? undefined,
      packageCharges: item.packageCharges ?? 0,
    })),
  };
}

function mapActivityAction(action: string): import('@/types').ActivityLogAction {
  const map: Record<string, import('@/types').ActivityLogAction> = {
    VIEWED: 'Viewed',
    CREATED: 'Created',
    UPDATED: 'Updated',
    DELETED: 'Deleted',
  };
  return map[action.toUpperCase()] ?? 'Viewed';
}

export function mapInvoiceToBillingRecord(
  invoice: import('@/lib/api/billing').InvoiceListItemDto,
  index = 0,
): import('@/types').BillingRecord {
  const displayId = invoice.patientDisplayId ?? invoice.patientId;
  const secondaryPatientId =
    invoice.patientCode &&
    invoice.patientCode.replace(/^#/, '') !== displayId.replace(/^#/, '')
      ? invoice.patientCode
      : '';
  return {
    id: invoice.id || invoice.invoiceId || `bill-${index}`,
    invoiceId: invoice.invoiceId,
    patientId: displayId.startsWith('#') ? displayId : `#${displayId}`,
    secondaryPatientId,
    patientUuid: invoice.patientId,
    invoiceDate: formatInvoiceDate(invoice.invoiceDate),
    totalAmount: invoice.totalAmount ?? 0,
    paidAmount: invoice.paidAmount ?? 0,
    leftAmount: invoice.leftAmount ?? 0,
    status: mapInvoiceStatus(invoice.status),
    kind: 'invoice',
  };
}

export function mapActivityLogDtoToRecord(
  log: import('@/lib/api/activityLogs').ActivityLogDto,
): import('@/types').ActivityLogRecord {
  return {
    id: log.id,
    page: log.page,
    action: mapActivityAction(log.action),
    target: log.target,
    before: log.before ?? '—',
    after: log.after ?? '—',
    timestamp: log.timestamp,
  };
}

export function mapSalesDtoToRecord(
  sale: import('@/lib/api/billing').SalesRecordDto,
  index = 0,
): import('@/types').SalesInvoiceRecord {
  return {
    id: sale.invoiceId || `sale-${index}`,
    invoiceId: sale.invoiceId,
    invoiceDate: formatInvoiceDate(sale.invoiceDate),
    treatmentCategory: sale.treatmentCategory ?? '—',
    serviceType: sale.serviceType,
    totalAmount: sale.totalAmount ?? 0,
  };
}

export function mapScheduleAppointment(
  item?: import('@/lib/api/dashboard').ScheduleAppointmentDto | null,
  fallback?: import('@/types').ScheduleAppointment,
): import('@/types').ScheduleAppointment {
  if (!item?.patientName) {
    return (
      fallback ?? {
        patientName: '—',
        time: '—',
        reason: 'No appointment scheduled',
      }
    );
  }
  const service = item.serviceType?.replace(/_/g, ' ') ?? 'Consultation';
  return {
    patientName: item.patientName,
    time: item.slotTime?.slice(0, 5) ?? '—',
    reason: `${titleCase(service)} · ${item.bookingStatus ?? 'Scheduled'}`,
  };
}

export function buildDashboardStats(input: {
  patientCount?: number;
  appointmentStats?: import('@/lib/api/dashboard').AppointmentStatsDto | null;
  billingSummary?: import('@/lib/api/billing').BillingSummaryDto | null;
}): import('@/types').DashboardStats {
  const appt = input.appointmentStats;
  const billing = input.billingSummary;
  const totalPatients = input.patientCount ?? 0;

  return {
    totalPatients,
    patientGrowth: 0,
    patientsToday: appt?.todayAppointmentCount ?? 0,
    activePatients: Math.round(totalPatients * 0.2),
    inactivePatients: Math.max(0, totalPatients - Math.round(totalPatients * 0.2)),
    totalAppointments: appt?.currentMonthAppointmentCount ?? 0,
    appointmentGrowth: 0,
    appointmentsToday: appt?.todayAppointmentCount ?? 0,
    billingTotal: billing?.totalRevenue ?? 0,
    billsGenerated: billing?.totalBillsGenerated ?? 0,
    pendingPayments: billing?.pendingPayments ?? 0,
    collectedPayments: billing?.collectedPayments ?? 0,
  };
}

function formatSlotTimeDisplay(slotTime?: string | null): string {
  if (!slotTime) return '—';
  const [hourPart, minutePart = '00'] = slotTime.split(':');
  const hours = Number.parseInt(hourPart, 10);
  if (Number.isNaN(hours)) return slotTime;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${minutePart.padStart(2, '0')} ${period}`;
}

function normalizeDoctorScheduleStatus(
  raw?: string | null,
): DoctorScheduleItem['status'] {
  const value = (raw ?? 'SCHEDULED').toUpperCase();
  if (value.includes('COMPLETE')) return 'Completed';
  if (value.includes('IN_CONSULTATION')) return 'In Consultation';
  return 'Scheduled';
}

export function mapTodayAppointmentToScheduleItem(
  item: TodayAppointmentItemDto,
): DoctorScheduleItem {
  const scheduledAt = parseScheduleDateTime(item.slotTime, item.bookingTime);
  return {
    id: item.bookingId,
    time: formatSlotTimeDisplay(item.slotTime),
    patient: item.patientName ?? '—',
    patientDetailId: item.patientId,
    visitType: normalizeVisitType(item.consultationTypes),
    status: normalizeDoctorScheduleStatus(item.bookingStatus),
    slotTime: item.slotTime,
    bookingTime: item.bookingTime,
    scheduledAt: scheduledAt?.getTime(),
  };
}

export function mapAppointmentStatsToDoctorStats(
  stats?: AppointmentStatsDto | null,
): DoctorStats {
  const scheduled = Number(stats?.scheduledCount ?? stats?.todayAppointmentCount ?? 0);
  const completed = Number(stats?.completedCount ?? 0);
  const ongoing = Number(
    stats?.inConsultationCount ?? stats?.ongoingCount ?? scheduled,
  );
  const total = Number(
    stats?.totalAppointments ?? stats?.currentMonthAppointmentCount ?? scheduled + completed,
  );

  return {
    totalPatients: total,
    completedPatients: completed,
    ongoingPatients: ongoing,
    activeTreatmentPlans: scheduled + ongoing,
    completedTreatmentPlans: completed,
    ongoingTreatmentPlans: ongoing,
    completedTreatments: completed,
    consultationCount: Math.max(0, Math.floor(completed * 0.55)),
    therapyCount: Math.max(0, completed - Math.floor(completed * 0.55)),
    followUpsDue: scheduled,
    followUpsScheduled: scheduled,
    followUpsPending: Number(stats?.rescheduledCount ?? 0),
  };
}

const CALENDAR_EVENT_COLORS: Record<VisitType, string> = {
  Consultation: 'bg-amber-200 border-amber-400',
  Therapy: 'bg-sky-200 border-sky-400',
  'Follow-Up': 'bg-purple-200 border-purple-400',
  Treatment: 'bg-emerald-200 border-emerald-400',
};

function parseCalendarDayHour(
  record: AppointmentRecord,
  fallbackIndex: number,
): { day: number; startHour: number } {
  let day = fallbackIndex % 7;
  let startHour = 9;

  const dateSource = record.registrationDate || record.dateCreated;
  if (dateSource) {
    const parsed = new Date(dateSource);
    if (!Number.isNaN(parsed.getTime())) {
      day = parsed.getDay();
    }
  }

  const slot = record.slotTime ?? '';
  const slotMatch = slot.match(/^(\d{1,2})/);
  if (slotMatch) {
    const hour = Number(slotMatch[1]);
    if (hour >= 7 && hour <= 16) startHour = hour;
  } else {
    const displayMatch = record.appointmentDate.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)/i,
    );
    if (displayMatch) {
      let hour = Number(displayMatch[1]);
      const meridiem = displayMatch[3].toUpperCase();
      if (meridiem === 'PM' && hour < 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0;
      if (hour >= 7 && hour <= 16) startHour = hour;
    }
  }

  return { day, startHour };
}

export function mapAppointmentRecordToCalendarEvent(
  record: AppointmentRecord,
  index: number,
): CalendarEvent {
  const { day, startHour } = parseCalendarDayHour(record, index);
  return {
    id: record.id,
    title: `${record.patient} · ${record.visitType}`,
    day,
    startHour,
    durationHours: 1,
    color:
      CALENDAR_EVENT_COLORS[record.visitType] ??
      'bg-amber-100 border-amber-300',
  };
}

export function mapAppointmentRecordsToCalendarEvents(
  records: AppointmentRecord[],
): CalendarEvent[] {
  return records.map(mapAppointmentRecordToCalendarEvent);
}

export function mapAppointmentRecordToCalendarDetail(
  record: AppointmentRecord,
): CalendarEventDetail {
  const doctorName = /^dr\.?\s/i.test(record.doctor)
    ? record.doctor
    : record.doctor !== '—'
      ? `Dr. ${record.doctor}`
      : '—';

  return {
    id: record.id,
    title: resolveCalendarEventTitle(record.visitType),
    appointmentDate: record.appointmentDate,
    doctorName,
    doctorRole: 'Ayurvedic Physician',
    patientName: record.patient,
    patientAge: '—',
    patientGender: '—',
    visitType: record.visitType,
    dosha: '—',
    condition: '—',
    lastVisit: record.dateCreated || '—',
    nextVisit: '—',
  };
}
