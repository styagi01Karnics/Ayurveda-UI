import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#EDE5D0' }}>
      <span className="text-sm" style={{ color: '#9C7040' }}>
        Showing {start}–{end} of {totalElements}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg border disabled:opacity-40 transition-colors hover:bg-gray-50"
          style={{ borderColor: '#EDE5D0' }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let p = i;
          if (totalPages > 5) {
            if (page > 2) p = page - 2 + i;
            if (page > totalPages - 3) p = totalPages - 5 + i;
          }
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: p === page ? '#B8860B' : 'transparent',
                color: p === page ? 'white' : '#6B4C1E',
              }}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg border disabled:opacity-40 transition-colors hover:bg-gray-50"
          style={{ borderColor: '#EDE5D0' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
