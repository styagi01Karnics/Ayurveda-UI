import { useCallback, useEffect, useState } from 'react';
import {
  getActiveBanner,
  loadActiveBannerId,
  loadBanners,
  saveActiveBannerId,
  saveBanners,
  type ClinicBanner,
} from '@/lib/bannerStorage';

const BANNERS_CHANGED = 'clinic-banners-changed';

export function notifyBannersChanged(): void {
  window.dispatchEvent(new Event(BANNERS_CHANGED));
}

export function useClinicBanners() {
  const [banners, setBannersState] = useState<ClinicBanner[]>(() => loadBanners());
  const [activeBannerId, setActiveBannerIdState] = useState<string | null>(() =>
    loadActiveBannerId(),
  );

  const refresh = useCallback(() => {
    setBannersState(loadBanners());
    setActiveBannerIdState(loadActiveBannerId());
  }, []);

  useEffect(() => {
    window.addEventListener(BANNERS_CHANGED, refresh);
    return () => window.removeEventListener(BANNERS_CHANGED, refresh);
  }, [refresh]);

  const persist = useCallback((next: ClinicBanner[]) => {
    saveBanners(next);
    setBannersState(next);
    notifyBannersChanged();
  }, []);

  const setActiveBanner = useCallback((id: string) => {
    saveActiveBannerId(id);
    setActiveBannerIdState(id);
    notifyBannersChanged();
  }, []);

  const activeBanner = getActiveBanner(banners);

  return {
    banners,
    activeBanner,
    activeBannerId: activeBannerId ?? activeBanner?.id ?? null,
    persist,
    setActiveBanner,
    refresh,
  };
}

export function useActiveBanner(): ClinicBanner | null {
  const [banner, setBanner] = useState<ClinicBanner | null>(() => getActiveBanner());

  useEffect(() => {
    const refresh = () => setBanner(getActiveBanner());
    refresh();
    window.addEventListener(BANNERS_CHANGED, refresh);
    return () => window.removeEventListener(BANNERS_CHANGED, refresh);
  }, []);

  return banner;
}
