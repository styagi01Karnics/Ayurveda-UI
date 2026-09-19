import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationProps {
  /** 0-based page index */
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  className,
  disabled = false,
}: PaginationProps) {
  if (totalElements <= 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const current = Math.min(Math.max(0, page), safeTotalPages - 1);
  const from = current * pageSize + 1;
  const to = Math.min(totalElements, (current + 1) * pageSize);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:px-5',
        className,
      )}
    >
      <p className="text-xs text-text-muted sm:text-sm">
        Showing {from}–{to} of {totalElements}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="px-3 py-1.5 text-xs"
          disabled={disabled || current <= 0}
          onClick={() => onPageChange(current - 1)}
        >
          Previous
        </Button>
        <span className="min-w-[5.5rem] text-center text-xs text-brown sm:text-sm">
          Page {current + 1} of {safeTotalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          className="px-3 py-1.5 text-xs"
          disabled={disabled || current >= safeTotalPages - 1}
          onClick={() => onPageChange(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
