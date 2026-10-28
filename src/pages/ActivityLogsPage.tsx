import { useEffect, useState } from 'react';
import { ActivityLogTable } from '@/components/activity-logs/ActivityLogTable';
import { PageShell } from '@/components/layout/PageShell';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Pagination } from '@/components/ui/Pagination';
import { SearchField } from '@/components/ui/SearchField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useClientPagination } from '@/hooks/useClientPagination';
import { getActivityLogs } from '@/lib/api/activityLogs';
import { mapActivityLogDtoToRecord } from '@/lib/api/mappers';
import type { ActivityLogRecord } from '@/types';

export function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: logs, loading, error, reload } = useAsyncData(
    async () => {
      const rows = await getActivityLogs({
        search: searchQuery.trim() || undefined,
        page: 0,
        size: 100,
      });
      return rows.map(mapActivityLogDtoToRecord);
    },
    [] as ActivityLogRecord[],
    [searchQuery],
  );

  const {
    page,
    setPage,
    pageSize,
    totalPages,
    totalElements,
    pageItems,
    resetPage,
  } = useClientPagination(logs);

  useEffect(() => {
    resetPage();
  }, [searchQuery, resetPage]);

  return (
    <PageShell>
      <ListPanel
        filters={
          <FilterControl>
            <SearchField
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterControl>
        }
      >
        <AsyncStatus
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && !error && logs.length === 0}
          emptyMessage="No activity logs found."
        >
          <ActivityLogTable embedded records={pageItems} />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
            disabled={loading}
          />
        </AsyncStatus>
      </ListPanel>
    </PageShell>
  );
}
