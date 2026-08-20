import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { FileText, Trash2, X } from 'lucide-react';
import { DocumentUploadDropzone } from '@/components/ui/DocumentUploadDropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Stepper } from '@/components/ui/Stepper';
import { TagInput, type TagOption } from '@/components/ui/TagInput';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/app/ToastContext';
import {
  getBookingDoshas,
  getTherapiesByCategory,
} from '@/lib/api/appointments';
import type { BookAppointmentResult, BookingSession } from '@/lib/api/booking';
import {
  submitBookingStep1,
  submitBookingStep2,
  submitBookingStep3,
} from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';
import { getActiveTherapists, mapTherapistSelectOptions, filterTherapistsByTherapyIds } from '@/lib/api/therapists';
import { getMedicalHistoryOptions } from '@/data/mock/medicalHistoryDefaults';
import type { TherapistDto } from '@/lib/api/types';
import {
  buildBookingSteps,
  CONSTITUTION_OPTIONS,
  GENDER_OPTIONS,
  ID_PROOF_TYPES,
  includesCategoryTypeIds,
  includesTherapyTypeIds,
  OCCUPATION_OPTIONS,
  patientCategoryStepSchema,
  patientStep1BookingSchema,
  patientStep2Schema,
  patientStep3Schema,
  RELATION_OPTIONS,
  type BookingStepKey,
  type CreatePatientValues,
  type PatientCategoryStepValues,
  type PatientStep1Values,
  type PatientStep2Values,
  type PatientStep3Values,
} from '@/lib/validation/patient.schema';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/lib/validation/signup.schema';
import {
  bookingDateInputProps,
  BOOKING_TIME_OPTIONS,
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

const EMPTY_DOCUMENTS = {
  pastMedicalReports: [] as File[],
  prescriptions: [] as File[],
  labReports: [] as File[],
};

const DOCUMENT_TABS = [
  { id: 'pastMedicalReports' as const, label: 'Past Medical Reports' },
  { id: 'prescriptions' as const, label: 'Prescriptions' },
  { id: 'labReports' as const, label: 'Lab Reports' },
];

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
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<CreatePatientValues>>({});
  const [bookingSession, setBookingSession] = useState<BookingSession | null>(
    null,
  );
  const [stepSubmitting, setStepSubmitting] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [categoryTherapyOptions, setCategoryTherapyOptions] = useState<
    TagOption[]
  >([]);
  const [therapistOptions, setTherapistOptions] = useState<SelectOption[]>(
    lookupOptions.therapists,
  );
  const [allTherapists, setAllTherapists] = useState<TherapistDto[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState(EMPTY_DOCUMENTS);
  const [documentTab, setDocumentTab] =
    useState<(typeof DOCUMENT_TABS)[number]['id']>('pastMedicalReports');
  const [doshaOptions, setDoshaOptions] = useState<SelectOption[]>(
    lookupOptions.doshas,
  );
  const [doshasLoading, setDoshasLoading] = useState(false);
  const [doshasError, setDoshasError] = useState<string | null>(null);

  const step1Form = useForm<PatientStep1Values>({
    resolver: zodResolver(patientStep1BookingSchema),
    defaultValues: {
      consultationTypeIds: [],
      appointmentTime: '10:00',
      registrationDate: getTodayIsoDate(),
      ...formData,
    },
  });

  const categoryForm = useForm<PatientCategoryStepValues>({
    resolver: zodResolver(patientCategoryStepSchema),
    defaultValues: { treatmentCategory: formData.treatmentCategory ?? '' },
  });

  const step2Form = useForm<PatientStep2Values>({
    resolver: zodResolver(patientStep2Schema),
    defaultValues: {
      recommendedTherapies: [],
      sessionDuration: '45',
      sessionFrequency: DEFAULT_SESSION_FREQUENCY,
      therapyInstructions:
        'Patient should avoid cold food during therapy and maintain warm diet.',
      ...formData,
    },
  });

  const step3Form = useForm<PatientStep3Values>({
    resolver: zodResolver(patientStep3Schema),
    defaultValues: {
      bodyConstitution: [],
      pastMedicalConditions: [],
      pastSurgeries: [],
      currentMedications: [],
      allergies: [],
      ...formData,
    },
  });

  const watchedConsultationTypeIds =
    step1Form.watch('consultationTypeIds') ??
    (formData.consultationTypeIds as string[] | undefined) ??
    [];

  const consultationTypeMasters = useMemo(
    () =>
      lookupOptions.consultationTypes.map((option) =>
        typeof option === 'string'
          ? { id: option, name: option }
          : { id: option.value, name: option.label },
      ),
    [lookupOptions.consultationTypes],
  );

  const bookingSteps = useMemo(
    () => buildBookingSteps(watchedConsultationTypeIds, consultationTypeMasters),
    [watchedConsultationTypeIds, consultationTypeMasters],
  );

  const activeSteps = bookingSteps;

  const currentStepKey: BookingStepKey =
    activeSteps[stepIndex]?.key ?? 'personal';
  const isLastStep = stepIndex >= activeSteps.length - 1;
  const showCategoryInTherapyStep =
    includesTherapyTypeIds(watchedConsultationTypeIds, consultationTypeMasters) &&
    !includesCategoryTypeIds(watchedConsultationTypeIds, consultationTypeMasters);

  const dateInputProps = useMemo(() => bookingDateInputProps(), [open]);
  const isBusy = submitting || stepSubmitting;

  const resetModal = () => {
    setStepIndex(0);
    setFormData({});
    setBookingSession(null);
    setUploadedDocuments(EMPTY_DOCUMENTS);
    setDocumentTab('pastMedicalReports');
    step1Form.reset({
      consultationTypeIds: [],
      appointmentTime: '10:00',
      registrationDate: getTodayIsoDate(),
    });
    categoryForm.reset({ treatmentCategory: '' });
    step2Form.reset({
      recommendedTherapies: [],
      sessionDuration: '45',
      sessionFrequency: DEFAULT_SESSION_FREQUENCY,
      therapyInstructions:
        'Patient should avoid cold food during therapy and maintain warm diet.',
    });
    step3Form.reset({
      bodyConstitution: [],
      pastMedicalConditions: [],
      pastSurgeries: [],
      currentMedications: [],
      allergies: [],
    });
  };

  const handleClose = () => {
    if (isBusy) return;
    resetModal();
    onClose();
  };

  const showStepError = (err: unknown, fallback: string) => {
    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : fallback;
    showToast({ title: 'Booking failed', message });
  };

  const mergeCompleteData = (
    extra: Partial<CreatePatientValues> = {},
  ): CreatePatientValues =>
    ({
      ...EMPTY_THERAPY,
      ...formData,
      ...extra,
      uploadedDocuments,
    }) as CreatePatientValues;

  const finishBooking = async (
    session: BookingSession,
    complete: CreatePatientValues,
    medicalAssessment: BookAppointmentResult['medicalAssessment'] = null,
  ) => {
    await onComplete({ ...session, medicalAssessment }, complete);
  };

  const handleStep1 = step1Form.handleSubmit(async (data) => {
    setStepSubmitting(true);
    try {
      const merged = { ...formData, ...data } as CreatePatientValues;
      const session = await submitBookingStep1(merged);
      setBookingSession(session);
      setFormData((prev) => ({ ...prev, ...data }));

      const steps = buildBookingSteps(
        data.consultationTypeIds,
        consultationTypeMasters,
      );
      if (steps.length <= 1) {
        await finishBooking(session, merged);
        return;
      }

      if (!includesTherapyTypeIds(data.consultationTypeIds, consultationTypeMasters)) {
        setFormData((prev) => ({ ...prev, ...data, ...EMPTY_THERAPY }));
      }

      setStepIndex(1);
    } catch (err) {
      showStepError(err, 'Failed to create appointment.');
    } finally {
      setStepSubmitting(false);
    }
  });

  const handleCategoryStep = categoryForm.handleSubmit(async (data) => {
    if (!bookingSession) {
      showToast({
        title: 'Booking failed',
        message: 'Complete personal information first.',
      });
      return;
    }
    setStepSubmitting(true);
    try {
      const merged = { ...formData, ...data } as CreatePatientValues;
      setFormData((prev) => ({ ...prev, ...data }));
      step2Form.setValue('treatmentCategory', data.treatmentCategory);

      if (isLastStep) {
        await finishBooking(bookingSession, merged);
        return;
      }
      setStepIndex((index) => index + 1);
    } catch (err) {
      showStepError(err, 'Failed to save category.');
    } finally {
      setStepSubmitting(false);
    }
  });

  const handleStep2 = step2Form.handleSubmit(async (data) => {
    if (!bookingSession) {
      showToast({
        title: 'Booking failed',
        message: 'Complete step 1 before therapy details.',
      });
      return;
    }
    setStepSubmitting(true);
    try {
      const merged = {
        ...formData,
        ...data,
        treatmentCategory:
          data.treatmentCategory || formData.treatmentCategory || '',
      } as CreatePatientValues;

      const therapy = await submitBookingStep2(merged, bookingSession);
      const session = { ...bookingSession, therapy };
      setBookingSession(session);
      setFormData((prev) => ({ ...prev, ...data }));

      if (isLastStep) {
        await finishBooking(session, mergeCompleteData(data));
        return;
      }
      setStepIndex((index) => index + 1);
    } catch (err) {
      showStepError(err, 'Failed to book therapy appointment.');
    } finally {
      setStepSubmitting(false);
    }
  });

  const handleStep3 = step3Form.handleSubmit(async (data) => {
    if (!bookingSession) {
      showToast({
        title: 'Booking failed',
        message: 'Complete personal information first.',
      });
      return;
    }
    setStepSubmitting(true);
    try {
      const complete = mergeCompleteData(data);
      const medicalAssessment = await submitBookingStep3(
        complete,
        bookingSession,
      );
      await finishBooking(bookingSession, complete, medicalAssessment);
    } catch (err) {
      showStepError(err, 'Failed to save medical assessment.');
    } finally {
      setStepSubmitting(false);
    }
  });

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((index) => index - 1);
  };

  const handlePrimaryAction = () => {
    switch (currentStepKey) {
      case 'personal':
        handleStep1();
        break;
      case 'category':
        handleCategoryStep();
        break;
      case 'therapy':
        handleStep2();
        break;
      case 'medical':
        handleStep3();
        break;
    }
  };

  const selectedState = step1Form.watch('state');
  const selectedGender = step1Form.watch('gender');
  const historyOptions = getMedicalHistoryOptions(selectedGender);
  const selectedCategory =
    categoryForm.watch('treatmentCategory') ||
    step2Form.watch('treatmentCategory') ||
    formData.treatmentCategory;
  const recommendedTherapies = step2Form.watch('recommendedTherapies') ?? [];

  const therapyOptions =
    categoryTherapyOptions.length > 0
      ? categoryTherapyOptions
      : selectedCategory
        ? lookupOptions.therapies.filter((option) => {
            if (typeof option === 'string') return true;
            return (
              (option as TagOption & { categoryId?: string }).categoryId ===
                undefined ||
              (option as { categoryId?: string }).categoryId === selectedCategory
            );
          })
        : lookupOptions.therapies;

  useEffect(() => {
    setDoshaOptions(lookupOptions.doshas);
  }, [lookupOptions.doshas]);

  useEffect(() => {
    if (!open || currentStepKey !== 'medical') return;

    let cancelled = false;
    setDoshasLoading(true);
    setDoshasError(null);

    getBookingDoshas()
      .then((doshas) => {
        if (cancelled) return;
        setDoshaOptions(
          doshas.map((d) => ({
            value: d.id,
            label: d.name,
          })),
        );
        if (doshas.length === 0) {
          setDoshasError(
            'No doshas returned from GET /api/v1/doshas. Add doshas in Settings or ask admin to fix the dosha list API.',
          );
        }
      })
      .catch(() => {
        if (cancelled) return;
        setDoshasError('Could not load dosha types. Please try again.');
        setDoshaOptions(lookupOptions.doshas);
      })
      .finally(() => {
        if (!cancelled) setDoshasLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, currentStepKey, lookupOptions.doshas]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    getActiveTherapists()
      .then((therapists) => {
        if (!cancelled) setAllTherapists(therapists);
      })
      .catch(() => {
        if (!cancelled) setAllTherapists([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    const source = allTherapists.length > 0 ? allTherapists : [];
    if (source.length === 0) {
      setTherapistOptions(lookupOptions.therapists);
      return;
    }

    setTherapistOptions(
      mapTherapistSelectOptions(
        filterTherapistsByTherapyIds(source, recommendedTherapies),
      ),
    );
  }, [recommendedTherapies, allTherapists, lookupOptions.therapists]);

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryTherapyOptions([]);
      return;
    }

    let cancelled = false;
    getTherapiesByCategory(selectedCategory)
      .then((therapies) => {
        if (cancelled) return;
        setCategoryTherapyOptions(
          therapies.map((therapy) => ({
            value: therapy.id,
            label: therapy.name || therapy.therapyName || therapy.id,
            categoryId: therapy.categoryId,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setCategoryTherapyOptions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedState && CITIES_BY_STATE[selectedState]) {
      setCityOptions(CITIES_BY_STATE[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (currentStepKey === 'therapy' && formData.treatmentCategory) {
      step2Form.setValue('treatmentCategory', formData.treatmentCategory);
    }
  }, [currentStepKey, formData.treatmentCategory, step2Form]);

  useEffect(() => {
    if (!open) resetModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when modal closes
  }, [open]);

  const primaryLabel =
    currentStepKey === 'medical' && isLastStep
      ? isBusy
        ? 'Saving…'
        : 'Confirm'
      : isBusy
        ? 'Saving…'
        : isLastStep
          ? 'Confirm'
          : 'Next';

  const primaryDisabled =
    isBusy ||
    (currentStepKey === 'medical' &&
      (doshasLoading || doshaOptions.length === 0));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Patient"
      subtitle="Please fill out the patient registration details"
      size="2xl"
      footer={
        <div className="flex gap-3">
          {stepIndex > 0 && (
            <Button variant="outline" onClick={goBack} disabled={isBusy}>
              Back
            </Button>
          )}
          <Button onClick={handlePrimaryAction} disabled={primaryDisabled}>
            {primaryLabel}
          </Button>
        </div>
      }
    >
      <Stepper
        steps={activeSteps.map((item, index) => ({
          id: index + 1,
          label: item.label,
        }))}
        currentStep={stepIndex + 1}
      />

      {currentStepKey === 'personal' && (
        <div className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input label="Full Name *" placeholder="Full Name" error={step1Form.formState.errors.fullName?.message} {...step1Form.register('fullName')} />
              <Input label="Date of Birth *" type="date" error={step1Form.formState.errors.dateOfBirth?.message} {...step1Form.register('dateOfBirth')} />
              <Input label="Mobile Number *" placeholder="Mobile Number" error={step1Form.formState.errors.mobileNumber?.message} {...step1Form.register('mobileNumber')} />
              <Select label="Gender *" placeholder="Gender" options={[...GENDER_OPTIONS]} error={step1Form.formState.errors.gender?.message} {...step1Form.register('gender')} />
              <TagInput
                label="Consultation Type *"
                value={step1Form.watch('consultationTypeIds') ?? []}
                onChange={(tags) =>
                  step1Form.setValue('consultationTypeIds', tags, {
                    shouldValidate: true,
                  })
                }
                options={lookupOptions.consultationTypes}
                error={step1Form.formState.errors.consultationTypeIds?.message}
              />
              <Input label="Age" placeholder="Age" error={step1Form.formState.errors.age?.message} {...step1Form.register('age')} />
              <Input label="Registration Date" type="date" min={dateInputProps.min} error={step1Form.formState.errors.registrationDate?.message} {...step1Form.register('registrationDate')} />
              <Select
                label="Appointment Time"
                placeholder="Select time"
                options={BOOKING_TIME_OPTIONS}
                error={step1Form.formState.errors.appointmentTime?.message}
                {...step1Form.register('appointmentTime')}
              />
              <Select
                label="Assigned Doctor"
                placeholder="Select Doctor"
                options={lookupOptions.doctors}
                error={step1Form.formState.errors.assignedDoctor?.message}
                {...step1Form.register('assignedDoctor')}
              />
            </div>
          </FormSection>

          <FormSection title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select label="ID Proof Type" placeholder="Select" options={[...ID_PROOF_TYPES]} error={step1Form.formState.errors.idProofType?.message} {...step1Form.register('idProofType')} />
              <Input label="ID No." placeholder="ID No." error={step1Form.formState.errors.idNumber?.message} {...step1Form.register('idNumber')} />
              <Select label="Occupation" placeholder="Select" options={[...OCCUPATION_OPTIONS]} error={step1Form.formState.errors.occupation?.message} {...step1Form.register('occupation')} />
              <Input label="Insurance Details (Optional)" placeholder="Insurance Details" {...step1Form.register('insuranceDetails')} />
            </div>
          </FormSection>
        </div>
      )}

      {currentStepKey === 'category' && (
        <div className="space-y-6">
          <FormSection title="Treatment Category">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Treatment Category *"
                placeholder="Select"
                options={lookupOptions.categories}
                error={categoryForm.formState.errors.treatmentCategory?.message}
                {...categoryForm.register('treatmentCategory', {
                  onChange: () => {
                    step2Form.setValue('recommendedTherapies', [], {
                      shouldValidate: true,
                    });
                  },
                })}
              />
            </div>
          </FormSection>
        </div>
      )}

      {currentStepKey === 'therapy' && (
        <div className="space-y-6">
          <FormSection title="Therapy Treatment">
            <div className="grid gap-4 sm:grid-cols-2">
              {showCategoryInTherapyStep && (
                <Select
                  label="Treatment Category"
                  placeholder="Select"
                  options={lookupOptions.categories}
                  error={step2Form.formState.errors.treatmentCategory?.message}
                  {...step2Form.register('treatmentCategory', {
                    onChange: () => {
                      step2Form.setValue('recommendedTherapies', [], {
                        shouldValidate: true,
                      });
                    },
                  })}
                />
              )}
              <TagInput
                label="Recommended Therapy"
                value={step2Form.watch('recommendedTherapies') ?? []}
                onChange={(tags) => step2Form.setValue('recommendedTherapies', tags, { shouldValidate: true })}
                options={therapyOptions}
                error={step2Form.formState.errors.recommendedTherapies?.message}
              />
            </div>
          </FormSection>

          <FormSection title="Therapy Schedule">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Schedule Date" type="date" min={dateInputProps.min} error={step2Form.formState.errors.scheduleDate?.message} {...step2Form.register('scheduleDate')} />
              <Select
                label="Schedule Time"
                placeholder="Select time"
                options={BOOKING_TIME_OPTIONS}
                error={step2Form.formState.errors.scheduleTime?.message}
                {...step2Form.register('scheduleTime')}
              />
              <Input label="Session Duration (mins)" placeholder="e.g. 45" error={step2Form.formState.errors.sessionDuration?.message} {...step2Form.register('sessionDuration')} />
              <Input
                label="Session Frequency (count)"
                readOnly
                className="cursor-not-allowed bg-gray-50"
                error={step2Form.formState.errors.sessionFrequency?.message}
                {...step2Form.register('sessionFrequency')}
              />
            </div>
          </FormSection>

          <FormSection title="Therapy Assignment">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Assigned Therapist"
                placeholder="Select"
                options={therapistOptions}
                error={step2Form.formState.errors.assignedTherapist?.message}
                {...step2Form.register('assignedTherapist')}
              />
              <Textarea label="Therapy Instructions" rows={4} error={step2Form.formState.errors.therapyInstructions?.message} {...step2Form.register('therapyInstructions')} />
            </div>
          </FormSection>
        </div>
      )}

      {currentStepKey === 'medical' && (
        <div className="space-y-6">
          <FormSection title="Ayurvedic Assessment">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Dosha Type *"
                placeholder={
                  doshasLoading
                    ? 'Loading doshas…'
                    : doshaOptions.length
                      ? 'Select'
                      : 'No doshas available'
                }
                options={doshaOptions}
                disabled={doshasLoading || doshaOptions.length === 0}
                error={
                  doshasError ??
                  step3Form.formState.errors.doshaType?.message
                }
                {...step3Form.register('doshaType')}
              />
              <TagInput
                label="Body Constitution *"
                value={step3Form.watch('bodyConstitution') ?? []}
                onChange={(tags) => step3Form.setValue('bodyConstitution', tags, { shouldValidate: true })}
                options={CONSTITUTION_OPTIONS}
                error={step3Form.formState.errors.bodyConstitution?.message}
              />
              <Input label="Current Imbalances" placeholder="Current Imbalances" error={step3Form.formState.errors.currentImbalance?.message} {...step3Form.register('currentImbalance')} />
            </div>
          </FormSection>

          <FormSection title="Physical Examination">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {(
                [
                  'weight', 'height', 'bmi', 'ibw', 'pulse', 'bp', 'temperature', 'pallor',
                  'icterus', 'cyanosis', 'lymphNodes', 'oedema', 'sensorium',
                  'acidityGas', 'motion', 'micturition',
                ] as const
              ).map((field) => (
                <Input
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  placeholder={field}
                  error={step3Form.formState.errors[field]?.message}
                  {...step3Form.register(field)}
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="Medical History">
            <div className="grid gap-4 sm:grid-cols-2">
              <TagInput
                label="Past Medical Conditions"
                value={step3Form.watch('pastMedicalConditions') ?? []}
                onChange={(tags) =>
                  step3Form.setValue('pastMedicalConditions', tags, {
                    shouldValidate: true,
                  })
                }
                options={historyOptions.pastConditions}
              />
              <TagInput
                label="Past Surgeries"
                value={step3Form.watch('pastSurgeries') ?? []}
                onChange={(tags) =>
                  step3Form.setValue('pastSurgeries', tags, {
                    shouldValidate: true,
                  })
                }
                options={historyOptions.pastSurgeries}
              />
              <TagInput
                label="Current Medications"
                value={step3Form.watch('currentMedications') ?? []}
                onChange={(tags) =>
                  step3Form.setValue('currentMedications', tags, {
                    shouldValidate: true,
                  })
                }
                options={historyOptions.currentMedications}
              />
              <TagInput
                label="Allergies"
                value={step3Form.watch('allergies') ?? []}
                onChange={(tags) =>
                  step3Form.setValue('allergies', tags, {
                    shouldValidate: true,
                  })
                }
                options={historyOptions.allergies}
              />
              <Textarea label="Family History" className="sm:col-span-2" rows={2} {...step3Form.register('familyHistory')} />
            </div>
          </FormSection>

          <FormSection title="Lifestyle Information">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select label="Diet Type" placeholder="Select" options={['Vegetarian', 'Non-Vegetarian', 'Vegan']} {...step3Form.register('dietType')} />
              <Input label="Sleep Pattern" placeholder="Sleep Pattern" {...step3Form.register('sleepPattern')} />
              <Select label="Exercise Habits" placeholder="Select" options={['Daily', 'Occasional walking', 'None']} {...step3Form.register('exerciseHabits')} />
              <Input label="Addiction" placeholder="Addiction" {...step3Form.register('addictions')} />
            </div>
          </FormSection>

          <FormSection title="Systemic Examination">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Input label="Cardiovascular" {...step3Form.register('cardiovascular')} />
              <Input label="Respiratory" {...step3Form.register('respiratory')} />
              <Input label="Nervous" {...step3Form.register('nervous')} />
              <Input label="Abdomen & GI" {...step3Form.register('abdomenGi')} />
              <Input label="Locomotor" {...step3Form.register('locomotor')} />
            </div>
          </FormSection>

          <FormSection title="Treatment Plan">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Investigation & Plan Suggested" {...step3Form.register('investigationPlan')} />
              <Input label="Plan Taken" {...step3Form.register('planDetails')} />
            </div>
          </FormSection>

          <FormSection title="Upload Reports">
            <UploadReportsSection
              activeTab={documentTab}
              onTabChange={setDocumentTab}
              documents={uploadedDocuments}
              onDocumentsChange={setUploadedDocuments}
            />
          </FormSection>
        </div>
      )}
    </Modal>
  );
}

type DocumentTabId = keyof typeof EMPTY_DOCUMENTS;

function UploadReportsSection({
  activeTab,
  onTabChange,
  documents,
  onDocumentsChange,
}: {
  activeTab: DocumentTabId;
  onTabChange: (tab: DocumentTabId) => void;
  documents: typeof EMPTY_DOCUMENTS;
  onDocumentsChange: Dispatch<SetStateAction<typeof EMPTY_DOCUMENTS>>;
}) {
  const activeFiles = documents[activeTab];

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    onDocumentsChange((current) => ({
      ...current,
      [activeTab]: [...current[activeTab], ...selectedFiles],
    }));
  };

  const removeFile = (index: number) => {
    onDocumentsChange((current) => ({
      ...current,
      [activeTab]: current[activeTab].filter((_, i) => i !== index),
    }));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4 [overflow-anchor:none]">
      <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wide">
        {DOCUMENT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={
              activeTab === tab.id ? 'text-gold' : 'text-text-muted hover:text-brown'
            }
          >
            {tab.label}
            {documents[tab.id].length > 0 ? ` (${documents[tab.id].length})` : ''}
          </button>
        ))}
      </div>
      <DocumentUploadDropzone
        title={
          activeFiles.length > 0
            ? `Selected: ${activeFiles.map((file) => file.name).join(', ')}`
            : `Tap to upload ${DOCUMENT_TABS.find((t) => t.id === activeTab)?.label}`
        }
        onFilesSelected={(files) => addFiles(files)}
      />
      {activeFiles.length > 0 && (
        <div className="space-y-2">
          {activeFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brown">{file.name}</p>
                  <p className="text-xs text-text-muted">{file.type || 'File'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="gold">{formatSize(file.size)}</Badge>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-text-muted hover:text-danger"
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!activeFiles.length && (
        <p className="text-xs text-text-muted">
          No files for this category. Booking will use JSON medical assessment only
          (3 APIs). Add files here to use the with-documents endpoint (4th API).
        </p>
      )}
    </div>
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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brown">{title}</h3>
        <button
          type="button"
          className="rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label={`Close ${title}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </section>
  );
}
