import { DataTableShell } from '@/components/ui/DataTableShell';
import type { ActivityLogRecord } from '@/types';

interface ActivityLogTableProps {
  records: ActivityLogRecord[];
  embedded?: boolean;
}

export function ActivityLogTable({ records, embedded }: ActivityLogTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
            <th className="px-5 py-3 font-medium">Page</th>
            <th className="px-5 py-3 font-medium">Action</th>
            <th className="px-5 py-3 font-medium">Target</th>
            <th className="px-5 py-3 font-medium">Before</th>
            <th className="px-5 py-3 font-medium">After</th>
            <th className="px-5 py-3 font-medium">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                No activity logs found matching your search.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4 text-brown">{record.page}</td>
                <td className="px-5 py-4 text-brown">{record.action}</td>
                <td className="px-5 py-4 text-brown">{record.target}</td>
                <td className="px-5 py-4 text-text-muted">{record.before}</td>
                <td className="px-5 py-4 text-text-muted">{record.after}</td>
                <td className="px-5 py-4 text-text-muted">{record.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </DataTableShell>
  );
}
