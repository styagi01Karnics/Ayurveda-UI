import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  bookTreatmentSchema,
  type BookTreatmentFormValues,
} from '@/lib/validation/patient.schema';
import { TREATMENT_PLAN_OPTIONS, SESSION_OPTIONS } from '@/lib/validation/doctorPatient.schema';

export interface BookTreatmentLookupOptions {
  patients: { value: string; label: string }[];
  therapists: { value: string; label: string }[];
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
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookTreatmentFormValues>({
    resolver: zodResolver(bookTreatmentSchema),
    defaultValues: {
      patientId: '',
      treatmentPlanName: '',
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
          <Select
            label="Patient"
            placeholder="Select patient"
            options={lookupOptions.patients}
            error={errors.patientId?.message}
            {...register('patientId')}
          />
          <Select
            label="Treatment Plan"
            placeholder="Select plan"
            options={[...TREATMENT_PLAN_OPTIONS]}
            error={errors.treatmentPlanName?.message}
            {...register('treatmentPlanName')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="End Date"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Total Sessions"
            placeholder="Sessions"
            options={[...SESSION_OPTIONS]}
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
