import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { BannerAccent, BannerLayout, ClinicBanner } from '@/lib/bannerStorage';

interface BannerEditorPanelProps {
  banner: ClinicBanner;
  onChange: (banner: ClinicBanner) => void;
}

const ACCENT_OPTIONS: { value: BannerAccent; label: string }[] = [
  { value: 'gold', label: 'Golden Harvest' },
  { value: 'sage', label: 'Healing Sage' },
  { value: 'terracotta', label: 'Earthy Terracotta' },
];

const LAYOUT_OPTIONS: { value: BannerLayout; label: string }[] = [
  { value: 'ribbon', label: 'Top Ribbon' },
  { value: 'split', label: 'Split Hero' },
  { value: 'minimal', label: 'Minimal Strip' },
];

export function BannerEditorPanel({ banner, onChange }: BannerEditorPanelProps) {
  const update = <K extends keyof ClinicBanner>(key: K, value: ClinicBanner[K]) => {
    onChange({ ...banner, [key]: value, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-4">
      <Input
        label="Banner Name (internal)"
        value={banner.title}
        onChange={(e) => update('title', e.target.value)}
        placeholder="e.g. Monsoon Wellness"
      />
      <Input
        label="Headline"
        value={banner.headline}
        onChange={(e) => update('headline', e.target.value)}
        placeholder="Main message shown to users"
      />
      <Textarea
        label="Supporting Text"
        rows={3}
        value={banner.subtext}
        onChange={(e) => update('subtext', e.target.value)}
        placeholder="Optional detail line beneath the headline"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="CTA Label"
          value={banner.ctaLabel}
          onChange={(e) => update('ctaLabel', e.target.value)}
          placeholder="Claim Offer"
        />
        <Input
          label="Badge (optional)"
          value={banner.badge ?? ''}
          onChange={(e) => update('badge', e.target.value)}
          placeholder="Seasonal"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Accent Palette"
          options={ACCENT_OPTIONS}
          value={banner.accent}
          onChange={(e) => update('accent', e.target.value as BannerAccent)}
        />
        <Select
          label="Layout Style"
          options={LAYOUT_OPTIONS}
          value={banner.layout}
          onChange={(e) => update('layout', e.target.value as BannerLayout)}
        />
      </div>
    </div>
  );
}
