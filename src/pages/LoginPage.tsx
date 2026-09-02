import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { DoshaDiagram } from '@/components/auth/DoshaDiagram';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { login } from '@/lib/api/auth';
import {
  DUMMY_LOGIN_CREDENTIALS,
  isSuperAdmin,
  mapAuthTokenToSession,
  mockLogin,
  setAuthSession,
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
  const location = useLocation();
  const notice =
    (location.state as { notice?: string } | null)?.notice ?? null;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantCode: DUMMY_LOGIN_CREDENTIALS.tenantCode,
      emailOrUsername: DUMMY_LOGIN_CREDENTIALS.emailOrUsername,
      password: DUMMY_LOGIN_CREDENTIALS.password,
      locationId: CLINIC_LOCATIONS[0].value,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    const usernameOrEmail = values.emailOrUsername.trim();
    const tenantCode = values.tenantCode?.trim() || undefined;

    try {
      const response = await login({
        tenantCode,
        usernameOrEmail,
        password: values.password,
      });
      const session = mapAuthTokenToSession(response);
      setAuthSession(session.token, session.user, session.tenant);
      setStoredClinicLocation(values.locationId);
      navigate(isSuperAdmin(session.user) ? '/platform/hospitals' : '/dashboard');
      return;
    } catch {
      // Fall through to local mock login for offline / demo use.
    }

    const user = mockLogin(usernameOrEmail, values.password);
    if (!user) {
      setSubmitError(
        'Invalid credentials. Password must be at least 6 characters.',
      );
      return;
    }
    setStoredClinicLocation(values.locationId);
    navigate(isSuperAdmin(user) ? '/platform/hospitals' : '/dashboard');
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
          {notice ? (
            <p className="mt-2 rounded-lg bg-success/10 px-3 py-2 text-xs text-brown">
              {notice}
            </p>
          ) : null}
          <p className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-brown">
            Demo login:{' '}
            <span className="font-medium">
              {DUMMY_LOGIN_CREDENTIALS.tenantCode}
            </span>
            {' / '}
            <span className="font-medium">
              {DUMMY_LOGIN_CREDENTIALS.emailOrUsername}
            </span>
            {' / '}
            <span className="font-medium">{DUMMY_LOGIN_CREDENTIALS.password}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            fieldVariant="auth"
            label="Hospital / tenant code"
            placeholder="e.g. GAN-DL"
            error={errors.tenantCode?.message}
            {...register('tenantCode')}
          />

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
          First-time platform setup?{' '}
          <Link to="/platform/bootstrap" className="text-gold hover:underline">
            Create Super Admin
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-text-muted">
          New hospital accounts are created by Super Admin after login.
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
