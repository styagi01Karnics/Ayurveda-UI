import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Users, Pill, Receipt, CalendarDays, Settings, UserRound } from 'lucide-react';
import { activityLogsApi } from '../services/api';
import { ActivityLog } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { format } from 'date-fns';

const entityIcons: Record<string, React.ElementType> = {
  PATIENT: Users, MEDICINE: Pill, BILL: Receipt,
  APPOINTMENT: CalendarDays, DOCTOR: UserRound, SETTINGS: Settings, DEFAULT: ClipboardList,
};

const entityColors: Record<string, string> = {
  PATIENT: '#4A7C4E', MEDICINE: '#B8860B', BILL: '#1e40af',
  APPOINTMENT: '#6B4C1E', DOCTOR: '#5b21b6', DEFAULT: '#9C7040',
};

const actionColors: Record<string, { badge: string }> = {
  CREATE: { badge: 'badge-green' },
  UPDATE: { badge: 'badge-blue' },
  DELETE: { badge: 'badge-red' },
  LOGIN: { badge: 'badge-gold' },
  LOGOUT: { badge: 'badge-gray' },
  VIEW: { badge: 'badge-purple' },
};

const mockLogs: ActivityLog[] = [
  { id: 1, userName: 'Dr. Arjun Sharma', action: 'CREATE', entity: 'PATIENT', entityId: 5, details: 'Added new patient: Kavya Nair (GAN-005)', createdAt: '2024-04-25T09:15:00' },
  { id: 2, userName: 'Admin', action: 'UPDATE', entity: 'MEDICINE', entityId: 2, details: 'Updated stock for Ashwagandha Tablet: qty changed from 5 to 8', createdAt: '2024-04-25T09:00:00' },
  { id: 3, userName: 'Dr. Meena Verma', action: 'CREATE', entity: 'APPOINTMENT', entityId: 2, details: 'Booked Panchakarma appointment for Rahul Verma', createdAt: '2024-04-24T17:30:00' },
  { id: 4, userName: 'Admin', action: 'CREATE', entity: 'BILL', entityId: 5, details: 'Generated bill BILL-005 for ₹6,500 — Kavya Nair', createdAt: '2024-04-24T16:45:00' },
  { id: 5, userName: 'Dr. Arjun Sharma', action: 'UPDATE', entity: 'APPOINTMENT', entityId: 4, details: 'Marked appointment as COMPLETED for Amit Kumar', createdAt: '2024-04-24T15:00:00' },
  { id: 6, userName: 'Admin', action: 'DELETE', entity: 'MEDICINE', entityId: 7, details: 'Removed expired medicine: Shatavari Syrup (B007)', createdAt: '2024-04-24T11:20:00' },
  { id: 7, userName: 'Admin', action: 'LOGIN', entity: 'SETTINGS', details: 'Admin logged in from 192.168.1.100', createdAt: '2024-04-24T08:55:00' },
  { id: 8, userName: 'Dr. Meena Verma', action: 'UPDATE', entity: 'PATIENT', entityId: 3, details: 'Updated dosha for Sunita Patel: Vata → Kapha', createdAt: '2024-04-23T14:30:00' },
  { id: 9, userName: 'Admin', action: 'CREATE', entity: 'DOCTOR', entityId: 3, details: 'Added new doctor: Dr. Ravi Patel (Skin & Cosmetology)', createdAt: '2024-04-23T10:00:00' },
  { id: 10, userName: 'Dr. Arjun Sharma', action: 'UPDATE', entity: 'BILL', entityId: 2, details: 'Updated bill BILL-002: payment received ₹4,000 via CASH', createdAt: '2024-04-22T16:00:00' },
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    activityLogsApi.getAll()
      .then((res) => {
        const d = res.data;
        setLogs(d?.content ?? (Array.isArray(d) ? d : mockLogs));
      })
      .catch(() => setLogs(mockLogs))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const matchSearch = !search ||
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.entity?.toLowerCase().includes(search.toLowerCase());
    const matchEntity = filterEntity === 'ALL' || log.entity === filterEntity;
    const matchAction = filterAction === 'ALL' || log.action === filterAction;
    return matchSearch && matchEntity && matchAction;
  });

  const uniqueEntities = Array.from(new Set(logs.map((l) => l.entity)));
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#EDE5D0' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Activity Logs</h1>
        <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>Track all system activities and changes</p>
      </div>

      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search logs..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)} className="select-field w-40">
          <option value="ALL">All Entities</option>
          {uniqueEntities.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="select-field w-36">
          <option value="ALL">All Actions</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<ClipboardList size={28} />} title="No activity logs found" description="Activity will appear here as users interact with the system" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((log) => {
              const EntityIcon = entityIcons[log.entity] || entityIcons['DEFAULT'];
              const entityColor = entityColors[log.entity] || entityColors['DEFAULT'];
              const actionCfg = actionColors[log.action] || { badge: 'badge-gray' };

              return (
                <div key={log.id} className="card p-4 hover:shadow-md transition-shadow fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background: entityColor + '20' }}>
                      <EntityIcon size={18} style={{ color: entityColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ color: '#2D1B00' }}>{log.userName}</span>
                        <span className={`badge text-xs ${actionCfg.badge}`}>{log.action}</span>
                        <span className="badge badge-gray text-xs">{log.entity}</span>
                        {log.entityId && (
                          <span className="text-xs" style={{ color: '#9C7040' }}>#{log.entityId}</span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#6B4C1E' }}>{log.details}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-medium" style={{ color: '#9C7040' }}>
                        {format(new Date(log.createdAt), 'dd MMM yyyy')}
                      </p>
                      <p className="text-xs" style={{ color: '#9C7040' }}>
                        {format(new Date(log.createdAt), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
