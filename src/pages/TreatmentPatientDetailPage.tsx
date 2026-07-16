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
import { mapPatientToDetail } from '@/lib/api/mappers';
import { getPatientById } from '@/lib/api/patients';
import type { PatientDetailTab } from '@/types/patientDetail';

export function TreatmentPatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');

  const { data: patient, loading, error, reload } = useAsyncData(
    async () => {
      if (!patientId) return null;
      const apiPatient = await getPatientById(patientId);
      return mapPatientToDetail(apiPatient);
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
