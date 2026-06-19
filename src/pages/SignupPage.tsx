import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
    <AuthLayout wide>
      <Card className="px-5 py-8 sm:px-8">
        <BrandHeader className="mb-6" />

        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-brown sm:text-3xl">
            Let&apos;s Begin
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Enter your Credentials to create admin account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
          <FormSection
            title="Clinic Information"
            subtitle="Basic information about your company"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Clinic Name"
                  error={errors.clinicName?.message}
                  {...register('clinicName')}
                />
                <Select
                  placeholder="Clinic Type"
                  options={[...CLINIC_TYPES]}
                  error={errors.clinicType?.message}
                  {...register('clinicType')}
                />
                <Select
                  placeholder="Select State"
                  options={[...INDIAN_STATES]}
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Select
                  placeholder="Select City"
                  options={cityOptions}
                  error={errors.city?.message}
                  disabled={!selectedState}
                  {...register('city')}
                />
                <Input
                  placeholder="Pin Code"
                  error={errors.pinCode?.message}
                  {...register('pinCode')}
                />
                <Input
                  placeholder="Address Line 1"
                  error={errors.addressLine1?.message}
                  {...register('addressLine1')}
                />
                <Input
                  placeholder="Address Line 2"
                  className="sm:col-span-2"
                  {...register('addressLine2')}
                />
                <Input
                  placeholder="Registration Number/ GST"
                  className="sm:col-span-2"
                  error={errors.registrationNumber?.message}
                  {...register('registrationNumber')}
                />
              </div>
              <FileUpload
                label="Logo"
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
            <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Full Name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  placeholder="Mobile Number"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  placeholder="User ID"
                  error={errors.userId?.message}
                  {...register('userId')}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
              <FileUpload
                label="Photo"
                error={errors.photo?.message}
                onChange={(file) =>
                  setValue('photo', file, { shouldValidate: true })
                }
              />
            </div>
          </FormSection>

          <div className="space-y-4">
            <Button type="submit" fullWidth disabled={isSubmitting}>
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
      </Card>
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
    <section>
      <h3 className="text-base font-bold text-brown">{title}</h3>
      <p className="mb-4 text-sm text-text-muted">{subtitle}</p>
      {children}
    </section>
  );
}
