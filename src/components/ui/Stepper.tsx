import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: { id: number; label: string }[];
  currentStep: number;
}

/** Evenly spaced progress steps (works for 2–6+ steps without skewing connectors). */
export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-8 w-full">
      <div className="flex w-full items-start">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={cn('flex min-w-0 items-start', isLast ? 'flex-none' : 'flex-1')}
            >
              <div className="flex w-[7.5rem] shrink-0 flex-col items-center gap-2 sm:w-32">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                    (isCompleted || isActive) && 'bg-gold text-white',
                    !isCompleted && !isActive && 'bg-[#f0ebe3] text-text-muted',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    'hidden text-center text-xs font-medium leading-snug sm:block',
                    isActive || isCompleted ? 'text-gold' : 'text-text-muted',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mt-4 h-0.5 min-w-[12px] flex-1',
                    currentStep > step.id ? 'bg-gold' : 'bg-[#e8dfd0]',
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
