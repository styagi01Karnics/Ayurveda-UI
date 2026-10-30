import { Input } from '@/components/ui/Input';
import { FieldLabel } from '@/components/ui/FieldLabel';
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
}: DoctorAvailabilityFieldsProps) {
  const toggleDay = (day: DoctorAvailabilityDay) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((value) => value !== day));
      return;
    }
    onDaysChange([...selectedDays, day]);
  };

  return (
    <div className="min-w-0 space-y-2">
      <FieldLabel as="span" label="Availability" className="field-label" />
      <div className="flex flex-wrap items-end gap-4">
        <div
          role="group"
          aria-label="Available days"
          className="inline-flex rounded-lg border border-[#EFF0F6] bg-white p-1"
        >
          {DOCTOR_AVAILABILITY_DAY_OPTIONS.map((option) => {
            const active = selectedDays.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleDay(option.value)}
                className={cn(
                  'rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                  active
                    ? 'bg-[#FAF4E5] text-brown ring-1 ring-[#E8D5A8]'
                    : 'text-text-muted hover:bg-[#FAF9F5] hover:text-brown',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-[138px] shrink-0">
            <Input
              label="From"
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              error={startTimeError}
            />
          </div>
          <span className="mb-2.5 text-sm text-[#838A9A]" aria-hidden>
            –
          </span>
          <div className="w-[138px] shrink-0">
            <Input
              label="To"
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              error={endTimeError}
            />
          </div>
        </div>
      </div>
      {daysError ? <p className="text-xs text-danger">{daysError}</p> : null}
    </div>
  );
}
