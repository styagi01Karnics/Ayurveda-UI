import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { DoshaDiagram } from '@/components/auth/DoshaDiagram';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  DUMMY_LOGIN_CREDENTIALS,
  mockLogin,
} from '@/lib/auth';
import {
  CLINIC_LOCATIONS,
  setStoredClinicLocation,
} from '@/lib/clinicLocations';
import {
  loginSchema,
  type LoginFormValues,
} from '@/lib/validation/login.schema';

export function LoginPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: DUMMY_LOGIN_CREDENTIALS.emailOrUsername,
      password: DUMMY_LOGIN_CREDENTIALS.password,
      locationId: CLINIC_LOCATIONS[0].value,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null);
    const user = mockLogin(
      values.emailOrUsername.trim(),
      values.password,
    );
    if (!user) {
      setSubmitError('Invalid credentials. Password must be at least 6 characters.');
      return;
    }
    setStoredClinicLocation(values.locationId);
    navigate('/dashboard');
  };

  return (
    <AuthLayout variant="login" aside={<DoshaDiagram />}>
      <AuthCard className="max-w-[400px] px-7 py-8 sm:px-9 sm:py-9">
        <BrandHeader className="mb-8" />

        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold leading-tight text-brown sm:text-[26px]">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your credentials to access your account
          </p>
          <p className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-brown">
            Demo login (no API):{' '}
            <span className="font-medium">{DUMMY_LOGIN_CREDENTIALS.emailOrUsername}</span>
            {' / '}
            <span className="font-medium">{DUMMY_LOGIN_CREDENTIALS.password}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            fieldVariant="auth"
            label="Enter your username or email address"
            placeholder="Enter your username or email address"
            error={errors.emailOrUsername?.message}
            {...register('emailOrUsername')}
          />

          <Select
            fieldVariant="auth"
            label="Location"
            placeholder="Select location"
            options={[...CLINIC_LOCATIONS]}
            error={errors.locationId?.message}
            {...register('locationId')}
          />

          <div>
            <Input
              fieldVariant="auth"
              label="Password"
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-xs text-brown hover:text-gold"
              >
                Forgot password
              </button>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-danger" role="alert">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            className="mt-1 rounded-xl py-3 text-base font-semibold"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-gold hover:underline">
            Sign Up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
