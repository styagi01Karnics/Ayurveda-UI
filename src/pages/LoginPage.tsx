import { useEffect, useMemo, useState } from 'react';
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
import { Tabs } from '@/components/ui/Tabs';
import { getPublicTenants, forgotPassword, login, type PublicTenantDto } from '@/lib/api/auth';
import {
  DUMMY_LOGIN_CREDENTIALS,
  mapAuthTokenToSession,
  mockLogin,
  setAuthSession,
  setStoredUser,
} from '@/lib/auth';
import {
  CLINIC_LOCATIONS,
  setStoredClinicLocation,
} from '@/lib/clinicLocations';
import { ALL_PAGE_CODES } from '@/lib/pagePermissions';
import {
  loginSchema,
  type LoginFormValues,
  type LoginMode,
} from '@/lib/validation/login.schema';

const LOGIN_TABS: { id: LoginMode; label: string }[] = [
  { id: 'superAdmin', label: 'System Admin' },
  { id: 'all', label: 'Users' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice =
    (location.state as { notice?: string } | null)?.notice ?? null;
  const [loginMode, setLoginMode] = useState<LoginMode>('all');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<PublicTenantDto[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

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
      tenantCode: DUMMY_LOGIN_CREDENTIALS.tenantCode,
      emailOrUsername: DUMMY_LOGIN_CREDENTIALS.emailOrUsername,
      password: DUMMY_LOGIN_CREDENTIALS.password,
      locationId: CLINIC_LOCATIONS[0].value,
    },
  });

  const selectedTenantCode = watch('tenantCode');

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

  useEffect(() => {
    if (loginMode !== 'all' || !selectedTenantCode) return;
    const match = tenants.find((t) => t.tenantCode === selectedTenantCode);
    if (!match) return;
    setValue(
      'locationId',
      match.city?.trim() || match.state?.trim() || match.tenantCode,
    );
  }, [loginMode, selectedTenantCode, tenants, setValue]);

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
      if (isHospitalLogin && values.locationId) {
        setStoredClinicLocation(values.locationId);
      }
      navigate('/dashboard');
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

    if (values.mode === 'superAdmin') {
      const superUser = {
        ...user,
        role: 'Super Admin',
        apiRole: 'SUPER_ADMIN',
        tenantCode: 'PLATFORM',
        pageCodes: [...ALL_PAGE_CODES],
      };
      setStoredUser(superUser);
      navigate('/dashboard');
      return;
    }

    if (values.locationId) {
      setStoredClinicLocation(values.locationId);
    }
    navigate('/dashboard');
  };

  const handleForgotPassword = async () => {
    setSubmitError(null);
    setForgotNotice(null);
    const email = watch('emailOrUsername')?.trim();
    if (!email) {
      setSubmitError('Enter your email address first.');
      return;
    }
    setForgotBusy(true);
    try {
      await forgotPassword({
        usernameOrEmail: email,
        tenantCode:
          loginMode === 'all'
            ? watch('tenantCode')?.trim() || undefined
            : undefined,
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
      <AuthCard className="w-full max-w-[560px] px-7 py-7 sm:px-9 sm:py-8">
        <BrandHeader
          className="mb-5"
          variant={loginMode === 'superAdmin' ? 'platform' : 'clinic'}
        />

        <div className="mb-4">
          <h2 className="font-serif text-2xl font-bold leading-tight text-brown sm:text-[26px]">
            Welcome back!
          </h2>
          <p className="mt-1.5 text-sm text-text-muted">
            Enter your Credentials to access your account
          </p>
          {notice ? (
            <p className="mt-2 rounded-lg bg-success/10 px-3 py-2 text-xs text-brown">
              {notice}
            </p>
          ) : null}
        </div>

        <Tabs
          tabs={LOGIN_TABS}
          activeTab={loginMode}
          onChange={setLoginMode}
          className="mb-4"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          <input type="hidden" {...register('mode')} />
          <input type="hidden" {...register('locationId')} />

          {loginMode === 'all' ? (
            <>
              <Select
                fieldVariant="auth"
                label="Clinic"
                placeholder={
                  tenantsLoading ? 'Loading clinics…' : 'Select clinic'
                }
                options={hospitalOptions}
                error={errors.tenantCode?.message}
                disabled={tenantsLoading && tenants.length === 0}
                {...register('tenantCode')}
              />

              <Input
                fieldVariant="auth"
                label="Email address"
                placeholder="admin@gmail.com"
                error={errors.emailOrUsername?.message}
                {...register('emailOrUsername')}
              />
            </>
          ) : (
            <Input
              fieldVariant="auth"
              label="Email address"
              placeholder="superadmin@gmail.com"
              error={errors.emailOrUsername?.message}
              {...register('emailOrUsername')}
            />
          )}

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
                disabled={forgotBusy}
                onClick={() => void handleForgotPassword()}
                className="text-xs text-brown hover:text-gold disabled:opacity-60"
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
            className="mt-1 rounded-xl py-3 text-base font-semibold"
          >
            Login
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-text-muted">
          First-time platform setup?{' '}
          <Link to="/platform/bootstrap" className="text-gold hover:underline">
            Create Super Admin
          </Link>
        </p>
        <p className="mt-1.5 text-center text-xs text-text-muted">
          New clinic accounts are created by Super Admin after login.
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
