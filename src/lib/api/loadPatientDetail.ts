import {
  getAppointmentsByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getInvoices } from '@/lib/api/billing';
import { getPackagesByPatientId } from '@/lib/api/packages';
import { getAllDoctors } from '@/lib/api/doctors';
import {
  mapInvoicesToPatientBilling,
  mapMedicalAssessmentDtoToUi,
  mapPatientPackageToBillingMembership,
  mapPatientToDetail,
  pickDosha,
} from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import { getTreatmentsByPatientId } from '@/lib/api/treatments';
import type { PatientDetail } from '@/types';

export async function loadPatientDetail(
  patientId: string,
): Promise<PatientDetail | null> {
  const [
    apiPatient,
    doctors,
    appointments,
    treatments,
    medicalAssessment,
    invoices,
    packages,
  ] = await Promise.all([
    getPatientById(patientId),
    getAllDoctors().catch(() => []),
    getAppointmentsByPatientId(patientId).catch(() => []),
    getTreatmentsByPatientId(patientId).catch(() => []),
    getMedicalAssessmentByPatientId(patientId).catch(() => null),
    getInvoices({ patientId }).catch(() => []),
    getPackagesByPatientId(patientId).catch(() => []),
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

  const treatment = treatments[0];
  const packageBilling = packages[0]
    ? mapPatientPackageToBillingMembership(packages[0])
    : {};

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
      therapyDuration: '—',
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
      treatmentPlanId: treatment?.treatmentPlanId,
      treatmentName: treatment?.treatmentPlanName ?? '—',
      startDate: treatment?.startDate ?? '—',
      endDate: treatment?.endDate ?? '—',
      totalSessions: treatment?.totalSessions ?? 0,
      sessionsCompleted: treatment?.completedSessions ?? 0,
      remainingSessions: treatment?.remainingSessions ?? 0,
      assignedTherapistId: treatment?.assignedTherapistId,
      assignedTherapist: treatment?.assignedTherapistName ?? '—',
      nextFollowUp: treatment?.endDate ?? '—',
      followUpDoctor: doctorName ?? '—',
      reminder: '—',
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
      ...packageBilling,
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
      treatment?.treatmentStatus?.toUpperCase() === 'COMPLETED'
        ? 'Discharged'
        : 'Under Treatment',
  });
}
