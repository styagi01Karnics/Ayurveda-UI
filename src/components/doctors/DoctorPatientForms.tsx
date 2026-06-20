import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ReactNode } from 'react';
import { CloudUpload, FileText, Folder, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TagInput } from '@/components/ui/TagInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CONSTITUTION_OPTIONS,
  CONSULTATION_TYPES,
  DOSHA_OPTIONS,
  GENDER_OPTIONS,
  ID_PROOF_TYPES,
  LANGUAGE_OPTIONS,
  OCCUPATION_OPTIONS,
  RELATION_OPTIONS,
  THERAPIST_OPTIONS,
} from '@/lib/validation/patient.schema';
import {
  doctorBillingTabSchema,
  doctorMedicalTabSchema,
  doctorPersonalTabSchema,
  doctorPrescriptionSchema,
  doctorTreatmentTabSchema,
  FOLLOW_UP_OPTIONS,
  MEMBERSHIP_STATUS_OPTIONS,
  PACKAGE_TYPE_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  SESSION_OPTIONS,
  TREATMENT_PLAN_OPTIONS,
  YES_NO_OPTIONS,
  type DoctorBillingTabValues,
  type DoctorMedicalTabValues,
  type DoctorPersonalTabValues,
  type DoctorPrescriptionValues,
  type DoctorTreatmentTabValues,
} from '@/lib/validation/doctorPatient.schema';
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

export function DoctorPersonalForm({
  defaultValues,
  onSubmit,
  formId,
}: TabFormProps<DoctorPersonalTabValues>) {
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
          <Select label="Preferred Language" options={[...LANGUAGE_OPTIONS]} error={form.formState.errors.preferredLanguage?.message} {...form.register('preferredLanguage')} />
          <TagInput
            label="Consultation Type"
            value={form.watch('consultationTypes') ?? []}
            onChange={(tags) => form.setValue('consultationTypes', tags, { shouldValidate: true })}
            options={CONSULTATION_TYPES}
            error={form.formState.errors.consultationTypes?.message}
          />
          <Input label="Registration Date" type="date" error={form.formState.errors.registrationDate?.message} {...form.register('registrationDate')} />
          <Select label="Assigned Doctor" options={[...THERAPIST_OPTIONS]} error={form.formState.errors.assignedDoctor?.message} {...form.register('assignedDoctor')} />
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
          <Input label="Patient ID" error={form.formState.errors.patientId?.message} {...form.register('patientId')} />
          <Select label="ID Proof Type" options={[...ID_PROOF_TYPES]} error={form.formState.errors.idProofType?.message} {...form.register('idProofType')} />
          <Input label="ID No." error={form.formState.errors.idNumber?.message} {...form.register('idNumber')} />
          <Select label="Occupation" options={[...OCCUPATION_OPTIONS]} error={form.formState.errors.occupation?.message} {...form.register('occupation')} />
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
          <Input label="Past Medical Conditions" {...form.register('pastConditions')} />
          <Select label="Past Surgeries" options={[...YES_NO_OPTIONS]} {...form.register('pastSurgeries')} />
          <Select label="Current Medications" options={['BP tablets', 'None', 'Other']} {...form.register('currentMedications')} />
          <TagInput
            label="Allergies"
            value={form.watch('allergies') ?? []}
            onChange={(tags) => form.setValue('allergies', tags)}
            options={['Allergy 1', 'Allergy 2', 'Allergy 3']}
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
        <ReportUploadSection reports={patient.medicalAssessment.reports} />
      </FormSection>
    </form>
  );
}

function ReportUploadSection({
  reports,
}: {
  reports: PatientDetail['medicalAssessment']['reports'];
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        <span className="text-gold">Past Medical Reports</span>
        <span>Prescriptions</span>
        <span>Lab Reports</span>
      </div>
      <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/50 bg-gold/5 px-4 py-8 text-center">
        <CloudUpload className="h-8 w-8 text-gold" />
        <p className="text-sm font-medium text-brown">Tap to upload photo</p>
        <p className="text-xs text-text-muted">Only Supported: .jpg, .jpeg, .png</p>
      </div>
      <div className="space-y-2">
        {reports.map((report) => (
          <div key={report.name} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
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
            <div className="flex items-center gap-3">
              <Badge variant="gold">{report.size}</Badge>
              <button type="button" className="text-text-muted hover:text-danger" aria-label="Delete report">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DoctorTreatmentForm({
  defaultValues,
  onSubmit,
  formId,
}: TabFormProps<DoctorTreatmentTabValues>) {
  const form = useForm<DoctorTreatmentTabValues>({
    resolver: zodResolver(doctorTreatmentTabSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Active Treatment Plan">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Treatment Plan Name" options={[...TREATMENT_PLAN_OPTIONS]} error={form.formState.errors.treatmentPlanName?.message} {...form.register('treatmentPlanName')} />
          <Input label="Start Date" type="date" error={form.formState.errors.startDate?.message} {...form.register('startDate')} />
          <Input label="End Date" type="date" error={form.formState.errors.endDate?.message} {...form.register('endDate')} />
          <Select label="Total Sessions" options={[...SESSION_OPTIONS]} error={form.formState.errors.totalSessions?.message} {...form.register('totalSessions')} />
          <Select label="Completed Sessions" options={[...SESSION_OPTIONS]} error={form.formState.errors.completedSessions?.message} {...form.register('completedSessions')} />
          <Select label="Remaining Sessions" options={[...SESSION_OPTIONS]} error={form.formState.errors.remainingSessions?.message} {...form.register('remainingSessions')} />
          <Select label="Assigned Therapist" options={[...THERAPIST_OPTIONS, 'Meera']} error={form.formState.errors.assignedTherapist?.message} {...form.register('assignedTherapist')} />
        </div>
      </FormSection>

      <FormSection title="Next Follow Up">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Set Up Required" options={[...YES_NO_OPTIONS]} error={form.formState.errors.setupRequired?.message} {...form.register('setupRequired')} />
          <Select label="Follow-up Scheduling Options" options={[...FOLLOW_UP_OPTIONS]} error={form.formState.errors.followUpScheduling?.message} {...form.register('followUpScheduling')} />
          <Select label="Assigned Doctor" options={[...THERAPIST_OPTIONS]} error={form.formState.errors.assignedDoctor?.message} {...form.register('assignedDoctor')} />
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
}: TabFormProps<DoctorBillingTabValues>) {
  const form = useForm<DoctorBillingTabValues>({
    resolver: zodResolver(doctorBillingTabSchema),
    defaultValues,
  });
  const applyTax = form.watch('applyTax');

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Billing & Membership">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Package Name" options={[...TREATMENT_PLAN_OPTIONS]} error={form.formState.errors.packageName?.message} {...form.register('packageName')} />
          <Input label="Validity" type="date" error={form.formState.errors.validity?.message} {...form.register('validity')} />
          <Select label="Status" options={[...MEMBERSHIP_STATUS_OPTIONS]} error={form.formState.errors.membershipStatus?.message} {...form.register('membershipStatus')} />
          <Input label="Discount Applied" error={form.formState.errors.discountApplied?.message} {...form.register('discountApplied')} />
        </div>
      </FormSection>

      <FormSection title="Payment Setup">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Registration Fees" options={['400', '500', '800']} error={form.formState.errors.registrationFees?.message} {...form.register('registrationFees')} />
          <Select label="Payment Mode" options={[...PAYMENT_MODE_OPTIONS]} error={form.formState.errors.paymentMode?.message} {...form.register('paymentMode')} />
          <Select label="Partial Payment" options={[...YES_NO_OPTIONS]} error={form.formState.errors.partialPayment?.message} {...form.register('partialPayment')} />
          <Input label="Outstanding Amount" error={form.formState.errors.outstandingAmount?.message} {...form.register('outstandingAmount')} />
        </div>
      </FormSection>

      <FormSection title="Billing Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Service Type" options={['Consultation', 'Therapy']} error={form.formState.errors.serviceType?.message} {...form.register('serviceType')} />
          <Input label="Service Fees (₹)" error={form.formState.errors.serviceFees?.message} {...form.register('serviceFees')} />
          <Select label="Package Type" options={[...PACKAGE_TYPE_OPTIONS]} error={form.formState.errors.packageType?.message} {...form.register('packageType')} />
          <Input label="Package Charges (₹)" error={form.formState.errors.packageCharges?.message} {...form.register('packageCharges')} />
          <Input label="Discount (if any) (₹)" error={form.formState.errors.discount?.message} {...form.register('discount')} />
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-brown">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-gold focus:ring-gold"
                {...form.register('applyTax')}
              />
              CGST & SGST
            </label>
            {applyTax && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input label="CGST" {...form.register('cgst')} />
                <Input label="SGST" {...form.register('sgst')} />
              </div>
            )}
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-4">
          + Add More Service
        </Button>
      </FormSection>
    </form>
  );
}

export function CreatePrescriptionForm({
  onSubmit,
  formId,
}: {
  onSubmit: (values: DoctorPrescriptionValues) => void;
  formId: string;
}) {
  const form = useForm<DoctorPrescriptionValues>({
    resolver: zodResolver(doctorPrescriptionSchema),
    defaultValues: {
      diagnosis: '',
      medicines: '',
      dosageInstructions: '',
      duration: '',
      followUpDate: '',
      notes: '',
    },
  });

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Prescription Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Diagnosis" error={form.formState.errors.diagnosis?.message} {...form.register('diagnosis')} />
          <Input label="Duration" placeholder="e.g. 14 days" error={form.formState.errors.duration?.message} {...form.register('duration')} />
          <Textarea label="Medicines" className="sm:col-span-2" rows={3} error={form.formState.errors.medicines?.message} {...form.register('medicines')} />
          <Textarea label="Dosage Instructions" className="sm:col-span-2" rows={3} error={form.formState.errors.dosageInstructions?.message} {...form.register('dosageInstructions')} />
          <Input label="Follow-up Date" type="date" error={form.formState.errors.followUpDate?.message} {...form.register('followUpDate')} />
          <Textarea label="Notes (Optional)" rows={2} {...form.register('notes')} />
        </div>
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
