import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, AuthFormSection } from '@/components/auth/AuthCard';
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

const authField = { fieldVariant: 'auth' as const };

export function SignupPage() {
  const navigate = useNavigate();
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitError(null);
    mockSignup({
      fullName: values.fullName,
      email: values.email,
      userId: values.userId,
    });
    navigate('/dashboard');
  };

  return (
    <AuthLayout variant="signup">
      <AuthCard className="px-6 py-8 sm:px-10 sm:py-10">
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
          <AuthFormSection
            title="Clinic Information"
            subtitle="Basic Information about your company"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    {...authField}
                    label="Clinic Name"
                    placeholder="Clinic Name"
                    error={errors.clinicName?.message}
                    {...register('clinicName')}
                  />
                  <Select
                    {...authField}
                    label="Clinic Type"
                    placeholder="Clinic Type"
                    options={[...CLINIC_TYPES]}
                    error={errors.clinicType?.message}
                    {...register('clinicType')}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    {...authField}
                    label="State"
                    placeholder="Select State"
                    options={[...INDIAN_STATES]}
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <Select
                    {...authField}
                    label="City"
                    placeholder="Select City"
                    options={cityOptions}
                    error={errors.city?.message}
                    disabled={!selectedState}
                    {...register('city')}
                  />
                  <Input
                    {...authField}
                    label="PIN Code"
                    placeholder="Pin Code"
                    error={errors.pinCode?.message}
                    {...register('pinCode')}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    {...authField}
                    label="Address Line 1"
                    placeholder="Address Line 1"
                    error={errors.addressLine1?.message}
                    {...register('addressLine1')}
                  />
                  <Input
                    {...authField}
                    label="Address Line 2"
                    placeholder="Address Line 2"
                    {...register('addressLine2')}
                  />
                </div>

                <Input
                  {...authField}
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
          </AuthFormSection>

          <AuthFormSection
            title="Contact Information"
            subtitle="Primary contact information for your company"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  {...authField}
                  label="Full Name"
                  placeholder="Full Name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  {...authField}
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
                <Input
                  {...authField}
                  label="Email"
                  placeholder="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  {...authField}
                  label="User ID"
                  placeholder="User ID"
                  error={errors.userId?.message}
                  {...register('userId')}
                />
                <Input
                  {...authField}
                  label="Password"
                  placeholder="Password"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  {...authField}
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
          </AuthFormSection>

          <div className="space-y-4 pt-2">
            {submitError && (
              <p className="text-sm text-danger" role="alert">
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="rounded-xl py-3.5 text-base font-semibold"
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
      </AuthCard>
    </AuthLayout>
  );
}
