import { useMemo, useState } from 'react';
import { ActivityLogTable } from '@/components/activity-logs/ActivityLogTable';
import { PageShell } from '@/components/layout/PageShell';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getActivityLogs } from '@/lib/api/activityLogs';
import { mapActivityLogDtoToRecord } from '@/lib/api/mappers';
import type { ActivityLogRecord } from '@/types';

export function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: logs, loading, error, reload } = useAsyncData(
    async () => {
      const rows = await getActivityLogs({
        search: searchQuery.trim() || undefined,
      });
      return rows.map(mapActivityLogDtoToRecord);
    },
    [] as ActivityLogRecord[],
    [searchQuery],
  );

  const filteredLogs = useMemo(() => logs, [logs]);

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
          empty={!loading && !error && filteredLogs.length === 0}
          emptyMessage="No activity logs found."
        >
          <ActivityLogTable embedded records={filteredLogs} />
        </AsyncStatus>
      </ListPanel>
    </PageShell>
  );
}
