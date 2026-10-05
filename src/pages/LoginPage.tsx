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
import { login as loginApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { mapAuthTokenToSession, setAuthSession } from '@/lib/auth';
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
      emailOrUsername: '',
      password: '',
      tenantCode: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      const response = await loginApi({
        usernameOrEmail: values.emailOrUsername.trim(),
        password: values.password,
        tenantCode: values.tenantCode,
      });
      const session = mapAuthTokenToSession(response);
      setAuthSession(session.token, session.user);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError('Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout variant="login" aside={<DoshaDiagram />}>
      <AuthCard className="w-full max-w-[510px] rounded-[11.7px] bg-[#FFFFFFCC] px-9 py-11 shadow-[0_0_3.53px_1.18px_#BE880B1A] sm:px-11 sm:py-12">
        <BrandHeader className="mb-7" />

        <div className="mb-6">
          <h2 className="font-sans text-[37.61px] font-medium leading-none tracking-normal text-brown">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-text-muted sm:text-[15px]">
            Enter your Credentials to access your account
          </p>
          <p className="mt-2 text-xs text-brown/70">
            Hospital login needs tenant code (e.g. GAN-AP). Leave tenant blank for
            Super Admin.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            fieldVariant="auth"
            label="Hospital tenant code (optional for Super Admin)"
            placeholder="e.g. GAN-AP"
            className="py-3 text-[15px] uppercase"
            autoComplete="organization"
            error={errors.tenantCode?.message}
            {...register('tenantCode')}
          />

          <Input
            fieldVariant="auth"
            label="Enter your username or email address"
            placeholder="Enter your username or email address"
            className="py-3 text-[15px]"
            autoComplete="username"
            error={errors.emailOrUsername?.message}
            {...register('emailOrUsername')}
          />

          <div>
            <Input
              fieldVariant="auth"
              label="Password"
              type="password"
              placeholder="Password"
              className="py-3 text-[15px]"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="mt-1.5 text-right">
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
            className="mt-2 rounded-[11.7px] py-1.5 text-base font-semibold"
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[15px] text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-gold hover:underline">
            Sign Up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
