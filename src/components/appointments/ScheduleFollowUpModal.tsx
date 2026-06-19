import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  followUpSchema,
  type FollowUpFormValues,
} from '@/lib/validation/patient.schema';
import { DOCTORS_LIST } from '@/data/mock/appointments';
import { APPOINTMENT_FILTER_OPTIONS } from '@/data/mock/appointments';

interface ScheduleFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FollowUpFormValues) => void;
}

export function ScheduleFollowUpModal({
  open,
  onClose,
  onSubmit,
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
      fullName: '',
      contactNumber: '',
      visitType: '',
      doctor: '',
      scheduleDate: '',
      scheduleTime: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: FollowUpFormValues) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule Follow Up"
      subtitle="Please fill out the patient details"
      size="lg"
      footer={
        <Button
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
        >
          Confirm
        </Button>
      }
    >
      <form className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Patient ID"
            placeholder="Patient ID"
            error={errors.patientId?.message}
            {...register('patientId')}
          />
          <Input
            label="Full Name"
            placeholder="Full Name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Contact Number"
            placeholder="Contact Number"
            error={errors.contactNumber?.message}
            {...register('contactNumber')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Visit Type"
            placeholder="Visit Type"
            options={[...APPOINTMENT_FILTER_OPTIONS.visitType]}
            error={errors.visitType?.message}
            {...register('visitType')}
          />
          <Select
            label="Doctor"
            placeholder="Doctor"
            options={[...DOCTORS_LIST]}
            error={errors.doctor?.message}
            {...register('doctor')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Schedule Date"
            type="date"
            error={errors.scheduleDate?.message}
            {...register('scheduleDate')}
          />
          <Input
            label="Schedule Time"
            type="time"
            error={errors.scheduleTime?.message}
            {...register('scheduleTime')}
          />
        </div>
      </form>
    </Modal>
  );
}
