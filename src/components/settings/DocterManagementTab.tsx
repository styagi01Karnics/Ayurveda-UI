
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/app/ToastContext';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { DoctorAvailabilityFields } from '@/components/settings/DoctorAvailabilityFields';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';

import {
  SectionHeader,
  SettingsActionButton,
  SettingsTableHead,
  StatusToggle,
} from '@/components/settings/ClinicSettingsTab';

import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  updateDoctorStatus,
} from '@/lib/api/doctors';

import { mapDoctorToClinicRecord } from '@/lib/api/mappers';
import { ApiError } from '@/lib/api/client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDoctorAvailability } from '@/lib/doctorAvailability';
import { formatCurrency } from '@/lib/utils';

import {
  CLINIC_STATUS_OPTIONS,
  clinicDoctorSchema,
  type ClinicDoctorFormValues,
} from '@/lib/validation/settings.schema';

import type { ClinicDoctorRecord, ClinicStatus } from '@/types';

const EMPTY_DOCTOR_FORM: ClinicDoctorFormValues = {
  name: '',
  specialization: '',
  qualification: '',
  mobileNumber: '',
  status: 'Active',
  consultationFees: '',
  followUpFees: '',
  availabilityDays: ['weekdays'],
  availabilityStartTime: '09:00',
  availabilityEndTime: '17:00',
};

const toApiStatus = (status: ClinicStatus) =>
  status === 'Active' ? 'ACTIVE' : 'INACTIVE';

const nextStatus = (status: ClinicStatus) =>
  status === 'Active' ? 'INACTIVE' : 'ACTIVE';

export function DocterManagementTab() {
  const { showToast } = useToast();

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ClinicDoctorRecord | null>(null);

  const {
    data: doctors,
    setData: setDoctors,
    loading,
    error,
    reload,
  } = useAsyncData(
    async () => {
      const response = await getAllDoctors();
      return response.map(mapDoctorToClinicRecord);
    },
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClinicDoctorFormValues>({
    resolver: zodResolver(clinicDoctorSchema),
    defaultValues: EMPTY_DOCTOR_FORM,
  });

  const availabilityDays = watch('availabilityDays') ?? [];

  const refreshDoctors = async () => {
    const response = await getAllDoctors();
    setDoctors(response.map(mapDoctorToClinicRecord));
  };

  const onSubmit = async (values: ClinicDoctorFormValues) => {
    try {
      await createDoctor({
        name: values.name,
        specialization: values.specialization,
        status: toApiStatus(values.status),
        consultationFees: Number(values.consultationFees),
        followUpFees: Number(values.followUpFees),
        availability: formatDoctorAvailability(
          values.availabilityDays,
          values.availabilityStartTime,
          values.availabilityEndTime,
        ),
        mobileNumber: values.mobileNumber,
        qualification: values.qualification ?? '',
      });

      await refreshDoctors();
      reset(EMPTY_DOCTOR_FORM);

      showToast({
        title: 'Doctor Added',
        message: `${values.name} has been added successfully.`,
      });
    } catch (err) {
      showToast({
        title: 'Failed to add doctor',
        message:
          err instanceof ApiError ? err.message : 'Could not create doctor.',
      });
    }
  };

  const handleToggleStatus = async (doctor: ClinicDoctorRecord) => {
    setTogglingId(doctor.id);

    try {
      await updateDoctorStatus(doctor.id, nextStatus(doctor.status));
      await refreshDoctors();
    } catch (err) {
      showToast({
        title: 'Failed to update doctor status',
        message:
          err instanceof ApiError ? err.message : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDoctor(deleteTarget.id);
      await refreshDoctors();

      showToast({
        title: 'Doctor has been deleted',
        message: `${deleteTarget.name} was removed from the database.`,
      });
    } catch (err) {
      showToast({
        title: 'Error deleting record',
        message:
          err instanceof ApiError
            ? err.message
            : 'An unknown error occurred.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const onInvalid = () => {
    showToast({
      title: 'Cannot add doctor',
      message:
        'Please fill name, specialization, mobile, fees, and availability.',
    });
  };

  return (
    <AsyncStatus loading={loading} error={error} onRetry={reload}>
      <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
        <div className="border-b border-[#EFF0F6] px-5 py-4">
          <SectionHeader title="Doctors" />
        </div>

        <form
          className="border-b border-[#EFF0F6] px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(onSubmit, onInvalid)();
          }}
        >
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <div className="min-w-0">
              <Input
                label="Name"
                placeholder="Name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div className="min-w-0">
              <Input
                label="Specialisation"
                placeholder="Specialisation"
                error={errors.specialization?.message}
                {...register('specialization')}
              />
            </div>

            <div className="min-w-0">
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Qualification"
                    placeholder="Qualification"
                    error={errors.qualification?.message}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </div>

            <div className="min-w-0">
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Mobile"
                    placeholder="10-digit no."
                    error={errors.mobileNumber?.message}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </div>

            <div className="min-w-0">
              <Select
                label="Status"
                placeholder="Status"
                options={[...CLINIC_STATUS_OPTIONS]}
                error={errors.status?.message}
                {...register('status')}
              />
            </div>

            <div className="min-w-0">
              <RupeeInput
                label="Consultation"
                placeholder="0"
                error={errors.consultationFees?.message}
                {...register('consultationFees')}
              />
            </div>

            <div className="min-w-0">
              <RupeeInput
                label="Follow up"
                placeholder="0"
                error={errors.followUpFees?.message}
                {...register('followUpFees')}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DoctorAvailabilityFields
                selectedDays={availabilityDays}
                onDaysChange={(days) =>
                  setValue('availabilityDays', days, {
                    shouldValidate: true,
                  })
                }
                startTime={watch('availabilityStartTime') ?? '09:00'}
                endTime={watch('availabilityEndTime') ?? '17:00'}
                onStartTimeChange={(value) =>
                  setValue('availabilityStartTime', value, {
                    shouldValidate: true,
                  })
                }
                onEndTimeChange={(value) =>
                  setValue('availabilityEndTime', value, {
                    shouldValidate: true,
                  })
                }
                daysError={errors.availabilityDays?.message}
                startTimeError={errors.availabilityStartTime?.message}
                endTimeError={errors.availabilityEndTime?.message}
              />
            </div>

            <SettingsActionButton
              label="Add doctor"
              disabled={isSubmitting}
              onClick={() => void handleSubmit(onSubmit, onInvalid)()}
            />
          </div>
        </form>

        <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <SettingsTableHead
                columns={[
                  'S No.',
                  'Name',
                  'Specialization',
                  'Qualification',
                  'Mobile',
                  'Status',
                  'Consultation Fees',
                  'Follow Up Fees',
                  'Availability',
                  'Action',
                ]}
              />
            </thead>

            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id} className="border-b border-[#EFF0F6]">
                  <td className="px-4 py-4 text-[#422C23]">
                    {index + 1}.
                  </td>

                  <td className="px-4 py-4 font-medium text-[#422C23]">
                    {doctor.name}
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {doctor.specialization}
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {doctor.qualification || '—'}
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {doctor.mobileNumber || '—'}
                  </td>

                  <td className="px-4 py-4">
                    <StatusToggle
                      status={doctor.status}
                      disabled={togglingId === doctor.id}
                      onToggle={() => handleToggleStatus(doctor)}
                    />
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {formatCurrency(doctor.consultationFees)}
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {formatCurrency(doctor.followUpFees)}
                  </td>

                  <td className="px-4 py-4 text-[#422C23]">
                    {doctor.availability || '—'}
                  </td>

                  <td className="px-4 py-4">
                    <SettingsActionButton
                      label={`Delete ${doctor.name}`}
                      variant="delete"
                      onClick={() => setDeleteTarget(doctor)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DeleteClinicItemModal
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemType="Doctor"
        />
      </Card>
    </AsyncStatus>
  );
}
