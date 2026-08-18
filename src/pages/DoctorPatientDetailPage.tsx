import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { DoctorPatientBreadcrumbs } from '@/components/doctors/DoctorPatientBreadcrumbs';
import {
  DoctorBillingForm,
  DoctorMedicalForm,
  DoctorPatientViewTab,
  DoctorPersonalForm,
  DoctorTreatmentForm,
  type DoctorFormMasterOptions,
} from '@/components/doctors/DoctorPatientForms';
import { CreatePrescriptionForm } from '@/components/doctors/CreatePrescriptionForm';
import { PrescriptionPreviewModal } from '@/components/doctors/PrescriptionPreviewModal';
import { UnsavedChangesModal } from '@/components/doctors/UnsavedChangesModal';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getActiveDoctors } from '@/lib/api/doctors';
import { getActiveConsultationTypes } from '@/lib/api/consultationTypes';
import { getActivePackageMasters } from '@/lib/api/packageMasters';
import { getActiveTherapists, mapTherapistSelectOptions } from '@/lib/api/therapists';
import { getActiveTreatmentPlanMasters } from '@/lib/api/treatmentPlanMasters';
import { loadPatientDetail } from '@/lib/api/loadPatientDetail';
import {
  applyBillingFormToPatient,
  applyMedicalFormToPatient,
  applyPersonalFormToPatient,
  applyTreatmentFormToPatient,
  mapPatientToBillingForm,
  mapPatientToMedicalForm,
  mapPatientToPersonalForm,
  mapPatientToTreatmentForm,
} from '@/lib/doctorPatientMappers';
import type {
  DoctorBillingTabValues,
  DoctorMedicalTabValues,
  DoctorPersonalTabValues,
  DoctorPrescriptionValues,
  DoctorTreatmentTabValues,
} from '@/lib/validation/doctorPatient.schema';
import type { PatientDetail } from '@/types';
import type { PatientDetailTab } from '@/types/patientDetail';

const WORKFLOW_STEPS = [
  { id: 1, label: 'Patient Details' },
  { id: 2, label: 'Create Prescription' },
];

const detailTabs: { id: PatientDetailTab; label: string }[] = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'medical', label: 'Medical Assessment' },
  { id: 'treatment', label: 'Treatment & Follow Up' },
  { id: 'billing', label: 'Billing & Membership' },
];

const TAB_ORDER: PatientDetailTab[] = ['personal', 'medical', 'treatment', 'billing'];

function scrollWorkflowToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function getFormId(tab: PatientDetailTab): string {
  return `doctor-patient-${tab}-form`;
}

export function DoctorPatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [prescriptionPreviewOpen, setPrescriptionPreviewOpen] = useState(false);
  const [prescriptionDraft, setPrescriptionDraft] =
    useState<DoctorPrescriptionValues | null>(null);
  const [prescriptionSubmitting, setPrescriptionSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    data: loadedPatient,
    loading,
    error,
    reload,
  } = useAsyncData(
    async () => (patientId ? loadPatientDetail(patientId) : null),
    null,
    [patientId],
  );

  const { data: masterOptions } = useAsyncData(
    async () => {
      const [consultationTypes, treatmentPlans, packageMasters, therapists, doctors] =
        await Promise.all([
          getActiveConsultationTypes().catch(() => []),
          getActiveTreatmentPlanMasters().catch(() => []),
          getActivePackageMasters().catch(() => []),
          getActiveTherapists().catch(() => []),
          getActiveDoctors().catch(() => []),
        ]);
      return {
        consultationTypes: consultationTypes.map((type) => ({
          value: type.id,
          label: type.name,
        })),
        treatmentPlans: treatmentPlans.map((plan) => ({
          value: plan.id,
          label: plan.name,
        })),
        packageMasters: packageMasters.map((pkg) => ({
          value: pkg.id,
          label: pkg.name,
        })),
        therapists: mapTherapistSelectOptions(therapists),
        doctors: doctors.map((doctor) => ({
          value: doctor.name || doctor.doctorName || doctor.id,
          label: doctor.name || doctor.doctorName || '—',
        })),
      } satisfies DoctorFormMasterOptions;
    },
    {
      consultationTypes: [],
      treatmentPlans: [],
      packageMasters: [],
      therapists: [],
      doctors: [],
    },
  );

  const [patient, setPatient] = useState<PatientDetail | undefined>();
  const [workflowStep, setWorkflowStep] = useState(1);
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<PatientDetailTab | null>(null);
  const [pendingAction, setPendingAction] = useState<'step' | 'tab' | null>(null);

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => navigate('/appointments')}
      >
        <Plus className="h-4 w-4" />
        Book Appointment
      </Button>
    ),
    [navigate],
  );

  usePageAction(headerAction);

  useEffect(() => {
    if (loadedPatient) {
      setPatient(loadedPatient);
    }
  }, [loadedPatient]);

  const personalDefaults = useMemo(
    () => (patient ? mapPatientToPersonalForm(patient) : undefined),
    [patient],
  );
  const medicalDefaults = useMemo(
    () => (patient ? mapPatientToMedicalForm(patient) : undefined),
    [patient],
  );
  const treatmentDefaults = useMemo(
    () => (patient ? mapPatientToTreatmentForm(patient) : undefined),
    [patient],
  );
  const billingDefaults = useMemo(
    () => (patient ? mapPatientToBillingForm(patient) : undefined),
    [patient],
  );

  const saveCurrentTab = useCallback(
    (
      values:
        | DoctorPersonalTabValues
        | DoctorMedicalTabValues
        | DoctorTreatmentTabValues
        | DoctorBillingTabValues,
    ) => {
      if (!patient) return;
      let updated = patient;
      switch (activeTab) {
        case 'personal':
          updated = applyPersonalFormToPatient(patient, values as DoctorPersonalTabValues);
          break;
        case 'medical':
          updated = applyMedicalFormToPatient(patient, values as DoctorMedicalTabValues);
          break;
        case 'treatment':
          updated = applyTreatmentFormToPatient(
            patient,
            values as DoctorTreatmentTabValues,
            masterOptions.therapists,
          );
          break;
        case 'billing':
          updated = applyBillingFormToPatient(patient, values as DoctorBillingTabValues);
          break;
      }
      setPatient(updated);
      setIsDirty(false);
      showToast({
        title: 'Changes Saved',
        message: 'Patient details have been updated successfully.',
      });
    },
    [activeTab, patient, showToast, masterOptions.therapists],
  );

  const handleTabChange = (tab: PatientDetailTab) => {
    if (isEditing && isDirty) {
      setPendingTab(tab);
      setPendingAction('tab');
      setUnsavedOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    if (isEditing && isDirty) {
      setPendingAction('tab');
      setUnsavedOpen(true);
      return;
    }
    setIsEditing((prev) => !prev);
    setIsDirty(false);
  };

  useEffect(() => {
    scrollWorkflowToTop();
  }, [activeTab, workflowStep]);

  const handleNext = () => {
    if (workflowStep === 2) {
      const form = document.getElementById('doctor-prescription-form') as HTMLFormElement | null;
      form?.requestSubmit();
      return;
    }

    if (isEditing) {
      const form = document.getElementById(getFormId(activeTab)) as HTMLFormElement | null;
      form?.requestSubmit();
      return;
    }

    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex < TAB_ORDER.length - 1) {
      setActiveTab(TAB_ORDER[currentIndex + 1]);
      scrollWorkflowToTop();
      return;
    }
    setWorkflowStep(2);
    scrollWorkflowToTop();
  };

  const handleUnsavedConfirm = () => {
    setUnsavedOpen(false);
    const form = document.getElementById(getFormId(activeTab)) as HTMLFormElement | null;
    form?.requestSubmit();
    setPendingAction(null);
  };

  const handleUnsavedDiscard = () => {
    setUnsavedOpen(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    if (pendingAction === 'step') {
      setWorkflowStep(2);
    }
    setIsEditing(false);
    setIsDirty(false);
    setPendingAction(null);
  };

  const handleFormSubmit = (
    values:
      | DoctorPersonalTabValues
      | DoctorMedicalTabValues
      | DoctorTreatmentTabValues
      | DoctorBillingTabValues,
  ) => {
    saveCurrentTab(values);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsEditing(false);
      return;
    }
    if (pendingAction === 'step') {
      setWorkflowStep(2);
      setPendingAction(null);
      setIsEditing(false);
      return;
    }
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex < TAB_ORDER.length - 1) {
      setActiveTab(TAB_ORDER[currentIndex + 1]);
      scrollWorkflowToTop();
      return;
    }
    setWorkflowStep(2);
    scrollWorkflowToTop();
  };

  const handlePrescriptionSubmit = (values: DoctorPrescriptionValues) => {
    setPrescriptionDraft(values);
    setPrescriptionPreviewOpen(true);
  };

  const handlePrescriptionConfirm = async () => {
    setPrescriptionSubmitting(true);
    try {
      showToast({
        title: 'Prescription Created',
        message: 'Prescription has been saved successfully.',
      });
      setPrescriptionPreviewOpen(false);
      navigate('/doctors');
    } finally {
      setPrescriptionSubmitting(false);
    }
  };

  const nextLabel =
    workflowStep === 2
      ? 'Generate Prescription'
      : activeTab === 'billing' && !isEditing
        ? 'Next'
        : activeTab === 'billing' && isEditing
          ? 'Save & Continue'
          : 'Next';

  return (
    <div className="space-y-5">
      <DoctorPatientBreadcrumbs />

      <AsyncStatus
        loading={loading}
        error={error}
        onRetry={reload}
        empty={!loading && !error && !patient}
        emptyMessage="Patient not found."
      >
        {patient &&
          personalDefaults &&
          medicalDefaults &&
          treatmentDefaults &&
          billingDefaults && (
            <>
              <Stepper steps={WORKFLOW_STEPS} currentStep={workflowStep} />

              <Card className="p-5 sm:p-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-brown">{patient.name}</h2>
            <Badge variant="gold" className="rounded-md px-3 py-1">
              {patient.treatmentStatus}
            </Badge>
          </div>

          {workflowStep === 1 && (
            <div className="flex items-center justify-between gap-4">
              <UnderlineTabs
                tabs={detailTabs}
                activeTab={activeTab}
                onChange={handleTabChange}
                className="flex-1"
              />
              <button
                type="button"
                onClick={handleEditToggle}
                className={`rounded-full border p-2 transition-colors ${isEditing ? 'border-gold bg-gold/10 text-gold' : 'border-gray-200 text-text-muted hover:border-gold hover:text-gold'}`}
                aria-label={isEditing ? 'Exit edit mode' : 'Edit patient details'}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-8">
            {workflowStep === 1 && !isEditing && (
              <DoctorPatientViewTab patient={patient} activeTab={activeTab} />
            )}

            {workflowStep === 1 && isEditing && (
              <div onChange={() => setIsDirty(true)}>
                {activeTab === 'personal' && (
                  <DoctorPersonalForm
                    formId={getFormId('personal')}
                    defaultValues={personalDefaults}
                    onSubmit={handleFormSubmit}
                    masterOptions={masterOptions}
                  />
                )}
                {activeTab === 'medical' && (
                  <DoctorMedicalForm
                    formId={getFormId('medical')}
                    defaultValues={medicalDefaults}
                    onSubmit={handleFormSubmit}
                    patient={patient}
                  />
                )}
                {activeTab === 'treatment' && (
                  <DoctorTreatmentForm
                    formId={getFormId('treatment')}
                    defaultValues={treatmentDefaults}
                    onSubmit={handleFormSubmit}
                    masterOptions={masterOptions}
                  />
                )}
                {activeTab === 'billing' && (
                  <DoctorBillingForm
                    formId={getFormId('billing')}
                    defaultValues={billingDefaults}
                    onSubmit={handleFormSubmit}
                    masterOptions={masterOptions}
                  />
                )}
              </div>
            )}

            {workflowStep === 2 && (
              <CreatePrescriptionForm
                formId="doctor-prescription-form"
                patient={patient}
                onSubmit={handlePrescriptionSubmit}
              />
            )}
          </div>

          <div className="flex justify-end pt-4">
            {workflowStep === 2 && (
              <Button variant="outline" className="mr-3" onClick={() => setWorkflowStep(1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>{nextLabel}</Button>
          </div>
        </div>
      </Card>
            </>
          )}
      </AsyncStatus>

      {patient ? (
        <PrescriptionPreviewModal
          open={prescriptionPreviewOpen}
          onClose={() => setPrescriptionPreviewOpen(false)}
          onConfirm={() => void handlePrescriptionConfirm()}
          patient={patient}
          prescription={prescriptionDraft}
          submitting={prescriptionSubmitting}
        />
      ) : null}

      <UnsavedChangesModal
        open={unsavedOpen}
        onClose={() => {
          setUnsavedOpen(false);
          setPendingTab(null);
          setPendingAction(null);
        }}
        onConfirm={handleUnsavedConfirm}
        onDiscard={handleUnsavedDiscard}
      />
    </div>
  );
}
