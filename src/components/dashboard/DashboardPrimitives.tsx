import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { BillingPeriod } from '@/lib/api/billing';
import { cn } from '@/lib/utils';

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = DASHBOARD_PERIOD_OPTIONS.find((option) => option.value === value);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Select period"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#EFF0F6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#422C23]"
      >
        {selected?.label ?? 'Monthly'}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <ul
          className="absolute right-0 z-20 mt-1 min-w-[132px] overflow-hidden rounded-lg border border-[#EFF0F6] bg-white py-1.5 shadow-[0_0_3px_1px_#BE880B26]"
          role="listbox"
        >
          {DASHBOARD_PERIOD_OPTIONS.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={cn(
                  'w-full px-4 py-2.5 text-left text-xs font-semibold',
                  option.value === value
                    ? 'bg-[#422C23] text-white'
                    : 'text-[#422C23] hover:bg-[#FBF6E8]',
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
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
      <svg width="80" height="48" viewBox="0 0 80 48" aria-hidden>
        <path
          d="M 10 42 A 28 28 0 0 1 70 42"
          fill="none"
          stroke="#ebe4d8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 10 42 A 28 28 0 0 1 70 42"
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
        />
        <text
          x="40"
          y="40"
          textAnchor="middle"
          fill="#67554d"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          {percent}%
        </text>
      </svg>
      <span className="mt-1.5 font-sans text-[11px] text-[#67554d]">{label}</span>
      <span className="font-sans text-sm font-semibold text-[#BE880B]">{count}</span>
    </div>
  );
}
