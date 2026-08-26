import {
  getAppointmentsByPatientId,
  getAllTherapies,
  getAppointmentTherapiesByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getInvoices, getBillingsByPatient } from '@/lib/api/billing';
import { getPackagesByPatientId } from '@/lib/api/packages';
import { getAllDoctors } from '@/lib/api/doctors';
import { getDocumentsByPatientId } from '@/lib/api/documents';
import {
  mapBillingDraftToPatientBilling,
  mapInvoicesToPatientBilling,
  mapMedicalAssessmentDtoToUi,
  mapPatientPackageToBillingMembership,
  mapPatientToDetail,
  pickDosha,
  fromApiConsultationTypeIds,
} from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import { getTreatmentsByPatientId } from '@/lib/api/treatments';
import {
  DOCUMENT_SECTIONS,
  formatDocumentFileSize,
} from '@/lib/documentUpload';
import type { PatientDetail } from '@/types';

function getAppointmentServiceTypes(
  appointment: Awaited<ReturnType<typeof getAppointmentsByPatientId>>[number] | undefined,
): string[] {
  if (!appointment) return ['Consultation'];
  const rawTypes = appointment.consultationTypes?.length
    ? appointment.consultationTypes.map((type) =>
        typeof type === 'string' ? type : type.name,
      )
    : [appointment.visitType ?? 'Consultation'];
  const serviceTypes = rawTypes.map((rawType) => {
    const normalized = rawType
      .toString()
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_');
    if (normalized.includes('FOLLOW')) return 'Follow-up';
    if (normalized.includes('THERAPY')) return 'Therapy';
    return 'Consultation';
  });
  return [...new Set(serviceTypes)];
}

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
    billings,
    documents,
    appointmentTherapies,
    therapyCatalogue,
  ] = await Promise.all([
    getPatientById(patientId),
    getAllDoctors().catch(() => []),
    getAppointmentsByPatientId(patientId).catch(() => []),
    getTreatmentsByPatientId(patientId).catch(() => []),
    getMedicalAssessmentByPatientId(patientId).catch(() => null),
    getInvoices({ patientId }).catch(() => []),
    getPackagesByPatientId(patientId).catch(() => []),
    getBillingsByPatient(patientId).catch(() => []),
    getDocumentsByPatientId(patientId).catch(() => []),
    getAppointmentTherapiesByPatientId(patientId).catch(() => []),
    getAllTherapies().catch(() => []),
  ]);

  const latestAppointment = appointments[0];
  const pendingBilling =
    billings.find((row) => String(row.status).toUpperCase() === 'PENDING') ??
    billings[0];
  const billingDraft = pendingBilling
    ? mapBillingDraftToPatientBilling(pendingBilling)
    : {};

  const doctorId =
    latestAppointment?.assignedDoctorId ?? latestAppointment?.doctorId;
  const matchedDoctor = doctorId
    ? doctors.find((d) => d.id === doctorId)
    : undefined;
  const doctorName =
    latestAppointment?.doctorName ??
    latestAppointment?.assignedDoctor?.name ??
    latestAppointment?.assignedDoctor?.doctorName ??
    matchedDoctor?.name ??
    matchedDoctor?.doctorName;
  const appointmentServiceTypes = getAppointmentServiceTypes(latestAppointment);
  const latestTherapy = appointmentTherapies[0];
  const selectedTherapyIds = new Set([
    ...(latestTherapy?.therapyIds ?? []),
    ...(latestTherapy?.therapyId ? [latestTherapy.therapyId] : []),
    ...(latestTherapy?.therapies ?? [])
      .map((therapy) => therapy.id)
      .filter((id): id is string => Boolean(id)),
  ]);
  const therapyFees = therapyCatalogue
    .filter((therapy) => selectedTherapyIds.has(therapy.id))
    .reduce((total, therapy) => total + (therapy.price ?? 0), 0);
  const appointmentServiceFees = appointmentServiceTypes.reduce(
    (total, serviceType) => {
      if (serviceType === 'Consultation') {
        return total + (matchedDoctor?.consultationFees ?? 0);
      }
      if (serviceType === 'Follow-up') {
        return total + (matchedDoctor?.followUpFees ?? 0);
      }
      return total + therapyFees;
    },
    0,
  );
  const appointmentServiceType = appointmentServiceTypes.join(' + ');

  const treatment = treatments[0];
  const packageBilling = packages[0]
    ? mapPatientPackageToBillingMembership(packages[0])
    : {};

  const medicalUi = mapMedicalAssessmentDtoToUi(
    medicalAssessment,
    apiPatient.gender,
  );
  medicalUi.reports = documents.map((document) => ({
    name: document.fileName,
    size: formatDocumentFileSize(document.fileSize ?? 0),
    time:
      DOCUMENT_SECTIONS.find(
        (section) => section.type === document.documentType,
      )?.label ?? document.documentType.replace(/_/g, ' '),
    type: 'file' as const,
  }));
  const { billing, invoice } = mapInvoicesToPatientBilling(invoices);
  const doshaName =
    medicalAssessment?.ayurvedicAssessment?.dosha?.name ?? undefined;

  const registrationDate =
    latestAppointment?.registrationDate ??
    latestAppointment?.appointmentDate ??
    apiPatient.createdAt ??
    '';

  return mapPatientToDetail(apiPatient, {
    bookingId:
      latestAppointment?.bookingId ?? latestAppointment?.id ?? '',
    assignedDoctorId: doctorId,
    doctor: doctorName ?? '',
    dosha: pickDosha(doshaName),
    consultationTypeIds: fromApiConsultationTypeIds(
      latestAppointment?.consultationTypes,
    ),
    visitType:
      appointmentServiceType === 'Therapy' ? 'Therapy' : 'Consultation',
    appointmentDate: registrationDate || undefined,
    medicalAssessment: medicalUi,
    personalInfo: {
      serviceType: appointmentServiceType,
      registrationDate: registrationDate.slice(0, 10),
      assignedDoctor: doctorName ?? '',
      therapyDuration: latestTherapy?.sessionDuration
        ? `${latestTherapy.sessionDuration} mins`
        : '',
    },
    treatmentFollowUp: {
      id: treatment?.id,
      treatmentPlanId: treatment?.treatmentPlanId,
      treatmentName: treatment?.treatmentPlanName ?? '',
      startDate: treatment?.startDate ?? '',
      endDate: treatment?.endDate ?? '',
      totalSessions: treatment?.totalSessions ?? 0,
      sessionsCompleted: treatment?.completedSessions ?? 0,
      remainingSessions: treatment?.remainingSessions ?? 0,
      assignedTherapistId: treatment?.assignedTherapistId,
      assignedTherapist: treatment?.assignedTherapistName ?? '',
      nextFollowUp: treatment?.endDate ?? '',
      followUpDoctor: doctorName ?? '',
      reminder: '',
      appointmentHistory: appointments.slice(0, 5).map((appt) => ({
        visitType:
          getAppointmentServiceTypes(appt).includes('Therapy')
            ? 'Therapy'
            : 'Consultation',
        date:
          appt.registrationDate ??
          appt.appointmentDate ??
          appt.createdAt?.slice(0, 10) ??
          '',
        status: 'Scheduled' as const,
      })),
    },
    billing: {
      ...billing,
      ...packageBilling,
      ...billingDraft,
      serviceType: latestAppointment
        ? appointmentServiceType
        : billingDraft.serviceType || billing.serviceType,
      serviceFees: latestAppointment
        ? appointmentServiceFees
        : (billingDraft.serviceFees ?? billing.serviceFees),
      billingServices: latestAppointment
        ? [
            {
              ...(billingDraft.billingServices?.[0] ?? {}),
              serviceType: appointmentServiceType,
              serviceFees: appointmentServiceFees,
            },
          ]
        : billingDraft.billingServices,
    },
    invoice: {
      ...invoice,
      doctorName: doctorName ?? invoice.doctorName,
      doctorCredentials:
        matchedDoctor?.qualification || invoice.doctorCredentials,
      doctorPhone:
        matchedDoctor?.mobileNumber || invoice.doctorPhone,
      address: apiPatient.address,
      email: apiPatient.email,
    },
    treatmentStatus:
      treatment?.treatmentStatus?.toUpperCase() === 'COMPLETED'
        ? 'Discharged'
        : 'Under Treatment',
  });
}
