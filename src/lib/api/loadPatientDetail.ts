import {
  getAppointmentTherapiesByPatientId,
  getAppointmentsByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getInvoices } from '@/lib/api/billing';
import { getAllDoctors } from '@/lib/api/doctors';
import {
  mapInvoicesToPatientBilling,
  mapMedicalAssessmentDtoToUi,
  mapPatientToDetail,
  pickDosha,
} from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import { getAllTherapists } from '@/lib/api/therapists';
import type { PatientDetail } from '@/types';

export async function loadPatientDetail(
  patientId: string,
): Promise<PatientDetail | null> {
  const [
    apiPatient,
    doctors,
    therapists,
    appointments,
    therapies,
    medicalAssessment,
    invoices,
  ] = await Promise.all([
    getPatientById(patientId),
    getAllDoctors().catch(() => []),
    getAllTherapists().catch(() => []),
    getAppointmentsByPatientId(patientId).catch(() => []),
    getAppointmentTherapiesByPatientId(patientId).catch(() => []),
    getMedicalAssessmentByPatientId(patientId).catch(() => null),
    getInvoices({ patientId }).catch(() => []),
  ]);

  const latestAppointment = appointments[0];
  const doctorId =
    latestAppointment?.assignedDoctorId ?? latestAppointment?.doctorId;
  const doctorName =
    latestAppointment?.doctorName ??
    latestAppointment?.assignedDoctor?.name ??
    latestAppointment?.assignedDoctor?.doctorName ??
    (doctorId
      ? doctors.find((d) => d.id === doctorId)?.name ??
        doctors.find((d) => d.id === doctorId)?.doctorName
      : undefined);

  const therapy = therapies[0];
  const therapistName =
    therapy?.therapistName ??
    therapy?.assignedTherapist?.name ??
    therapy?.assignedTherapist?.therapistName ??
    (therapy?.assignedTherapistId
      ? therapists.find((t) => t.id === therapy.assignedTherapistId)?.name ??
        therapists.find((t) => t.id === therapy.assignedTherapistId)?.therapistName
      : undefined);

  const treatmentCategoryName =
    therapy?.treatmentCategoryName ??
    therapy?.categoryName ??
    therapy?.treatmentCategory?.categoryName ??
    therapy?.therapies?.[0]?.name ??
    therapy?.therapies?.[0]?.therapyName ??
    '—';

  const medicalUi = mapMedicalAssessmentDtoToUi(medicalAssessment);
  const { billing, invoice } = mapInvoicesToPatientBilling(invoices);
  const doshaName =
    medicalAssessment?.ayurvedicAssessment?.dosha?.name ?? undefined;

  return mapPatientToDetail(apiPatient, {
    doctor: doctorName ?? '—',
    dosha: pickDosha(doshaName),
    visitType: latestAppointment
      ? (latestAppointment.consultationTypes?.[0] ?? 'Consultation')
          .toString()
          .toLowerCase()
          .includes('therapy')
        ? 'Therapy'
        : 'Consultation'
      : 'Consultation',
    appointmentDate: latestAppointment?.registrationDate ?? undefined,
    medicalAssessment: medicalUi,
    personalInfo: {
      gender: '',
      age: '',
      dob: '',
      serviceType: 'Consultation',
      registrationDate: '',
      assignedDoctor: doctorName ?? '—',
      therapyDuration: therapy?.sessionDuration
        ? `${therapy.sessionDuration} mins`
        : '—',
      email: '',
      city: '',
      state: '',
      address: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      idProofType: '',
      idProofNumber: '',
      occupation: '',
      insuranceDetails: '',
    },
    treatmentFollowUp: {
      treatmentName: treatmentCategoryName,
      startDate: therapy?.scheduleDate ?? '—',
      endDate: '—',
      totalSessions: therapy?.sessionFrequency ?? 0,
      sessionsCompleted: 0,
      remainingSessions: therapy?.sessionFrequency ?? 0,
      assignedTherapist: therapistName ?? '—',
      nextFollowUp: therapy?.scheduleDate ?? '—',
      followUpDoctor: doctorName ?? '—',
      reminder: therapy?.therapyInstructions ?? '—',
      appointmentHistory: appointments.slice(0, 5).map((appt) => ({
        visitType: (appt.consultationTypes?.[0] ?? 'Consultation')
          .toString()
          .toLowerCase()
          .includes('therapy')
          ? 'Therapy'
          : 'Consultation',
        date:
          appt.registrationDate ??
          appt.appointmentDate ??
          appt.createdAt?.slice(0, 10) ??
          '—',
        status: 'Scheduled' as const,
      })),
    },
    billing: {
      ...billing,
      serviceType: latestAppointment
        ? (latestAppointment.consultationTypes?.[0] ?? 'Consultation')
            .toString()
            .replace(/_/g, ' ')
        : billing.serviceType,
    },
    invoice: {
      ...invoice,
      doctorName: doctorName ?? invoice.doctorName,
      address: apiPatient.address,
      email: apiPatient.email,
    },
    treatmentStatus:
      (therapy?.therapyStatus ?? therapy?.status)
        ?.toUpperCase()
        .includes('COMPLETE')
        ? 'Discharged'
        : 'Under Treatment',
  });
}
