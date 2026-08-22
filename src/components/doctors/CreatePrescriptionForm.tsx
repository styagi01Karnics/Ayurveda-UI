import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TagInput } from '@/components/ui/TagInput';
import { Textarea } from '@/components/ui/Textarea';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAllTreatmentCategories,
  getTherapiesByCategory,
} from '@/lib/api/appointments';
import type { TherapyDto } from '@/lib/api/types';
import { getAllMedicines } from '@/lib/api/medicines';
import {
  PRESCRIPTION_DOSAGE_OPTIONS,
  PRESCRIPTION_FREQUENCY_OPTIONS,
  PRESCRIPTION_SETUP_OPTIONS,
} from '@/lib/prescriptionOptions';
import {
  doctorPrescriptionSchema,
  PRESCRIPTION_SCHEDULING_OPTIONS,
  type DoctorPrescriptionValues,
} from '@/lib/validation/doctorPatient.schema';
import { cn } from '@/lib/utils';
import type { PatientDetail } from '@/types';

function PrescriptionSection({
  title,
  onRemove,
  children,
  className,
}: {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-brown">{title}</h3>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-text-muted hover:bg-brown/5"
            aria-label={`Remove ${title}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TherapyRowFields({
  index,
  categoryOptions,
  onRemove,
  canRemove,
  register,
  watch,
  setValue,
  errors,
}: {
  index: number;
  categoryOptions: { value: string; label: string }[];
  onRemove: () => void;
  canRemove: boolean;
  register: ReturnType<typeof useForm<DoctorPrescriptionValues>>['register'];
  watch: ReturnType<typeof useForm<DoctorPrescriptionValues>>['watch'];
  setValue: ReturnType<typeof useForm<DoctorPrescriptionValues>>['setValue'];
  errors: ReturnType<
    typeof useForm<DoctorPrescriptionValues>
  >['formState']['errors'];
}) {
  const categoryId = watch(`therapies.${index}.categoryId`);
  const previousCategoryId = useRef(categoryId);
  const { data: therapies, loading } = useAsyncData(
    async () => {
      if (!categoryId) return [];
      return getTherapiesByCategory(categoryId).catch(() => []);
    },
    [] as TherapyDto[],
    [categoryId],
  );
  const therapyOptions = therapies.map((therapy) => ({
    value: therapy.id,
    label: [
      therapy.name || therapy.therapyName || therapy.id,
      therapy.therapyCode,
      therapy.durationMinutes ? `${therapy.durationMinutes} mins` : '',
      therapy.price != null
        ? `₹${therapy.price.toLocaleString('en-IN')}`
        : '',
    ]
      .filter(Boolean)
      .join(' · '),
  }));
  const selectedTherapies = therapies.filter((therapy) =>
    (watch(`therapies.${index}.therapyIds`) ?? []).includes(therapy.id),
  );

  useEffect(() => {
    if (
      previousCategoryId.current &&
      previousCategoryId.current !== categoryId
    ) {
      setValue(`therapies.${index}.therapyIds`, [], { shouldValidate: true });
    }
    previousCategoryId.current = categoryId;
  }, [categoryId, index, setValue]);

  const rowErrors = errors.therapies?.[index];

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr_auto] sm:items-start">
      <Select
        label="Therapy Category"
        placeholder="Therapy Category"
        options={categoryOptions}
        error={rowErrors?.categoryId?.message}
        {...register(`therapies.${index}.categoryId`)}
      />
      <div>
        <TagInput
          label="Recommended Therapy"
          placeholder={
            !categoryId
              ? 'Select category first'
              : loading
                ? 'Loading therapies…'
                : therapyOptions.length
                  ? 'Select therapies'
                  : 'No active therapies available'
          }
          value={watch(`therapies.${index}.therapyIds`) ?? []}
          onChange={(tags) =>
            setValue(`therapies.${index}.therapyIds`, tags, {
              shouldValidate: true,
            })
          }
          options={therapyOptions}
          error={rowErrors?.therapyIds?.message}
        />
        {selectedTherapies.length > 0 ? (
          <div className="mt-2 space-y-2">
            {selectedTherapies.map((therapy) => (
              <div
                key={therapy.id}
                className="rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs"
              >
                <p className="font-semibold text-brown">
                  {therapy.name || therapy.therapyName}
                  {therapy.therapyCode ? ` · ${therapy.therapyCode}` : ''}
                </p>
                {therapy.description ? (
                  <p className="mt-1 text-text-muted">{therapy.description}</p>
                ) : null}
                <p className="mt-1 text-gold">
                  {therapy.durationMinutes
                    ? `${therapy.durationMinutes} minutes`
                    : 'Duration not specified'}
                  {therapy.price != null
                    ? ` · ₹${therapy.price.toLocaleString('en-IN')}`
                    : ''}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {canRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="mt-6 rounded p-2 text-text-muted hover:bg-brown/5 hover:text-danger sm:mt-7"
          aria-label="Remove therapy row"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}

export function CreatePrescriptionForm({
  formId,
  patient,
  onSubmit,
  initialValues,
  initialMedicineOptions = [],
}: {
  formId: string;
  patient: PatientDetail;
  onSubmit: (values: DoctorPrescriptionValues) => void;
  initialValues?: DoctorPrescriptionValues;
  initialMedicineOptions?: { value: string; label: string }[];
}) {
  const [showTherapy, setShowTherapy] = useState(true);
  const [showFollowUp, setShowFollowUp] = useState(true);

  const defaultDiagnosis =
    patient.medicalAssessment.presentConditions &&
    patient.medicalAssessment.presentConditions !== '—'
      ? patient.medicalAssessment.presentConditions
      : '';

  const form = useForm<DoctorPrescriptionValues>({
    resolver: zodResolver(doctorPrescriptionSchema),
    defaultValues: initialValues ?? {
      diagnosis: defaultDiagnosis,
      medicines: [
        {
          medicineId: '',
          dosage: '',
          frequency: '',
          duration: '',
          notes: '',
        },
      ],
      therapies: [{ categoryId: '', therapyIds: [] }],
      setupRequired: '',
      followUpScheduling: '7_DAYS',
      suggestions: '',
    },
  });

  const {
    control,
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!initialValues) return;
    reset(initialValues);
    setShowTherapy(initialValues.therapies.length > 0);
    setShowFollowUp(
      Boolean(
        initialValues.setupRequired ||
          initialValues.followUpScheduling ||
          initialValues.suggestions,
      ),
    );
  }, [initialValues, reset]);

  const submitPrescription = handleSubmit((values: DoctorPrescriptionValues) => {
    const cleaned: DoctorPrescriptionValues = {
      ...values,
      medicines:
        values.medicines?.filter((row) => Boolean(row.medicineId)) ?? [],
      therapies:
        values.therapies?.filter(
          (row) => Boolean(row.categoryId) && (row.therapyIds?.length ?? 0) > 0,
        ) ?? [],
      setupRequired: showFollowUp ? values.setupRequired : 'No',
      followUpScheduling: showFollowUp ? values.followUpScheduling : '',
    };
    onSubmit(cleaned);
  });

  const {
    fields: medicineFields,
    append: appendMedicine,
    remove: removeMedicine,
  } = useFieldArray({ control, name: 'medicines' });

  const {
    fields: therapyFields,
    append: appendTherapy,
    remove: removeTherapy,
  } = useFieldArray({ control, name: 'therapies' });

  const { data: catalogueMedicineOptions, loading: medicinesLoading } = useAsyncData(
    async () => {
      const medicines = await getAllMedicines().catch(() => []);
      return medicines.map((medicine) => ({
        value: medicine.id,
        label: medicine.medicineName,
      }));
    },
    [] as { value: string; label: string }[],
  );
  const medicineOptions = useMemo(() => {
    const merged = new Map(
      initialMedicineOptions.map((option) => [option.value, option]),
    );
    catalogueMedicineOptions.forEach((option) => merged.set(option.value, option));
    return [...merged.values()];
  }, [catalogueMedicineOptions, initialMedicineOptions]);

  const { data: categoryOptions, loading: categoriesLoading } = useAsyncData(
    async () => {
      const categories = await getAllTreatmentCategories().catch(() => []);
      return categories.map((category) => ({
        value: category.id,
        label: category.categoryName,
      }));
    },
    [] as { value: string; label: string }[],
  );

  const followUpOptions = useMemo(
    () => [...PRESCRIPTION_SCHEDULING_OPTIONS],
    [],
  );

  return (
    <form
      id={formId}
      onSubmit={submitPrescription}
      className="space-y-5"
    >
      <PrescriptionSection title="Prescribe Medicine">
        <div className="space-y-4">
          {medicineFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto]"
            >
              <Select
                label="Medicine Name"
                placeholder={
                  medicinesLoading ? 'Loading…' : 'Select medicine'
                }
                options={medicineOptions}
                error={errors.medicines?.[index]?.medicineId?.message}
                {...register(`medicines.${index}.medicineId`)}
              />
              <Select
                label="Dosage"
                placeholder="Dosage"
                options={[...PRESCRIPTION_DOSAGE_OPTIONS]}
                error={errors.medicines?.[index]?.dosage?.message}
                {...register(`medicines.${index}.dosage`)}
              />
              <Select
                label="Frequency"
                placeholder="Frequency"
                options={[...PRESCRIPTION_FREQUENCY_OPTIONS]}
                error={errors.medicines?.[index]?.frequency?.message}
                {...register(`medicines.${index}.frequency`)}
              />
              <Input
                label="Duration"
                placeholder="e.g. 5 days"
                error={errors.medicines?.[index]?.duration?.message}
                {...register(`medicines.${index}.duration`)}
              />
              <Input
                label="Notes"
                placeholder="e.g. After food"
                error={errors.medicines?.[index]?.notes?.message}
                {...register(`medicines.${index}.notes`)}
              />
              {medicineFields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="mt-6 rounded p-2 text-text-muted hover:bg-brown/5 hover:text-danger lg:mt-7"
                  aria-label="Remove medicine row"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendMedicine({
                medicineId: '',
                dosage: '',
                frequency: '',
                duration: '',
                notes: '',
              })
            }
          >
            Add More Medicine
          </Button>
        </div>
        {errors.medicines?.message ? (
          <p className="mt-2 text-xs text-danger">{errors.medicines.message}</p>
        ) : null}
      </PrescriptionSection>

      {showTherapy ? (
        <PrescriptionSection
          title="Suggest Therapy"
          onRemove={() => {
            setShowTherapy(false);
            setValue('therapies', [], { shouldValidate: true });
          }}
        >
          <div className="space-y-4">
            {therapyFields.map((field, index) => (
              <TherapyRowFields
                key={field.id}
                index={index}
                categoryOptions={
                  categoriesLoading
                    ? [{ value: '', label: 'Loading categories…' }]
                    : categoryOptions
                }
                canRemove={therapyFields.length > 1}
                onRemove={() => removeTherapy(index)}
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendTherapy({ categoryId: '', therapyIds: [] })
              }
              disabled={categoriesLoading}
            >
              Add More Therapy
            </Button>
          </div>
        </PrescriptionSection>
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowTherapy(true);
              setValue('therapies', [{ categoryId: '', therapyIds: [] }], {
                shouldValidate: true,
              });
            }}
          >
            Add Suggest Therapy
          </Button>
        </div>
      )}

      {showFollowUp ? (
        <PrescriptionSection
          title="Next Follow Up"
          onRemove={() => {
            setValue('setupRequired', 'No', { shouldValidate: true });
            setValue('followUpScheduling', '7_DAYS', { shouldValidate: true });
            setShowFollowUp(false);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Set Up Required"
              placeholder="Set Follow Up"
              options={[...PRESCRIPTION_SETUP_OPTIONS]}
              error={errors.setupRequired?.message}
              {...register('setupRequired')}
            />
            <Select
              label="Follow-up Scheduling Options"
              placeholder="Follow-up Scheduling Options"
              options={followUpOptions}
              error={errors.followUpScheduling?.message}
              {...register('followUpScheduling')}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Suggestions"
                placeholder="Enter Suggestions (if any)"
                rows={3}
                error={errors.suggestions?.message}
                {...register('suggestions')}
              />
            </div>
          </div>
        </PrescriptionSection>
      ) : (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => setShowFollowUp(true)}>
            Add Next Follow Up
          </Button>
        </div>
      )}

      <div className="hidden">
        <Input label="Diagnosis" {...register('diagnosis')} />
      </div>
    </form>
  );
}
