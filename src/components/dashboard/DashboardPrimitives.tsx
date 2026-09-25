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
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 34;
  const cx = 46;
  const cy = 46;
  const d = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <svg
        width="92"
        height="56"
        viewBox="0 0 92 56"
        className="shrink-0 overflow-visible"
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          stroke="#E8E4DC"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - clamped}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#67554D"
          style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
        >
          {clamped}%
        </text>
      </svg>
      <span className="mt-1 font-sans text-[12px] font-medium leading-4 text-[#67554D]">
        {label}
      </span>
      <span className="mt-0.5 font-sans text-[14px] font-semibold leading-none text-[#BE880B]">
        {count}
      </span>
    </div>
  );
}
