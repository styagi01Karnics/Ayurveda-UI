import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import {
  followUpSchema,
  FOLLOW_UP_SCHEDULING_OPTIONS,
  type FollowUpFormValues,
} from '@/lib/validation/patient.schema';
import {
  bookingDateInputProps,
  BOOKING_TIME_OPTIONS,
} from '@/lib/bookingConstraints';

export interface FollowUpLookupOptions {
  patients: SelectOption[];
  doctors: SelectOption[];
  visitTypes: SelectOption[];
}

interface ScheduleFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FollowUpFormValues) => void | Promise<void>;
  lookupOptions: FollowUpLookupOptions;
  submitting?: boolean;
}

export function ScheduleFollowUpModal({
  open,
  onClose,
  onSubmit,
  lookupOptions,
  submitting = false,
}: ScheduleFollowUpModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      patientId: '',
      assignedDoctorId: '',
      visitTypeId: '',
      schedulingOption: '7_DAYS',
      scheduleDate: '',
      scheduleTime: '',
      smsReminderEnabled: false,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: FollowUpFormValues) => {
    await onSubmit(data);
    handleClose();
  };

  const busy = submitting || isSubmitting;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule Follow Up"
      subtitle="Schedule a follow-up visit for a patient"
      size="lg"
      footer={
        <Button
          onClick={handleSubmit(onFormSubmit)}
          disabled={busy}
        >
          {busy ? 'Scheduling…' : 'Confirm'}
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
            label="Doctor"
            placeholder="Select doctor"
            options={lookupOptions.doctors}
            error={errors.assignedDoctorId?.message}
            {...register('assignedDoctorId')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Visit Type"
            placeholder="Visit Type"
            options={lookupOptions.visitTypes}
            error={errors.visitTypeId?.message}
            {...register('visitTypeId')}
          />
          <Select
            label="Scheduling"
            placeholder="Scheduling option"
            options={[...FOLLOW_UP_SCHEDULING_OPTIONS]}
            error={errors.schedulingOption?.message}
            {...register('schedulingOption')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Appointment Date"
            type="date"
            min={bookingDateInputProps().min}
            error={errors.scheduleDate?.message}
            {...register('scheduleDate')}
          />
          <Select
            label="Appointment Time"
            placeholder="Select time"
            options={BOOKING_TIME_OPTIONS}
            error={errors.scheduleTime?.message}
            {...register('scheduleTime')}
          />
        </div>
      </form>
    </Modal>
  );
}
