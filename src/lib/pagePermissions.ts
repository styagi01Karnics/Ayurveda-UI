/** Fixed UiPageSeeder codes — do not invent new ones. */
export const PAGE_ROUTES = {
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  TREATMENTS: '/treatments',
  MEDICINES: '/medicines',
  SALES: '/sales',
  ACTIVITY_LOG: '/activity-logs',
  BILLING: '/billing',
  SETTINGS: '/settings',
} as const;

export type PageCode = keyof typeof PAGE_ROUTES;

export const ALL_PAGE_CODES: PageCode[] = Object.keys(
  PAGE_ROUTES,
) as PageCode[];

export const PAGE_CODE_LABELS: Record<PageCode, string> = {
  DASHBOARD: 'Dashboard',
  PATIENTS: 'Patients',
  DOCTORS: 'Doctors',
  APPOINTMENTS: 'Appointments',
  TREATMENTS: 'Treatments',
  MEDICINES: 'Medicines',
  SALES: 'Sales',
  ACTIVITY_LOG: 'Activity Log',
  BILLING: 'Billing',
  SETTINGS: 'Settings',
};

/** Map a path to its pageCode (longest prefix wins). */
export function pageCodeForPath(pathname: string): PageCode | null {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const entries = Object.entries(PAGE_ROUTES) as [PageCode, string][];
  const match = entries
    .filter(([, path]) => normalized === path || normalized.startsWith(`${path}/`))
    .sort((a, b) => b[1].length - a[1].length)[0];
  return match?.[0] ?? null;
}

export function firstAllowedPath(pageCodes: string[] | undefined | null): string {
  if (!pageCodes?.length) return PAGE_ROUTES.DASHBOARD;
  for (const code of ALL_PAGE_CODES) {
    if (pageCodes.includes(code)) return PAGE_ROUTES[code];
  }
  return PAGE_ROUTES.DASHBOARD;
}

export function hasPageAccess(
  pageCodes: string[] | undefined | null,
  pageCode: PageCode,
): boolean {
  // Empty / missing codes = full access (legacy mock sessions).
  if (!pageCodes || pageCodes.length === 0) return true;
  return pageCodes.includes(pageCode);
}
