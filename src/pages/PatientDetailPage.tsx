import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BillingMembershipTab,
  MedicalAssessmentTab,
  PatientDetailHeader,
  PersonalInfoTab,
  TreatmentFollowUpTab,
} from '@/components/patients/PatientDetailTabs';
import { PatientBreadcrumbs } from '@/components/patients/PatientsTable';
import { Card } from '@/components/ui/Card';
import { getPatientByDetailId } from '@/data/mock/patients';
import type { PatientDetailTab } from '@/types/patientDetail';
import { NotFoundPage } from './NotFoundPage';

export function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');

  const patient = patientId ? getPatientByDetailId(patientId) : undefined;

  if (!patient) {
    return <NotFoundPage />;
  }

  return (
    <div className="space-y-5">
      <PatientBreadcrumbs />

      <Card className="p-5 sm:p-6">
        <PatientDetailHeader
          patient={patient}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-8">
          {activeTab === 'personal' && <PersonalInfoTab patient={patient} />}
          {activeTab === 'medical' && <MedicalAssessmentTab patient={patient} />}
          {activeTab === 'treatment' && <TreatmentFollowUpTab patient={patient} />}
          {activeTab === 'billing' && <BillingMembershipTab patient={patient} />}
        </div>
      </Card>

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
