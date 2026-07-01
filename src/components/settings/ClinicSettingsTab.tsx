import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DeleteClinicItemModal } from '@/components/settings/DeleteClinicItemModal';
import {
  initialClinicDoctors,
  initialClinicTherapists,
  initialClinicTherapies,
  THERAPY_ASSIGNMENT_OPTIONS,
} from '@/data/mock/settings';
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

export function ClinicSettingsTab() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState(initialClinicDoctors);
  const [therapies, setTherapies] = useState(initialClinicTherapies);
  const [therapists, setTherapists] = useState(initialClinicTherapists);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const therapistNames = therapists.map((t) => t.name);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'Doctor') {
      setDoctors((prev) => prev.filter((d) => d.id !== deleteTarget.record.id));
      showToast({
        title: 'Doctor has been deleted',
        message: `${deleteTarget.record.name} was removed.`,
      });
    } else if (deleteTarget.type === 'Therapy') {
      setTherapies((prev) => prev.filter((t) => t.id !== deleteTarget.record.id));
      showToast({
        title: 'Therapy has been deleted',
        message: `${deleteTarget.record.name} was removed.`,
      });
    } else {
      setTherapists((prev) => prev.filter((t) => t.id !== deleteTarget.record.id));
      showToast({
        title: 'Therapist has been deleted',
        message: `${deleteTarget.record.name} was removed.`,
      });
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <DoctorsSection
        doctors={doctors}
        onAdd={(values) => {
          setDoctors((prev) => [
            ...prev,
            {
              id: `doc-${Date.now()}`,
              name: values.name,
              specialization: values.specialization,
              status: values.status,
              consultationFees: Number(values.consultationFees),
              followUpFees: Number(values.followUpFees),
              availability: values.availability,
            },
          ]);
          showToast({
            title: 'Doctor Added',
            message: `${values.name} has been added successfully.`,
          });
        }}
        onDelete={(record) => setDeleteTarget({ type: 'Doctor', record })}
      />

      <TherapySection
        therapies={therapies}
        therapistOptions={therapistNames.length > 0 ? therapistNames : ['Dr. Narendra Jain']}
        onAdd={(values) => {
          setTherapies((prev) => [
            ...prev,
            {
              id: `therapy-${Date.now()}`,
              name: values.name,
              category: values.category,
              status: values.status,
              duration: values.duration,
              price: Number(values.price),
              assignedTherapist: values.assignedTherapist,
            },
          ]);
          showToast({
            title: 'Therapy Added',
            message: `${values.name} has been added successfully.`,
          });
        }}
        onDelete={(record) => setDeleteTarget({ type: 'Therapy', record })}
      />

      <TherapistSection
        therapists={therapists}
        onAdd={(values) => {
          setTherapists((prev) => [
            ...prev,
            {
              id: `therapist-${Date.now()}`,
              name: values.name,
              status: values.status,
              assignedTherapies: values.assignedTherapies,
            },
          ]);
          showToast({
            title: 'Therapist Added',
            message: `${values.name} has been added successfully.`,
          });
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
  onAdd: (values: ClinicDoctorFormValues) => void;
  onDelete: (record: ClinicDoctorRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  const onSubmit = (values: ClinicDoctorFormValues) => {
    onAdd(values);
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
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark"
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
  onAdd,
  onDelete,
}: {
  therapies: ClinicTherapyRecord[];
  therapistOptions: string[];
  onAdd: (values: ClinicTherapyFormValues) => void;
  onDelete: (record: ClinicTherapyRecord) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  const onSubmit = (values: ClinicTherapyFormValues) => {
    onAdd(values);
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
                <Input placeholder="Category" error={errors.category?.message} {...register('category')} />
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
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark"
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
  onAdd: (values: ClinicTherapistFormValues) => void;
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

  const onSubmit = (values: ClinicTherapistFormValues) => {
    onAdd(values);
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
