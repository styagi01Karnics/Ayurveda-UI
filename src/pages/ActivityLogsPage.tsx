import { useMemo, useState } from 'react';
import { ActivityLogTable } from '@/components/activity-logs/ActivityLogTable';
import { PageShell } from '@/components/layout/PageShell';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { activityLogs } from '@/data/mock/activity-logs';

export function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activityLogs;
    return activityLogs.filter((log) =>
      [log.page, log.action, log.target, log.timestamp]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery]);

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
        <ActivityLogTable embedded records={filteredLogs} />
      </ListPanel>
    </PageShell>
  );
}
