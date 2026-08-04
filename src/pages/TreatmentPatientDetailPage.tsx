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
  getAppointmentTherapiesByPatientId,
  getAppointmentsByPatientId,
  getMedicalAssessmentByPatientId,
} from '@/lib/api/appointments';
import { getInvoices } from '@/lib/api/billing';
import {
  mapInvoicesToPatientBilling,
  mapMedicalAssessmentDtoToUi,
  mapPatientToDetail,
  pickDosha,
} from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import type { PatientDetailTab } from '@/types/patientDetail';

export function TreatmentPatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');

  const { data: patient, loading, error, reload } = useAsyncData(
    async () => {
      if (!patientId) return null;

      const [apiPatient, appointments, therapies, medicalAssessment, invoices] =
        await Promise.all([
          getPatientById(patientId),
          getAppointmentsByPatientId(patientId).catch(() => []),
          getAppointmentTherapiesByPatientId(patientId).catch(() => []),
          getMedicalAssessmentByPatientId(patientId).catch(() => null),
          getInvoices({ patientId }).catch(() => []),
        ]);

      const therapy = therapies[0];
      const latestAppointment = appointments[0];
      const medicalUi = mapMedicalAssessmentDtoToUi(medicalAssessment);
      const { billing, invoice } = mapInvoicesToPatientBilling(invoices);

      return mapPatientToDetail(apiPatient, {
        dosha: pickDosha(
          medicalAssessment?.ayurvedicAssessment?.dosha?.name,
        ),
        doctor: latestAppointment?.doctorName ?? '—',
        medicalAssessment: medicalUi,
        treatmentFollowUp: {
          treatmentName:
            therapy?.treatmentCategoryName ??
            therapy?.categoryName ??
            therapy?.treatmentCategory?.categoryName ??
            '—',
          startDate: therapy?.scheduleDate ?? '—',
          endDate: '—',
          totalSessions: therapy?.sessionFrequency ?? 0,
          sessionsCompleted: 0,
          remainingSessions: therapy?.sessionFrequency ?? 0,
          assignedTherapist:
            therapy?.therapistName ??
            therapy?.assignedTherapist?.name ??
            therapy?.assignedTherapist?.therapistName ??
            '—',
          nextFollowUp: therapy?.scheduleDate ?? '—',
          followUpDoctor: latestAppointment?.doctorName ?? '—',
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
        billing,
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
