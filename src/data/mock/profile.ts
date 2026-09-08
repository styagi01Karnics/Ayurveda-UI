import type { ProfileFormValues } from '@/lib/validation/profile.schema';
import { emptyProfileValues } from '@/lib/validation/profile.schema';

/** @deprecated Prefer emptyProfileValues — profile UI loads from auth APIs. */
export const defaultProfile: ProfileFormValues = emptyProfileValues;
