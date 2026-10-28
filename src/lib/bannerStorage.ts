export type BannerStatus = 'active' | 'draft';
export type BannerAccent = 'gold' | 'sage' | 'terracotta';
export type BannerLayout = 'ribbon' | 'split' | 'minimal';

export interface ClinicBanner {
  id: string;
  title: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  badge?: string;
  accent: BannerAccent;
  layout: BannerLayout;
  status: BannerStatus;
  updatedAt: string;
}

const BANNERS_KEY = 'ganesha-clinic-banners';
const ACTIVE_BANNER_KEY = 'ganesha-active-banner-id';

export const DEFAULT_BANNERS: ClinicBanner[] = [
  {
    id: 'banner-default-offer',
    title: 'Monsoon Wellness',
    headline: 'Up to 50% Off on Ayurvedic Medicines & Wellness Products',
    subtext: 'Limited-time clinic offer for Panchakarma packages and herbal formulations.',
    ctaLabel: 'Claim Offer',
    badge: 'Seasonal',
    accent: 'gold',
    layout: 'ribbon',
    status: 'active',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-panchakarma',
    title: 'Panchakarma Retreat',
    headline: 'Book a 7-Day Detox Program — Complimentary Consultation Included',
    subtext: 'Restore balance with guided therapies and personalised diet plans.',
    ctaLabel: 'Explore Program',
    badge: 'Featured',
    accent: 'sage',
    layout: 'split',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-consult',
    title: 'First Visit',
    headline: 'New patients receive 20% off their first consultation',
    subtext: 'Valid through this month at Ganesha Ayurvedaa clinic.',
    ctaLabel: 'Book Now',
    accent: 'terracotta',
    layout: 'minimal',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  },
];

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadBanners(): ClinicBanner[] {
  const stored = readJson<ClinicBanner[]>(BANNERS_KEY);
  if (stored?.length) return stored;
  return DEFAULT_BANNERS;
}

export function saveBanners(banners: ClinicBanner[]): void {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
}

export function loadActiveBannerId(): string | null {
  return localStorage.getItem(ACTIVE_BANNER_KEY);
}

export function saveActiveBannerId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_BANNER_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_BANNER_KEY);
  }
}

export function getActiveBanner(banners = loadBanners()): ClinicBanner | null {
  const activeId = loadActiveBannerId();
  const active = banners.find((b) => b.id === activeId && b.status === 'active');
  if (active) return active;
  return banners.find((b) => b.status === 'active') ?? banners[0] ?? null;
}

export function createEmptyBanner(): ClinicBanner {
  return {
    id: `banner-${Date.now()}`,
    title: 'Untitled Banner',
    headline: '',
    subtext: '',
    ctaLabel: 'Learn More',
    badge: '',
    accent: 'gold',
    layout: 'ribbon',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  };
}

export const BANNER_ACCENT_STYLES: Record<
  BannerAccent,
  { gradient: string; ring: string; badge: string; text: string }
> = {
  gold: {
    gradient: 'from-[#f8ecd4] via-[#f3e4c4] to-[#ebe0cc]',
    ring: 'ring-gold/25',
    badge: 'bg-gold/15 text-gold-dark',
    text: 'text-gold-dark',
  },
  sage: {
    gradient: 'from-[#e8f0e6] via-[#dce8da] to-[#d4e2d2]',
    ring: 'ring-[#6b8f71]/25',
    badge: 'bg-[#6b8f71]/15 text-[#3d5c42]',
    text: 'text-[#3d5c42]',
  },
  terracotta: {
    gradient: 'from-[#f5e8e2] via-[#edd9cf] to-[#e5cfc4]',
    ring: 'ring-[#b8734a]/25',
    badge: 'bg-[#b8734a]/15 text-[#7a4528]',
    text: 'text-[#7a4528]',
  },
};
