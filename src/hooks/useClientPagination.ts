import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/components/ui/Pagination';

export interface UseClientPaginationResult<T> {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  pageItems: T[];
  resetPage: () => void;
}

/** Client-side pagination over an already-loaded / filtered list. */
export function useClientPagination<T>(
  items: T[],
  pageSize: number = DEFAULT_PAGE_SIZE,
): UseClientPaginationResult<T> {
  const [page, setPage] = useState(0);
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize) || 1);

  const resetPage = useCallback(() => setPage(0), []);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const pageItems = useMemo(
    () => items.slice(page * pageSize, page * pageSize + pageSize),
    [items, page, pageSize],
  );

  return {
    page,
    setPage,
    pageSize,
    totalPages,
    totalElements,
    pageItems,
    resetPage,
  };
}

export function buildPageQuery(
  page = 0,
  size: number = DEFAULT_PAGE_SIZE,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', String(Math.max(0, page)));
  params.set('size', String(Math.max(1, size)));
  return params;
}
