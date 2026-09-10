import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/app/ToastContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/lib/api/client';
import {
  createHospital,
  getHospitals,
  retryHospitalProvision,
  updateHospitalStatus,
  type PlatformHospitalDto,
} from '@/lib/api/roles';
import {
  CITIES_BY_STATE,
  INDIAN_STATES,
} from '@/lib/validation/signup.schema';
import {
  fileToDataUrl,
  onboardHospitalSchema,
  PLATFORM_CLINIC_TYPES,
  type OnboardHospitalFormValues,
} from '@/lib/validation/onboardHospital.schema';

const emptyForm: OnboardHospitalFormValues = {
  clinicName: '',
  clinicType: 'CLINIC',
  state: '',
  city: '',
  pinCode: '',
  addressLine1: '',
  addressLine2: '',
  logoUrl: '',
  fullName: '',
  mobileNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function PlatformHospitalsPage() {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState<PlatformHospitalDto[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [lastOnboard, setLastOnboard] = useState<{
    tenantCode?: string;
    schemaName?: string;
    adminEmail?: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoFileError, setLogoFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardHospitalFormValues>({
    resolver: zodResolver(onboardHospitalSchema),
    defaultValues: emptyForm,
  });

  const selectedState = watch('state');
  const cityOptions = selectedState
    ? (CITIES_BY_STATE[selectedState] ?? [])
    : [];

  const loadHospitals = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const list = await getHospitals();
      setHospitals(list);
    } catch (err) {
      setListError(
        err instanceof ApiError
          ? err.message
          : 'Could not load hospitals.',
      );
      setHospitals([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    setValue('city', '');
  }, [selectedState, setValue]);

  const onSubmit = async (values: OnboardHospitalFormValues) => {
    try {
      let logoUrl = values.logoUrl?.trim() || undefined;
      if (logoFile) {
        logoUrl = await fileToDataUrl(logoFile);
      }

      const result = await createHospital({
        clinicName: values.clinicName.trim(),
        clinicType: values.clinicType,
        state: values.state,
        city: values.city,
        pinCode: values.pinCode.trim(),
        addressLine1: values.addressLine1.trim(),
        addressLine2: values.addressLine2?.trim() || undefined,
        logoUrl,
        fullName: values.fullName.trim(),
        mobileNumber: values.mobileNumber.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      const tenantCode =
        result.hospital?.tenantCode ?? result.tenantCode ?? undefined;
      const schemaName =
        result.hospital?.schemaName ?? result.schemaName ?? undefined;

      setLastOnboard({
        tenantCode,
        schemaName,
        adminEmail: result.admin?.email ?? values.email.trim(),
      });
      reset(emptyForm);
      setLogoFile(undefined);
      setLogoFileError(null);
      setShowForm(false);
      await loadHospitals();
      showToast({
        title: 'Hospital onboarded',
        message: tenantCode
          ? `Tenant code ${tenantCode} is ready. Share it with the hospital admin to log in.`
          : 'Hospital and admin were created successfully.',
      });
    } catch (err) {
      showToast({
        title: 'Onboard failed',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not create hospital. Please try again.',
      });
    }
  };

  const handleStatus = async (hospitalId: string, status: string) => {
    try {
      await updateHospitalStatus(hospitalId, status);
      await loadHospitals();
      showToast({
        title: 'Status updated',
        message: `Hospital marked as ${status}.`,
      });
    } catch (err) {
      showToast({
        title: 'Update failed',
        message:
          err instanceof ApiError ? err.message : 'Could not update status.',
      });
    }
  };

  const handleRetry = async (hospitalId: string) => {
    try {
      await retryHospitalProvision(hospitalId);
      await loadHospitals();
      showToast({
        title: 'Provision retry started',
        message: 'Schema provisioning was retried.',
      });
    } catch (err) {
      showToast({
        title: 'Retry failed',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not retry provisioning.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown sm:text-[28px]">
            Hospitals
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Onboard a hospital and its admin, then share the tenant code for
            hospital login.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Hide form' : 'Onboard hospital'}
        </Button>
      </div>

      {lastOnboard ? (
        <Card className="border border-success/30 bg-success/5 p-4 sm:p-5">
          <p className="text-sm font-semibold text-brown">
            Latest onboard success
          </p>
          <dl className="mt-2 grid gap-1 text-sm text-brown sm:grid-cols-3">
            <div>
              <dt className="text-text-muted">Tenant code</dt>
              <dd className="font-medium">{lastOnboard.tenantCode ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Schema</dt>
              <dd className="font-medium">{lastOnboard.schemaName ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Admin email</dt>
              <dd className="font-medium">{lastOnboard.adminEmail ?? '—'}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-text-muted">
            Hospital login: tenant code + admin email + password (omit for Super
            Admin).
          </p>
        </Card>
      ) : null}

      {showForm ? (
        <Card className="p-5 sm:p-6">
          <h2 className="mb-1 text-lg font-bold text-brown">
            Onboard hospital + admin
          </h2>


          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            <section>
              <h3 className="mb-4 text-sm font-semibold text-brown">
                Clinic information
              </h3>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Clinic name"
                      placeholder="Ganesha Ayurveda"
                      error={errors.clinicName?.message}
                      {...register('clinicName')}
                    />
                    <Select
                      label="Clinic type"
                      options={[...PLATFORM_CLINIC_TYPES]}
                      error={errors.clinicType?.message}
                      {...register('clinicType')}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select
                      label="State"
                      placeholder="Select state"
                      options={[...INDIAN_STATES]}
                      error={errors.state?.message}
                      {...register('state')}
                    />
                    <Select
                      label="City"
                      placeholder="Select city"
                      options={cityOptions}
                      error={errors.city?.message}
                      disabled={!selectedState}
                      {...register('city')}
                    />
                    <Input
                      label="PIN code"
                      placeholder="110001"
                      error={errors.pinCode?.message}
                      {...register('pinCode')}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Address line 1"
                      placeholder="12 Main Road"
                      error={errors.addressLine1?.message}
                      {...register('addressLine1')}
                    />
                    <Input
                      label="Address line 2"
                      placeholder="Optional"
                      {...register('addressLine2')}
                    />
                  </div>
                  <Input
                    label="Logo URL (optional)"
                    placeholder="https://cdn.example.com/logo.png"
                    error={errors.logoUrl?.message}
                    {...register('logoUrl')}
                  />
                </div>

                <FileUpload
                  label="Clinic Logo"
                  editOnly
                  actionLabel="Upload clinic logo"
                  value={logoFile}
                  error={logoFileError ?? undefined}
                  onChange={(file) => {
                    setLogoFileError(null);
                    if (
                      file &&
                      ![
                        'image/svg+xml',
                        'image/png',
                        'image/jpeg',
                        'image/gif',
                        'image/webp',
                      ].includes(file.type)
                    ) {
                      setLogoFileError(
                        'Logo must be SVG, PNG, JPG, WEBP or GIF',
                      );
                      setLogoFile(undefined);
                      return;
                    }
                    if (file && file.size > 5 * 1024 * 1024) {
                      setLogoFileError('File must be under 5MB');
                      setLogoFile(undefined);
                      return;
                    }
                    setLogoFile(file);
                    if (file) {
                      setValue('logoUrl', '', { shouldValidate: true });
                    }
                  }}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-sm font-semibold text-brown">
                Hospital admin
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Hospital Admin"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Mobile number"
                  placeholder="9876543210"
                  error={errors.mobileNumber?.message}
                  {...register('mobileNumber')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@gmail.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <div className="hidden sm:block" aria-hidden />
                <Input
                  label="Password"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
            </section>

            <div className="flex justify-end border-t border-[#f0ebe3] pt-5">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create hospital'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-brown">All hospitals</h2>
        </div>
        {loadingList ? (
          <p className="px-5 py-8 text-sm text-text-muted">Loading…</p>
        ) : listError ? (
          <div className="px-5 py-8">
            <p className="text-sm text-danger">{listError}</p>
            <Button
              type="button"
              className="mt-3"
              onClick={() => void loadHospitals()}
            >
              Retry
            </Button>
          </div>
        ) : hospitals.length === 0 ? (
          <p className="px-5 py-8 text-sm text-text-muted">
            No hospitals yet. Use the form above to onboard the first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Tenant code</th>
                  <th className="px-5 py-3 font-medium">Schema</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => {
                  const name =
                    hospital.name ?? hospital.clinicName ?? 'Hospital';
                  const status = (hospital.status ?? '—').toUpperCase();
                  return (
                    <tr
                      key={hospital.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-5 py-4 font-medium text-brown">
                        {name}
                      </td>
                      <td className="px-5 py-4 text-brown">
                        {hospital.tenantCode ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-brown">
                        {hospital.schemaName ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-brown">{status}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {status === 'FAILED' ? (
                            <Button
                              type="button"
                              className="px-2.5 py-1 text-xs"
                              onClick={() => void handleRetry(hospital.id)}
                            >
                              Retry provision
                            </Button>
                          ) : null}
                          {status === 'ACTIVE' ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="px-2.5 py-1 text-xs"
                              onClick={() =>
                                void handleStatus(hospital.id, 'INACTIVE')
                              }
                            >
                              Deactivate
                            </Button>
                          ) : status === 'INACTIVE' ||
                            status === 'SUSPENDED' ? (
                            <Button
                              type="button"
                              className="px-2.5 py-1 text-xs"
                              onClick={() =>
                                void handleStatus(hospital.id, 'ACTIVE')
                              }
                            >
                              Activate
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
