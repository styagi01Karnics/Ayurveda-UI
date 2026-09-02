import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  clinicConsultationTypeSchema,
  clinicDoshaSchema,
  clinicPackageMasterSchema,
  clinicTreatmentPlanMasterSchema,
  type ClinicConsultationTypeFormValues,
  type ClinicDoshaFormValues,
  type ClinicPackageMasterFormValues,
  type ClinicTreatmentPlanMasterFormValues,
} from '@/lib/validation/settings.schema';
import { formatCurrency } from '@/lib/utils';
import type {
  ClinicConsultationTypeRecord,
  ClinicDoshaRecord,
  ClinicPackageMasterRecord,
  ClinicStatus,
  ClinicTreatmentPlanMasterRecord,
} from '@/types';

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="mb-4 text-base font-semibold text-brown">{title}</h3>
  );
}

function masterStatusLabel(status?: string): ClinicStatus {
  return status?.toUpperCase() === 'INACTIVE' ? 'Inactive' : 'Active';
}

export function ConsultationTypesSection({
  records,
  onAdd,
}: {
  records: ClinicConsultationTypeRecord[];
  onAdd: (values: ClinicConsultationTypeFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicConsultationTypeFormValues>({
    resolver: zodResolver(clinicConsultationTypeSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: ClinicConsultationTypeFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Consultation Types" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. CONSULTATION"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </td>
              <td className="px-4 py-3 text-text-muted">Active</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add consultation type"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {records.map((record, index) => (
              <tr key={record.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{record.name}</td>
                <td className="px-4 py-4 text-brown">{record.status}</td>
                <td className="px-4 py-4 text-text-muted">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function TreatmentPlanMastersSection({
  records,
  onAdd,
}: {
  records: ClinicTreatmentPlanMasterRecord[];
  onAdd: (values: ClinicTreatmentPlanMasterFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicTreatmentPlanMasterFormValues>({
    resolver: zodResolver(clinicTreatmentPlanMasterSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: ClinicTreatmentPlanMasterFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Treatment Plan Master" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. Panchakarma Detox"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </td>
              <td className="px-4 py-3 text-text-muted">Active</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add treatment plan"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {records.map((record, index) => (
              <tr key={record.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{record.name}</td>
                <td className="px-4 py-4 text-brown">{record.status}</td>
                <td className="px-4 py-4 text-text-muted">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function PackageMastersSection({
  records,
  onAdd,
}: {
  records: ClinicPackageMasterRecord[];
  onAdd: (values: ClinicPackageMasterFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicPackageMasterFormValues>({
    resolver: zodResolver(clinicPackageMasterSchema),
    defaultValues: { name: '', packagePrice: '' },
  });

  const onSubmit = async (values: ClinicPackageMasterFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Package Masters" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. Gold Membership"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="₹"
                  error={errors.packagePrice?.message}
                  {...register('packagePrice')}
                />
              </td>
              <td className="px-4 py-3 text-text-muted">Active</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add package master"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {records.map((record, index) => (
              <tr key={record.id} className="border-b border-gray-50">
                <td className="px-4 py-4 text-brown">{index + 1}.</td>
                <td className="px-4 py-4 font-medium text-brown">{record.name}</td>
                <td className="px-4 py-4 text-brown">
                  {formatCurrency(record.packagePrice)}
                </td>
                <td className="px-4 py-4 text-brown">{record.status}</td>
                <td className="px-4 py-4 text-text-muted">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function mapConsultationTypeMasterToRecord(
  dto: { id: string; name: string; status?: string },
): ClinicConsultationTypeRecord {
  return {
    id: dto.id,
    name: dto.name,
    status: masterStatusLabel(dto.status),
  };
}

export function mapTreatmentPlanMasterToRecord(
  dto: { id: string; name: string; status?: string },
): ClinicTreatmentPlanMasterRecord {
  return {
    id: dto.id,
    name: dto.name,
    status: masterStatusLabel(dto.status),
  };
}

export function mapPackageMasterToRecord(
  dto: { id: string; name: string; packagePrice: number; status?: string },
): ClinicPackageMasterRecord {
  return {
    id: dto.id,
    name: dto.name,
    packagePrice: dto.packagePrice,
    status: masterStatusLabel(dto.status),
  };
}

export function DoshasSection({
  records,
  onAdd,
}: {
  records: ClinicDoshaRecord[];
  onAdd: (values: ClinicDoshaFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicDoshaFormValues>({
    resolver: zodResolver(clinicDoshaSchema),
    defaultValues: { name: '', elements: '', characteristics: '' },
  });

  const onSubmit = async (values: ClinicDoshaFormValues) => {
    await onAdd(values);
    reset();
  };

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-gray-100 px-5 py-4">
        <SectionHeader title="Dosha Master" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="w-16 px-4 py-3 font-medium">S No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Elements</th>
              <th className="px-4 py-3 font-medium">Characteristics</th>
              <th className="w-24 px-4 py-3 font-medium">Status</th>
              <th className="w-20 px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-cream/30">
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. Vata"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. Air + Ether"
                  error={errors.elements?.message}
                  {...register('elements')}
                />
              </td>
              <td className="px-4 py-3">
                <Input
                  placeholder="e.g. Dry, light, cold"
                  error={errors.characteristics?.message}
                  {...register('characteristics')}
                />
              </td>
              <td className="px-4 py-3 text-text-muted">Active</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gold px-2.5 py-2 text-white hover:bg-gold-dark disabled:opacity-60"
                  aria-label="Add dosha"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </td>
            </tr>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No doshas yet. Add Vata, Pitta, Kapha (or others) above.
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.id} className="border-b border-gray-50">
                  <td className="px-4 py-4 text-brown">{index + 1}.</td>
                  <td className="px-4 py-4 font-medium text-brown">
                    {record.name}
                  </td>
                  <td className="px-4 py-4 text-brown">{record.elements}</td>
                  <td className="px-4 py-4 text-brown">
                    {record.characteristics}
                  </td>
                  <td className="px-4 py-4 text-brown">{record.status}</td>
                  <td className="px-4 py-4 text-text-muted">—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function mapDoshaToRecord(dto: {
  id: string;
  name: string;
  elements?: string;
  characteristics?: string;
  status?: string;
}): ClinicDoshaRecord {
  return {
    id: dto.id,
    name: dto.name,
    elements: dto.elements?.trim() || '—',
    characteristics: dto.characteristics?.trim() || '—',
    status: masterStatusLabel(dto.status),
  };
}
