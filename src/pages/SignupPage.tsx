import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockSignup } from '@/lib/auth';
import {
  CITIES_BY_STATE,
  CLINIC_TYPES,
  INDIAN_STATES,
  signupSchema,
  type SignupFormValues,
} from '@/lib/validation/signup.schema';

export function SignupPage() {
  const navigate = useNavigate();
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      clinicName: '',
      clinicType: '',
      state: '',
      city: '',
      pinCode: '',
      addressLine1: '',
      addressLine2: '',
      registrationNumber: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      userId: '',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedState = watch('state');

  useEffect(() => {
    if (selectedState && CITIES_BY_STATE[selectedState]) {
      setCityOptions(CITIES_BY_STATE[selectedState]);
      setValue('city', '');
    } else {
      setCityOptions([]);
    }
  }, [selectedState, setValue]);

  const onSubmit = (values: SignupFormValues) => {
    mockSignup({
      fullName: values.fullName,
      email: values.email,
      userId: values.userId,
    });
    navigate('/dashboard');
  };

  return (
    <AuthLayout variant="signup">
      <div className="w-full rounded-2xl bg-white px-6 py-8 shadow-[0_8px_40px_rgba(60,42,33,0.08)] sm:px-10 sm:py-10">
        <BrandHeader className="mb-6" />

        <div className="mb-8">
          <h2 className="font-serif text-[28px] font-bold leading-tight text-brown">
            Let&apos;s Begin
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your Credentials to create admin account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FormSection
            title="Clinic Information"
            subtitle="Basic Information about your company"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Clinic Name"
                    placeholder="Clinic Name"
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
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
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
                    placeholder="Pin Code"
                    error={errors.pinCode?.message}
                    {...register('pinCode')}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Address Line 1"
                    placeholder="Address Line 1"
                    error={errors.addressLine1?.message}
                    {...register('addressLine1')}
                  />
                  <Input
                    label="Address Line 2"
                    placeholder="Address Line 2"
                    {...register('addressLine2')}
                  />
                </div>

                <Input
                  label="Registration Number/ GST"
                  placeholder="Registration Number/ GST"
                  error={errors.registrationNumber?.message}
                  {...register('registrationNumber')}
                />
              </div>

              <FileUpload
                label="Your Logo"
                error={errors.logo?.message}
                onChange={(file) =>
                  setValue('logo', file, { shouldValidate: true })
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Contact Information"
            subtitle="Primary contact information for your company"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Full Name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
                <Input
                  label="Email"
                  placeholder="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="User ID"
                  placeholder="User ID"
                  error={errors.userId?.message}
                  {...register('userId')}
                />
                <Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  type="password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              <FileUpload
                label="Your Photo"
                error={errors.photo?.message}
                onChange={(file) =>
                  setValue('photo', file, { shouldValidate: true })
                }
              />
            </div>
          </FormSection>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="rounded-xl py-3.5 text-base"
            >
              {isSubmitting ? 'Creating account...' : 'Signup'}
            </Button>
            <p className="text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-gold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#ebe6dc] bg-[#faf8f4] p-5 sm:p-6">
      <h3 className="text-base font-bold text-brown">{title}</h3>
      <p className="mb-5 text-sm text-text-muted">{subtitle}</p>
      {children}
    </section>
  );
}
