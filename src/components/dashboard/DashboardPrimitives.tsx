import { ChevronDown } from 'lucide-react';
import type { BillingPeriod } from '@/lib/api/billing';

export const DASHBOARD_PERIOD_OPTIONS: {
  value: BillingPeriod;
  label: string;
}[] = [
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

interface PeriodDropdownProps {
  value: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}

export function PeriodDropdown({ value, onChange }: PeriodDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as BillingPeriod)}
        aria-label="Select period"
        className="appearance-none rounded-lg border border-[#e8e0d4] bg-white py-1 pl-2.5 pr-7 text-xs text-text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
      >
        {DASHBOARD_PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
    </div>
  );
}

export function DashDivider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-dashed border-[#dcd4c8] ${className}`} />;
}

interface SemiCircleGaugeProps {
  label: string;
  percent: number;
  count: number;
  stroke: string;
}

export function SemiCircleGauge({
  label,
  percent,
  count,
  stroke,
}: SemiCircleGaugeProps) {
  const radius = 32;
  const arcLength = Math.PI * radius;
  const offset = arcLength * (1 - percent / 100);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <svg width="76" height="46" viewBox="0 0 76 46" aria-hidden>
        <path
          d="M 10 40 A 28 28 0 0 1 66 40"
          fill="none"
          stroke="#ebe4d8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 10 40 A 28 28 0 0 1 66 40"
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
        />
        <text
          x="38"
          y="36"
          textAnchor="middle"
          className="fill-text-muted text-[11px] font-medium"
          style={{ fontSize: 11 }}
        >
          {percent}%
        </text>
      </svg>
      <span className="mt-0.5 text-[11px] text-text-muted">{label}</span>
      <span className="text-[11px] font-semibold text-gold">{count}</span>
    </div>
  );
}

export function CategoryChip({ count, label }: { count: number; label: string }) {
  return (
    <div className="min-w-[58px] rounded-lg bg-[#fffbf2] px-2 py-1.5 text-center">
      <p className="text-sm font-bold leading-tight text-brown">{count}</p>
      <p className="text-[10px] leading-tight text-text-muted">{label}</p>
    </div>
  );
}
