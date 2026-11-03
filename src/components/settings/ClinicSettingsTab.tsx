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
  deleteCategory,
  deleteDosha,
  deleteTherapy,
  getAllDoshas,
  getAllTherapies,
  getAllTreatmentCategories,
  invalidateBookingDoshasCache,
  updateTherapyStatus,
} from '@/lib/api/appointments';
import { createConsultationType, deleteConsultationType, getAllConsultationTypes } from '@/lib/api/consultationTypes';
import { ApiError } from '@/lib/api/client';
import { createPackageMaster, deletePackageMasters, getAllPackageMasters } from '@/lib/api/packageMasters';
import {
  createTreatmentPlanMaster,
  deleteTreatmentPlanMaster,
  getAllTreatmentPlanMasters,
} from '@/lib/api/treatmentPlanMasters';
import {
  deleteDoctor,
  getAllDoctors,
} from '@/lib/api/doctors';
import {
  mapDoctorToClinicRecord,
  mapTherapistToClinicRecord,
  mapTherapyToClinicRecord,
  mapTreatmentCategoryToRecord,
  parseSessionNumber,
} from '@/lib/api/mappers';
import {
  deleteTherapist,
  getAllTherapists,
  // updateTherapistStatus,
} from '@/lib/api/therapists';
import {
  clinicCategorySchema,
  clinicTherapySchema,
  type ClinicCategoryFormValues,
  type ClinicTherapyFormValues,
} from '@/lib/validation/settings.schema';
import { cn, formatCurrency } from '@/lib/utils';
import type { TherapistDto, TherapyDto, TreatmentCategoryDto } from '@/lib/api/types';
import type {
  ClinicConsultationTypeRecord,
  ClinicDoctorRecord,
  ClinicDoshaRecord,
  ClinicPackageMasterRecord,
  ClinicStatus,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
  ClinicTreatmentCategoryRecord,
  ClinicTreatmentPlanMasterRecord,
} from '@/types';

type DeleteTarget =
  | { type: 'Doctor'; record: ClinicDoctorRecord }
  | { type: 'Category'; record: ClinicTreatmentCategoryRecord }
  | { type: 'Therapy'; record: ClinicTherapyRecord }
  | { type: 'Therapist'; record: ClinicTherapistRecord }
  | { type: 'Consultation'; record: ClinicConsultationTypeRecord }
  | { type: 'Treatment Plan Master'; record: ClinicTreatmentPlanMasterRecord }
  | { type: 'Package Masters'; record: ClinicPackageMasterRecord }
  | { type: 'Dosha Master'; record: ClinicDoshaRecord }
  | null;

// function toApiStatus(status: ClinicStatus): 'ACTIVE' | 'INACTIVE' {
//   return status === 'Active' ? 'ACTIVE' : 'INACTIVE';
// }

function nextStatus(status: ClinicStatus): 'ACTIVE' | 'INACTIVE' {
  return status === 'Active' ? 'INACTIVE' : 'ACTIVE';
}

type ClinicSettingsData = {
  doctors: ClinicDoctorRecord[];
  therapists: ClinicTherapistRecord[];
  therapies: ClinicTherapyRecord[];
  categories: ClinicTreatmentCategoryRecord[];
  categoryOptions: { value: string; label: string }[];
  consultationTypes: ClinicConsultationTypeRecord[];
  treatmentPlans: ClinicTreatmentPlanMasterRecord[];
  packageMasters: ClinicPackageMasterRecord[];
  doshas: ClinicDoshaRecord[];
};

const EMPTY_CLINIC_SETTINGS: ClinicSettingsData = {
  doctors: [],
  therapists: [],
  therapies: [],
  categories: [],
  categoryOptions: [],
  consultationTypes: [],
  treatmentPlans: [],
  packageMasters: [],
  doshas: [],
};

function toCategoryOptions(categories: TreatmentCategoryDto[]) {
  return categories
    .filter((c) => c.id)
    .map((c) => ({
      value: c.id,
      label: (c.categoryName || c.name || c.categoryCode || '').trim() || c.id,
    }));
}

function mapClinicTherapies(
  therapies: TherapyDto[],
  categories: TreatmentCategoryDto[],
) {
  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  return therapies.map((therapy) =>
    mapTherapyToClinicRecord(therapy, categoriesById),
  );
}

function mapClinicTherapists(
  therapists: TherapistDto[],
  therapies: TherapyDto[],
) {
  const therapiesById = new Map(therapies.map((t) => [t.id, t]));
  return therapists.map((t) => mapTherapistToClinicRecord(t, therapiesById));
}

async function loadClinicSettings(): Promise<ClinicSettingsData> {
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

  return {
    doctors: doctors.map(mapDoctorToClinicRecord),
    therapists: mapClinicTherapists(therapists, therapies),
    therapies: mapClinicTherapies(therapies, categories),
    categories: categories.map(mapTreatmentCategoryToRecord),
    categoryOptions: toCategoryOptions(categories),
    consultationTypes: consultationTypes.map(mapConsultationTypeMasterToRecord),
    treatmentPlans: treatmentPlans.map(mapTreatmentPlanMasterToRecord),
    packageMasters: packageMasters.map(mapPackageMasterToRecord),
    doshas: doshas.map(mapDoshaToRecord),
  };
}

export function StatusToggle({
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

  const { data, setData, loading, error, reload } = useAsyncData(
    loadClinicSettings,
    EMPTY_CLINIC_SETTINGS,
  );

  const { therapies } = data;

  const refreshDoctors = async () => {
    const doctorsList = await getAllDoctors();
    setData((prev) => ({
      ...prev,
      doctors: doctorsList.map(mapDoctorToClinicRecord),
    }));
  };

  const refreshCategories = async () => {
    const [categories, therapiesList] = await Promise.all([
      getAllTreatmentCategories(),
      getAllTherapies(),
    ]);
    setData((prev) => ({
      ...prev,
      categories: categories.map(mapTreatmentCategoryToRecord),
      categoryOptions: toCategoryOptions(categories),
      therapies: mapClinicTherapies(therapiesList, categories),
    }));
  };

  const refreshTherapies = async () => {
    const [therapiesList, categories, therapistsList] = await Promise.all([
      getAllTherapies(),
      getAllTreatmentCategories(),
      getAllTherapists(),
    ]);
    setData((prev) => ({
      ...prev,
      therapies: mapClinicTherapies(therapiesList, categories),
      categoryOptions: toCategoryOptions(categories),
      therapists: mapClinicTherapists(therapistsList, therapiesList),
    }));
  };

  const refreshTherapists = async () => {
    const [therapistsList, therapiesList] = await Promise.all([
      getAllTherapists(),
      getAllTherapies(),
    ]);
    setData((prev) => ({
      ...prev,
      therapists: mapClinicTherapists(therapistsList, therapiesList),
    }));
  };

  const refreshConsultationTypes = async () => {
    const consultationTypes = await getAllConsultationTypes();
    setData((prev) => ({
      ...prev,
      consultationTypes: consultationTypes.map(mapConsultationTypeMasterToRecord),
    }));
  };

  const refreshTreatmentPlans = async () => {
    const treatmentPlans = await getAllTreatmentPlanMasters();
    setData((prev) => ({
      ...prev,
      treatmentPlans: treatmentPlans.map(mapTreatmentPlanMasterToRecord),
    }));
  };

  const refreshPackageMasters = async () => {
    const packageMasters = await getAllPackageMasters();
    setData((prev) => ({
      ...prev,
      packageMasters: packageMasters.map(mapPackageMasterToRecord),
    }));
  };

  const refreshDoshas = async () => {
    const doshas = await getAllDoshas();
    setData((prev) => ({
      ...prev,
      doshas: doshas.map(mapDoshaToRecord),
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'Doctor') {
        await deleteDoctor(deleteTarget.record.id);
        await refreshDoctors();
        showToast({
          title: 'Doctor has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      } else if (deleteTarget.type === 'Therapy') {
        await deleteTherapy(deleteTarget.record.id);
        await refreshTherapies();
        showToast({
          title: 'Therapy has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      } else if (deleteTarget.type === 'Therapist') {
        await deleteTherapist(deleteTarget.record.id);
        await refreshTherapists();
        showToast({
          title: 'Therapist has been deleted',
          message: `${deleteTarget.record.name} was removed from the database.`,
        });
      }
      else if (deleteTarget.type === 'Category') {
        await deleteCategory(deleteTarget.record.id);
        await refreshCategories();
        showToast({
          title: 'Category has been deleted',
          message: `${deleteTarget.record.id} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Consultation') {
        await deleteConsultationType(deleteTarget.record.id);
        await refreshConsultationTypes();
        showToast({
          title: 'Category has been deleted',
          message: `${deleteTarget.record.id} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Treatment Plan Master') {
        await deleteTreatmentPlanMaster(deleteTarget.record.id);
        await refreshTreatmentPlans();
        showToast({
          title: 'Treatment Plan Master has been deleted',
          message: `${deleteTarget.record.id} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Package Masters') {
        await deletePackageMasters(deleteTarget.record.id);
        await refreshPackageMasters();
        showToast({
          title: 'Package Masters has been deleted',
          message: `${deleteTarget.record.id} was removed from the database`
        });
      }
       else if (deleteTarget.type === 'Dosha Master') {
        await deleteDosha(deleteTarget.record.id);
        await refreshDoshas();
        showToast({
          title: 'Dosha has been deleted',
          message: `${deleteTarget.record.id} was removed from the database`
        });
      }
    } catch (err) {
      showToast({
        title: 'Error deleting record',
        message: err instanceof ApiError ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  // const handleToggleDoctorStatus = async (doctor: ClinicDoctorRecord) => {
  //   setTogglingId(doctor.id);
  //   try {
  //     await updateDoctorStatus(doctor.id, nextStatus(doctor.status));
  //     await refreshDoctors();
  //   } catch (err) {
  //     showToast({
  //       title: 'Failed to update doctor status',
  //       message: err instanceof ApiError ? err.message : 'Could not update status.',
  //     });
  //   } finally {
  //     setTogglingId(null);
  //   }
  // };

  const handleToggleTherapyStatus = async (therapy: ClinicTherapyRecord) => {
    setTogglingId(therapy.id);
    try {
      await updateTherapyStatus(therapy.id, nextStatus(therapy.status));
      await refreshTherapies();
    } catch (err) {
      showToast({
        title: 'Failed to update therapy status',
        message: err instanceof ApiError ? err.message : 'Could not update status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  // const handleToggleTherapistStatus = async (therapist: ClinicTherapistRecord) => {
  //   setTogglingId(therapist.id);
  //   try {
  //     await updateTherapistStatus(therapist.id, nextStatus(therapist.status));
  //     await refreshTherapists();
  //   } catch (err) {
  //     showToast({
  //       title: 'Failed to update therapist status',
  //       message: err instanceof ApiError ? err.message : 'Could not update status.',
  //     });
  //   } finally {
  //     setTogglingId(null);
  //   }
  // };

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

              await refreshCategories();

              showToast({
                title: 'Category Added',
                message: `${values.categoryName} has been added successfully.`,
              });

              return true;
            } catch (err) {
              console.error('Create category failed:', err);

              showToast({
                title: 'Failed to add category',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create treatment category.',
                variant: 'error',
              });
              return false;
            }
          }}
          onDelete={(record) => setDeleteTarget({ type: 'Category', record })}
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

              await refreshTherapies();
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

        <ConsultationTypesSection
          records={data.consultationTypes}
          onAdd={async (values) => {
            try {
              await createConsultationType({
                name: values.name.trim().toUpperCase().replace(/\s+/g, '_'),
                status: 'ACTIVE',
              });
              await refreshConsultationTypes();
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
          onDelete={(record) => setDeleteTarget({ type: 'Consultation', record })}
        />

        <TreatmentPlanMastersSection
          records={data.treatmentPlans}
          onAdd={async (values) => {
            try {
              await createTreatmentPlanMaster({
                name: values.name.trim(),
                status: 'ACTIVE',
              });
              await refreshTreatmentPlans();
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
          onDelete={(record) => setDeleteTarget({ type: 'Treatment Plan Master', record })}
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
              await refreshPackageMasters();
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
          onDelete={(record) => setDeleteTarget({ type: 'Package Masters', record })}
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
              await refreshDoshas();
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
          onDelete={(record) => setDeleteTarget({ type: 'Dosha Master', record })}
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

export function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="font-sans text-base font-semibold leading-tight tracking-normal text-[#422C23]">
      {title}
    </h3>
  );
}

export function SettingsActionButton({
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
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
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

export function SettingsTableHead({ columns }: { columns: string[] }) {
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
  onDelete
}: {
  categories: ClinicTreatmentCategoryRecord[];
  // onAdd: (values: ClinicCategoryFormValues) => void | Promise<void>;
  onAdd: (values: ClinicCategoryFormValues) => Promise<boolean>;
  onDelete: (record: ClinicTreatmentCategoryRecord) => void;
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
    const success = await onAdd(values);

    if (success) reset();
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Treatment Categories" />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className='sticky top-0 z-10 bg-white'>
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
                <td className="px-4 py-4">
                  <SettingsActionButton
                    label={`Delete ${category.name}`}
                    variant="delete"
                    onClick={() => onDelete(category)}
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
      <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className='sticky top-0 z-10 bg-white'>
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

