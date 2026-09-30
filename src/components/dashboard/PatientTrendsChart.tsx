import {
  Bar,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendPoint {
  month: string;
  newPatients: number;
  followUps: number;
}

interface PatientTrendsChartProps {
  data: TrendPoint[];
  onExpand?: () => void;
  compact?: boolean;
  className?: string;
}

function niceYMax(data: TrendPoint[]) {
  const peak = Math.max(
    0,
    ...data.flatMap((point) => [point.newPatients, point.followUps]),
  );
  if (peak <= 200) return 200;
  if (peak <= 400) return 400;
  if (peak <= 600) return 600;
  return Math.ceil(peak / 200) * 200;
}

function yTicks(max: number) {
  const step = max <= 200 ? 50 : max <= 400 ? 100 : 200;
  const ticks: number[] = [];
  for (let value = 0; value <= max; value += step) ticks.push(value);
  return ticks;
}

export function PatientTrendsChart({
  data,
  onExpand,
  compact = false,
  className,
}: PatientTrendsChartProps) {
  const yMax = niceYMax(data);
  const ticks = yTicks(yMax);
  const chartData = data.map((point) => ({
    ...point,
    decor: yMax,
  }));

  return (
    <div className={cn('flex min-h-0 min-w-0 flex-col', className)}>
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div className="flex gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[#2E7D32]" />
            New Patients
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-[#e8943a]" />
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

      <div className={cn('min-h-0 w-full', compact ? 'min-h-[220px] flex-1' : 'h-80')}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 4, left: 4, bottom: 0 }}
            barCategoryGap={compact ? 2 : 6}
            barGap={1}
          >
            <defs>
              <linearGradient id="patientDecorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFEF7" />
                <stop offset="100%" stopColor="#FBF7EE" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#67554d' }}
              axisLine={false}
              tickLine={false}
              dy={4}
            />
            <YAxis
              domain={[0, yMax]}
              ticks={ticks}
              tick={{ fontSize: 11, fill: '#67554d' }}
              axisLine={false}
              tickLine
              tickSize={4}
              width={36}
              tickMargin={6}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'decor') return [null, null];
                return [value, name];
              }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e8e0d4',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(66,44,35,0.06)',
              }}
            />
            <Bar
              dataKey="decor"
              fill="url(#patientDecorBar)"
              radius={[6, 6, 0, 0]}
              barSize={compact ? 120 : 48}
              tooltipType="none"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="newPatients"
              stroke="#2E7D32"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#2E7D32', stroke: '#fff', strokeWidth: 2 }}
              name="New Patients"
              isAnimationActive={false}
            >
              <LabelList
                dataKey="newPatients"
                content={({ x, y, index, value }) => {
                  const month = data[index ?? -1]?.month;
                  if (month !== 'Oct' || x == null || y == null) return null;
                  return (
                    <g>
                      <rect
                        x={Number(x) - 78}
                        y={Number(y) - 28}
                        width={156}
                        height={20}
                        rx={4}
                        fill="white"
                        stroke="#e8e0d4"
                      />
                      <text
                        x={Number(x)}
                        y={Number(y) - 14}
                        textAnchor="middle"
                        fill="#3d8f5a"
                        fontSize={10}
                        fontWeight={500}
                      >
                        {value}: New Patients in October
                      </text>
                    </g>
                  );
                }}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="followUps"
              stroke="#BE880B"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#BE880B', stroke: '#fff', strokeWidth: 2 }}
              name="Follow Ups"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
