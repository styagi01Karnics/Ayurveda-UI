import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface PatientTrendsChartProps {
  data: { month: string; newPatients: number; followUps: number }[];
  onExpand?: () => void;
  compact?: boolean;
}

export function PatientTrendsChart({
  data,
  onExpand,
  compact = false,
}: PatientTrendsChartProps) {
  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            New Patients
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" />
            Follow Ups
          </span>
        </div>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="rounded p-1 text-text-muted hover:bg-brown/5"
            aria-label="Expand chart"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className={compact ? 'h-48' : 'h-64'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #eee',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="newPatients"
              stroke="#2d8a5b"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2d8a5b' }}
              name="New Patients"
            />
            <Line
              type="monotone"
              dataKey="followUps"
              stroke="#c5a059"
              strokeWidth={2}
              dot={{ r: 3, fill: '#c5a059' }}
              name="Follow Ups"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
