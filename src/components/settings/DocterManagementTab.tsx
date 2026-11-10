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
  SettingsActionButton,
  SettingsTableHead,
  StatusToggle,
} from '@/components/settings/ClinicSettingsTab';

import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  updateDoctorStatus,
  updateDoctor,
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
  email: '',
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
  const [deleteTarget, setDeleteTarget] = useState<ClinicDoctorRecord | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<ClinicDoctorRecord | null>(null);

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

  const handleEditClick = (doctor: ClinicDoctorRecord) => {
    setEditingDoctor(doctor);

    reset({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification || '',
      mobileNumber: doctor.mobileNumber || '',
      email: doctor.email || '',
      status: doctor.status,
      consultationFees: doctor.consultationFees.toString(),
      followUpFees: doctor.followUpFees.toString(),
      availabilityDays: ['weekdays'],
      availabilityStartTime: '09:00',
      availabilityEndTime: '17:00',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingDoctor(null);
    reset(EMPTY_DOCTOR_FORM);
  };

  const onSubmit = async (values: ClinicDoctorFormValues) => {
    try {
      const payload = {
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
        email: values.email,
        qualification: values.qualification ?? '',
      };

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, payload);
        showToast({
          title: 'Doctor Updated',
          message: `${values.name}'s profile has been updated.`,
        });
      } else {
        await createDoctor(payload);
        showToast({
          title: 'Doctor Added',
          message: `${values.name} has been added successfully.`,
        });
      }

      await refreshDoctors();
      setEditingDoctor(null);
      reset(EMPTY_DOCTOR_FORM);

    } catch (err) {
      showToast({
        title: editingDoctor ? 'Failed to update doctor' : 'Failed to add doctor',
        message: err instanceof ApiError ? err.message : 'An error occurred.',
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
        message: err instanceof ApiError ? err.message : 'Could not update status.',
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
        title: 'Doctor deleted',
        message: `${deleteTarget.name} was removed.`,
      });
    } catch (err) {
      showToast({
        title: 'Error deleting record',
        message: err instanceof ApiError ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const onInvalid = () => {
    showToast({
      title: 'Cannot save doctor',
      message: 'Please fill name, specialization, mobile, fees, and availability.',
    });
  };

  return (
    <AsyncStatus loading={loading} error={error} onRetry={reload}>
      <div className="flex flex-col gap-6 p-4">
        {/* Top Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#422C23]">Doctors</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage doctor profiles, consultation fees and availability.
            </p>
          </div>
          <SettingsActionButton
            label="+ Add doctor"
            onClick={handleCancelEdit}
          />
        </div>

        {/* Doctor Details Form Card */}
        <Card className="settings-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#422C23]">
                {editingDoctor ? 'Edit Doctor Details' : 'Doctor details'}
              </h2>
              <p className="text-sm text-gray-500">
                Enter the doctor's profile and fee information.
              </p>
            </div>
            {editingDoctor && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Editing: {editingDoctor.name}
              </span>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(onSubmit, onInvalid)(); }}>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0">
                <Input label="Full name" placeholder="e.g. Dr. Arman" error={errors.name?.message} {...register('name')} />
              </div>

              <div className="min-w-0">
                <Input label="Specialisation" placeholder="Select specialisation" error={errors.specialization?.message} {...register('specialization')} />
              </div>

              <div className="min-w-0">
                <Controller
                  name="qualification"
                  control={control}
                  render={({ field }) => (
                    <Input label="Qualification" placeholder="e.g. BAMS, MD" error={errors.qualification?.message} {...field} value={field.value ?? ''} />
                  )}
                />
              </div>

              <div className="min-w-0">
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <Input label="Mobile number" placeholder="+91 98765 43210" error={errors.mobileNumber?.message} {...field} value={field.value ?? ''} />
                  )}
                />
              </div>

              <div className="min-w-0">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input label="Email" type="email" placeholder="doctor@example.com" error={errors.email?.message} {...field} value={field.value ?? ''} />
                  )}
                />
              </div>

              <div className="min-w-0">
                <Select label="Status" placeholder="Active" options={[...CLINIC_STATUS_OPTIONS]} error={errors.status?.message} {...register('status')} />
              </div>

              <div className="min-w-0">
                <RupeeInput label="Consultation fee" placeholder="1,000" error={errors.consultationFees?.message} {...register('consultationFees')} />
              </div>

              <div className="min-w-0">
                <RupeeInput label="Follow-up fee" placeholder="500" error={errors.followUpFees?.message} {...register('followUpFees')} />
              </div>
            </div>

            <div className="mt-6 min-w-0 w-full lg:w-3/4">
              <DoctorAvailabilityFields
                selectedDays={availabilityDays}
                onDaysChange={(days) => setValue('availabilityDays', days, { shouldValidate: true })}
                startTime={watch('availabilityStartTime') ?? '09:00'}
                endTime={watch('availabilityEndTime') ?? '17:00'}
                onStartTimeChange={(val) => setValue('availabilityStartTime', val, { shouldValidate: true })}
                onEndTimeChange={(val) => setValue('availabilityEndTime', val, { shouldValidate: true })}
                daysError={errors.availabilityDays?.message}
                startTimeError={errors.availabilityStartTime?.message}
                endTimeError={errors.availabilityEndTime?.message}
              />
            </div>

            <div className="mt-8 flex items-center justify-end gap-4 border-t border-[#EFF0F6] pt-6">
              <div className="mt-8 flex items-center justify-end gap-4 border-t border-[#EFF0F6] pt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit(onSubmit, onInvalid)()}
                  className="rounded-md bg-gold px-6 py-2 text-sm font-medium text-white focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {editingDoctor ? 'Save' : 'Add doctor'}
                </button>
              </div>
            </div>
          </form>
        </Card>

        {/* Doctor List Table Card */}
        <Card className="settings-card p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#422C23]">Doctor list</h2>
              <p className="text-sm text-gray-500">{doctors.length} doctors</p>
            </div>
            <div className="w-full sm:w-64">
              <Input placeholder="Search doctors..." />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[#EFF0F6] bg-white text-xs uppercase tracking-wider text-gray-500">
                <SettingsTableHead
                  columns={[
                    'DOCTOR', 'SPECIALISATION', 'QUALIFICATION', 'MOBILE',
                    'STATUS', 'FEES', 'AVAILABILITY', 'ACTIONS'
                  ]}
                />
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-[#EFF0F6] hover:bg-gray-50/50">
                    <td className="px-4 py-4 font-medium text-[#422C23]">{doctor.name}</td>
                    <td className="px-4 py-4 text-[#422C23]">{doctor.specialization}</td>
                    <td className="px-4 py-4 text-[#422C23]">{doctor.qualification || '—'}</td>
                    <td className="px-4 py-4 text-[#422C23]">{doctor.mobileNumber || '—'}</td>
                    <td className="px-4 py-4">
                      <StatusToggle
                        status={doctor.status}
                        disabled={togglingId === doctor.id}
                        onToggle={() => handleToggleStatus(doctor)}
                      />
                    </td>
                    <td className="px-4 py-4 text-[#422C23]">
                      {formatCurrency(doctor.consultationFees)} / {formatCurrency(doctor.followUpFees)}
                    </td>
                    <td className="px-4 py-4 text-[#422C23]">{doctor.availability || '—'}</td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <SettingsActionButton
                          label="Edit"
                          variant='edit'
                          onClick={() => handleEditClick(doctor)}
                        />
                        <SettingsActionButton
                          label="Delete"
                          variant="delete"
                          onClick={() => setDeleteTarget(doctor)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {doctors.length > 0 ? 1 : 0}-{doctors.length} of {doctors.length} doctors
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded px-2 py-1 hover:bg-gray-100">&lt;</button>
              <span className="font-medium">1</span>
              <button className="rounded px-2 py-1 hover:bg-gray-100">&gt;</button>
            </div>
          </div>
        </Card>

        <DeleteClinicItemModal
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemType="Doctor"
        />
      </div>
    </AsyncStatus>
  );
}