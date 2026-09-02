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
import { ApiError } from '@/lib/api/client';
import { bootstrapSuperAdmin } from '@/lib/api/roles';
import {
  bootstrapSuperAdminSchema,
  type BootstrapSuperAdminFormValues,
} from '@/lib/validation/bootstrapSuperAdmin.schema';

/**
 * First-time platform setup — POST /api/v1/platform/bootstrap-super-admin.
 * No JWT is returned; user must log in afterward (omit tenant code).
 */
export function BootstrapSuperAdminPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BootstrapSuperAdminFormValues>({
    resolver: zodResolver(bootstrapSuperAdminSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: BootstrapSuperAdminFormValues) => {
    setSubmitError(null);
    try {
      await bootstrapSuperAdmin({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/login', {
        replace: true,
        state: {
          notice:
            'Super Admin created. Log in with your email and password (leave Tenant Code empty).',
        },
      });
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Could not create Super Admin. It may already exist — try logging in instead.',
      );
    }
  };

  return (
    <AuthLayout variant="login" aside={<DoshaDiagram />}>
      <AuthCard className="max-w-[400px] px-7 py-8 sm:px-9 sm:py-9">
        <BrandHeader className="mb-8" />

        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold leading-tight text-brown sm:text-[26px]">
            Create Super Admin
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            First-time platform setup. This can only be done once.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Input
            fieldVariant="auth"
            label="Full name"
            placeholder="Platform Admin"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            fieldVariant="auth"
            label="Email"
            type="email"
            placeholder="superadmin@gmail.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            fieldVariant="auth"
            label="Password"
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            fieldVariant="auth"
            label="Confirm password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {submitError ? (
            <p className="text-sm text-danger" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            className="mt-1 rounded-xl py-3 text-base font-semibold"
          >
            {isSubmitting ? 'Creating…' : 'Create Super Admin'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already set up?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
