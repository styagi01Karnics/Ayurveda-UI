import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PatientSearchSelect } from '@/components/ui/PatientSearchSelect';
import { Select } from '@/components/ui/Select';
import {
  bookTreatmentSchema,
  type BookTreatmentFormValues,
} from '@/lib/validation/patient.schema';
import { bookingDateInputProps } from '@/lib/bookingConstraints';

export interface BookTreatmentLookupOptions {
  patients: {
    value: string;
    label: string;
    patientId?: string;
    name?: string;
  }[];
  therapists: { value: string; label: string }[];
  treatmentPlans: { value: string; label: string }[];
}

interface BookTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookTreatmentFormValues) => void | Promise<void>;
  lookupOptions: BookTreatmentLookupOptions;
  submitting?: boolean;
}

export function BookTreatmentModal({
  open,
  onClose,
  onSubmit,
  lookupOptions,
  submitting = false,
}: BookTreatmentModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookTreatmentFormValues>({
    resolver: zodResolver(bookTreatmentSchema),
    defaultValues: {
      patientId: '',
      treatmentPlanId: '',
      startDate: '',
      endDate: '',
      totalSessions: '7',
      assignedTherapistId: '',
      treatmentStatus: 'SCHEDULED',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: BookTreatmentFormValues) => {
    await onSubmit(data);
    handleClose();
  };

  const busy = submitting || isSubmitting;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Book Treatment"
      subtitle="Schedule a new therapy treatment for a patient"
      size="lg"
      footer={
        <Button onClick={handleSubmit(onFormSubmit)} disabled={busy}>
          {busy ? 'Booking…' : 'Confirm'}
        </Button>
      }
    >
      <form className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <PatientSearchSelect
                label="Patient"
                placeholder="Search by patient ID or name (min 4 characters)"
                options={lookupOptions.patients}
                value={field.value}
                onChange={field.onChange}
                error={errors.patientId?.message}
              />
            )}
          />
          <Select
            label="Treatment Plan"
            placeholder="Select plan"
            options={lookupOptions.treatmentPlans}
            error={errors.treatmentPlanId?.message}
            {...register('treatmentPlanId')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Start Date"
            type="date"
            min={bookingDateInputProps().min}
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="End Date"
            type="date"
            min={bookingDateInputProps().min}
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Total Sessions"
            type="number"
            min={0}
            placeholder="e.g. 10"
            error={errors.totalSessions?.message}
            {...register('totalSessions')}
          />
          <Select
            label="Assigned Therapist"
            placeholder="Select therapist"
            options={lookupOptions.therapists}
            error={errors.assignedTherapistId?.message}
            {...register('assignedTherapistId')}
          />
        </div>
      </form>
    </Modal>
  );
}
