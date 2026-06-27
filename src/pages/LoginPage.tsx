import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 shadow-[0_8px_40px_rgba(60,42,33,0.08)] sm:px-10 sm:py-12">
        <BrandHeader className="mb-10" />

        <div className="mb-8">
          <h2 className="text-[28px] font-bold leading-tight text-brown">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your Credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Enter your username or email address"
            placeholder="Enter your username or email address"
            error={errors.emailOrUsername?.message}
            {...register('emailOrUsername')}
          />

          <div>
            <Input
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
            className="mt-2 rounded-xl py-3.5 text-base"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-gold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
