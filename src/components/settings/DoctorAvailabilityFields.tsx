import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  DOCTOR_AVAILABILITY_DAY_OPTIONS,
  type DoctorAvailabilityDay,
} from '@/lib/doctorAvailability';

interface DoctorAvailabilityFieldsProps {
  selectedDays: DoctorAvailabilityDay[];
  onDaysChange: (days: DoctorAvailabilityDay[]) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  daysError?: string;
  startTimeError?: string;
  endTimeError?: string;
  compact?: boolean;
}

export function DoctorAvailabilityFields({
  selectedDays,
  onDaysChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  daysError,
  startTimeError,
  endTimeError,
  compact = false,
}: DoctorAvailabilityFieldsProps) {
  const toggleDay = (day: DoctorAvailabilityDay) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((value) => value !== day));
      return;
    }
    onDaysChange([...selectedDays, day]);
  };

  return (
    <div className={cn('space-y-2', compact ? 'min-w-[200px]' : 'min-w-[240px]')}>
      <div className="flex flex-wrap gap-1.5">
        {DOCTOR_AVAILABILITY_DAY_OPTIONS.map((option) => {
          const active = selectedDays.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleDay(option.value)}
              className={cn(
                'rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-gold bg-gold/15 text-brown'
                  : 'border-gray-200 bg-white text-text-muted hover:border-gold/40',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label={compact ? undefined : 'From'}
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          error={startTimeError}
        />
        <Input
          label={compact ? undefined : 'To'}
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          error={endTimeError}
        />
      </div>
      {daysError && <p className="text-xs text-danger">{daysError}</p>}
    </div>
  );
}
