import { useState } from 'react';

import { useToast } from '@/app/ToastContext';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';
import { useAsyncData } from '@/hooks/useAsyncData';
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api/client';
import { getAllTherapies } from '@/lib/api/appointments';
import {
  createTherapist,
  deleteTherapist,
  getAllTherapists,
  updateTherapistStatus,
} from '@/lib/api/therapists';
import { mapTherapistToClinicRecord } from '@/lib/api/mappers';

import {
  CLINIC_STATUS_OPTIONS,
  clinicTherapistSchema,
  type ClinicTherapistFormValues,
} from '@/lib/validation/settings.schema';
import type {
  ClinicStatus,
  ClinicTherapistRecord,
} from '@/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { TherapyDto } from '@/lib/api/types';
import { SettingsActionButton, SettingsTableHead, StatusToggle } from './ClinicSettingsTab';
import { X } from 'lucide-react';

type DeleteTarget = ClinicTherapistRecord | null;

type TherapistTabData = {
  therapists: ClinicTherapistRecord[];
  therapyOptions: { value: string; label: string }[];
};

const EMPTY_DATA: TherapistTabData = {
  therapists: [],
  therapyOptions: [],
};

function nextStatus(status: ClinicStatus): 'ACTIVE' | 'INACTIVE' {
  return status === 'Active' ? 'INACTIVE' : 'ACTIVE';
}

async function loadTherapistData(): Promise<TherapistTabData> {
  const [therapists, therapies] = await Promise.all([
    getAllTherapists(),
    getAllTherapies(),
  ]);

  const therapiesById = new Map<string, TherapyDto>(
    therapies.map((therapy) => [therapy.id, therapy]),
  );

  return {
    therapists: therapists.map((therapist) =>
      mapTherapistToClinicRecord(therapist, therapiesById),
    ),
   therapyOptions: therapies
  .filter((therapy) => therapy.id)
  .map((therapy) => ({
    value: therapy.id,
    label: therapy.name ?? '',
  })),
  };
}

export function TherapistManagementTab() {
  const { showToast } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    data,
    setData,
    loading,
    error,
    reload,
  } = useAsyncData(loadTherapistData, EMPTY_DATA);

  const refreshTherapists = async () => {
    const updatedData = await loadTherapistData();
    setData(updatedData);
  };

  const handleAddTherapist = async (
    values: ClinicTherapistFormValues,
  ) => {
    try {
      await createTherapist({
        name: values.name,
        status: values.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
        assignedTherapyIds: values.assignedTherapyIds,
      });

      await refreshTherapists();

      showToast({
        title: 'Therapist Added',
        message: `${values.name} has been added successfully.`,
      });
    } catch (err) {
      showToast({
        title: 'Failed to add therapist',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not create therapist.',
      });
    }
  };

  const handleToggleStatus = async (
    therapist: ClinicTherapistRecord,
  ) => {
    setTogglingId(therapist.id);

    try {
      await updateTherapistStatus(
        therapist.id,
        nextStatus(therapist.status),
      );

      await refreshTherapists();
    } catch (err) {
      showToast({
        title: 'Failed to update therapist status',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteTherapist(deleteTarget.id);

      await refreshTherapists();

      showToast({
        title: 'Therapist Deleted',
        message: `${deleteTarget.name} was removed successfully.`,
      });
    } catch (err) {
      showToast({
        title: 'Error deleting therapist',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not delete therapist.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AsyncStatus
      loading={loading}
      error={error}
      onRetry={reload}
    >
      <div className="space-y-6">
        <TherapistSection
          therapists={data.therapists}
          therapyOptions={data.therapyOptions}
          togglingId={togglingId}
          onToggleStatus={handleToggleStatus}
          onAdd={handleAddTherapist}
          onDelete={setDeleteTarget}
        />

        <DeleteClinicItemModal
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemType="Therapist"
        />
      </div>
    </AsyncStatus>
  );
}

function TherapistSection({
  therapists,
  therapyOptions,
  togglingId,
  onToggleStatus,
  onAdd,
  onDelete,
}: {
  therapists: ClinicTherapistRecord[];
  therapyOptions: { value: string; label: string }[];
  togglingId: string | null;
  onToggleStatus: (
    record: ClinicTherapistRecord,
  ) => void | Promise<void>;
  onAdd: (
    values: ClinicTherapistFormValues,
  ) => void | Promise<void>;
  onDelete: (record: ClinicTherapistRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset, 
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClinicTherapistFormValues>({
    resolver: zodResolver(clinicTherapistSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      assignedTherapyIds: [],
    },
  });

  const assignedTherapyIds = watch('assignedTherapyIds') ?? [];

  const addTherapyTag = (therapyId: string) => {
    if (
      !therapyId ||
      assignedTherapyIds.includes(therapyId)
    ) {
      return;
    }

    setValue(
      'assignedTherapyIds',
      [...assignedTherapyIds, therapyId],
      { shouldValidate: true },
    );
  };

  const removeTherapyTag = (therapyId: string) => {
    setValue(
      'assignedTherapyIds',
      assignedTherapyIds.filter((id) => id !== therapyId),
      { shouldValidate: true },
    );
  };

  const therapyLabel = (therapyId: string) =>
    therapyOptions.find(
      (option) => option.value === therapyId,
    )?.label ?? therapyId;

  const onSubmit = async (
    values: ClinicTherapistFormValues,
  ) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <h3 className="font-sans text-base font-semibold leading-tight text-[#422C23]">
          Therapist
        </h3>
      </div>

      <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <SettingsTableHead
              columns={[
                'S No.',
                'Name',
                'Status',
                'Assigned Therapies',
                'Action',
              ]}
            />
          </thead>

          <tbody>
            <tr className="border-b border-[#EFF0F6]">
              <td className="px-4 py-3" />

              <td className="px-4 py-3">
                <Input
                  placeholder="Name"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </td>

              <td className="px-4 py-3">
                <Select
                  placeholder="Status"
                  options={[...CLINIC_STATUS_OPTIONS]}
                  error={errors.status?.message}
                  {...register('status')}
                />
              </td>

              <td className="px-4 py-3">
                <div className="space-y-2">
                  <div className="flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-lg border border-[#EFF0F6] bg-white px-2.5 py-1.5">
                    {assignedTherapyIds.map((therapyId) => (
                      <span
                        key={therapyId}
                        className="inline-flex items-center gap-1 rounded-md border border-[#EFF0F6] bg-[#F7F7F8] px-2 py-0.5 text-[11px] font-medium text-[#422C23]"
                      >
                        {therapyLabel(therapyId)}

                        <button
                          type="button"
                          onClick={() =>
                            removeTherapyTag(therapyId)
                          }
                          className="text-[#838A9A] hover:text-[#422C23]"
                          aria-label={`Remove ${therapyLabel(therapyId)}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}

                    <select
                      className="min-w-[120px] flex-1 appearance-none border-none bg-transparent py-1 text-[12px] text-[#422C23] focus:outline-none"
                      value=""
                      disabled={therapyOptions.length === 0}
                      onChange={(event) => {
                        addTherapyTag(event.target.value);
                        event.target.value = '';
                      }}
                    >
                      <option value="">
                        {therapyOptions.length
                          ? 'Select therapy'
                          : 'Add therapies first'}
                      </option>

                      {therapyOptions
                        .filter(
                          (option) =>
                            !assignedTherapyIds.includes(
                              option.value,
                            ),
                        )
                        .map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {errors.assignedTherapyIds?.message && (
                    <p className="text-xs text-danger">
                      {errors.assignedTherapyIds.message}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-4 py-3">
                <SettingsActionButton
                  label="Add therapist"
                  disabled={isSubmitting}
                  onClick={() =>
                    void handleSubmit(onSubmit)()
                  }
                />
              </td>
            </tr>

            {therapists.map((therapist, index) => (
              <tr
                key={therapist.id}
                className="border-b border-[#EFF0F6]"
              >
                <td className="px-4 py-4 text-[#422C23]">
                  {index + 1}.
                </td>

                <td className="px-4 py-4 font-medium text-[#422C23]">
                  {therapist.name}
                </td>

                <td className="px-4 py-4">
                  <StatusToggle
                    status={therapist.status}
                    disabled={togglingId === therapist.id}
                    onToggle={() =>
                      onToggleStatus(therapist)
                    }
                  />
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {therapist.assignedTherapies.length > 0 ? (
                      therapist.assignedTherapies.map(
                        (therapy) => (
                          <span
                            key={therapy}
                            className="rounded-md border border-[#EFF0F6] bg-[#F7F7F8] px-2.5 py-1 text-[11px] font-medium text-[#422C23]"
                          >
                            {therapy}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="text-[#838A9A]">
                        —
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <SettingsActionButton
                    label={`Delete ${therapist.name}`}
                    variant="delete"
                    onClick={() => onDelete(therapist)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


