import {
  Area,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface PatientTrendsChartProps {
  data: { month: string; newPatients: number; followUps: number }[];
  onExpand?: () => void;
  compact?: boolean;
  embedded?: boolean;
}

export function PatientTrendsChart({
  data,
  onExpand,
  compact = false,
  embedded = false,
}: PatientTrendsChartProps) {
  const body = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-success" />
            New Patients
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-gold" />
            Follow Ups
          </span>
        </div>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="rounded-full bg-[#f3e8d4] p-1.5 text-text-muted hover:bg-gold/20"
            aria-label="Expand chart"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div
        className={cn(
          'chart-wrap w-full overflow-hidden',
          embedded ? 'min-h-[180px] flex-1' : compact ? 'h-[220px]' : 'h-64',
        )}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={data}
            margin={{ top: 36, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="patientChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#be880b" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#be880b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#ebe4d8"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#67554d' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              tick={{ fontSize: 11, fill: '#67554d' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e8e0d4',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(66,44,35,0.06)',
              }}
            />
            <Area
              type="natural"
              dataKey="newPatients"
              stroke="none"
              fill="url(#patientChartFill)"
              isAnimationActive={false}
            />
            <Line
              type="natural"
              dataKey="newPatients"
              stroke="#3d8f5a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3d8f5a', stroke: '#fff', strokeWidth: 2 }}
              name="New Patients"
              isAnimationActive={false}
            >
              <LabelList
                dataKey="newPatients"
                content={({ x, y, index, value }) => {
                  if (index !== 1 || x == null || y == null) return null;
                  const month = data[1]?.month ?? '';
                  const count = Number(value ?? 0);
                  const label = `${count}+ New${month ? ` · ${month}` : ''}`;
                  return (
                    <text
                      x={Number(x)}
                      y={Number(y) - 12}
                      textAnchor="middle"
                      fill="#3d8f5a"
                      fontSize={10}
                      fontWeight={600}
                    >
                      {label}
                    </text>
                  );
                }}
              />
            </Line>
            <Line
              type="natural"
              dataKey="followUps"
              stroke="#e8943a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#e8943a', stroke: '#fff', strokeWidth: 2 }}
              name="Follow Ups"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  if (embedded) {
    return <div className="flex min-h-0 min-w-0 flex-1 flex-col">{body}</div>;
  }

  return (
    <Card className="dashboard-card flex h-full w-full min-w-0 flex-col overflow-hidden p-5">
      {body}
    </Card>
  );
}
