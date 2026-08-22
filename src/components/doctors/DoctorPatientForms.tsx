import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactNode } from 'react';
import { FileText, Folder, X } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { DocumentUploadDropzone } from '@/components/ui/DocumentUploadDropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TagInput } from '@/components/ui/TagInput';
import { Badge } from '@/components/ui/Badge';
import { uploadDocument, type DocumentTypeApi } from '@/lib/api/documents';
import {
  DOCUMENT_SECTIONS,
  formatDocumentFileSize,
} from '@/lib/documentUpload';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';
import {
  CONSTITUTION_OPTIONS,
  DOSHA_OPTIONS,
  GENDER_OPTIONS,
  ID_PROOF_TYPES,
  OCCUPATION_OPTIONS,
  RELATION_OPTIONS,
} from '@/lib/validation/patient.schema';
import { getMedicalHistoryOptions } from '@/data/mock/medicalHistoryDefaults';
import {
  doctorBillingTabSchema,
  doctorMedicalTabSchema,
  doctorPersonalTabSchema,
  doctorTreatmentTabSchema,
  FOLLOW_UP_OPTIONS,
  MEMBERSHIP_STATUS_OPTIONS,
  computeRemainingSessions,
  YES_NO_OPTIONS,
  type DoctorBillingTabValues,
  type DoctorMedicalTabValues,
  type DoctorPersonalTabValues,
  type DoctorTreatmentTabValues,
} from '@/lib/validation/doctorPatient.schema';
import { VISIT_TYPE_OPTIONS } from '@/lib/validation/billing.schema';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/validation/signup.schema';
import type { PatientDetail } from '@/types';
import {
  BillingMembershipTab,
  MedicalAssessmentTab,
  PersonalInfoTab,
  TreatmentFollowUpTab,
} from '@/components/patients/PatientDetailTabs';

function FormSection({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brown">{title}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-text-muted hover:bg-brown/5"
            aria-label={`Remove ${title}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

interface TabFormProps<T> {
  defaultValues: T;
  onSubmit: (values: T) => void;
  formId: string;
}

export interface DoctorFormMasterOptions {
  consultationTypes: { value: string; label: string }[];
  treatmentPlans: { value: string; label: string }[];
  packageMasters: { value: string; label: string; packagePrice?: number }[];
  therapists: { value: string; label: string }[];
  doctors: { value: string; label: string }[];
}

const BILLING_PACKAGE_TYPE_OPTIONS = [
  { value: 'Monthly', label: 'Monthly', packagePrice: 2000 },
  { value: 'Quarterly', label: 'Quarterly', packagePrice: 5000 },
  { value: 'Yearly', label: 'Yearly', packagePrice: 10000 },
] as const;

export function DoctorPersonalForm({
  defaultValues,
  onSubmit,
  formId,
  masterOptions,
}: TabFormProps<DoctorPersonalTabValues> & {
  masterOptions?: Pick<DoctorFormMasterOptions, 'consultationTypes' | 'doctors'>;
}) {
  const form = useForm<DoctorPersonalTabValues>({
    resolver: zodResolver(doctorPersonalTabSchema),
    defaultValues,
  });
  const selectedState = form.watch('state');

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Full Name" error={form.formState.errors.fullName?.message} {...form.register('fullName')} />
          <Select label="Gender" options={[...GENDER_OPTIONS]} error={form.formState.errors.gender?.message} {...form.register('gender')} />
          <Input label="Date of Birth" type="date" error={form.formState.errors.dateOfBirth?.message} {...form.register('dateOfBirth')} />
          <Input label="Age" error={form.formState.errors.age?.message} {...form.register('age')} />
          <TagInput
            label="Consultation Type"
            value={form.watch('consultationTypeIds') ?? []}
            onChange={(tags) =>
              form.setValue('consultationTypeIds', tags, { shouldValidate: true })
            }
            options={masterOptions?.consultationTypes ?? []}
            error={form.formState.errors.consultationTypeIds?.message}
          />
          <Input
            label="Registration Date"
            type="date"
            readOnly
            tabIndex={-1}
            className="cursor-not-allowed bg-gray-50"
            error={form.formState.errors.registrationDate?.message}
            {...form.register('registrationDate')}
          />
          <Select
            label="Assigned Doctor"
            placeholder="Select doctor"
            options={masterOptions?.doctors ?? []}
            error={form.formState.errors.assignedDoctor?.message}
            {...form.register('assignedDoctor')}
          />
        </div>
      </FormSection>

      <FormSection title="Contact Information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Mobile Number" error={form.formState.errors.mobileNumber?.message} {...form.register('mobileNumber')} />
          <Input label="Email Address" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <Select label="State" options={[...INDIAN_STATES]} error={form.formState.errors.state?.message} {...form.register('state', { onChange: () => form.setValue('city', '') })} />
          <Select label="City" options={selectedState ? (CITIES_BY_STATE[selectedState] ?? []) : []} error={form.formState.errors.city?.message} {...form.register('city')} />
          <Textarea label="Permanent Address" className="sm:col-span-2 lg:col-span-3" rows={3} error={form.formState.errors.permanentAddress?.message} {...form.register('permanentAddress')} />
        </div>
      </FormSection>

      <FormSection title="Emergency Contact">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Name" error={form.formState.errors.emergencyName?.message} {...form.register('emergencyName')} />
          <Select label="Relation" options={[...RELATION_OPTIONS]} error={form.formState.errors.emergencyRelation?.message} {...form.register('emergencyRelation')} />
          <Input label="Phone Number" error={form.formState.errors.emergencyPhone?.message} {...form.register('emergencyPhone')} />
        </div>
      </FormSection>

      <FormSection title="Identification & Admin">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="ID Proof Type" options={[...ID_PROOF_TYPES]} error={form.formState.errors.idProofType?.message} {...form.register('idProofType')} />
          <Input label="ID No." error={form.formState.errors.idNumber?.message} {...form.register('idNumber')} />
          <Select label="Occupation" placeholder="Select" options={[...OCCUPATION_OPTIONS]} error={form.formState.errors.occupation?.message} {...form.register('occupation')} />
          <Input label="Insurance Details (Optional)" {...form.register('insuranceDetails')} />
        </div>
      </FormSection>
    </form>
  );
}

export function DoctorMedicalForm({
  defaultValues,
  onSubmit,
  formId,
  patient,
}: TabFormProps<DoctorMedicalTabValues> & { patient: PatientDetail }) {
  const form = useForm<DoctorMedicalTabValues>({
    resolver: zodResolver(doctorMedicalTabSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const physicalFields = [
    'weight', 'height', 'ibw', 'pulse', 'bp', 'temperature', 'pallor',
    'icterus', 'cyanosis', 'lymphNodes', 'oedema', 'sensorium',
    'acidityGas', 'motion', 'micturition',
  ] as const;
  const historyOptions = getMedicalHistoryOptions(patient.personalInfo.gender);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Ayurvedic Assessment">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Dosha Type" options={[...DOSHA_OPTIONS]} error={form.formState.errors.doshaType?.message} {...form.register('doshaType')} />
          <TagInput
            label="Body Constitution"
            value={form.watch('bodyConstitution') ?? []}
            onChange={(tags) => form.setValue('bodyConstitution', tags, { shouldValidate: true })}
            options={CONSTITUTION_OPTIONS}
            error={form.formState.errors.bodyConstitution?.message}
          />
          <Input label="Current Imbalances" error={form.formState.errors.currentImbalance?.message} {...form.register('currentImbalance')} />
        </div>
      </FormSection>

      <FormSection title="Physical Examination">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {physicalFields.map((field) => (
            <Input
              key={field}
              label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              error={form.formState.errors[field]?.message}
              {...form.register(field)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Medical History">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Present Medical Conditions" {...form.register('presentConditions')} />
          <TagInput
            label="Past Medical Conditions"
            value={form.watch('pastConditions') ?? []}
            onChange={(tags) =>
              form.setValue('pastConditions', tags, { shouldValidate: true })
            }
            options={historyOptions.pastConditions}
          />
          <TagInput
            label="Past Surgeries"
            value={form.watch('pastSurgeries') ?? []}
            onChange={(tags) =>
              form.setValue('pastSurgeries', tags, { shouldValidate: true })
            }
            options={historyOptions.pastSurgeries}
          />
          <TagInput
            label="Current Medications"
            value={form.watch('currentMedications') ?? []}
            onChange={(tags) =>
              form.setValue('currentMedications', tags, {
                shouldValidate: true,
              })
            }
            options={historyOptions.currentMedications}
          />
          <TagInput
            label="Allergies"
            value={form.watch('allergies') ?? []}
            onChange={(tags) => form.setValue('allergies', tags)}
            options={historyOptions.allergies}
          />
          <Textarea label="Family History" className="sm:col-span-2" rows={2} {...form.register('familyHistory')} />
        </div>
      </FormSection>

      <FormSection title="Lifestyle Information">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Diet Type" options={['Vegetarian', 'Non-Vegetarian', 'Vegan']} {...form.register('dietType')} />
          <Input label="Sleep Pattern" {...form.register('sleepPattern')} />
          <Select label="Exercise Habits" options={['Daily', 'Occasional walking', 'None']} {...form.register('exerciseHabits')} />
          <Input label="Addiction" {...form.register('addictions')} />
        </div>
      </FormSection>

      <FormSection title="Systemic Examination">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input label="Cardiovascular" {...form.register('cardiovascular')} />
          <Input label="Respiratory" {...form.register('respiratory')} />
          <Input label="Nervous" {...form.register('nervous')} />
          <Input label="Abdomen & GI" {...form.register('abdomenGi')} />
          <Input label="Locomotor" {...form.register('locomotor')} />
        </div>
      </FormSection>

      <FormSection title="Treatment Plan">
        <div className="grid gap-4 sm:grid-cols-2">
          <Textarea label="Investigation & Plan Suggested" rows={3} {...form.register('investigationPlan')} />
          <Textarea label="Plan Taken" rows={3} {...form.register('planDetails')} />
        </div>
      </FormSection>

      <FormSection title="Upload Reports">
        <ReportUploadSection patient={patient} />
      </FormSection>
    </form>
  );
}

function ReportUploadSection({ patient }: { patient: PatientDetail }) {
  const { showToast } = useToast();
  const [activeType, setActiveType] = useState<DocumentTypeApi>(
    DOCUMENT_SECTIONS[0].type,
  );
  const [reports, setReports] = useState(patient.medicalAssessment.reports);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setReports(patient.medicalAssessment.reports);
  }, [patient.medicalAssessment.reports]);

  const canUpload = Boolean(patient.detailId && patient.bookingId);

  const sectionLabel = (type: DocumentTypeApi) =>
    DOCUMENT_SECTIONS.find((section) => section.type === type)?.label ?? type;

  const handleFilesSelected = async (fileList: FileList) => {
    if (!patient.detailId || !patient.bookingId) {
      showToast({
        title: 'Upload unavailable',
        message: UI_MESSAGES.error.bookingRequired,
      });
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      try {
        await uploadDocument(
          patient.detailId,
          patient.bookingId,
          activeType,
          file,
        );
        successCount += 1;
        setReports((prev) => [
          {
            name: file.name,
            size: formatDocumentFileSize(file.size),
            time: sectionLabel(activeType),
            type: 'file' as const,
          },
          ...prev,
        ]);
      } catch (err) {
        showToast({
          title: 'Upload failed',
          message: resolveErrorMessage(err, UI_MESSAGES.error.uploadFailed),
        });
      }
    }

    setUploading(false);

    if (successCount > 0) {
      showToast({
        title: 'Documents uploaded',
        message: UI_MESSAGES.success.uploaded,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide">
        {DOCUMENT_SECTIONS.map((section) => (
          <button
            key={section.type}
            type="button"
            onClick={() => setActiveType(section.type)}
            className={cn(
              activeType === section.type
                ? 'text-gold'
                : 'text-text-muted hover:text-brown',
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      {!canUpload && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          Patient or booking ID is missing. Document upload is unavailable.
        </p>
      )}

      <DocumentUploadDropzone
        title={`Tap to upload ${sectionLabel(activeType).toLowerCase()}`}
        disabled={!canUpload || uploading}
        onFilesSelected={(files) => void handleFilesSelected(files)}
      />

      <div className="space-y-2">
        {reports.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            {UI_MESSAGES.empty.uploadFiles}
          </p>
        ) : (
          reports.map((report) => (
            <div
              key={`${report.name}-${report.time}`}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {report.type === 'folder' ? (
                  <Folder className="h-5 w-5 text-gold" />
                ) : (
                  <FileText className="h-5 w-5 text-gold" />
                )}
                <div>
                  <p className="text-sm font-medium text-brown">{report.name}</p>
                  <p className="text-xs text-text-muted">{report.time}</p>
                </div>
              </div>
              <Badge variant="gold">{report.size}</Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function DoctorTreatmentForm({
  defaultValues,
  onSubmit,
  formId,
  masterOptions,
}: TabFormProps<DoctorTreatmentTabValues> & {
  masterOptions?: Pick<DoctorFormMasterOptions, 'treatmentPlans' | 'therapists' | 'doctors'>;
}) {
  const form = useForm<DoctorTreatmentTabValues>({
    resolver: zodResolver(doctorTreatmentTabSchema),
    defaultValues,
  });

  const totalSessions = form.watch('totalSessions');
  const completedSessions = form.watch('completedSessions');

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    form.setValue(
      'remainingSessions',
      computeRemainingSessions(totalSessions, completedSessions),
      { shouldValidate: true },
    );
  }, [totalSessions, completedSessions, form]);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Active Treatment Plan">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Treatment Plan" options={masterOptions?.treatmentPlans ?? []} error={form.formState.errors.treatmentPlanId?.message} {...form.register('treatmentPlanId')} />
          <Input label="Start Date" type="date" error={form.formState.errors.startDate?.message} {...form.register('startDate')} />
          <Input label="End Date" type="date" error={form.formState.errors.endDate?.message} {...form.register('endDate')} />
          <Input label="Total Sessions" type="number" min={0} placeholder="e.g. 10" error={form.formState.errors.totalSessions?.message} {...form.register('totalSessions')} />
          <Input label="Completed Sessions" type="number" min={0} placeholder="e.g. 3" error={form.formState.errors.completedSessions?.message} {...form.register('completedSessions')} />
          <Input label="Remaining Sessions" type="number" readOnly tabIndex={-1} className="bg-gray-50" error={form.formState.errors.remainingSessions?.message} {...form.register('remainingSessions')} />
          <Select
            label="Assigned Therapist"
            placeholder="Select therapist"
            options={masterOptions?.therapists ?? []}
            error={form.formState.errors.assignedTherapistId?.message}
            {...form.register('assignedTherapistId')}
          />
        </div>
      </FormSection>

      <FormSection title="Next Follow Up">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Set Up Required" options={[...YES_NO_OPTIONS]} error={form.formState.errors.setupRequired?.message} {...form.register('setupRequired')} />
          <Select label="Follow-up Scheduling Options" options={[...FOLLOW_UP_OPTIONS]} error={form.formState.errors.followUpScheduling?.message} {...form.register('followUpScheduling')} />
          <Select
            label="Assigned Doctor"
            placeholder="Select doctor"
            options={masterOptions?.doctors ?? []}
            error={form.formState.errors.assignedDoctor?.message}
            {...form.register('assignedDoctor')}
          />
        </div>
      </FormSection>

      <FormSection title="Follow Up Reminder">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-brown">Auto SMS</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.watch('autoSmsReminder')}
            onClick={() => form.setValue('autoSmsReminder', !form.watch('autoSmsReminder'))}
            className={`relative h-6 w-11 rounded-full transition-colors ${form.watch('autoSmsReminder') ? 'bg-gold' : 'bg-brown/30'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.watch('autoSmsReminder') ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>
      </FormSection>
    </form>
  );
}

export function DoctorBillingForm({
  defaultValues,
  onSubmit,
  formId,
  masterOptions,
}: TabFormProps<DoctorBillingTabValues> & {
  masterOptions?: Pick<DoctorFormMasterOptions, 'packageMasters'>;
}) {
  const form = useForm<DoctorBillingTabValues>({
    resolver: zodResolver(doctorBillingTabSchema),
    defaultValues,
  });

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields: serviceFields, append: appendService, remove: removeService } =
    useFieldArray({ control, name: 'billingServices' });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handlePackageTypeSelect = (index: number, packageType: string) => {
    setValue(`billingServices.${index}.packageType`, packageType, {
      shouldValidate: true,
    });
    const selected = BILLING_PACKAGE_TYPE_OPTIONS.find(
      (option) => option.value === packageType,
    );
    if (selected?.packagePrice != null) {
      setValue(
        `billingServices.${index}.packageCharges`,
        String(Math.round(selected.packagePrice)),
        { shouldValidate: true },
      );
    } else if (!packageType) {
      setValue(`billingServices.${index}.packageCharges`, '', {
        shouldValidate: true,
      });
    }
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Billing & Membership">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Package Name"
            placeholder="Select package"
            options={masterOptions?.packageMasters ?? []}
            error={errors.packageMasterId?.message}
            {...register('packageMasterId')}
          />
          <Input label="Validity" type="date" error={errors.validity?.message} {...register('validity')} />
          <Select
            label="Status"
            options={[...MEMBERSHIP_STATUS_OPTIONS]}
            error={errors.membershipStatus?.message}
            {...register('membershipStatus')}
          />
          <Input label="Discount Applied" error={errors.discountApplied?.message} {...register('discountApplied')} />
        </div>
      </FormSection>

      <FormSection title="Billing Details">
        <p className="mb-4 text-xs text-text-muted">
          Saved as a pending billing draft. Reception will add medicines, therapies,
          discount, and GST when generating the invoice.
        </p>
        <div className="space-y-6">
          {serviceFields.map((field, index) => (
            <div
              key={field.id}
              className={cn(index > 0 && 'border-t border-gray-100 pt-6')}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Service Type *"
                  placeholder="Service Type"
                  options={[...VISIT_TYPE_OPTIONS]}
                  error={errors.billingServices?.[index]?.serviceType?.message}
                  {...register(`billingServices.${index}.serviceType`)}
                />
                <RupeeInput
                  label="Service Fees *"
                  placeholder="0"
                  error={errors.billingServices?.[index]?.serviceFees?.message}
                  {...register(`billingServices.${index}.serviceFees`)}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Package Type (optional)"
                  placeholder="Select package type"
                  options={[
                    { value: '', label: 'None' },
                    ...BILLING_PACKAGE_TYPE_OPTIONS,
                  ]}
                  error={errors.billingServices?.[index]?.packageType?.message}
                  value={watch(`billingServices.${index}.packageType`) ?? ''}
                  onChange={(e) => handlePackageTypeSelect(index, e.target.value)}
                />
                <RupeeInput
                  label={
                    watch(`billingServices.${index}.packageType`)
                      ? 'Package Charges *'
                      : 'Package Charges'
                  }
                  placeholder="0"
                  readOnly
                  error={errors.billingServices?.[index]?.packageCharges?.message}
                  {...register(`billingServices.${index}.packageCharges`)}
                />
              </div>

              {serviceFields.length > 1 ? (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="rounded p-2 text-text-muted hover:bg-brown/5 hover:text-danger"
                    aria-label="Remove service"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendService({
                  serviceType: '',
                  serviceFees: '',
                  packageType: '',
                  packageCharges: '',
                })
              }
            >
              + Add More Service
            </Button>
          </div>
        </div>
        {errors.billingServices?.message ? (
          <p className="mt-2 text-xs text-danger">{errors.billingServices.message}</p>
        ) : null}
      </FormSection>
    </form>
  );
}

export function DoctorPatientViewTab({
  patient,
  activeTab,
}: {
  patient: PatientDetail;
  activeTab: 'personal' | 'medical' | 'treatment' | 'billing';
}) {
  switch (activeTab) {
    case 'personal':
      return <PersonalInfoTab patient={patient} />;
    case 'medical':
      return <MedicalAssessmentTab patient={patient} />;
    case 'treatment':
      return <TreatmentFollowUpTab patient={patient} />;
    case 'billing':
      return <BillingMembershipTab patient={patient} />;
  }
}
