import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';
import { THERAPY_ASSIGNMENT_OPTIONS } from '@/data/mock/settings';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  createTherapy,
  createTreatmentCategory,
  getAllTherapies,
  getAllTreatmentCategories,
} from '@/lib/api/appointments';
import { ApiError } from '@/lib/api/client';
import { createDoctor, getAllDoctors } from '@/lib/api/doctors';
import {
  mapDoctorToClinicRecord,
  mapTherapistToClinicRecord,
  mapTherapyToClinicRecord,
} from '@/lib/api/mappers';
import { createTherapist, getAllTherapists } from '@/lib/api/therapists';
import {
  CLINIC_STATUS_OPTIONS,
  clinicDoctorSchema,
  clinicTherapistSchema,
  clinicTherapySchema,
  type ClinicDoctorFormValues,
  type ClinicTherapistFormValues,
  type ClinicTherapyFormValues,
} from '@/lib/validation/settings.schema';
import { cn, formatCurrency } from '@/lib/utils';
import type {
  ClinicDoctorRecord,
  ClinicTherapistRecord,
  ClinicTherapyRecord,
} from '@/types';

type DeleteTarget =
  | { type: 'Doctor'; record: ClinicDoctorRecord }
  | { type: 'Therapy'; record: ClinicTherapyRecord }
  | { type: 'Therapist'; record: ClinicTherapistRecord }
  | null;

function emailFromName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `${slug || 'user'}@ganeshaayurvedaa.com`;
}

export function ClinicSettingsTab() {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [doctorsOverride, setDoctorsOverride] = useState<
    ClinicDoctorRecord[] | null
  >(null);
  const [therapiesOverride, setTherapiesOverride] = useState<
    ClinicTherapyRecord[] | null
  >(null);
  const [therapistsOverride, setTherapistsOverride] = useState<
    ClinicTherapistRecord[] | null
  >(null);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const [doctors, therapists, therapies, categories] = await Promise.all([
      getAllDoctors(),
      getAllTherapists(),
      getAllTherapies(),
      getAllTreatmentCategories(),
    ]);

    const categoriesById = new Map(categories.map((c) => [c.id, c]));

    return {
      doctors: doctors.map(mapDoctorToClinicRecord),
      therapists: therapists.map(mapTherapistToClinicRecord),
      therapies: therapies.map((therapy) =>
        mapTherapyToClinicRecord(therapy, categoriesById),
      ),
      categories,
    };
  }, {
    doctors: [] as ClinicDoctorRecord[],
    therapists: [] as ClinicTherapistRecord[],
    therapies: [] as ClinicTherapyRecord[],
    categories: [],
  });

  const doctors = doctorsOverride ?? data.doctors;
  const therapies = therapiesOverride ?? data.therapies;
  const therapists = therapistsOverride ?? data.therapists;
  const therapistNames = therapists.map((t) => t.name);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'Doctor') {
      setDoctorsOverride((prev) =>
        (prev ?? doctors).filter((d) => d.id !== deleteTarget.record.id),
      );
      showToast({
        title: 'Doctor has been deleted',
        message: `${deleteTarget.record.name} was removed locally. Delete is not available on the API yet.`,
      });
    } else if (deleteTarget.type === 'Therapy') {
      setTherapiesOverride((prev) =>
        (prev ?? therapies).filter((t) => t.id !== deleteTarget.record.id),
      );
      showToast({
        title: 'Therapy has been deleted',
        message: `${deleteTarget.record.name} was removed locally. Delete is not available on the API yet.`,
      });
    } else {
      setTherapistsOverride((prev) =>
        (prev ?? therapists).filter((t) => t.id !== deleteTarget.record.id),
      );
      showToast({
        title: 'Therapist has been deleted',
        message: `${deleteTarget.record.name} was removed locally. Delete is not available on the API yet.`,
      });
    }
    setDeleteTarget(null);
  };

  return (
    <AsyncStatus loading={loading} error={error} onRetry={reload}>
      <div className="space-y-6">
        <DoctorsSection
          doctors={doctors}
          onAdd={async (values) => {
            try {
              const created = await createDoctor({
                doctorName: values.name,
                specialization: values.specialization,
                mobileNumber: '9876543210',
                email: emailFromName(values.name),
                qualification: values.specialization,
                department: values.specialization,
                consultationRoom: values.availability || 'Room-1',
              });
              const mapped = {
                ...mapDoctorToClinicRecord(created),
                consultationFees: Number(values.consultationFees),
                followUpFees: Number(values.followUpFees),
                availability: values.availability,
              };
              setDoctorsOverride((prev) => [...(prev ?? doctors), mapped]);
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
          therapistOptions={
            therapistNames.length > 0 ? therapistNames : ['Dr. Narendra Jain']
          }
          categoryOptions={data.categories.map((c) => ({
            value: c.id,
            label: c.categoryName,
          }))}
          onAdd={async (values) => {
            try {
              let categoryId = values.category;
              const known = data.categories.find(
                (c) => c.id === values.category || c.categoryName === values.category,
              );
              if (known) {
                categoryId = known.id;
              } else {
                const createdCategory = await createTreatmentCategory({
                  categoryName: values.category,
                  description: values.category,
                  active: values.status === 'Active',
                });
                categoryId = createdCategory.id;
              }

              const created = await createTherapy({
                categoryId,
                therapyName: values.name,
                description: `${values.duration} · ₹${values.price}`,
                active: values.status === 'Active',
              });

              const mapped: ClinicTherapyRecord = {
                ...mapTherapyToClinicRecord(
                  created,
                  new Map(
                    data.categories.map((c) => [c.id, c]),
                  ),
                  values.assignedTherapist,
                ),
                category: known?.categoryName ?? values.category,
                duration: values.duration,
                price: Number(values.price),
                assignedTherapist: values.assignedTherapist,
              };
              setTherapiesOverride((prev) => [...(prev ?? therapies), mapped]);
              showToast({
                title: 'Therapy Added',
                message: `${values.name} has been added successfully.`,
              });
              reload();
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
          onAdd={async (values) => {
            try {
              const created = await createTherapist({
                therapistName: values.name,
                specialization: values.assignedTherapies[0] ?? 'General',
                mobileNumber: '9876543210',
                email: emailFromName(values.name),
                qualification: 'Therapist',
                therapyRoom: 'Therapy Room',
              });
              const mapped = {
                ...mapTherapistToClinicRecord(created),
                assignedTherapies: values.assignedTherapies,
              };
              setTherapistsOverride((prev) => [
                ...(prev ?? therapists),
                mapped,
              ]);
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

function DoctorsSection({
  doctors,
  onAdd,
  onDelete,
}: {
  doctors: ClinicDoctorRecord[];
  onAdd: (values: ClinicDoctorFormValues) => void | Promise<void>;
  onDelete: (record: ClinicDoctorRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicDoctorFormValues>({
    resolver: zodResolver(clinicDoctorSchema),
    defaultValues: {
      name: '',
      specialization: '',
      status: 'Active',
      consultationFees: '',
      followUpFees: '',
      availability: '',
    },
  });

  const onSubmit = async (values: ClinicDoctorFormValues) => {
    await onAdd(values);
    reset();
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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Consultation Fees</th>
              <th className="px-4 py-3 font-medium">Follow Up Fees</th>
              <th className="px-4 py-3 font-medium">Availability</th>
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
                <Select placeholder="Status" options={[...CLINIC_STATUS_OPTIONS]} error={errors.status?.message} {...register('status')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.consultationFees?.message} {...register('consultationFees')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.followUpFees?.message} {...register('followUpFees')} />
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <Input placeholder="Availability" error={errors.availability?.message} {...register('availability')} />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </td>
              <td className="px-4 py-3">
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
                <td className="px-4 py-4">
                  <span className="font-medium text-success">{doctor.status}</span>
                </td>
                <td className="px-4 py-4 text-brown">{formatCurrency(doctor.consultationFees)}</td>
                <td className="px-4 py-4 text-brown">{formatCurrency(doctor.followUpFees)}</td>
                <td className="px-4 py-4 text-brown">{doctor.availability}</td>
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
  therapistOptions,
  categoryOptions,
  onAdd,
  onDelete,
}: {
  therapies: ClinicTherapyRecord[];
  therapistOptions: string[];
  categoryOptions: { value: string; label: string }[];
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
      status: 'Active',
      duration: '',
      price: '',
      assignedTherapist: '',
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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Assigned Therapist</th>
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
                  placeholder="Category"
                  options={
                    categoryOptions.length > 0
                      ? categoryOptions
                      : ['Panchakarma', 'Wellness', 'Detox']
                  }
                  error={errors.category?.message}
                  {...register('category')}
                />
              </td>
              <td className="px-4 py-3">
                <Select placeholder="Status" options={[...CLINIC_STATUS_OPTIONS]} error={errors.status?.message} {...register('status')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="Duration" error={errors.duration?.message} {...register('duration')} />
              </td>
              <td className="px-4 py-3">
                <Input placeholder="₹" error={errors.price?.message} {...register('price')} />
              </td>
              <td className="px-4 py-3">
                <Select placeholder="Therapist" options={therapistOptions} error={errors.assignedTherapist?.message} {...register('assignedTherapist')} />
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
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
                <td className="px-4 py-4">
                  <span className="font-medium text-success">{therapy.status}</span>
                </td>
                <td className="px-4 py-4 text-brown">{therapy.duration}</td>
                <td className="px-4 py-4 text-brown">{formatCurrency(therapy.price)}</td>
                <td className="px-4 py-4 text-brown">{therapy.assignedTherapist}</td>
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
  onAdd,
  onDelete,
}: {
  therapists: ClinicTherapistRecord[];
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
      assignedTherapies: [],
    },
  });

  const assignedTherapies = watch('assignedTherapies') ?? [];

  const addTherapyTag = (therapy: string) => {
    if (!therapy || assignedTherapies.includes(therapy)) return;
    setValue('assignedTherapies', [...assignedTherapies, therapy], {
      shouldValidate: true,
    });
  };

  const removeTherapyTag = (therapy: string) => {
    setValue(
      'assignedTherapies',
      assignedTherapies.filter((t) => t !== therapy),
      { shouldValidate: true },
    );
  };

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
                    placeholder="Select therapy"
                    options={[...THERAPY_ASSIGNMENT_OPTIONS]}
                    onChange={(e) => {
                      addTherapyTag(e.target.value);
                      e.target.value = '';
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {assignedTherapies.map((therapy) => (
                      <span
                        key={therapy}
                        className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs text-brown"
                      >
                        {therapy}
                        <button
                          type="button"
                          onClick={() => removeTherapyTag(therapy)}
                          className="text-text-muted hover:text-brown"
                          aria-label={`Remove ${therapy}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.assignedTherapies?.message && (
                    <p className="text-xs text-danger">{errors.assignedTherapies.message}</p>
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
                  <span className={cn('font-medium', therapist.status === 'Active' ? 'text-success' : 'text-text-muted')}>
                    {therapist.status}
                  </span>
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
