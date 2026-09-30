import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TagInput, type TagOption } from '@/components/ui/TagInput';
import { useToast } from '@/app/ToastContext';
import type { BookAppointmentResult } from '@/lib/api/booking';
import { submitBookingStep1 } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';
import { computeAgeFromDob } from '@/lib/api/bookingPatientPayload';
import { cn } from '@/lib/utils';
import {
  GENDER_OPTIONS,
  ID_PROOF_TYPES,
  LANGUAGE_OPTIONS,
  OCCUPATION_OPTIONS,
  patientStep1BookingSchema,
  RELATION_OPTIONS,
  type CreatePatientValues,
  type PatientStep1Values,
  type PatientStep2Values,
} from '@/lib/validation/patient.schema';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/validation/signup.schema';
import {
  bookingDateInputProps,
  DEFAULT_SESSION_FREQUENCY,
  getTodayIsoDate,
} from '@/lib/bookingConstraints';

const EMPTY_THERAPY: PatientStep2Values = {
  treatmentCategory: '',
  recommendedTherapies: [],
  scheduleDate: '',
  scheduleTime: '',
  sessionDuration: '',
  sessionFrequency: DEFAULT_SESSION_FREQUENCY,
  assignedTherapist: '',
  therapyInstructions: '',
};

export interface BookingLookupOptions {
  doctors: SelectOption[];
  therapists: SelectOption[];
  categories: SelectOption[];
  therapies: TagOption[];
  doshas: SelectOption[];
  consultationTypes: TagOption[];
  patients?: SelectOption[];
}

interface CreatePatientModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (
    result: BookAppointmentResult,
    formData: CreatePatientValues,
  ) => void | Promise<void>;
  lookupOptions: BookingLookupOptions;
  submitting?: boolean;
}

export function CreatePatientModal({
  open,
  onClose,
  onComplete,
  lookupOptions,
  submitting = false,
}: CreatePatientModalProps) {
  const { showToast } = useToast();
  const [stepSubmitting, setStepSubmitting] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  const step1Form = useForm<PatientStep1Values>({
    resolver: zodResolver(patientStep1BookingSchema),
    defaultValues: {
      consultationTypeIds: [],
      appointmentTime: '10:00',
      registrationDate: getTodayIsoDate(),
    },
  });

  const dateInputProps = useMemo(() => bookingDateInputProps(), [open]);
  const isBusy = submitting || stepSubmitting;
  const selectedState = step1Form.watch('state');
  const selectedDob = step1Form.watch('dateOfBirth');

  const resetModal = () => {
    setCityOptions([]);
    step1Form.reset({
      consultationTypeIds: [],
      appointmentTime: '10:00',
      registrationDate: getTodayIsoDate(),
    });
  };

  const handleClose = () => {
    if (isBusy) return;
    resetModal();
    onClose();
  };

  const handleSubmit = step1Form.handleSubmit(async (data) => {
    setStepSubmitting(true);
    try {
      const complete = {
        ...EMPTY_THERAPY,
        ...data,
      } as CreatePatientValues;
      const session = await submitBookingStep1(complete);
      await onComplete(session, complete);
      resetModal();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to create appointment.';
      showToast({ title: 'Booking failed', message });
    } finally {
      setStepSubmitting(false);
    }
  });

  useEffect(() => {
    if (selectedState && CITIES_BY_STATE[selectedState]) {
      setCityOptions(CITIES_BY_STATE[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (!selectedDob) return;
    const age = computeAgeFromDob(selectedDob);
    if (age >= 0) {
      step1Form.setValue('age', String(age), { shouldValidate: true });
    }
  }, [selectedDob, step1Form]);

  useEffect(() => {
    if (!open) resetModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when modal closes
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Patient"
      subtitle="Please fill out the patient registration details"
      size="2xl"
      footer={
        <div className="flex gap-3">
          <Button
            className="min-w-[132px]"
            onClick={handleSubmit}
            disabled={isBusy}
          >
            {isBusy ? 'Saving…' : 'Confirm'}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <FormSection title="Basic Information">
          <FieldGrid columns={5}>
            <Input
              label="Full Name"
              placeholder="Full Name"
              error={step1Form.formState.errors.fullName?.message}
              {...step1Form.register('fullName')}
            />
            <Select
              label="Gender"
              placeholder="Select Gender"
              options={[...GENDER_OPTIONS]}
              error={step1Form.formState.errors.gender?.message}
              {...step1Form.register('gender')}
            />
            <Input
              label="Date of Birth"
              type="date"
              error={step1Form.formState.errors.dateOfBirth?.message}
              {...step1Form.register('dateOfBirth')}
            />
            <Input
              label="Age"
              placeholder="Age"
              error={step1Form.formState.errors.age?.message}
              {...step1Form.register('age')}
            />
            <Select
              label="Preferred Language"
              placeholder="Preferred Language"
              options={[...LANGUAGE_OPTIONS]}
              error={step1Form.formState.errors.preferredLanguage?.message}
              {...step1Form.register('preferredLanguage')}
            />
          </FieldGrid>
          <FieldGrid columns={3}>
            <TagInput
              label="Consultation Type"
              value={step1Form.watch('consultationTypeIds') ?? []}
              onChange={(tags) =>
                step1Form.setValue('consultationTypeIds', tags, {
                  shouldValidate: true,
                })
              }
              options={lookupOptions.consultationTypes}
              error={step1Form.formState.errors.consultationTypeIds?.message}
            />
            <Input
              label="Registration Date"
              type="date"
              min={dateInputProps.min}
              error={step1Form.formState.errors.registrationDate?.message}
              {...step1Form.register('registrationDate')}
            />
            <Select
              label="Assigned Doctor"
              placeholder="Assigned Doctor"
              options={lookupOptions.doctors}
              error={step1Form.formState.errors.assignedDoctor?.message}
              {...step1Form.register('assignedDoctor')}
            />
          </FieldGrid>
        </FormSection>

        <FormSection title="Contact Information">
          <FieldGrid columns={4}>
            <Input
              label="Mobile Number"
              placeholder="Mobile Number"
              error={step1Form.formState.errors.mobileNumber?.message}
              {...step1Form.register('mobileNumber')}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Email Address"
              error={step1Form.formState.errors.email?.message}
              {...step1Form.register('email')}
            />
            <Select
              label="State"
              placeholder="Select State"
              options={[...INDIAN_STATES]}
              error={step1Form.formState.errors.state?.message}
              {...step1Form.register('state', {
                onChange: (e) => {
                  setCityOptions(CITIES_BY_STATE[e.target.value] ?? []);
                  step1Form.setValue('city', '');
                },
              })}
            />
            <Select
              label="City"
              placeholder="Select City"
              options={cityOptions}
              error={step1Form.formState.errors.city?.message}
              {...step1Form.register('city')}
            />
          </FieldGrid>
          <Textarea
            label="Permanent Address"
            placeholder="Permanent Address"
            rows={2}
            error={step1Form.formState.errors.permanentAddress?.message}
            {...step1Form.register('permanentAddress')}
          />
        </FormSection>

        <FormSection title="Emergency Contact">
          <FieldGrid columns={3}>
            <Input
              label="Name"
              placeholder="Name"
              error={step1Form.formState.errors.emergencyName?.message}
              {...step1Form.register('emergencyName')}
            />
            <Select
              label="Relation"
              placeholder="Relation"
              options={[...RELATION_OPTIONS]}
              error={step1Form.formState.errors.emergencyRelation?.message}
              {...step1Form.register('emergencyRelation')}
            />
            <Input
              label="Phone Number"
              placeholder="Phone Number"
              error={step1Form.formState.errors.emergencyPhone?.message}
              {...step1Form.register('emergencyPhone')}
            />
          </FieldGrid>
        </FormSection>

        <FormSection title="Identification & Admin">
          <FieldGrid columns={5}>
            <Input
              label="Patient ID"
              placeholder="Patient ID"
              error={step1Form.formState.errors.patientId?.message}
              {...step1Form.register('patientId')}
            />
            <Select
              label="ID Proof Type"
              placeholder="ID Proof Type"
              options={[...ID_PROOF_TYPES]}
              error={step1Form.formState.errors.idProofType?.message}
              {...step1Form.register('idProofType')}
            />
            <Input
              label="ID No."
              placeholder="ID No."
              error={step1Form.formState.errors.idNumber?.message}
              {...step1Form.register('idNumber')}
            />
            <Select
              label="Occupation"
              placeholder="Occupation"
              options={[...OCCUPATION_OPTIONS]}
              error={step1Form.formState.errors.occupation?.message}
              {...step1Form.register('occupation')}
            />
            <Input
              label="Insurance Details (Optional)"
              placeholder="Insurance Details (Optional)"
              {...step1Form.register('insuranceDetails')}
            />
          </FieldGrid>
        </FormSection>
      </div>
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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brown">{title}</h3>
        <span className="text-text-muted" aria-hidden>
          <X className="h-4 w-4" />
        </span>
      </div>
      {children}
    </section>
  );
}

function FieldGrid({
  columns,
  children,
}: {
  columns: 2 | 3 | 4 | 5;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid items-start gap-4 [&>*]:min-w-0',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        columns === 5 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
      )}
    >
      {children}
    </div>
  );
}
