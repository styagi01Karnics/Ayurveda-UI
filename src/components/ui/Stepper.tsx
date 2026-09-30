import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: { id: number; label: string }[];
  currentStep: number;
  variant?: 'stacked' | 'inline';
}

export function Stepper({
  steps,
  currentStep,
  variant = 'stacked',
}: StepperProps) {
  if (variant === 'inline') {
    return (
      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        {steps.map((step, index) => {
          const isReached = currentStep >= step.id;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isReached
                      ? 'bg-gold text-white'
                      : 'border border-gray-300 bg-white text-text-muted',
                  )}
                >
                  {step.id}
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-medium',
                    isReached ? 'text-gold' : 'text-text-muted',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden h-px w-8 bg-gray-200 sm:block sm:w-12" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mb-8 flex items-center justify-between gap-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                  isCompleted && 'bg-gold text-white',
                  isActive && 'bg-gold text-white',
                  !isCompleted && !isActive && 'bg-gray-100 text-text-muted',
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden text-center text-xs font-medium sm:block',
                  isActive || isCompleted ? 'text-gold' : 'text-text-muted',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1',
                  currentStep > step.id ? 'bg-gold' : 'bg-gray-200',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
