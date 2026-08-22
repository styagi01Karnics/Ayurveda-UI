import { useEffect, useState } from 'react';
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
import { defaultProfile } from '@/data/mock/profile';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getMe, getTenant } from '@/lib/api/auth';
import {
  CITIES_BY_STATE,
  CLINIC_TYPES,
  INDIAN_STATES,
} from '@/lib/validation/signup.schema';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validation/profile.schema';

const SPECIALIZATIONS = [
  'Panchakarma & Detox',
  'Herbal Medicine',
  "Women's Health",
  'Pain Management',
  'General Ayurveda',
] as const;

export function MyProfilePage() {
  const { showToast } = useToast();
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const [user, tenant] = await Promise.all([
      getMe().catch(() => null),
      getTenant().catch(() => null),
    ]);
    return { user, tenant };
  }, { user: null, tenant: null });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfile,
  });

  const selectedState = watch('state');

  useEffect(() => {
    if (selectedState && CITIES_BY_STATE[selectedState]) {
      setCityOptions(CITIES_BY_STATE[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (!data.user && !data.tenant) return;
    reset({
      ...defaultProfile,
      clinicName: data.tenant?.name ?? defaultProfile.clinicName,
      fullName: data.user?.fullName ?? defaultProfile.fullName,
      email: data.user?.email ?? defaultProfile.email,
      mobileNumber: data.tenant?.phone?.replace(/\D/g, '').slice(-10) ?? defaultProfile.mobileNumber,
      addressLine1: data.tenant?.address ?? defaultProfile.addressLine1,
    });
  }, [data.user, data.tenant, reset]);

  const onSubmit = async (_values: ProfileFormValues) => {
    showToast({
      title: 'Profile Updated',
      message: 'Profile changes are saved locally. Backend profile update API is not available yet.',
      time: 'Just now',
    });
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
              subtitle="Basic Information about your company"
            />
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Clinic Name"
                  error={errors.clinicName?.message}
                  {...register('clinicName')}
                />
                <Select
                  label="Clinic Type"
                  placeholder="Clinic Type"
                  options={[...CLINIC_TYPES]}
                  error={errors.clinicType?.message}
                  {...register('clinicType')}
                />
                <Select
                  label="State"
                  placeholder="Select State"
                  options={[...INDIAN_STATES]}
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Select
                  label="City"
                  placeholder="Select City"
                  options={cityOptions}
                  error={errors.city?.message}
                  disabled={!selectedState}
                  {...register('city')}
                />
                <Input
                  label="PIN Code"
                  error={errors.pinCode?.message}
                  {...register('pinCode')}
                />
                <Input
                  label="Address Line 1"
                  error={errors.addressLine1?.message}
                  {...register('addressLine1')}
                />
                <Input
                  label="Address Line 2"
                  className="sm:col-span-2"
                  {...register('addressLine2')}
                />
                <Input
                  label="Registration Number/ GST"
                  className="sm:col-span-2"
                  error={errors.registrationNumber?.message}
                  {...register('registrationNumber')}
                />
              </div>
              <FileUpload label="Your Logo" editOnly onChange={() => undefined} />
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
                <Select
                  label="Specialization"
                  placeholder="Specialization"
                  options={[...SPECIALIZATIONS]}
                  error={errors.specialization?.message}
                  {...register('specialization')}
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
                <Input
                  label="Availability"
                  className="sm:col-span-2"
                  error={errors.availability?.message}
                  {...register('availability')}
                />
              </div>
              <FileUpload label="Your Photo" editOnly onChange={() => undefined} />
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
