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
import { mockLogin } from '@/lib/auth';
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
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null);
    const user = mockLogin(values.emailOrUsername, values.password);
    if (user) {
      navigate('/dashboard');
    } else {
      setSubmitError('Invalid credentials. Please try again.');
    }
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
            Enter your Credentials to access your account
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
            {isSubmitting ? 'Logging in...' : 'Login'}
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
