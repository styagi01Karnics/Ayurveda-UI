import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';
import { DoctorAvailabilityFields } from '@/components/settings/DoctorAvailabilityFields';
import {
  ConsultationTypesSection,
  PackageMastersSection,
  TreatmentPlanMastersSection,
  mapConsultationTypeMasterToRecord,
  mapPackageMasterToRecord,
  mapTreatmentPlanMasterToRecord,
} from '@/components/settings/MasterSettingsSections';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  createTherapy,
  createTreatmentCategory,
  deleteTherapy,
  getAllTherapies,
  getAllTreatmentCategories,
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
    ] = await Promise.all([
      getAllDoctors(),
      getAllTherapists(),
      getAllTherapies(),
      getAllTreatmentCategories(),
      getAllConsultationTypes().catch(() => []),
      getAllTreatmentPlanMasters().catch(() => []),
      getAllPackageMasters().catch(() => []),
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
                qualification: values.qualification?.trim() || undefined,
                mobileNumber: values.mobileNumber?.trim() || undefined,
                status: toApiStatus(values.status),
                consultationFees: Number(values.consultationFees),
                followUpFees: Number(values.followUpFees),
                availability: formatDoctorAvailability(
                  values.availabilityDays,
                  values.availabilityStartTime,
                  values.availabilityEndTime,
                ),
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
    <h3 className="mb-4 text-base font-semibold text-brown">{title}</h3>
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
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Treatment Categories" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Category Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
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
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add category"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{category.name}</td>
                <td className="px-4 py-4 text-brown">{category.description}</td>
                <td className="px-4 py-4 text-text-muted">—</td>
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

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Doctors" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialization</th>
              <th className="px-4 py-3 font-medium">Qualification</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Consultation Fees</th>
              <th className="px-4 py-3 font-medium">Follow Up Fees</th>
              <th className="px-4 py-3 font-medium min-w-[220px]">Availability</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input placeholder="Name" error={errors.name?.message} {...register('name')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="Specialization" error={errors.specialization?.message} {...register('specialization')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="Qualification" error={errors.qualification?.message} {...register('qualification')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="Mobile" error={errors.mobileNumber?.message} {...register('mobileNumber')} />
              </td>
              <td className="px-4 py-3">
                <Select placeholder="Status" options={[...CLINIC_STATUS_OPTIONS]} error={errors.status?.message} {...register('status')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.consultationFees?.message} {...register('consultationFees')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.followUpFees?.message} {...register('followUpFees')} />
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
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add doctor"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {doctors.map((doctor, index) => (
              <tr key={doctor.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{doctor.name}</td>
                <td className="px-4 py-4 text-brown">{doctor.specialization}</td>
                <td className="px-4 py-4 text-brown">{doctor.qualification || '—'}</td>
                <td className="px-4 py-4 text-brown">{doctor.mobileNumber || '—'}</td>
                <td className="px-4 py-4">
                  <StatusToggle
                    status={doctor.status}
                    disabled={togglingId === doctor.id}
                    onToggle={() => onToggleStatus(doctor)}
                  />
                </td>
                <td className="px-4 py-4 text-brown">{formatCurrency(doctor.consultationFees)}</td>
                <td className="px-4 py-4 text-brown">{formatCurrency(doctor.followUpFees)}</td>
                <td className="px-4 py-4 text-brown">{doctor.availability || '—'}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(doctor)}
                    className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-danger/10 hover:text-danger"
                    aria-label={`Delete ${doctor.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Therapy" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
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
              <td className="px-4 py-3">
                <Input placeholder="45" error={errors.duration?.message} {...register('duration')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.price?.message} {...register('price')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="Description" error={errors.description?.message} {...register('description')} />
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || categoryOptions.length === 0}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add therapy"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {therapies.map((therapy, index) => (
              <tr key={therapy.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{therapy.name}</td>
                <td className="px-4 py-4 text-brown">{therapy.category}</td>
                <td className="px-4 py-4 text-brown">{therapy.duration}</td>
                <td className="px-4 py-4 text-brown">{formatCurrency(therapy.price)}</td>
                <td className="px-4 py-4 text-brown">{therapy.description}</td>
                <td className="px-4 py-4">
                  <StatusToggle
                    status={therapy.status}
                    disabled={togglingId === therapy.id}
                    onToggle={() => onToggleStatus(therapy)}
                  />
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(therapy)}
                    className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-danger/10 hover:text-danger"
                    aria-label={`Delete ${therapy.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Therapist" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned Therapies</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input placeholder="Name" error={errors.name?.message} {...register('name')} />
              </td>
              <td className="px-4 py-3">
                <Select placeholder="Status" options={[...CLINIC_STATUS_OPTIONS]} error={errors.status?.message} {...register('status')} />
              </td>
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <Select
                    placeholder={therapyOptions.length ? 'Select therapy' : 'Add therapies first'}
                    options={therapyOptions}
                    disabled={therapyOptions.length === 0}
                    onChange={(e) => {
                      addTherapyTag(e.target.value);
                      e.target.value = '';
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {assignedTherapyIds.map((therapyId) => (
                      <span
                        key={therapyId}
                        className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs text-brown"
                      >
                        {therapyLabel(therapyId)}
                        <button
                          type="button"
                          onClick={() => removeTherapyTag(therapyId)}
                          className="text-text-muted hover:text-brown"
                          aria-label={`Remove ${therapyLabel(therapyId)}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.assignedTherapyIds?.message && (
                    <p className="text-xs text-danger">{errors.assignedTherapyIds.message}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark"
                  aria-label="Add therapist"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {therapists.map((therapist, index) => (
              <tr key={therapist.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{therapist.name}</td>
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
                        className="rounded-full bg-cream px-2.5 py-1 text-xs text-brown"
                      >
                        {therapy}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(therapist)}
                    className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-danger/10 hover:text-danger"
                    aria-label={`Delete ${therapist.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
