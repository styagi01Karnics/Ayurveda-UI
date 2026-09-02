import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { completeAppointment } from '@/lib/api/appointments';
import { createPackage } from '@/lib/api/packages';
import { createFollowUp } from '@/lib/api/followUps';
import { loadPatientDetail } from '@/lib/api/loadPatientDetail';
import {
  createBilling,
} from '@/lib/api/billing';
import { ApiError } from '@/lib/api/client';
import { getAllMedicines } from '@/lib/api/medicines';
import {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  type PrescriptionDto,
} from '@/lib/api/prescriptions';
import {
  createTreatment,
  updateTreatment,
} from '@/lib/api/treatments';
import { toFollowUpAppointmentDateIso } from '@/lib/followUpSchedule';
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

function mapPrescriptionToForm(
  prescription: PrescriptionDto,
): DoctorPrescriptionValues {
  return {
    diagnosis: prescription.diagnosis ?? '',
    notes: prescription.notes ?? '',
    medicines: (prescription.medicines ?? []).map((row) => ({
      medicineId: row.medicineId ?? '',
      dosage: row.dosage ?? '',
      frequency: row.frequency ?? '',
      duration: row.duration ?? '',
      notes: row.notes ?? '',
    })),
  };
}

function resolveFollowUpVisitTypeId(
  patient: PatientDetail,
  consultationTypes: { value: string; label: string }[],
): string {
  const followUpType = consultationTypes.find((type) =>
    /follow/i.test(type.label),
  );
  if (followUpType?.value) return followUpType.value;
  if (patient.consultationTypeIds?.[0]) return patient.consultationTypeIds[0];
  return consultationTypes[0]?.value ?? '';
}

function scrollWorkflowToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function getFormId(tab: PatientDetailTab): string {
  return `doctor-patient-${tab}-form`;
}

export function DoctorPatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingIdFromQuery = searchParams.get('bookingId') ?? '';
  const editPrescription = searchParams.get('editPrescription') === 'true';
  const [prescriptionPreviewOpen, setPrescriptionPreviewOpen] = useState(false);
  const [prescriptionDraft, setPrescriptionDraft] =
    useState<DoctorPrescriptionValues | null>(null);
  const [savedPrescription, setSavedPrescription] =
    useState<PrescriptionDto | null>(null);
  const [existingPrescription, setExistingPrescription] =
    useState<PrescriptionDto | null>(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
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

  useEffect(() => {
    if (!editPrescription || !patient) return;
    let active = true;
    setWorkflowStep(2);
    setPrescriptionLoading(true);
    void getPrescriptionsByPatient(patient.detailId)
      .then((prescriptions) => {
        if (!active) return;
        const matchingPrescriptions = prescriptions
          .filter(
            (item) =>
              !bookingIdFromQuery ||
              item.appointmentBookingId === bookingIdFromQuery,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
              new Date(a.updatedAt ?? a.createdAt ?? 0).getTime(),
          );
        const prescription = matchingPrescriptions[0] ?? prescriptions[0];
        setExistingPrescription(prescription ?? null);
        if (!prescription) {
          showToast({
            title: 'Prescription not found',
            message: 'No prescription was found for this completed appointment.',
          });
        }
      })
      .catch((err) => {
        if (!active) return;
        showToast({
          title: 'Could not load prescription',
          message: resolveErrorMessage(err, UI_MESSAGES.error.loadFailed),
        });
      })
      .finally(() => {
        if (active) setPrescriptionLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    bookingIdFromQuery,
    editPrescription,
    patient,
    showToast,
  ]);

  const prescriptionInitialValues = useMemo(
    () =>
      existingPrescription
        ? mapPrescriptionToForm(existingPrescription)
        : undefined,
    [existingPrescription],
  );
  const prescriptionMedicineOptions = useMemo(
    () =>
      (existingPrescription?.medicines ?? [])
        .filter((medicine) => medicine.medicineId)
        .map((medicine) => ({
          value: medicine.medicineId as string,
          label: medicine.medicineName || 'Medicine',
        })),
    [existingPrescription],
  );

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
        case 'treatment': {
          const treatmentValues = values as DoctorTreatmentTabValues;
          updated = applyTreatmentFormToPatient(
            patient,
            treatmentValues,
            masterOptions.therapists,
            masterOptions.doctors,
          );
          try {
            const treatmentPayload = {
              treatmentPlanId: treatmentValues.treatmentPlanId,
              startDate: treatmentValues.startDate,
              endDate: treatmentValues.endDate,
              totalSessions: Number(treatmentValues.totalSessions) || 0,
              completedSessions: Number(treatmentValues.completedSessions) || 0,
              assignedTherapistId: treatmentValues.assignedTherapistId,
            };

            const savedTreatment = patient.treatmentFollowUp.id
              ? await updateTreatment(
                  patient.treatmentFollowUp.id,
                  treatmentPayload,
                )
              : await createTreatment({
                  patientId: patient.detailId,
                  ...treatmentPayload,
                  treatmentStatus: 'SCHEDULED',
                });

            updated = {
              ...updated,
              treatmentFollowUp: {
                ...updated.treatmentFollowUp,
                id: savedTreatment.id,
                treatmentPlanId: savedTreatment.treatmentPlanId,
                treatmentName:
                  savedTreatment.treatmentPlanName ||
                  updated.treatmentFollowUp.treatmentName,
                remainingSessions: savedTreatment.remainingSessions,
              },
            };

            if (treatmentValues.setupRequired === 'Yes') {
              const visitTypeId = resolveFollowUpVisitTypeId(
                patient,
                masterOptions.consultationTypes,
              );
              if (!visitTypeId) {
                throw new Error(
                  'A visit type is required to schedule the follow-up.',
                );
              }
              const baseDate =
                patient.personalInfo.registrationDate ||
                patient.appointmentDate ||
                treatmentValues.startDate;
              await createFollowUp({
                patientId: patient.detailId,
                assignedDoctorId: treatmentValues.assignedDoctor || '',
                sourceBookingId: patient.bookingId || undefined,
                visitTypeId,
                appointmentDate: toFollowUpAppointmentDateIso(
                  baseDate,
                  treatmentValues.followUpScheduling,
                ),
                schedulingOption:
                  treatmentValues.followUpScheduling || 'AFTER_7_DAYS',
                smsReminderEnabled: treatmentValues.autoSmsReminder,
                status: 'UPCOMING',
              });
            }
          } catch (err) {
            showToast({
              title: 'Treatment save failed',
              message: resolveErrorMessage(err, UI_MESSAGES.error.saveFailed),
            });
            return false;
          }
          break;
        }
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
          } catch (err) {
            showToast({
              title: 'Package save failed',
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
            ? 'Billing details saved. Draft will be created after the prescription is generated.'
            : 'Patient details have been updated successfully.',
      });
      return true;
    },
    [activeTab, patient, showToast, masterOptions],
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

  const handlePrintExistingPrescription = () => {
    if (!existingPrescription || !prescriptionInitialValues) return;
    setPrescriptionDraft(prescriptionInitialValues);
    setSavedPrescription(existingPrescription);
    setPrescriptionPreviewOpen(true);
  };

  const handlePrescriptionConfirm = async () => {
    if (!patient || !prescriptionDraft) return;
    const assignedDoctorId = patient.assignedDoctorId?.trim();
    const appointmentBookingId = bookingIdFromQuery || patient.bookingId;
    if (!appointmentBookingId || !assignedDoctorId) {
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
      const medicineById = new Map(catalogue.map((item) => [item.id, item]));
      const medicines = (prescriptionDraft.medicines ?? [])
        .filter((row) => row.medicineId)
        .map((row) => ({
          medicineId: row.medicineId as string,
          medicineName: medicineById.get(row.medicineId as string)?.medicineName,
          dosage: row.dosage ?? '',
          frequency: row.frequency ?? '',
          duration: row.duration ?? '',
          notes: row.notes,
        }));

      const prescriptionPayload = {
        patientId: patient.detailId,
        appointmentBookingId,
        assignedDoctorId,
        medicines: medicines.length ? medicines : undefined,
        diagnosis: prescriptionDraft.diagnosis,
        notes: prescriptionDraft.notes,
      };
      const saved = existingPrescription
        ? await updatePrescription(existingPrescription.id, prescriptionPayload)
        : await createPrescription(prescriptionPayload);
      let completionError: unknown = null;
      if (!existingPrescription) {
        try {
          await completeAppointment(appointmentBookingId);
        } catch (err) {
          completionError = err;
        }
      }

      let billingError: unknown = null;
      let nextPatient = patient;
      if (!existingPrescription && !patient.billing.billingDraftId) {
        try {
          const toBillingServiceType = (raw: string | undefined) => {
            const upper = (raw || 'CONSULTATION')
              .toUpperCase()
              .replace(/[\s+-]+/g, '_');
            if (upper.includes('THERAPY')) return 'THERAPY';
            if (upper.includes('FOLLOW')) return 'FOLLOW_UP';
            if (upper.includes('PACKAGE')) return 'PACKAGE';
            // Doc: consultation (+ medicines) still uses CONSULTATION
            return 'CONSULTATION';
          };

          const services = (
            patient.billing.billingServices?.length
              ? patient.billing.billingServices
              : [
                  {
                    serviceType: patient.billing.serviceType || 'Consultation',
                    serviceFees: patient.billing.serviceFees || 0,
                    packageMasterId: patient.billing.packageMasterId,
                    packageType: patient.billing.packageType,
                    packageCharges: patient.billing.packageCharges,
                  },
                ]
          ).map((row) => ({
            serviceType: toBillingServiceType(row.serviceType),
            serviceFees: Number(row.serviceFees) || 0,
            packageMasterId: row.packageMasterId?.trim() || null,
            packageType: row.packageType?.trim() || null,
            packageCharges: row.packageCharges
              ? Number(row.packageCharges)
              : null,
          }));

          const draft = await createBilling({
            patientId: patient.detailId,
            patientName: patient.name,
            contactNumber: patient.phone.replace(/\D/g, '').slice(-10),
            billingDate: new Date().toISOString().slice(0, 10),
            services,
          });
          nextPatient = {
            ...patient,
            billing: {
              ...patient.billing,
              billingDraftId: draft.id,
              billingDraftStatus: 'PENDING',
            },
          };
          setPatient(nextPatient);
        } catch (err) {
          billingError = err;
        }
      }

      const enriched = await getPrescriptionById(saved.id).catch(() => saved);
      setExistingPrescription(enriched);
      setSavedPrescription(enriched);
      showToast({
        title: completionError
          ? 'Prescription created'
          : billingError
            ? 'Prescription created'
            : existingPrescription
              ? 'Prescription Updated'
              : 'Prescription Created',
        message: completionError
          ? `Prescription was saved, but the appointment could not be completed. ${resolveErrorMessage(
              completionError,
              'Please complete it from the Doctor tab.',
            )}`
          : billingError
            ? `Prescription was saved, but the billing draft failed. ${resolveErrorMessage(
                billingError,
                UI_MESSAGES.error.saveFailed,
              )}`
            : existingPrescription
              ? 'Prescription changes have been saved successfully.'
              : 'Prescription has been saved, billing draft created, and the appointment is completed.',
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
      ? existingPrescription
        ? 'Save'
        : 'Generate Prescription'
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
              prescriptionLoading ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  Loading prescription…
                </p>
              ) : (
                <CreatePrescriptionForm
                  key={existingPrescription?.id ?? 'new-prescription'}
                  formId="doctor-prescription-form"
                  patient={patient}
                  onSubmit={handlePrescriptionSubmit}
                  initialValues={prescriptionInitialValues}
                  initialMedicineOptions={prescriptionMedicineOptions}
                />
              )
            )}
          </div>

          <div className="flex justify-end pt-4">
            {workflowStep === 2 && (
              <>
                <Button variant="outline" className="mr-3" onClick={() => setWorkflowStep(1)}>
                  Back
                </Button>
                {existingPrescription ? (
                  <Button
                    variant="outline"
                    className="mr-3"
                    onClick={handlePrintExistingPrescription}
                  >
                    Print
                  </Button>
                ) : null}
              </>
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
            if (savedPrescription && !editPrescription) {
              navigate('/doctors');
            }
          }}
          onConfirm={() => void handlePrescriptionConfirm()}
          patient={patient}
          prescription={prescriptionDraft}
          enriched={savedPrescription}
          submitting={prescriptionSubmitting}
          confirmLabel={
            existingPrescription ? 'Save Prescription' : 'Confirm Prescription'
          }
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
