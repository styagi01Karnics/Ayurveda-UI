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
        className="appearance-none cursor-pointer bg-transparent py-0.5 pl-0 pr-5 text-xs font-medium text-text-muted focus:outline-none"
      >
        {DASHBOARD_PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
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
  const radius = 28;
  const arcLength = Math.PI * radius;
  const offset = arcLength * (1 - Math.min(100, Math.max(0, percent)) / 100);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <svg width="78" height="48" viewBox="0 0 78 48" aria-hidden>
        <path
          d="M 11 42 A 28 28 0 0 1 67 42"
          fill="none"
          stroke="#ebe4d8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 11 42 A 28 28 0 0 1 67 42"
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
        />
        <text
          x="39"
          y="38"
          textAnchor="middle"
          fill="#67554d"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          {percent}%
        </text>
      </svg>
      <span className="mt-0.5 text-[11px] text-text-muted">{label}</span>
      <span className="text-xs font-semibold text-gold">{count}</span>
    </div>
  );
}
