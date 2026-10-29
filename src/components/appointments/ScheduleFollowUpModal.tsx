import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PatientSearchSelect } from '@/components/ui/PatientSearchSelect';
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
  patients: Array<
    SelectOption | { value: string; label: string; patientId?: string; name?: string }
  >;
  doctors: SelectOption[];
  visitTypes: SelectOption[];
}

interface ScheduleFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FollowUpFormValues) => void | Promise<void>;
  lookupOptions: FollowUpLookupOptions;
  submitting?: boolean;
  initialValues?: Partial<FollowUpFormValues>;
  mode?: 'schedule' | 'reschedule';
}

export function ScheduleFollowUpModal({
  open,
  onClose,
  onSubmit,
  lookupOptions,
  submitting = false,
  initialValues,
  mode = 'schedule',
}: ScheduleFollowUpModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      patientId: '',
      assignedDoctorId: '',
      visitTypeId: '',
      schedulingOption: 'AFTER_7_DAYS',
      scheduleDate: '',
      scheduleTime: '',
      smsReminderEnabled: false,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      patientId: initialValues?.patientId ?? '',
      assignedDoctorId: initialValues?.assignedDoctorId ?? '',
      visitTypeId: initialValues?.visitTypeId ?? '',
      schedulingOption: initialValues?.schedulingOption ?? 'AFTER_7_DAYS',
      scheduleDate: initialValues?.scheduleDate ?? '',
      scheduleTime: initialValues?.scheduleTime ?? '',
      smsReminderEnabled: initialValues?.smsReminderEnabled ?? false,
      sourceBookingId: initialValues?.sourceBookingId,
    });
  }, [initialValues, open, reset]);

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
      title={mode === 'reschedule' ? 'Reschedule Follow Up' : 'Schedule Follow Up'}
      subtitle={
        mode === 'reschedule'
          ? 'Choose a new date and time for this follow-up'
          : 'Schedule a follow-up visit for a patient'
      }
      size="lg"
      footer={
        <Button
          onClick={handleSubmit(onFormSubmit)}
          disabled={busy}
        >
          {busy
            ? mode === 'reschedule'
              ? 'Rescheduling…'
              : 'Scheduling…'
            : mode === 'reschedule'
              ? 'Reschedule'
              : 'Confirm'}
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
                options={lookupOptions.patients.map((option) => {
                  if (typeof option === 'string') {
                    return { value: option, label: option };
                  }
                  return {
                    value: option.value,
                    label: option.label,
                    patientId:
                      'patientId' in option && option.patientId
                        ? option.patientId
                        : option.value,
                    name:
                      'name' in option && option.name
                        ? option.name
                        : option.label,
                  };
                })}
                value={field.value}
                onChange={field.onChange}
                error={errors.patientId?.message}
                disabled={mode === 'reschedule' && Boolean(initialValues?.patientId)}
              />
            )}
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
