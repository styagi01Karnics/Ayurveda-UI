import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAllMedicines } from '@/lib/api/medicines';
import {
  PRESCRIPTION_DOSAGE_OPTIONS,
  PRESCRIPTION_FREQUENCY_OPTIONS,
} from '@/lib/prescriptionOptions';
import {
  doctorPrescriptionSchema,
  type DoctorPrescriptionValues,
} from '@/lib/validation/doctorPatient.schema';
import { cn } from '@/lib/utils';
import type { PatientDetail } from '@/types';

function PrescriptionSection({
  title,
  children,
  className,
}: {
  title: string;
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
      </div>
      {children}
    </section>
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
    },
  });

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!initialValues) return;
    const medicines = initialValues.medicines.filter((row) => row.medicineId);
    reset({
      ...initialValues,
      medicines: [
        ...medicines,
        {
          medicineId: '',
          dosage: '',
          frequency: '',
          duration: '',
          notes: '',
        },
      ],
    });
  }, [initialValues, reset]);

  const submitPrescription = handleSubmit((values: DoctorPrescriptionValues) => {
    onSubmit({
      ...values,
      medicines:
        values.medicines?.filter((row) => Boolean(row.medicineId)) ?? [],
    });
  });

  const {
    fields: medicineFields,
    append: appendMedicine,
    remove: removeMedicine,
    replace: replaceMedicines,
  } = useFieldArray({ control, name: 'medicines' });

  const { data: catalogueMedicineOptions, loading: medicinesLoading } =
    useAsyncData(async () => {
      const medicines = await getAllMedicines().catch(() => []);
      return medicines.map((medicine) => ({
        value: medicine.id,
        label: medicine.medicineName,
      }));
    }, [] as { value: string; label: string }[]);

  const medicineOptions = useMemo(() => {
    const merged = new Map(
      initialMedicineOptions.map((option) => [option.value, option]),
    );
    catalogueMedicineOptions.forEach((option) =>
      merged.set(option.value, option),
    );
    return [...merged.values()];
  }, [catalogueMedicineOptions, initialMedicineOptions]);

  const medicineValues = watch('medicines') ?? [];
  const medicineEditorIndex = Math.max(0, medicineFields.length - 1);
  const editMedicine = (index: number) => {
    const selected = medicineValues[index];
    if (!selected) return;
    replaceMedicines([
      ...medicineValues
        .slice(0, -1)
        .filter((_, rowIndex) => rowIndex !== index),
      selected,
    ]);
  };

  return (
    <form id={formId} onSubmit={submitPrescription} className="space-y-5">
      <PrescriptionSection title="Prescribe Medicine">
        {medicineValues.slice(0, -1).some((row) => row.medicineId) ? (
          <div className="mb-5 overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Dosage</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="w-14 px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicineValues.slice(0, -1).map((row, index) =>
                  row.medicineId ? (
                    <tr
                      key={`${row.medicineId}-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="px-4 py-3 font-medium text-brown">
                        {medicineOptions.find(
                          (option) => option.value === row.medicineId,
                        )?.label ?? row.medicineId}
                      </td>
                      <td className="px-4 py-3">{row.dosage}</td>
                      <td className="px-4 py-3">{row.frequency}</td>
                      <td className="px-4 py-3">{row.duration}</td>
                      <td className="px-4 py-3">{row.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => editMedicine(index)}
                            className="rounded p-1 text-gold hover:bg-gold/10"
                            aria-label="Edit medicine"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="rounded p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
                            aria-label="Remove medicine"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="space-y-4">
          {medicineFields.map((field, index) =>
            index === medicineEditorIndex ? (
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
                <div className="hidden lg:block" />
              </div>
            ) : null,
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!medicineValues[medicineEditorIndex]?.medicineId) return;
              appendMedicine({
                medicineId: '',
                dosage: '',
                frequency: '',
                duration: '',
                notes: '',
              });
            }}
            disabled={!medicineValues[medicineEditorIndex]?.medicineId}
          >
            + Add Medicine
          </Button>
        </div>
        {errors.medicines?.message ? (
          <p className="mt-2 text-xs text-danger">{errors.medicines.message}</p>
        ) : null}
      </PrescriptionSection>

      <div className="hidden">
        <Input label="Diagnosis" {...register('diagnosis')} />
      </div>
    </form>
  );
}
