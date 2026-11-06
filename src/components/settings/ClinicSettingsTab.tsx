import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
  updateTreatmentCategory,
  updateTherapy,
  updateDoshaMaster
} from '@/lib/api/appointments';
import { createConsultationType, deleteConsultationType, getAllConsultationTypes, updateConsultationType } from '@/lib/api/consultationTypes';
import { ApiError } from '@/lib/api/client';
import { createPackageMaster, deletePackageMasters, getAllPackageMasters, updatePackageMaster } from '@/lib/api/packageMasters';
import {
  createTreatmentPlanMaster,
  deleteTreatmentPlanMaster,
  getAllTreatmentPlanMasters,
  updateTreatmentPlanMaster,
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
          message: `${deleteTarget.record.name} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Consultation') {
        await deleteConsultationType(deleteTarget.record.id);
        await refreshConsultationTypes();
        showToast({
          title: 'Category has been deleted',
          message: `${deleteTarget.record.name} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Treatment Plan Master') {
        await deleteTreatmentPlanMaster(deleteTarget.record.id);
        await refreshTreatmentPlans();
        showToast({
          title: 'Treatment Plan Master has been deleted',
          message: `${deleteTarget.record.name} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Package Masters') {
        await deletePackageMasters(deleteTarget.record.id);
        await refreshPackageMasters();
        showToast({
          title: 'Package Masters has been deleted',
          message: `${deleteTarget.record.name} was removed from the database`
        });
      }
      else if (deleteTarget.type === 'Dosha Master') {
        await deleteDosha(deleteTarget.record.id);
        await refreshDoshas();
        showToast({
          title: 'Dosha has been deleted',
          message: `${deleteTarget.record.name} was removed from the database`
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
          onUpdate={async (id, values) => {
            try {
              await updateTreatmentCategory(id, {
                categoryName: values.categoryName.trim(),
                description: values.description.trim(),
              });

              await refreshCategories();

              showToast({
                title: 'Category Updated',
                message: `${values.categoryName} has been updated successfully.`,
              });

              return true;
            } catch (err) {
              console.error('Update category failed:', err);

              showToast({
                title: 'Failed to update category',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not update treatment category.',
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
                return false;
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
              return true;
            } catch (err) {
              showToast({
                title: 'Failed to add therapy',
                message:
                  err instanceof ApiError ? err.message : 'Could not create therapy.',
                variant: 'error',
              });
              return false;
            }
          }}
          onUpdate={async (id, values) => {
            try {
              await updateTherapy(id, {
                name: values.name,
                categoryId: values.category,
                status: 'ACTIVE',
                durationMinutes: parseSessionNumber(values.duration) || 45,
                price: Number(values.price),
                description: values.description,
              });

              await refreshTherapies();

              showToast({
                title: 'Therapy Updated',
                message: `${values.name} has been updated successfully.`,
              });

              return true;
            } catch (err) {
              console.error('Update therapy failed:', err);

              showToast({
                title: 'Failed to update therapy',
                message:
                  err instanceof ApiError ? err.message : 'Could not update therapy.',
                variant: 'error',
              });
              return false;
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
              return true;
            } catch (err) {
              showToast({
                title: 'Failed to add consultation type',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create consultation type.',
                variant: 'error',
              });
              return false;
            }
          }}
          onUpdate={async (id, values) => {
            try {
              await updateConsultationType(id, {
                name: values.name.trim().toUpperCase().replace(/\s+/g, '_'),
                status: 'ACTIVE',
              });
              await refreshConsultationTypes();
              showToast({
                title: 'Consultation type updated',
                message: `${values.name} has been updated successfully.`,
              });
              return true;
            } catch (err) {
              console.error('Update consultation type failed:', err);
              showToast({
                title: 'Failed to update consultation type',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not update consultation type.',
                variant: 'error',
              });
              return false;
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
              return true;
            } catch (err) {
              showToast({
                title: 'Failed to add treatment plan',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create treatment plan.',
                variant: 'error',
              });
              return false;
            }
          }}
          onUpdate={async (id, values) => {
            try {
              await updateTreatmentPlanMaster(id, {
                name: values.name.trim(),
                status: 'ACTIVE',
              });
              await refreshTreatmentPlans();
              showToast({
                title: 'Treatment plan updated',
                message: `${values.name} has been updated successfully.`,
              });
              return true;
            } catch (err) {
              console.error('Update treatment plan failed:', err);
              showToast({
                title: 'Failed to update treatment plan',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not update treatment plan.',
                variant: 'error',
              });
              return false;
            }
          }}
          onDelete={(record) =>
            setDeleteTarget({ type: 'Treatment Plan Master', record })
          }
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
              return true;
            } catch (err) {
              showToast({
                title: 'Failed to add package master',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create package master.',
                variant: 'error',
              });
              return false;
            }
          }}
          onUpdate={async (id, values) => {
            try {
              await updatePackageMaster(id, {
                name: values.name.trim(),
                packagePrice: Number(values.packagePrice),
                status: 'ACTIVE',
              });
              await refreshPackageMasters();
              showToast({
                title: 'Package master updated',
                message: `${values.name} has been updated successfully.`,
              });
              return true;
            } catch (err) {
              console.error('Update package master failed:', err);
              showToast({
                title: 'Failed to update package master',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not update package master.',
                variant: 'error',
              });
              return false;
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
              return true;
            } catch (err) {
              showToast({
                title: 'Failed to add dosha',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not create dosha.',
                variant: 'error',
              });
              return false;
            }
          }}
          onUpdate={async (id, values) => {
            try {
              await updateDoshaMaster(id, {
                name: values.name.trim(),
                elements: values.elements.trim(),
                characteristics: values.characteristics.trim(),
                status: 'ACTIVE',
              });
              invalidateBookingDoshasCache();
              await refreshDoshas();
              showToast({
                title: 'Dosha updated',
                message: `${values.name} has been updated successfully.`,
              });
              return true;
            } catch (err) {
              console.error('Update dosha failed:', err);
              showToast({
                title: 'Failed to update dosha',
                message:
                  err instanceof ApiError
                    ? err.message
                    : 'Could not update dosha.',
                variant: 'error',
              });
              return false;
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
  variant?: 'add' | 'delete' | 'edit'; // Added 'edit' to the types
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
      title={label} // Added title so users see what the button does on hover
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4E5] text-[#422C23] transition-colors hover:bg-[#F5EBD3] disabled:opacity-60',
        variant === 'delete' && 'hover:bg-danger/10 hover:text-danger',
        variant === 'edit' && 'hover:bg-[#EAE0C8]' // Optional: slightly different hover state for edit if desired, or you can remove this line to keep the default hover
      )}
    >
      {variant === 'add' && <Plus className="h-4 w-4" strokeWidth={2.25} />}
      {variant === 'delete' && <Trash2 className="h-4 w-4" strokeWidth={2} />}
      {variant === 'edit' && <Pencil className="h-4 w-4" strokeWidth={2} />}
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

export function TreatmentCategoriesSection({
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: {
  categories: ClinicTreatmentCategoryRecord[];
  onAdd: (values: ClinicCategoryFormValues) => Promise<boolean>;
  onUpdate: (id: string, values: ClinicCategoryFormValues) => Promise<boolean>;
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

  const [editingCategory, setEditingCategory] =
    useState<ClinicTreatmentCategoryRecord | null>(null);

  const onSubmit = async (values: ClinicCategoryFormValues) => {
    let success = false;

    if (editingCategory) {
      success = await onUpdate(editingCategory.id, values);
    } else {
      success = await onAdd(values);
    }

    if (success) {
      reset({ categoryName: '', description: '' });
      setEditingCategory(null);
    }
  };

  const handleEditClick = (category: ClinicTreatmentCategoryRecord) => {
    setEditingCategory(category);
    reset({
      categoryName: category.name,
      description: category.description || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    reset({ categoryName: '', description: '' });
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Treatment Categories" />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <SettingsTableHead
              columns={['S No.', 'Category Name', 'Description', 'Action']}
            />
          </thead>
          <tbody>
            {/* Input Row: Used for both Adding and Editing */}
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
                <div className="flex items-center gap-2">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleSubmit(onSubmit)()}
                    className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {editingCategory ? 'Save' : 'Add'}
                  </button>
                </div>
              </td>
            </tr>

            {/* List Rows */}
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">
                  {category.name}
                </td>
                <td className="px-4 py-4 text-[#422C23]">
                  {category.description}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <SettingsActionButton
                      label={`Edit ${category.name}`}
                      variant="edit"
                      onClick={() => handleEditClick(category)}
                    />
                    <SettingsActionButton
                      label={`Delete ${category.name}`}
                      variant="delete"
                      onClick={() => onDelete(category)}
                    />
                  </div>
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
  onUpdate,
}: {
  therapies: ClinicTherapyRecord[];
  categoryOptions: { value: string; label: string }[];
  togglingId: string | null;
  onToggleStatus: (record: ClinicTherapyRecord) => void | Promise<void>;
  onAdd: (values: ClinicTherapyFormValues) => Promise<boolean> | void;
  onDelete: (record: ClinicTherapyRecord) => void;
  onUpdate: (id: string, values: ClinicTherapyFormValues) => Promise<boolean>;
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

  const [editingTherapy, setEditingTherapy] =
    useState<ClinicTherapyRecord | null>(null);

  const handleCancelEdit = () => {
    setEditingTherapy(null);
    reset({
      name: '',
      category: '',
      duration: '',
      price: '',
      description: '',
    });
  };

  const onSubmit = async (values: ClinicTherapyFormValues) => {
    let success = false;
    if (editingTherapy) {
      success = await onUpdate(editingTherapy.id, values);
    } else {
      const res = await onAdd(values);
      success = res !== false;
    }

    if (success) {
      handleCancelEdit();
    }
  };

  const handleEditClick = (therapy: ClinicTherapyRecord) => {
    setEditingTherapy(therapy);
    reset({
      name: therapy.name,
      // If therapy.categoryId exists, use it; otherwise match option by category name
      category:
        (therapy as any).categoryId ||
        categoryOptions.find((opt) => opt.label === therapy.category)?.value ||
        '',
      duration: therapy.duration?.toString() || '',
      price: therapy.price?.toString() || '',
      description: therapy.description || '',
    });
  };

  return (
    <Card className="settings-card min-w-0 overflow-hidden p-0 shadow-none">
      <div className="border-b border-[#EFF0F6] px-5 py-4">
        <SectionHeader title="Therapy" />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-white">
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
            {/* Input Row: Add or Edit */}
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
                  placeholder={
                    categoryOptions.length ? 'Category' : 'Add category first'
                  }
                  options={categoryOptions}
                  disabled={categoryOptions.length === 0}
                  error={errors.category?.message}
                  {...register('category')}
                />
              </td>
              <td className="px-4 py-3 text-[12px] text-[#838A9A]">Active</td>
              <td className="px-4 py-3">
                <Input
                  placeholder="45 min"
                  error={errors.duration?.message}
                  {...register('duration')}
                />
              </td>
              <td className="px-4 py-3">
                <RupeeInput
                  placeholder="0"
                  error={errors.price?.message}
                  {...register('price')}
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
                <div className="flex items-center gap-2">
                  {editingTherapy && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleSubmit(onSubmit)()}
                    className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {editingTherapy ? 'Save' : 'Add'}
                  </button>
                </div>
              </td>
            </tr>

            {/* Therapy Records */}
            {therapies.map((therapy, index) => (
              <tr key={therapy.id} className="border-b border-[#EFF0F6]">
                <td className="px-4 py-4 text-[#422C23]">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-[#422C23]">
                  {therapy.name}
                </td>
                <td className="px-4 py-4 text-[#422C23]">{therapy.category}</td>
                <td className="px-4 py-4">
                  <StatusToggle
                    status={therapy.status}
                    disabled={togglingId === therapy.id}
                    onToggle={() => onToggleStatus(therapy)}
                  />
                </td>
                <td className="px-4 py-4 text-[#422C23]">{therapy.duration}</td>
                <td className="px-4 py-4 text-[#422C23]">
                  {formatCurrency(therapy.price)}
                </td>
                <td className="px-4 py-4 text-[#422C23]">
                  {therapy.description}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <SettingsActionButton
                      label={`Edit ${therapy.name}`}
                      variant="edit"
                      onClick={() => handleEditClick(therapy)}
                    />
                    <SettingsActionButton
                      label={`Delete ${therapy.name}`}
                      variant="delete"
                      onClick={() => onDelete(therapy)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

