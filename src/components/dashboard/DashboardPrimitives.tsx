import { ChevronDown } from 'lucide-react';

export function PeriodDropdown() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg border border-[#e8e0d4] bg-white px-2.5 py-1 text-xs text-text-muted"
    >
      Monthly
      <ChevronDown className="h-3 w-3" />
    </button>
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
