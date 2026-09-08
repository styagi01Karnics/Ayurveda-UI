import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { useToast } from '@/app/ToastContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getMe,
  getTenant,
  getUserById,
  updateMe,
  type TenantResponse,
  type UserResponse,
} from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { getStoredUser, isHospitalAdmin } from '@/lib/auth';
import { assets } from '@/lib/assets';
import {
  CITIES_BY_STATE,
  CLINIC_TYPES,
  INDIAN_STATES,
} from '@/lib/validation/signup.schema';
import {
  emptyProfileValues,
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validation/profile.schema';
import { cn } from '@/lib/utils';

function digitsPhone(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '').slice(-10);
}

function textOrEmpty(value: string | null | undefined): string {
  return (value ?? '').trim();
}

/** Map API clinicType enums / labels onto Select options when possible. */
function normalizeClinicType(raw: string | null | undefined): string {
  const value = textOrEmpty(raw);
  if (!value) return '';

  const upper = value.toUpperCase().replace(/[\s-]+/g, '_');
  if (upper === 'HOSPITAL') return 'Hospital';
  if (upper === 'CLINIC' || upper === 'AYURVEDIC_CLINIC' || upper.includes('AYURVED')) {
    return 'Ayurvedic Clinic';
  }
  if (upper.includes('WELLNESS')) return 'Wellness Center';
  if (upper.includes('PANCHAKARMA')) return 'Panchakarma Center';

  const match = CLINIC_TYPES.find(
    (option) => option.toLowerCase() === value.toLowerCase(),
  );
  return match ?? value;
}

function citiesForState(state: string, city: string): string[] {
  const base = state && CITIES_BY_STATE[state] ? [...CITIES_BY_STATE[state]] : [];
  if (city && !base.includes(city)) base.unshift(city);
  return base;
}

function mapProfileFromApi(
  user: UserResponse | null,
  tenant: TenantResponse | null,
): ProfileFormValues {
  return {
    clinicName: textOrEmpty(tenant?.clinicName || tenant?.name),
    clinicType: normalizeClinicType(tenant?.clinicType),
    state: textOrEmpty(tenant?.state),
    city: textOrEmpty(tenant?.city),
    pinCode: textOrEmpty(tenant?.pinCode),
    addressLine1: textOrEmpty(tenant?.addressLine1 || tenant?.address),
    addressLine2: textOrEmpty(tenant?.addressLine2 ?? ''),
    registrationNumber: textOrEmpty(tenant?.registrationNumberGst ?? ''),
    fullName: textOrEmpty(user?.fullName || tenant?.fullName),
    email: textOrEmpty(user?.email || tenant?.email),
    mobileNumber:
      digitsPhone(user?.mobileNumber) ||
      digitsPhone(tenant?.mobileNumber) ||
      digitsPhone(tenant?.phone),
  };
}

export function MyProfilePage() {
  const { showToast } = useToast();
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const storedUser = getStoredUser();
  const canEditClinic = isHospitalAdmin(storedUser);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const userId = getStoredUser()?.id;
    const [user, tenant] = await Promise.all([
      userId
        ? getUserById(userId).catch(() => getMe().catch(() => null))
        : getMe().catch(() => null),
      getTenant().catch(() => null),
    ]);
    return { user, tenant };
  }, { user: null as UserResponse | null, tenant: null as TenantResponse | null });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfileValues,
  });

  const selectedState = watch('state');
  const clinicTypeValue = watch('clinicType');
  const cityValue = watch('city');

  const clinicTypeOptions = useMemo(() => {
    const options = [...CLINIC_TYPES] as string[];
    if (clinicTypeValue && !options.includes(clinicTypeValue)) {
      options.unshift(clinicTypeValue);
    }
    return options;
  }, [clinicTypeValue]);

  const stateOptions = useMemo(() => {
    const options = [...INDIAN_STATES] as string[];
    if (selectedState && !options.includes(selectedState)) {
      options.unshift(selectedState);
    }
    return options;
  }, [selectedState]);

  useEffect(() => {
    setCityOptions(citiesForState(selectedState, cityValue));
  }, [selectedState, cityValue]);

  useEffect(() => {
    if (!data.user && !data.tenant) return;
    const mapped = mapProfileFromApi(data.user, data.tenant);
    setCityOptions(citiesForState(mapped.state, mapped.city));
    reset(mapped);
  }, [data.user, data.tenant, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (storedUser?.id || data.user?.id) {
        await updateMe({ fullName: values.fullName });
      }
      showToast({
        title: 'Profile Updated',
        message: canEditClinic
          ? 'Your profile details have been saved.'
          : 'Your contact details have been saved. Clinic information can only be edited by Admin.',
        time: 'Just now',
      });
    } catch (err) {
      showToast({
        title: 'Update failed',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not update profile. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-text-muted">
        <Link to="/dashboard" className="hover:text-gold">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brown">My Profile</span>
      </nav>

      <AsyncStatus loading={loading} error={error} onRetry={reload}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Clinic Information"
              subtitle={
                canEditClinic
                  ? 'Basic Information about your company'
                  : 'View only — only Admin can edit clinic details'
              }
            />
            <div
              className={cn(
                'mt-4 grid gap-6 lg:grid-cols-[1fr_220px]',
                !canEditClinic && 'opacity-95',
              )}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Clinic Name"
                  error={errors.clinicName?.message}
                  readOnly={!canEditClinic}
                  disabled={!canEditClinic}
                  {...register('clinicName')}
                />
                <Select
                  label="Clinic Type"
                  placeholder="Clinic Type"
                  options={clinicTypeOptions}
                  error={errors.clinicType?.message}
                  disabled={!canEditClinic}
                  {...register('clinicType')}
                />
                <Select
                  label="State"
                  placeholder="Select State"
                  options={stateOptions}
                  error={errors.state?.message}
                  disabled={!canEditClinic}
                  {...register('state')}
                />
                <Select
                  label="City"
                  placeholder="Select City"
                  options={cityOptions}
                  error={errors.city?.message}
                  disabled={!canEditClinic || !selectedState}
                  {...register('city')}
                />
                <Input
                  label="PIN Code"
                  error={errors.pinCode?.message}
                  readOnly={!canEditClinic}
                  disabled={!canEditClinic}
                  {...register('pinCode')}
                />
                <Input
                  label="Address Line 1"
                  error={errors.addressLine1?.message}
                  readOnly={!canEditClinic}
                  disabled={!canEditClinic}
                  {...register('addressLine1')}
                />
                <Input
                  label="Address Line 2"
                  className="sm:col-span-2"
                  readOnly={!canEditClinic}
                  disabled={!canEditClinic}
                  {...register('addressLine2')}
                />
                <Input
                  label="Registration Number/ GST"
                  className="sm:col-span-2"
                  error={errors.registrationNumber?.message}
                  readOnly={!canEditClinic}
                  disabled={!canEditClinic}
                  {...register('registrationNumber')}
                />
              </div>
              <FileUpload
                label="Your Logo"
                editOnly
                disabled
                previewUrl={data.tenant?.logoUrl?.trim() || assets.brandLogo}
                onChange={() => undefined}
              />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Contact Information"
              subtitle="Primary contact information for your company"
            />
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Mobile Number"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
              </div>
              <FileUpload
                label="Your Photo"
                editOnly
                previewUrl={data.tenant?.photoUrl ?? undefined}
                onChange={() => undefined}
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </AsyncStatus>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-base font-bold text-brown">{title}</h2>
      <p className="text-sm text-text-muted">{subtitle}</p>
    </div>
  );
}
