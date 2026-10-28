import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { TagInput, type TagOption } from '@/components/ui/TagInput';
import { fromApiConsultationTypeIds, slotTimeForInput } from '@/lib/api/mappers';
import {
  bookingDateInputProps,
  BOOKING_TIME_OPTIONS,
} from '@/lib/bookingConstraints';
import {
  rescheduleAppointmentSchema,
  type RescheduleAppointmentFormValues,
} from '@/lib/validation/patient.schema';
import type { AppointmentRecord } from '@/types';

interface RescheduleAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RescheduleAppointmentFormValues) => void | Promise<void>;
  appointment: AppointmentRecord | null;
  doctorOptions: SelectOption[];
  consultationTypeOptions: TagOption[];
  submitting?: boolean;
}

function resolveDoctorId(
  doctorName: string,
  options: SelectOption[],
): string {
  const normalized = options.map((option) =>
    typeof option === 'string'
      ? { value: option, label: option }
      : option,
  );
  const match = normalized.find((option) => option.label === doctorName);
  return match?.value ?? '';
}

export function RescheduleAppointmentModal({
  open,
  onClose,
  onSubmit,
  appointment,
  doctorOptions,
  consultationTypeOptions,
  submitting = false,
}: RescheduleAppointmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RescheduleAppointmentFormValues>({
    resolver: zodResolver(rescheduleAppointmentSchema),
    defaultValues: {
      patientId: '',
      registrationDate: '',
      slotTime: '10:00',
      assignedDoctorId: '',
      consultationTypeIds: [],
    },
  });

  useEffect(() => {
    if (!open || !appointment) return;

    reset({
      patientId: appointment.patientId ?? '',
      registrationDate:
        appointment.registrationDate ?? appointment.dateCreated ?? '',
      slotTime: slotTimeForInput(appointment.slotTime),
      assignedDoctorId:
        appointment.assignedDoctorId ??
        resolveDoctorId(appointment.doctor, doctorOptions),
      consultationTypeIds: fromApiConsultationTypeIds(
        appointment.consultationTypes,
      ),
    });
  }, [open, appointment, doctorOptions, reset]);

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const onFormSubmit = async (data: RescheduleAppointmentFormValues) => {
    await onSubmit(data);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Reschedule Appointment"
      subtitle="Update appointment details for this patient"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      }
    >
      {appointment && (
        <form className="space-y-4" noValidate>
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
            <p className="text-xs font-medium text-text-muted">Patient</p>
            <p className="mt-1 text-sm font-semibold text-brown">
              {appointment.patient}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">{appointment.uhid}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Registration Date"
              type="date"
              min={bookingDateInputProps().min}
              error={errors.registrationDate?.message}
              {...register('registrationDate')}
            />
            <Select
              label="Appointment Time"
              placeholder="Select time"
              options={BOOKING_TIME_OPTIONS}
              error={errors.slotTime?.message}
              {...register('slotTime')}
            />
          </div>

          <Select
            label="Assigned Doctor"
            placeholder="Select doctor"
            options={doctorOptions}
            error={errors.assignedDoctorId?.message}
            {...register('assignedDoctorId')}
          />

          <TagInput
            label="Consultation Type"
            value={watch('consultationTypeIds') ?? []}
            onChange={(tags) =>
              setValue('consultationTypeIds', tags, { shouldValidate: true })
            }
            options={consultationTypeOptions}
            error={errors.consultationTypeIds?.message}
          />
        </form>
      )}
    </Modal>
  );
}
