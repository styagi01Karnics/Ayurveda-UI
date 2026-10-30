import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { DoshaDiagram } from '@/components/auth/DoshaDiagram';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPassword, login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import {
  DUMMY_LOGIN_CREDENTIALS,
  mapAuthTokenToSession,
  setAuthSession,
} from '@/lib/auth';
import { CLINIC_LOCATIONS, setStoredClinicLocation } from '@/lib/clinicLocations';
import {
  loginSchema,
  type LoginFormValues,
  type LoginMode,
} from '@/lib/validation/login.schema';
import { Select } from '@/components/ui/Select';
import { getPublicTenants, type PublicTenantDto } from '@/lib/api/auth';
const PLATFORM_LOGIN_PATH = '/platform/login';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice =
    (location.state as { notice?: string } | null)?.notice ?? null;
  const isPlatformLogin = location.pathname === PLATFORM_LOGIN_PATH;
  const loginMode: LoginMode = isPlatformLogin ? 'superAdmin' : 'all';
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenants, setTenants] = useState<PublicTenantDto[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mode: 'all',
      emailOrUsername: DUMMY_LOGIN_CREDENTIALS.emailOrUsername,
      password: DUMMY_LOGIN_CREDENTIALS.password,
      locationId: CLINIC_LOCATIONS[0].value,
    },
  });

  useEffect(() => {
    setValue('mode', loginMode);
    setSubmitError(null);
  }, [loginMode, setValue]);

  useEffect(() => {
    let active = true;
    setTenantsLoading(true);
    getPublicTenants()
      .then((list) => {
        if (!active) return;
        setTenants(list);
        const preferred =
          list.find((t) => t.tenantCode === DUMMY_LOGIN_CREDENTIALS.tenantCode) ??
          list[0];
        if (preferred?.tenantCode) {
          setValue('tenantCode', preferred.tenantCode);
          setValue(
            'locationId',
            preferred.city?.trim() ||
            preferred.state?.trim() ||
            preferred.tenantCode,
          );
        }
      })
      .catch(() => {
        if (active) setTenants([]);
      })
      .finally(() => {
        if (active) setTenantsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setValue]);

  const hospitalOptions = useMemo(() => {
    if (tenants.length === 0) {
      return [
        {
          value: DUMMY_LOGIN_CREDENTIALS.tenantCode,
          label: DUMMY_LOGIN_CREDENTIALS.tenantCode,
        },
      ];
    }
    return tenants.map((tenant) => {
      const name = tenant.clinicName || tenant.name || tenant.tenantCode;
      const place = [tenant.city, tenant.state].filter(Boolean).join(', ');
      return {
        value: tenant.tenantCode,
        label: place ? `${name} — ${place}` : name,
      };
    });
  }, [tenants]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setForgotNotice(null);
    const usernameOrEmail = values.emailOrUsername.trim();
    const isHospitalLogin = values.mode === 'all';
 const tenantCode = isHospitalLogin
      ? values.tenantCode?.trim() || undefined
      : undefined;
    try {
      const response = await login({
        tenantCode,
        usernameOrEmail,
        password: values.password,
      });
      const session = mapAuthTokenToSession(response);
      setAuthSession(session.token, session.user, session.tenant);
      if (isHospitalLogin) {
        const tenant = response.tenant;
        const clinicLocation =
          tenant?.city?.trim() || tenant?.state?.trim() || tenant?.tenantCode;
        if (clinicLocation) setStoredClinicLocation(clinicLocation);
      }
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setSubmitError(null);
    setForgotNotice(null);
    const email = watch('emailOrUsername')?.trim();
    const clinicCode = watch('tenantCode')?.trim();
    if (!email) {
      setSubmitError('Enter your email address first.');
      return;
    }
    if (loginMode === 'all' && !clinicCode) {
      setSubmitError('Select your clinic location to reset your password.');
      return;
    }
    setForgotBusy(true);
    try {
      await forgotPassword({
        usernameOrEmail: email,
        tenantCode: loginMode === 'all' ? clinicCode : undefined,
      });
      setForgotNotice(
        'If an account exists for that email, a reset link has been sent.',
      );
    } catch {
      setSubmitError('Could not start password reset. Try again later.');
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <AuthLayout variant="login" aside={<DoshaDiagram />}>
      <div className="login-form w-full">
        <BrandHeader
          className="mb-5"
          variant={loginMode === 'superAdmin' ? 'platform' : 'clinic'}
        />

        <div className="mb-4">
          <h2 className="font-sans text-[clamp(22px,3vw,28px)] font-medium leading-none tracking-normal text-[#422C23]">
            Welcome back!
          </h2>
          <p className="mt-2 font-sans text-[13px] font-normal leading-snug text-text-muted">
            Enter your Credentials to access your account
          </p>
          {notice ? (
            <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs text-brown">
              {notice}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          <input type="hidden" {...register('mode')} />

          <Input
            fieldVariant="auth"
            label={
              loginMode === 'superAdmin'
                ? 'Email address'
                : 'Enter your username or email address'
            }
            placeholder={
              loginMode === 'superAdmin'
                ? 'Enter your email address'
                : 'Enter your username or email address'
            }
            error={errors.emailOrUsername?.message}
            {...register('emailOrUsername')}
          />

          <div className="space-y-3.5">
            {loginMode === 'all' ? (
              <Select
                fieldVariant="auth"
                label="Location"
                placeholder={
                  tenantsLoading ? 'Loading clinics…' : 'Select clinic'
                }
                options={hospitalOptions}
                error={errors.tenantCode?.message}
                disabled={tenantsLoading && tenants.length === 0}
                {...register('tenantCode')}
              />
            ) : null}

            <Input
              fieldVariant="auth"
              label="Password"
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="-mt-1.5 text-right">
              <button
                type="button"
                disabled={forgotBusy}
                onClick={() => void handleForgotPassword()}
                className="text-[12px] text-text-muted hover:text-gold disabled:opacity-60"
              >
                {forgotBusy ? 'Sending…' : 'Forgot password'}
              </button>
            </div>
          </div>

          {forgotNotice ? (
            <p className="text-sm text-success" role="status">
              {forgotNotice}
            </p>
          ) : null}

          {submitError && (
            <p className="text-sm text-danger" role="alert">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-[#BE880B] py-2.5 text-[14px] font-semibold text-white hover:bg-gold-dark"
          >
            Login
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
