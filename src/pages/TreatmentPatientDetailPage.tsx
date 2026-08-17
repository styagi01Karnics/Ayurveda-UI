import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BillingMembershipTab,
  MedicalAssessmentTab,
  PatientDetailHeader,
  PersonalInfoTab,
  TreatmentFollowUpTab,
} from '@/components/patients/PatientDetailTabs';
import { TreatmentPatientBreadcrumbs } from '@/components/treatments/TreatmentPatientBreadcrumbs';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAppointmentsByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getInvoices } from '@/lib/api/billing';
import { getPackagesByPatientId } from '@/lib/api/packages';
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

export function TreatmentPatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');

  const { data: patient, loading, error, reload } = useAsyncData(
    async () => {
      if (!patientId) return null;

      const [apiPatient, appointments, treatments, medicalAssessment, invoices, packages] =
        await Promise.all([
          getPatientById(patientId),
          getAppointmentsByPatientId(patientId).catch(() => []),
          getTreatmentsByPatientId(patientId).catch(() => []),
          getMedicalAssessmentByPatientId(patientId).catch(() => null),
          getInvoices({ patientId }).catch(() => []),
          getPackagesByPatientId(patientId).catch(() => []),
        ]);

      const treatment = treatments[0];
      const latestAppointment = appointments[0];
      const medicalUi = mapMedicalAssessmentDtoToUi(
        medicalAssessment,
        apiPatient.gender,
      );
      const { billing, invoice } = mapInvoicesToPatientBilling(invoices);
      const packageBilling = packages[0]
        ? mapPatientPackageToBillingMembership(packages[0])
        : {};

      return mapPatientToDetail(apiPatient, {
        dosha: pickDosha(
          medicalAssessment?.ayurvedicAssessment?.dosha?.name,
        ),
        doctor: latestAppointment?.doctorName ?? '—',
        medicalAssessment: medicalUi,
        treatmentFollowUp: {
          treatmentName: treatment?.treatmentPlanName ?? '—',
          startDate: treatment?.startDate ?? '—',
          endDate: treatment?.endDate ?? '—',
          totalSessions: treatment?.totalSessions ?? 0,
          sessionsCompleted: treatment?.completedSessions ?? 0,
          remainingSessions: treatment?.remainingSessions ?? 0,
          assignedTherapist: treatment?.assignedTherapistName ?? '—',
          nextFollowUp: treatment?.endDate ?? '—',
          followUpDoctor: latestAppointment?.doctorName ?? '—',
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
        billing: { ...billing, ...packageBilling },
        invoice: {
          ...invoice,
          address: apiPatient.address,
          email: apiPatient.email,
        },
      });
    },
    null,
    [patientId],
  );

  return (
    <div className="space-y-5">
      <TreatmentPatientBreadcrumbs />

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
                <BillingMembershipTab patient={patient} />
              )}
            </div>
          </Card>
        )}
      </AsyncStatus>

      <button
        type="button"
        onClick={() => navigate('/treatments')}
        className="text-sm font-medium text-gold hover:underline"
      >
        ← Back to Treatments
      </button>
    </div>
  );
}
