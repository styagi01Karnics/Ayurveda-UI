import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Stepper } from '@/components/ui/Stepper';
import { TagInput } from '@/components/ui/TagInput';
import {
  CONSTITUTION_OPTIONS,
  CONSULTATION_TYPES,
  DOSHA_OPTIONS,
  GENDER_OPTIONS,
  ID_PROOF_TYPES,
  LANGUAGE_OPTIONS,
  OCCUPATION_OPTIONS,
  patientStep1Schema,
  patientStep2Schema,
  patientStep3Schema,
  RELATION_OPTIONS,
  THERAPIST_OPTIONS,
  THERAPY_OPTIONS,
  TREATMENT_CATEGORIES,
  type CreatePatientValues,
  type PatientStep1Values,
  type PatientStep2Values,
  type PatientStep3Values,
} from '@/lib/validation/patient.schema';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/validation/signup.schema';

const STEPS = [
  { id: 1, label: 'Personal Information' },
  { id: 2, label: 'Therapy Details' },
  { id: 3, label: 'Medical Assessment' },
];

interface CreatePatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePatientValues) => void;
}

export function CreatePatientModal({
  open,
  onClose,
  onSubmit,
}: CreatePatientModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePatientValues>>({});
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  const step1Form = useForm<PatientStep1Values>({
    resolver: zodResolver(patientStep1Schema),
    defaultValues: {
      consultationTypes: [],
      ...formData,
    },
  });

  const step2Form = useForm<PatientStep2Values>({
    resolver: zodResolver(patientStep2Schema),
    defaultValues: {
      recommendedTherapies: [],
      therapyInstructions:
        'Patient should avoid cold food during therapy and maintain warm diet.',
      ...formData,
    },
  });

  const step3Form = useForm<PatientStep3Values>({
    resolver: zodResolver(patientStep3Schema),
    defaultValues: {
      bodyConstitution: [],
      allergies: [],
      ...formData,
    },
  });

  const handleClose = () => {
    setStep(1);
    setFormData({});
    step1Form.reset();
    step2Form.reset();
    step3Form.reset();
    onClose();
  };

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });

  const handleStep3 = step3Form.handleSubmit((data) => {
    const complete = { ...formData, ...data } as CreatePatientValues;
    onSubmit(complete);
    handleClose();
  });

  const selectedState = step1Form.watch('state');

  useEffect(() => {
    if (selectedState && CITIES_BY_STATE[selectedState]) {
      setCityOptions(CITIES_BY_STATE[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Patient"
      subtitle="Please fill out the patient registration details"
      size="xl"
      footer={
        step === 1 ? (
          <Button onClick={handleStep1}>Next</Button>
        ) : step === 2 ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleStep2}>Next</Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={handleStep3}>Confirm</Button>
          </div>
        )
      }
    >
      <Stepper steps={STEPS} currentStep={step} />

      {step === 1 && (
        <div className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input label="Full Name" placeholder="Full Name" error={step1Form.formState.errors.fullName?.message} {...step1Form.register('fullName')} />
              <Select label="Gender" placeholder="Gender" options={[...GENDER_OPTIONS]} error={step1Form.formState.errors.gender?.message} {...step1Form.register('gender')} />
              <Input label="Date of Birth" type="date" error={step1Form.formState.errors.dateOfBirth?.message} {...step1Form.register('dateOfBirth')} />
              <Input label="Age" placeholder="Age" error={step1Form.formState.errors.age?.message} {...step1Form.register('age')} />
              <Select label="Preferred Language" placeholder="Select" options={[...LANGUAGE_OPTIONS]} error={step1Form.formState.errors.preferredLanguage?.message} {...step1Form.register('preferredLanguage')} />
              <TagInput
                label="Consultation Type"
                value={step1Form.watch('consultationTypes') ?? []}
                onChange={(tags) => step1Form.setValue('consultationTypes', tags, { shouldValidate: true })}
                options={CONSULTATION_TYPES}
                error={step1Form.formState.errors.consultationTypes?.message}
              />
              <Input label="Registration Date" type="date" error={step1Form.formState.errors.registrationDate?.message} {...step1Form.register('registrationDate')} />
              <Select label="Assigned Doctor" placeholder="Select Doctor" options={[...THERAPIST_OPTIONS]} error={step1Form.formState.errors.assignedDoctor?.message} {...step1Form.register('assignedDoctor')} />
            </div>
          </FormSection>

          <FormSection title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input label="Mobile Number" placeholder="Mobile Number" error={step1Form.formState.errors.mobileNumber?.message} {...step1Form.register('mobileNumber')} />
              <Input label="Email Address" type="email" placeholder="Email" error={step1Form.formState.errors.email?.message} {...step1Form.register('email')} />
              <Select label="State" placeholder="Select State" options={[...INDIAN_STATES]} error={step1Form.formState.errors.state?.message} {...step1Form.register('state', { onChange: (e) => { setCityOptions(CITIES_BY_STATE[e.target.value] ?? []); step1Form.setValue('city', ''); } })} />
              <Select label="City" placeholder="Select City" options={cityOptions} error={step1Form.formState.errors.city?.message} {...step1Form.register('city')} />
              <Textarea label="Permanent Address" className="sm:col-span-2 lg:col-span-3" rows={3} error={step1Form.formState.errors.permanentAddress?.message} {...step1Form.register('permanentAddress')} />
            </div>
          </FormSection>

          <FormSection title="Emergency Contact">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Name" placeholder="Name" error={step1Form.formState.errors.emergencyName?.message} {...step1Form.register('emergencyName')} />
              <Select label="Relation" placeholder="Relation" options={[...RELATION_OPTIONS]} error={step1Form.formState.errors.emergencyRelation?.message} {...step1Form.register('emergencyRelation')} />
              <Input label="Phone Number" placeholder="Phone Number" error={step1Form.formState.errors.emergencyPhone?.message} {...step1Form.register('emergencyPhone')} />
            </div>
          </FormSection>

          <FormSection title="Identification & Admin">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input label="Patient ID" placeholder="Patient ID" error={step1Form.formState.errors.patientId?.message} {...step1Form.register('patientId')} />
              <Select label="ID Proof Type" placeholder="Select" options={[...ID_PROOF_TYPES]} error={step1Form.formState.errors.idProofType?.message} {...step1Form.register('idProofType')} />
              <Input label="ID No." placeholder="ID No." error={step1Form.formState.errors.idNumber?.message} {...step1Form.register('idNumber')} />
              <Select label="Occupation" placeholder="Select" options={[...OCCUPATION_OPTIONS]} error={step1Form.formState.errors.occupation?.message} {...step1Form.register('occupation')} />
              <Input label="Insurance Details (Optional)" placeholder="Insurance Details" {...step1Form.register('insuranceDetails')} />
            </div>
          </FormSection>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <FormSection title="Therapy Treatment">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Treatment Category" placeholder="Select" options={[...TREATMENT_CATEGORIES]} error={step2Form.formState.errors.treatmentCategory?.message} {...step2Form.register('treatmentCategory')} />
              <TagInput
                label="Recommended Therapy"
                value={step2Form.watch('recommendedTherapies') ?? []}
                onChange={(tags) => step2Form.setValue('recommendedTherapies', tags, { shouldValidate: true })}
                options={THERAPY_OPTIONS}
                error={step2Form.formState.errors.recommendedTherapies?.message}
              />
            </div>
          </FormSection>

          <FormSection title="Therapy Schedule">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Schedule Date" type="date" error={step2Form.formState.errors.scheduleDate?.message} {...step2Form.register('scheduleDate')} />
              <Input label="Schedule Time" type="time" error={step2Form.formState.errors.scheduleTime?.message} {...step2Form.register('scheduleTime')} />
              <Input label="Session Duration" placeholder="e.g. 60 mins" error={step2Form.formState.errors.sessionDuration?.message} {...step2Form.register('sessionDuration')} />
              <Input label="Session Frequency" placeholder="e.g. Weekly" error={step2Form.formState.errors.sessionFrequency?.message} {...step2Form.register('sessionFrequency')} />
            </div>
          </FormSection>

          <FormSection title="Therapy Assignment">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Assigned Therapist" placeholder="Select" options={[...THERAPIST_OPTIONS]} error={step2Form.formState.errors.assignedTherapist?.message} {...step2Form.register('assignedTherapist')} />
              <Textarea label="Therapy Instructions" rows={4} error={step2Form.formState.errors.therapyInstructions?.message} {...step2Form.register('therapyInstructions')} />
            </div>
          </FormSection>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <FormSection title="Ayurvedic Assessment">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Dosha Type" placeholder="Select" options={[...DOSHA_OPTIONS]} error={step3Form.formState.errors.doshaType?.message} {...step3Form.register('doshaType')} />
              <TagInput
                label="Body Constitution"
                value={step3Form.watch('bodyConstitution') ?? []}
                onChange={(tags) => step3Form.setValue('bodyConstitution', tags, { shouldValidate: true })}
                options={CONSTITUTION_OPTIONS}
                error={step3Form.formState.errors.bodyConstitution?.message}
              />
              <Input label="Current Imbalance" placeholder="Current Imbalance" error={step3Form.formState.errors.currentImbalance?.message} {...step3Form.register('currentImbalance')} />
            </div>
          </FormSection>

          <FormSection title="Physical Examination">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {(['height', 'weight', 'bmi', 'pulse', 'bp'] as const).map((field) => (
                <Input
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  placeholder={field.toUpperCase()}
                  error={step3Form.formState.errors[field]?.message}
                  {...step3Form.register(field)}
                />
              ))}
              <Input label="Temperature" placeholder="Temp" {...step3Form.register('temperature')} />
            </div>
          </FormSection>

          <FormSection title="Medical History">
            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea label="Past Medical Conditions" rows={2} {...step3Form.register('pastMedicalConditions')} />
              <Textarea label="Past Surgeries" rows={2} {...step3Form.register('pastSurgeries')} />
              <Input label="Current Medications" placeholder="Current Medications" {...step3Form.register('currentMedications')} />
              <TagInput
                label="Allergies"
                value={step3Form.watch('allergies') ?? []}
                onChange={(tags) => step3Form.setValue('allergies', tags)}
                options={['Allergy 1', 'Allergy 2', 'Allergy 3']}
              />
              <Textarea label="Family History" className="sm:col-span-2" rows={2} {...step3Form.register('familyHistory')} />
            </div>
          </FormSection>

          <FormSection title="Lifestyle Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Diet Type" placeholder="Diet Type" {...step3Form.register('dietType')} />
              <Input label="Sleep Pattern" placeholder="Sleep Pattern" {...step3Form.register('sleepPattern')} />
              <Input label="Exercise Habits" placeholder="Exercise Habits" {...step3Form.register('exerciseHabits')} />
              <Input label="Addictions" placeholder="Addictions" {...step3Form.register('addictions')} />
            </div>
          </FormSection>

          <FormSection title="Treatment Plan">
            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea label="Investigation & Plan Suggested" rows={3} {...step3Form.register('investigationPlan')} />
              <Textarea label="Plan Details" rows={3} {...step3Form.register('planDetails')} />
            </div>
          </FormSection>
        </div>
      )}
    </Modal>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <h3 className="mb-4 text-sm font-semibold text-brown">{title}</h3>
      {children}
    </section>
  );
}
