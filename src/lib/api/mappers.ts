import type {
  AppointmentDto,
  AppointmentTherapyDto,
  DoctorDto,
  PatientDto,
  TherapistDto,
  TherapyDto,
  TreatmentCategoryDto,
} from '@/lib/api/types';
import type {
  AppointmentRecord,
  ClinicDoctorRecord,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  Dosha,
  PatientDetail,
  PatientRecord,
  PatientStatus,
  TreatmentRecord,
  VisitType,
} from '@/types';

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
  if (date && time) {
    const combined = new Date(`${date}T${time}`);
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

function normalizeVisitType(raw?: string | string[] | null): VisitType {
  const value = Array.isArray(raw) ? raw[0] : raw;
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
  const value = (raw ?? 'Scheduled').toLowerCase();
  if (value.includes('complete')) return 'Completed';
  if (value.includes('cancel')) return 'Cancelled';
  return 'Scheduled';
}

function normalizeTreatmentStatus(
  raw?: string | null,
): TreatmentRecord['status'] {
  const value = (raw ?? 'Ongoing').toLowerCase();
  if (value.includes('complete')) return 'Completed';
  return 'Ongoing';
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
  const code = patient.patientCode || patient.id.slice(0, 8);
  return {
    id: code.startsWith('#') ? code : `#${code}`,
    secondaryId: patient.patientCode || patient.id,
    detailId: patient.id,
    name: patient.fullName,
    phone: patient.mobileNumber ? `+91-${patient.mobileNumber}` : '—',
    doctor: extras?.doctor ?? '—',
    visitType: extras?.visitType ?? 'Consultation',
    appointmentDate:
      extras?.appointmentDate ?? formatDisplayDate(patient.createdAt),
    dosha: extras?.dosha ?? 'Vata',
    status: extras?.status ?? (patient.active ? 'Pending' : 'Cancelled'),
    isActive: patient.active,
  };
}

export function mapPatientToDetail(
  patient: PatientDto,
  extras?: Partial<PatientDetail>,
): PatientDetail {
  const summary = mapPatientToRecord(patient, extras);
  return {
    ...summary,
    treatmentStatus: extras?.treatmentStatus ?? 'Pending',
    personalInfo: {
      gender: titleCase(patient.gender),
      age: `${patient.age}yrs`,
      dob: formatDisplayDate(patient.dateOfBirth),
      serviceType: extras?.personalInfo?.serviceType ?? summary.visitType,
      registrationDate: formatDisplayDate(patient.createdAt),
      assignedDoctor: extras?.personalInfo?.assignedDoctor ?? summary.doctor,
      therapyDuration: extras?.personalInfo?.therapyDuration ?? '—',
      email: patient.email,
      city: patient.city,
      state: patient.state,
      address: patient.address,
      emergencyName: patient.emergencyContactName,
      emergencyRelation: patient.emergencyRelationship,
      emergencyPhone: patient.emergencyPhoneNumber
        ? `+91-${patient.emergencyPhoneNumber}`
        : '—',
      idProofType: titleCase(patient.idProofType),
      idProofNumber: patient.idProofNumber,
      occupation: patient.occupation,
      insuranceDetails: patient.insuranceDetails || 'N/A',
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
    (doctorId ? doctorsById.get(doctorId)?.doctorName : undefined) ??
    '—';

  const patient =
    appointment.patientName ??
    appointment.fullName ??
    appointment.patient?.fullName ??
    '—';

  const patientCode =
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
    appointment.scheduleTime,
  );

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
      ''
    ).slice(0, 10),
    status: normalizeAppointmentStatus(appointment.status),
  };
}

export function mapAppointmentTherapyToTreatment(
  therapy: AppointmentTherapyDto,
  patientName?: string,
): TreatmentRecord {
  const therapyType =
    therapy.therapyNames?.[0] ??
    therapy.therapies?.[0]?.therapyName ??
    'Therapy';

  return {
    id: String(therapy.id ?? crypto.randomUUID()),
    patient: patientName ?? therapy.patientName ?? '—',
    patientDetailId: therapy.patientId ?? '',
    treatmentCategory:
      therapy.treatmentCategoryName ?? therapy.categoryName ?? '—',
    therapyType,
    assignedTherapist: therapy.therapistName ?? '—',
    therapistSchedule: formatDisplayDateTime(
      therapy.scheduleDate,
      therapy.scheduleTime,
    ),
    totalSessions: therapy.sessionFrequency ?? 0,
    status: normalizeTreatmentStatus(therapy.status),
    dateCreated: (therapy.createdAt ?? therapy.scheduleDate ?? '').slice(0, 10),
  };
}

export function mapDoctorToClinicRecord(doctor: DoctorDto): ClinicDoctorRecord {
  return {
    id: doctor.id,
    name: doctor.doctorName,
    specialization: doctor.specialization,
    status: doctor.active ? 'Active' : 'Inactive',
    consultationFees: 0,
    followUpFees: 0,
    availability: `${doctor.department} · ${doctor.consultationRoom}`,
  };
}

export function mapTherapistToClinicRecord(
  therapist: TherapistDto,
): ClinicTherapistRecord {
  return {
    id: therapist.id,
    name: therapist.therapistName,
    status: therapist.active ? 'Active' : 'Inactive',
    assignedTherapies: therapist.specialization
      ? [therapist.specialization]
      : [],
  };
}

export function mapTherapyToClinicRecord(
  therapy: TherapyDto,
  categoriesById: Map<string, TreatmentCategoryDto>,
  therapistName = '—',
): ClinicTherapyRecord {
  return {
    id: therapy.id,
    name: therapy.therapyName,
    category:
      categoriesById.get(therapy.categoryId)?.categoryName ?? therapy.categoryId,
    status: therapy.active ? 'Active' : 'Inactive',
    duration: '—',
    price: 0,
    assignedTherapist: therapistName,
  };
}

export function toApiGender(gender: string): string {
  return gender.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiIdProofType(idProofType: string): string {
  return idProofType.trim().toUpperCase().replace(/\s+/g, '_');
}

export function toApiConsultationTypes(
  types: string[],
): Array<'CONSULTATION' | 'THERAPY'> {
  return types.map((type) => {
    const upper = type.toUpperCase();
    return upper.includes('THERAPY') ? 'THERAPY' : 'CONSULTATION';
  });
}

export function parseSessionNumber(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export { pickDosha, titleCase };
