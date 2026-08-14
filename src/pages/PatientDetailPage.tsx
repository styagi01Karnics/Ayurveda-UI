import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import {
  BillingMembershipTab,
  MedicalAssessmentTab,
  PatientDetailHeader,
  PersonalInfoTab,
  TreatmentFollowUpTab,
} from '@/components/patients/PatientDetailTabs';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { PatientBreadcrumbs } from '@/components/patients/PatientsTable';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { useAsyncData } from '@/hooks/useAsyncData';
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
import type { PatientDetailTab } from '@/types/patientDetail';

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');
  const [billInvoiceId, setBillInvoiceId] = useState<string | null>(null);
  const [latestInvoiceId, setLatestInvoiceId] = useState<string | null>(null);

  const { data: patient, loading, error, reload } = useAsyncData(
    async () => {
      if (!patientId) return null;

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

      setLatestInvoiceId(invoices[0]?.id ?? null);

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
          assignedTherapistId: treatment?.assignedTherapistId,
          treatmentName: treatment?.treatmentPlanName ?? '—',
          startDate: treatment?.startDate ?? '—',
          endDate: treatment?.endDate ?? '—',
          totalSessions: treatment?.totalSessions ?? 0,
          sessionsCompleted: treatment?.completedSessions ?? 0,
          remainingSessions: treatment?.remainingSessions ?? 0,
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
    },
    null,
    [patientId],
  );

  const handleDownloadBill = () => {
    if (!latestInvoiceId) {
      showToast({
        title: 'No invoice found',
        message: 'This patient does not have a bill to download yet.',
      });
      return;
    }
    setBillInvoiceId(latestInvoiceId);
  };

  return (
    <div className="space-y-5">
      <PatientBreadcrumbs />

      <AsyncStatus
        loading={loading}
        error={error}
        onRetry={reload}
        empty={!loading && !error && !patient}
        emptyMessage="Patient not found."
      >
        {patient && (
          <Card className="p-5 sm:p-6">
            <PatientDetailHeader
              patient={patient}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-8">
              {activeTab === 'personal' && <PersonalInfoTab patient={patient} />}
              {activeTab === 'medical' && (
                <MedicalAssessmentTab patient={patient} />
              )}
              {activeTab === 'treatment' && (
                <TreatmentFollowUpTab patient={patient} />
              )}
              {activeTab === 'billing' && (
                <BillingMembershipTab
                  patient={patient}
                  onDownloadBill={handleDownloadBill}
                />
              )}
            </div>
          </Card>
        )}
      </AsyncStatus>

      <BillInvoiceModal
        open={Boolean(billInvoiceId)}
        invoiceId={billInvoiceId}
        onClose={() => setBillInvoiceId(null)}
      />

      <button
        type="button"
        onClick={() => navigate('/patients')}
        className="text-sm font-medium text-gold hover:underline"
      >
        ← Back to Patients
      </button>
    </div>
  );
}

export type { PatientDetailTab };
