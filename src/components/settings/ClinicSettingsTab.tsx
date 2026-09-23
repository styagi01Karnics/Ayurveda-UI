import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RupeeInput } from '@/components/ui/RupeeInput';
import { Select } from '@/components/ui/Select';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';
import { DoctorAvailabilityFields } from '@/components/settings/DoctorAvailabilityFields';
import {
  ConsultationTypesSection,
  DoshasSection,
  PackageMastersSection,
  TreatmentPlanMastersSection,
  mapConsultationTypeMasterToRecord,
  mapDoshaToRecord,
  mapPackageMasterToRecord,
  mapTreatmentPlanMasterToRecord,
} from '@/components/settings/MasterSettingsSections';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  createDosha,
  createTherapy,
  createTreatmentCategory,
  deleteTherapy,
  getAllDoshas,
  getAllTherapies,
  getAllTreatmentCategories,
  invalidateBookingDoshasCache,
  updateTherapyStatus,
} from '@/lib/api/appointments';
import { createConsultationType, getAllConsultationTypes } from '@/lib/api/consultationTypes';
import { ApiError } from '@/lib/api/client';
import { createPackageMaster, getAllPackageMasters } from '@/lib/api/packageMasters';
import {
  createTreatmentPlanMaster,
  getAllTreatmentPlanMasters,
} from '@/lib/api/treatmentPlanMasters';
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  updateDoctorStatus,
} from '@/lib/api/doctors';
import {
  mapDoctorToClinicRecord,
  mapTherapistToClinicRecord,
  mapTherapyToClinicRecord,
  mapTreatmentCategoryToRecord,
  parseSessionNumber,
} from '@/lib/api/mappers';
import {
  createTherapist,
  deleteTherapist,
  getAllTherapists,
  updateTherapistStatus,
} from '@/lib/api/therapists';
import {
  CLINIC_STATUS_OPTIONS,
  clinicCategorySchema,
  clinicDoctorSchema,
  clinicTherapistSchema,
  clinicTherapySchema,
  type ClinicCategoryFormValues,
  type ClinicDoctorFormValues,
  type ClinicTherapistFormValues,
  type ClinicTherapyFormValues,
} from '@/lib/validation/settings.schema';
import { cn, formatCurrency } from '@/lib/utils';
import { formatDoctorAvailability } from '@/lib/doctorAvailability';
import type {
  ClinicDoctorRecord,
  ClinicStatus,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  ClinicTreatmentCategoryRecord,
} from '@/types';

type DeleteTarget =
  | { type: 'Doctor'; record: ClinicDoctorRecord }
  | { type: 'Therapy'; record: ClinicTherapyRecord }
  | { type: 'Therapist'; record: ClinicTherapistRecord }
  | null;

function toApiStatus(status: ClinicStatus): 'ACTIVE' | 'INACTIVE' {
  return status === 'Active' ? 'ACTIVE' : 'INACTIVE';
}

function nextStatus(status: ClinicStatus): 'ACTIVE' | 'INACTIVE' {
  return status === 'Active' ? 'INACTIVE' : 'ACTIVE';
}

function StatusToggle({
  status,
  onToggle,
  disabled,
}: {
  status: ClinicStatus;
  onToggle: () => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => void onToggle()}
      disabled={disabled}
      className={cn(
        'font-medium underline-offset-2 hover:underline disabled:opacity-60',
        status === 'Active' ? 'text-success' : 'text-text-muted',
      )}
    >
      {status}
    </button>
  );
}

export function ClinicSettingsTab() {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const [
      doctors,
      therapists,
      therapies,
      categories,
      consultationTypes,
      treatmentPlans,
      packageMasters,
      doshas,
    ] = await Promise.all([
      getAllDoctors(),
      getAllTherapists(),
      getAllTherapies(),
      getAllTreatmentCategories(),
      getAllConsultationTypes().catch(() => []),
      getAllTreatmentPlanMasters().catch(() => []),
      getAllPackageMasters().catch(() => []),
      getAllDoshas().catch(() => []),
    ]);

    const categoriesById = new Map(categories.map((c) => [c.id, c]));
    const therapiesById = new Map(therapies.map((t) => [t.id, t]));

    return {
      doctors: doctors.map(mapDoctorToClinicRecord),
      therapists: therapists.map((t) =>
        mapTherapistToClinicRecord(t, therapiesById),
      ),
      therapies: therapies.map((therapy) =>
        mapTherapyToClinicRecord(therapy, categoriesById),
      ),
      categories: categories.map(mapTreatmentCategoryToRecord),
      categoryOptions: categories.map((c) => ({
        value: c.id,
        label: c.categoryName,
      })),
      consultationTypes: consultationTypes.map(mapConsultationTypeMasterToRecord),
      treatmentPlans: treatmentPlans.map(mapTreatmentPlanMasterToRecord),
      packageMasters: packageMasters.map(mapPackageMasterToRecord),
      doshas: doshas.map(mapDoshaToRecord),
    };
  }, {
    doctors: [] as ClinicDoctorRecord[],
    therapists: [] as ClinicTherapistRecord[],
    therapies: [] as ClinicTherapyRecord[],
    categories: [] as ClinicTreatmentCategoryRecord[],
    categoryOptions: [] as { value: string; label: string }[],
    consultationTypes: [],
    treatmentPlans: [],
    packageMasters: [],
    doshas: [],
  });

  const { doctors, therapies, therapists } = data;

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'Doctor') {
        await deleteDoctor(deleteTarget.record.id);
        showToast({
          title: 'Doctor has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      } else if (deleteTarget.type === 'Therapy') {
        await deleteTherapy(deleteTarget.record.id);
        showToast({
          title: 'Therapy has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      } else if (deleteTarget.type === 'Therapist') {
        await deleteTherapist(deleteTarget.record.id);
        showToast({
          title: 'Therapist has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      }
      await reload();
    } catch (err) {
      showToast({
        title: 'Error deleting record',
        message: err instanceof ApiError ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleDoctorStatus = async (doctor: ClinicDoctorRecord) => {
    setTogglingId(doctor.id);
    try {
      await updateDoctorStatus(doctor.id, nextStatus(doctor.status));
      await reload();
    } catch (err) {
      showToast({
        title: 'Failed to update doctor status',
        message: err instanceof ApiError ? err.message : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleTherapyStatus = async (therapy: ClinicTherapyRecord) => {
    setTogglingId(therapy.id);
    try {
      await updateTherapyStatus(therapy.id, nextStatus(therapy.status));
      await reload();
    } catch (err) {
      showToast({
        title: 'Failed to update therapy status',
        message: err instanceof ApiError ? err.message : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleTherapistStatus = async (therapist: ClinicTherapistRecord) => {
    setTogglingId(therapist.id);
    try {
      await updateTherapistStatus(therapist.id, nextStatus(therapist.status));
      await reload();
    } catch (err) {
      showToast({
        title: 'Failed to update therapist status',
        message: err instanceof ApiError ? err.message : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AsyncStatus loading={loading} error={error} onRetry={reload}>
      <div className="space-y-6">
        <TreatmentCategoriesSection
          categories={data.categories}
          onAdd={async (values) => {
            try {
              await createTreatmentCategory({
                categoryName: values.categoryName.trim(),
                description: values.description.trim(),
                status: 'ACTIVE',
              });
              await reload();
              showToast({
                title: 'Category Added',
                message: `${values.categoryName} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add category',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create treatment category.',
              });
            }
          }}
        />

        <DoctorsSection
          doctors={doctors}
          togglingId={togglingId}
          onToggleStatus={handleToggleDoctorStatus}
          onAdd={async (values) => {
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
                mobileNumber: values.mobileNumber?.trim() || undefined,
                qualification: values.qualification?.trim() || undefined,
              });
              await reload();
              showToast({
                title: 'Doctor Added',
                message: `${values.name} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add doctor',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create doctor.',
              });
            }
          }}
          onDelete={(record) => setDeleteTarget({ type: 'Doctor', record })}
        />

        <TherapySection
          therapies={therapies}
          categoryOptions={data.categoryOptions}
          togglingId={togglingId}
          onToggleStatus={handleToggleTherapyStatus}
          onAdd={async (values) => {
            try {
              if (!values.category) {
                showToast({
                  title: 'Category required',
                  message: 'Add a treatment category before creating therapies.',
                });
                return;
              }

              await createTherapy({
                name: values.name,
                categoryId: values.category,
                status: 'ACTIVE',
                durationMinutes: parseSessionNumber(values.duration) || 45,
                price: Number(values.price),
                description: values.description,
              });

              await reload();
              showToast({
                title: 'Therapy Added',
                message: `${values.name} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add therapy',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create therapy.',
              });
            }
          }}
          onDelete={(record) => setDeleteTarget({ type: 'Therapy', record })}
        />

        <TherapistSection
          therapists={therapists}
          therapyOptions={therapies.map((therapy) => ({
            value: therapy.id,
            label: therapy.name,
          }))}
          togglingId={togglingId}
          onToggleStatus={handleToggleTherapistStatus}
          onAdd={async (values) => {
            try {
              await createTherapist({
                name: values.name,
                status: toApiStatus(values.status),
                assignedTherapyIds: values.assignedTherapyIds,
              });
              await reload();
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
          }}
          onDelete={(record) => setDeleteTarget({ type: 'Therapist', record })}
        />

        <ConsultationTypesSection
          records={data.consultationTypes}
          onAdd={async (values) => {
            try {
              await createConsultationType({
                name: values.name.trim().toUpperCase().replace(/\s+/g, '_'),
                status: 'ACTIVE',
              });
              await reload();
              showToast({
                title: 'Consultation type added',
                message: `${values.name} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add consultation type',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create consultation type.',
              });
            }
          }}
        />

        <TreatmentPlanMastersSection
          records={data.treatmentPlans}
          onAdd={async (values) => {
            try {
              await createTreatmentPlanMaster({
                name: values.name.trim(),
                status: 'ACTIVE',
              });
              await reload();
              showToast({
                title: 'Treatment plan added',
                message: `${values.name} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add treatment plan',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create treatment plan.',
              });
            }
          }}
        />

        <PackageMastersSection
          records={data.packageMasters}
          onAdd={async (values) => {
            try {
              await createPackageMaster({
                name: values.name.trim(),
                packagePrice: Number(values.packagePrice),
                status: 'ACTIVE',
              });
              await reload();
              showToast({
                title: 'Package master added',
                message: `${values.name} has been added successfully.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add package',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create package master.',
              });
            }
          }}
        />

        <DoshasSection
          records={data.doshas}
          onAdd={async (values) => {
            try {
              await createDosha({
                name: values.name.trim(),
                elements: values.elements.trim(),
                characteristics: values.characteristics.trim(),
                status: 'ACTIVE',
              });
              invalidateBookingDoshasCache();
              await reload();
              showToast({
                title: 'Dosha added',
                message: `${values.name} has been added to Dosha Master.`,
              });
            } catch (err) {
              showToast({
                title: 'Failed to add dosha',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create dosha.',
              });
            }
          }}
        />

        <DeleteClinicItemModal
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemType={deleteTarget?.type ?? 'Doctor'}
        />
      </div>
    </AsyncStatus>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="font-sans text-base font-semibold leading-tight tracking-normal text-[#422C23]">
      {title}
    </h3>
  );
}

function SettingsActionButton({
  label,
  onClick,
  disabled,
  variant = 'add',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'add' | 'delete';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4E5] text-[#422C23] transition-colors hover:bg-[#F5EBD3] disabled:opacity-60',
        variant === 'delete' && 'hover:bg-danger/10 hover:text-danger',
      )}
    >
      {variant === 'add' ? (
        <Plus className="h-4 w-4" strokeWidth={2.25} />
      ) : (
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
}

function SettingsTableHead({ columns }: { columns: string[] }) {
  return (
    <tr className="border-b border-[#EFF0F6] text-[12px] font-medium text-[#838A9A]">
      {columns.map((column) => (
        <th key={column} className="px-4 py-3 text-left font-medium">
          {column}
        </th>
      ))}
    </tr>
  );
}

function TreatmentCategoriesSection({
  categories,
  onAdd,
}: {
  categories: ClinicTreatmentCategoryRecord[];
  onAdd: (values: ClinicCategoryFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicCategoryFormValues>({
    resolver: zodResolver(clinicCategorySchema),
    defaultValues: { categoryName: '', description: '' },
  });

  const onSubmit = async (values: ClinicCategoryFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Treatment Categories" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <SettingsTableHead
              columns={['S No.', 'Category Name', 'Description', 'Action']}
            />
          </thead>
          <tbody>
            <tr className="border-b border-[#EFF0F6]">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input
                  placeholder="Category Name"
                  error={errors.categoryName?.message}
                  {...register('categoryName')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="Description"
                  error={errors.description?.message}
                  {...register('description')}
                />
              </td>
              <td className="px-4 py-3">
                <SettingsActionButton
                  label="Add category"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit(onSubmit)()}
                />
              </td>
            </tr>
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">{category.name}</td>
                <td className="px-4 py-4 text-[#422C23]">{category.description}</td>
                <td className="px-4 py-4 text-[#838A9A]">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DoctorsSection({
  doctors,
  togglingId,
  onToggleStatus,
  onAdd,
  onDelete,
}: {
  doctors: ClinicDoctorRecord[];
  togglingId: string | null;
  onToggleStatus: (record: ClinicDoctorRecord) => void | Promise<void>;
  onAdd: (values: ClinicDoctorFormValues) => void | Promise<void>;
  onDelete: (record: ClinicDoctorRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClinicDoctorFormValues>({
    resolver: zodResolver(clinicDoctorSchema),
    defaultValues: {
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
    },
  });

  const availabilityDays = watch('availabilityDays') ?? [];
  const { showToast } = useToast();

  const onSubmit = async (values: ClinicDoctorFormValues) => {
    await onAdd(values);
    reset({
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
    });
  };

  const onInvalid = () => {
    showToast({
      title: 'Cannot add doctor',
      message:
        'Please fill name, specialization, mobile, fees, and availability.',
    });
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Doctors" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
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
            <tr className="border-b border-[#EFF0F6]">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input placeholder="Name" error={errors.name?.message} {...register('name')} />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="Specialisation"
                  error={errors.specialization?.message}
                  {...register('specialization')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="Qualification"
                  error={errors.qualification?.message}
                  {...register('qualification')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="Mobile"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
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
                <RupeeInput
                  placeholder="0"
                  error={errors.consultationFees?.message}
                  {...register('consultationFees')}
                />
              </td>
              <td className="px-4 py-3">
                <RupeeInput
                  placeholder="0"
                  error={errors.followUpFees?.message}
                  {...register('followUpFees')}
                />
              </td>
              <td className="px-4 py-3 align-top">
                <DoctorAvailabilityFields
                  compact
                  selectedDays={availabilityDays}
                  onDaysChange={(days) =>
                    setValue('availabilityDays', days, { shouldValidate: true })
                  }
                  startTime={watch('availabilityStartTime') ?? '09:00'}
                  endTime={watch('availabilityEndTime') ?? '17:00'}
                  onStartTimeChange={(value) =>
                    setValue('availabilityStartTime', value, { shouldValidate: true })
                  }
                  onEndTimeChange={(value) =>
                    setValue('availabilityEndTime', value, { shouldValidate: true })
                  }
                  daysError={errors.availabilityDays?.message}
                  startTimeError={errors.availabilityStartTime?.message}
                  endTimeError={errors.availabilityEndTime?.message}
                />
              </td>
              <td className="px-4 py-3 align-top">
                <SettingsActionButton
                  label="Add doctor"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit(onSubmit, onInvalid)()}
                />
              </td>
            </tr>
            {doctors.map((doctor, index) => (
              <tr key={doctor.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">{doctor.name}</td>
                <td className="px-4 py-4 text-[#422C23]">{doctor.specialization}</td>
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
                    onToggle={() => onToggleStatus(doctor)}
                  />
                </td>
                <td className="px-4 py-4 text-[#422C23]">
                  {formatCurrency(doctor.consultationFees)}
                </td>
                <td className="px-4 py-4 text-[#422C23]">
                  {formatCurrency(doctor.followUpFees)}
                </td>
                <td className="px-4 py-4 text-[#422C23]">{doctor.availability || '—'}</td>
                <td className="px-4 py-4">
                  <SettingsActionButton
                    label={`Delete ${doctor.name}`}
                    variant="delete"
                    onClick={() => onDelete(doctor)}
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

function TherapySection({
  therapies,
  categoryOptions,
  togglingId,
  onToggleStatus,
  onAdd,
  onDelete,
}: {
  therapies: ClinicTherapyRecord[];
  categoryOptions: { value: string; label: string }[];
  togglingId: string | null;
  onToggleStatus: (record: ClinicTherapyRecord) => void | Promise<void>;
  onAdd: (values: ClinicTherapyFormValues) => void | Promise<void>;
  onDelete: (record: ClinicTherapyRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicTherapyFormValues>({
    resolver: zodResolver(clinicTherapySchema),
    defaultValues: {
      name: '',
      category: '',
      duration: '',
      price: '',
      description: '',
    },
  });

  const onSubmit = async (values: ClinicTherapyFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Therapy" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <SettingsTableHead
              columns={[
                'S No.',
                'Name',
                'Category',
                'Status',
                'Duration',
                'Price',
                'Description',
                'Action',
              ]}
            />
          </thead>
          <tbody>
            <tr className="border-b border-[#EFF0F6]">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input placeholder="Name" error={errors.name?.message} {...register('name')} />
              </td>
              <td className="px-4 py-3">
                <Select
                  placeholder={categoryOptions.length ? 'Category' : 'Add category first'}
                  options={categoryOptions}
                  disabled={categoryOptions.length === 0}
                  error={errors.category?.message}
                  {...register('category')}
                />
              </td>
              <td className="px-4 py-3 text-[12px] text-[#838A9A]">Active</td>
              <td className="px-4 py-3">
                <Input placeholder="45 min" error={errors.duration?.message} {...register('duration')} />
              </td>
              <td className="px-4 py-3">
                <RupeeInput placeholder="0" error={errors.price?.message} {...register('price')} />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="Description"
                  error={errors.description?.message}
                  {...register('description')}
                />
              </td>
              <td className="px-4 py-3">
                <SettingsActionButton
                  label="Add therapy"
                  disabled={isSubmitting || categoryOptions.length === 0}
                  onClick={() => void handleSubmit(onSubmit)()}
                />
              </td>
            </tr>
            {therapies.map((therapy, index) => (
              <tr key={therapy.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">{therapy.name}</td>
                <td className="px-4 py-4 text-[#422C23]">{therapy.category}</td>
                <td className="px-4 py-4">
                  <StatusToggle
                    status={therapy.status}
                    disabled={togglingId === therapy.id}
                    onToggle={() => onToggleStatus(therapy)}
                  />
                </td>
                <td className="px-4 py-4 text-[#422C23]">{therapy.duration}</td>
                <td className="px-4 py-4 text-[#422C23]">{formatCurrency(therapy.price)}</td>
                <td className="px-4 py-4 text-[#422C23]">{therapy.description}</td>
                <td className="px-4 py-4">
                  <SettingsActionButton
                    label={`Delete ${therapy.name}`}
                    variant="delete"
                    onClick={() => onDelete(therapy)}
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
  onToggleStatus: (record: ClinicTherapistRecord) => void | Promise<void>;
  onAdd: (values: ClinicTherapistFormValues) => void | Promise<void>;
  onDelete: (record: ClinicTherapistRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
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
    if (!therapyId || assignedTherapyIds.includes(therapyId)) return;
    setValue('assignedTherapyIds', [...assignedTherapyIds, therapyId], {
      shouldValidate: true,
    });
  };

  const removeTherapyTag = (therapyId: string) => {
    setValue(
      'assignedTherapyIds',
      assignedTherapyIds.filter((id) => id !== therapyId),
      { shouldValidate: true },
    );
  };

  const therapyLabel = (therapyId: string) =>
    therapyOptions.find((option) => option.value === therapyId)?.label ??
    therapyId;

  const onSubmit = async (values: ClinicTherapistFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Therapist" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <SettingsTableHead
              columns={['S No.', 'Name', 'Status', 'Assigned Therapies', 'Action']}
            />
          </thead>
          <tbody>
            <tr className="border-b border-[#EFF0F6]">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input placeholder="Name" error={errors.name?.message} {...register('name')} />
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
                          onClick={() => removeTherapyTag(therapyId)}
                          className="text-[#838A9A] hover:text-[#422C23]"
                          aria-label={`Remove ${therapyLabel(therapyId)}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <select
                      className="min-w-[120px] flex-1 appearance-none border-none bg-transparent py-1 font-sans text-[12px] font-medium text-[#422C23] focus:outline-none"
                      value=""
                      disabled={therapyOptions.length === 0}
                      onChange={(e) => {
                        addTherapyTag(e.target.value);
                        e.target.value = '';
                      }}
                    >
                      <option value="">
                        {therapyOptions.length ? 'Select therapy' : 'Add therapies first'}
                      </option>
                      {therapyOptions
                        .filter((opt) => !assignedTherapyIds.includes(opt.value))
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.assignedTherapyIds?.message && (
                    <p className="text-xs text-danger">{errors.assignedTherapyIds.message}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <SettingsActionButton
                  label="Add therapist"
                  onClick={() => void handleSubmit(onSubmit)()}
                />
              </td>
            </tr>
            {therapists.map((therapist, index) => (
              <tr key={therapist.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">{therapist.name}</td>
                <td className="px-4 py-4">
                  <StatusToggle
                    status={therapist.status}
                    disabled={togglingId === therapist.id}
                    onToggle={() => onToggleStatus(therapist)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {therapist.assignedTherapies.map((therapy) => (
                      <span
                        key={therapy}
                        className="rounded-md border border-[#EFF0F6] bg-[#F7F7F8] px-2.5 py-1 text-[11px] font-medium text-[#422C23]"
                      >
                        {therapy}
                      </span>
                    ))}
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
