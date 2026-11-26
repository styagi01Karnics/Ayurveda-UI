import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import {
  addUserSchema,
  editUserSchema,
  type AddUserFormValues,
  type EditUserFormValues,
} from '@/lib/validation/settings.schema';
import type { SettingsUserRecord } from '@/types';
import { getActiveDoctorsWithoutUserCode, getDoctorById } from '@/lib/api/doctors';

export interface TenantRoleOption {
  value: string;
  label: string;
  description?: string;
  pageCodes?: string[];
}

export type UserFormValues = AddUserFormValues | EditUserFormValues;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  submitting?: boolean;
  tenantRoleOptions?: TenantRoleOption[];
  user?: SettingsUserRecord | null;
}

export function AddUserModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  tenantRoleOptions = [],
  user = null,
}: AddUserModalProps) {
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : addUserSchema),
    defaultValues: {
      tenantRoleId: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      status: 'Active',
      profession: 'OTHERS' as const,
      userCode: '',
      doctorId: '',
    },
  });

  const profession = watch('profession');
  const [doctorEmails, setDoctorEmails] = useState<{ value: string; label: string }[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    if (profession === 'DOCTOR') {
      void (async () => {
        try {
          const doctors = await getActiveDoctorsWithoutUserCode();
          setDoctors(Array.isArray(doctors) ? doctors : []);
          const emails = (Array.isArray(doctors) ? doctors : []).map((d: any) => {
            const email = d?.email ?? d?.emailId ?? d?.doctorEmail;
            return typeof email === 'string' ? email.trim() : '';
          }).filter((e: string) => e.length > 0).map((e: string) => ({ value: e, label: e }));
          // In edit mode, ensure the existing user's email is in the list
          if (isEdit && user?.email && user.email !== '—' && !emails.some((opt) => opt.value === user.email)) {
            emails.unshift({ value: user.email, label: user.email });
          }
          // Deduplicate
          const seen = new Set<string>();
          const unique = emails.filter((opt) => {
            if (seen.has(opt.value)) return false;
            seen.add(opt.value);
            return true;
          });
          setDoctorEmails(unique);
        } catch {
          setDoctorEmails([]);
        }
      })();
    } else {
      setDoctorEmails([]);
    }
  }, [profession, open]);

  useEffect(() => {
    if (!open) return;
    if (user) {
      reset({
        tenantRoleId: user.tenantRoleId ?? '',
        fullName: user.fullName === '—' ? '' : user.fullName,
        mobileNumber: user.phone.replace(/\D/g, '').slice(-10),
        email: user.email === '—' ? '' : user.email,
        status: user.status,
        profession: (user.profession as 'DOCTOR' | 'OTHERS') ?? 'OTHERS',
        userCode: user.userCode ?? '',
        doctorId: user.doctorId ?? '',
      });
      return;
    }
    reset({
      tenantRoleId: '',
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      status: 'Active',
      profession: 'OTHERS',
      userCode: '',
      doctorId: '',
    });
  }, [open, user, reset]);

  useEffect(() => {
    if (!open || isEdit || profession !== 'DOCTOR') return;
    const doctorRole = tenantRoleOptions.find(
      (opt) => opt.label.trim().toLowerCase() === 'doctor',
    );
    if (doctorRole && !watch('tenantRoleId')) {
      setValue('tenantRoleId', doctorRole.value);
    }
  }, [open, isEdit, profession, tenantRoleOptions, setValue, watch]);

  useEffect(() => {
    if (!open || !isEdit || profession !== 'DOCTOR' || !user?.doctorId) return;
    if (user.email && user.email !== '—') return;
    void (async () => {
      try {
        const doctor = await getDoctorById(user.doctorId!);
        if (doctor?.email) {
          setValue('email', doctor.email);
        }
      } catch {
        // ignore
      }
    })();
  }, [open, isEdit, profession, user, setValue]);


  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit User' : 'Add User'}
      subtitle={
        isEdit
          ? 'Please fill out the details to update user'
          : 'Please fill out the details to add user'
      }
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? 'Saving...' : 'Confirm'}
        </Button>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" noValidate>
         <Select
          label="Profession"
          placeholder="Select profession"
          options={[
            { value: 'DOCTOR', label: 'Doctor' },
            { value: 'OTHERS', label: 'Others' },
          ]}
          disabled={isEdit}
          error={'profession' in errors ? errors.profession?.message : undefined}
          {...register('profession')}
        />
        <Input
          label="User ID"
          placeholder="User ID"
          disabled={isEdit}
          readOnly={isEdit}
          className={isEdit ? 'cursor-not-allowed bg-gray-50' : ''}
          error={'userCode' in errors ? errors.userCode?.message : undefined}
          {...register('userCode')}
        />
        <Select
          label="Role"
          placeholder="Select role"
          options={tenantRoleOptions}
          error={'tenantRoleId' in errors ? errors.tenantRoleId?.message : undefined}
          {...register('tenantRoleId')}
        />
        <Input
          label="Full Name"
          placeholder="Full Name"
          error={'fullName' in errors ? errors.fullName?.message : undefined}
          {...register('fullName')}
        />
        <Input
          label="Mobile Number"
          placeholder="Mobile Number"
          error={'mobileNumber' in errors ? errors.mobileNumber?.message : undefined}
          {...register('mobileNumber')}
        />
        {profession === 'DOCTOR' && !isEdit ? (
          <Select
            label="Email"
            placeholder="Select doctor email"
            options={doctorEmails}
            value={watch('email') ?? ''}
            error={'email' in errors ? errors.email?.message : undefined}
            onChange={(e) => {
              setValue('email', e.target.value, { shouldValidate: true });
              // find doctor id from the fetched doctors
              const doc = doctors.find((d: any) => (d.email ?? d.emailId ?? d.doctorEmail) === e.target.value);
              setValue('doctorId', doc?.id ?? '');
              if (doc) {
                setValue('fullName', doc.name ?? doc.doctorName ?? '');
                setValue('mobileNumber', String(doc.mobileNumber ?? '').replace(/\D/g, '').slice(-10));
              }
            }}
          />
        ) : (
          <Input
            label="Email"
            type="email"
            placeholder="Email"
            disabled={isEdit}
            readOnly={isEdit}
            className={isEdit ? 'cursor-not-allowed bg-gray-50' : ''}
            error={'email' in errors ? errors.email?.message : undefined}
            {...register('email')}
          />
        )}
       
        {!isEdit ? (
          <>
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              error={'password' in errors ? errors.password?.message : undefined}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              error={
                'confirmPassword' in errors
                  ? errors.confirmPassword?.message
                  : undefined
              }
              {...register('confirmPassword')}
            />
          </>
        ) : null}
      </form>
    </Modal>
  );
}
