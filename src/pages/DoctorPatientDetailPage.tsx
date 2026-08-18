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
import { createPackage } from '@/lib/api/packages';
import { loadPatientDetail } from '@/lib/api/loadPatientDetail';
import {
  createBilling,
} from '@/lib/api/billing';
import { ApiError } from '@/lib/api/client';
import { getAllMedicines } from '@/lib/api/medicines';
import {
  createPrescription,
  getPrescriptionById,
  type PrescriptionDto,
} from '@/lib/api/prescriptions';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
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

function toPatientPackageStatus(
  status?: string,
): 'SCHEDULED' | 'ONGOING' | 'COMPLETED' {
  const normalized = status?.trim().toUpperCase();
  if (normalized === 'COMPLETED') return 'COMPLETED';
  if (normalized === 'ACTIVE' || normalized === 'ONGOING') return 'ONGOING';
  return 'SCHEDULED';
}

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
  const [savedPrescription, setSavedPrescription] =
    useState<PrescriptionDto | null>(null);
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
          packagePrice: pkg.packagePrice,
        })),
        therapists: mapTherapistSelectOptions(therapists),
        doctors: doctors.map((doctor) => ({
          value: doctor.id,
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
    async (
      values:
        | DoctorPersonalTabValues
        | DoctorMedicalTabValues
        | DoctorTreatmentTabValues
        | DoctorBillingTabValues,
    ) => {
      if (!patient) return false;
      let updated = patient;
      switch (activeTab) {
        case 'personal':
          updated = applyPersonalFormToPatient(
            patient,
            values as DoctorPersonalTabValues,
            masterOptions.doctors,
          );
          break;
        case 'medical':
          updated = applyMedicalFormToPatient(patient, values as DoctorMedicalTabValues);
          break;
        case 'treatment':
          updated =           applyTreatmentFormToPatient(
            patient,
            values as DoctorTreatmentTabValues,
            masterOptions.therapists,
            masterOptions.doctors,
          );
          break;
        case 'billing': {
          const billingValues = values as DoctorBillingTabValues;
          updated = applyBillingFormToPatient(patient, billingValues);
          try {
            if (billingValues.packageMasterId) {
              await createPackage({
                patientId: patient.detailId,
                packageMasterId: billingValues.packageMasterId,
                validity: billingValues.validity || '',
                status: toPatientPackageStatus(
                  billingValues.membershipStatus,
                ),
                discountApplied: Number(billingValues.discountApplied) || 0,
              });
            }

            const draft = await createBilling({
              patientId: patient.detailId,
              patientName: patient.name,
              contactNumber: patient.phone.replace(/\D/g, '').slice(-10),
              billingDate: new Date().toISOString().slice(0, 10),
              services: billingValues.billingServices.map((row) => ({
                serviceType: row.serviceType,
                serviceFees: Number(row.serviceFees) || 0,
              })),
            });
            updated = {
              ...updated,
              billing: {
                ...updated.billing,
                billingDraftId: draft.id,
                billingDraftStatus: 'PENDING',
              },
            };
          } catch (err) {
            showToast({
              title: 'Billing draft failed',
              message: resolveErrorMessage(err, UI_MESSAGES.error.saveFailed),
            });
            return false;
          }
          break;
        }
      }
      setPatient(updated);
      setIsDirty(false);
      showToast({
        title: 'Changes Saved',
        message:
          activeTab === 'billing'
            ? 'Pending billing draft has been saved for reception.'
            : 'Patient details have been updated successfully.',
      });
      return true;
    },
    [activeTab, patient, showToast, masterOptions.therapists, masterOptions.doctors],
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

  const handleFormSubmit = async (
    values:
      | DoctorPersonalTabValues
      | DoctorMedicalTabValues
      | DoctorTreatmentTabValues
      | DoctorBillingTabValues,
  ) => {
    const saved = await saveCurrentTab(values);
    if (!saved) return;
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
    setSavedPrescription(null);
    setPrescriptionDraft(values);
    setPrescriptionPreviewOpen(true);
  };

  const handlePrescriptionConfirm = async () => {
    if (!patient || !prescriptionDraft) return;
    const assignedDoctorId = patient.assignedDoctorId?.trim();
    if (!patient.bookingId || !assignedDoctorId) {
      showToast({
        title: 'Missing appointment details',
        message:
          'A booking and assigned doctor are required before generating a prescription.',
      });
      return;
    }

    setPrescriptionSubmitting(true);
    try {
      const catalogue = await getAllMedicines().catch(() => []);
      const medicineNames = new Map(
        catalogue.map((item) => [item.id, item.medicineName]),
      );
      const medicines = (prescriptionDraft.medicines ?? [])
        .filter((row) => row.medicineId)
        .map((row) => ({
          medicineId: row.medicineId as string,
          medicineName: medicineNames.get(row.medicineId as string),
          dosage: row.dosage ?? '',
          frequency: row.frequency ?? '',
          duration: row.duration ?? '',
          notes: row.notes,
        }));
      const therapySuggestions = (prescriptionDraft.therapies ?? [])
        .filter(
          (row) => Boolean(row.categoryId) && (row.therapyIds?.length ?? 0) > 0,
        )
        .map((row) => ({
          therapyCategoryId: row.categoryId as string,
          recommendedTherapyIds: row.therapyIds ?? [],
        }));

      const created = await createPrescription({
        patientId: patient.detailId,
        appointmentBookingId: patient.bookingId,
        assignedDoctorId,
        medicines: medicines.length ? medicines : undefined,
        therapySuggestions: therapySuggestions.length
          ? therapySuggestions
          : undefined,
        nextFollowUp: {
          setUpRequired: prescriptionDraft.setupRequired === 'Yes',
          schedulingOption:
            prescriptionDraft.setupRequired === 'Yes'
              ? prescriptionDraft.followUpScheduling
              : undefined,
          suggestions: prescriptionDraft.suggestions,
        },
        diagnosis: prescriptionDraft.diagnosis,
        notes: prescriptionDraft.notes,
      });
      const enriched = await getPrescriptionById(created.id).catch(() => created);
      setSavedPrescription(enriched);
      showToast({
        title: 'Prescription Created',
        message: 'Prescription has been saved successfully.',
      });
    } catch (err) {
      showToast({
        title: 'Prescription failed',
        message:
          err instanceof ApiError
            ? err.message
            : resolveErrorMessage(err, UI_MESSAGES.error.saveFailed),
      });
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
          onClose={() => {
            setPrescriptionPreviewOpen(false);
            if (savedPrescription) {
              navigate('/doctors');
            }
          }}
          onConfirm={() => void handlePrescriptionConfirm()}
          patient={patient}
          prescription={prescriptionDraft}
          enriched={savedPrescription}
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
