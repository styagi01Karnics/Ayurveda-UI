import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CalendarDays, Plus, Search, Edit2, Trash2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { appointmentsApi, patientsApi, doctorsApi } from '../services/api';
import { Appointment, Patient, Doctor } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { format } from 'date-fns';

const VISIT_TYPES = ['CONSULTATION', 'FOLLOW_UP', 'TREATMENT', 'PANCHAKARMA'];
const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'FOLLOW_UP'];

const schema = Yup.object({
  patientId: Yup.number().required('Patient is required'),
  doctorId: Yup.number().optional().nullable(),
  appointmentDate: Yup.string().required('Date & time is required'),
  visitType: Yup.string().oneOf(VISIT_TYPES).required('Visit type is required'),
  status: Yup.string().oneOf(STATUSES).required(),
  chiefComplaint: Yup.string().required('Chief complaint is required'),
  notes: Yup.string().optional(),
});

const initVal = {
  patientId: '', doctorId: '', appointmentDate: '', visitType: 'CONSULTATION',
  status: 'PENDING', chiefComplaint: '', notes: '',
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; badgeClass: string }> = {
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, badgeClass: 'badge-green' },
  PENDING: { label: 'Pending', icon: Clock, badgeClass: 'badge-yellow' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, badgeClass: 'badge-blue' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, badgeClass: 'badge-red' },
  FOLLOW_UP: { label: 'Follow Up', icon: AlertCircle, badgeClass: 'badge-purple' },
};

const mockAppointments: Appointment[] = [
  { id: 1, patientId: 1, patientName: 'Priya Sharma', doctorId: 1, doctorName: 'Dr. Arjun Sharma', appointmentDate: '2024-04-25T09:00:00', visitType: 'CONSULTATION', status: 'CONFIRMED', chiefComplaint: 'Chronic fatigue and joint pain' },
  { id: 2, patientId: 2, patientName: 'Rahul Verma', doctorId: 2, doctorName: 'Dr. Meena Verma', appointmentDate: '2024-04-25T10:30:00', visitType: 'PANCHAKARMA', status: 'PENDING', chiefComplaint: 'Digestive issues, bloating' },
  { id: 3, patientId: 3, patientName: 'Sunita Patel', doctorId: 1, doctorName: 'Dr. Arjun Sharma', appointmentDate: '2024-04-25T11:00:00', visitType: 'FOLLOW_UP', status: 'CONFIRMED', chiefComplaint: 'Follow-up for skin treatment' },
  { id: 4, patientId: 4, patientName: 'Amit Kumar', doctorId: 2, doctorName: 'Dr. Meena Verma', appointmentDate: '2024-04-24T14:00:00', visitType: 'TREATMENT', status: 'COMPLETED', chiefComplaint: 'Hypertension management' },
  { id: 5, patientId: 5, patientName: 'Kavya Nair', doctorId: 1, doctorName: 'Dr. Arjun Sharma', appointmentDate: '2024-04-24T15:30:00', visitType: 'CONSULTATION', status: 'CANCELLED', chiefComplaint: 'Anxiety and stress' },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      appointmentsApi.getAll(page).catch(() => ({ data: null })),
      patientsApi.getAll(0, 100).catch(() => ({ data: null })),
      doctorsApi.getAll(0, 100).catch(() => ({ data: null })),
    ]).then(([aRes, pRes, dRes]) => {
      const aData = aRes.data;
      if (aData?.content) {
        setAppointments(aData.content);
        setTotalPages(aData.totalPages);
        setTotalElements(aData.totalElements);
      } else if (Array.isArray(aData)) {
        setAppointments(aData);
      } else {
        setAppointments(mockAppointments);
        setTotalElements(mockAppointments.length);
      }
      const pData = pRes.data;
      setPatients(pData?.content ?? (Array.isArray(pData) ? pData : []));
      const dData = dRes.data;
      setDoctors(dData?.content ?? (Array.isArray(dData) ? dData : []));
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = appointments.filter((a) => {
    const matchSearch = !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      a.chiefComplaint?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formik = useFormik({
    initialValues: initVal,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        if (editing) { await appointmentsApi.update(editing.id, values); }
        else { await appointmentsApi.create(values); }
        resetForm();
        setModalOpen(false);
        setEditing(null);
        fetchAll();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setSubmitError(e?.response?.data?.message || 'Failed to save');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openAdd = () => {
    setEditing(null);
    formik.resetForm({ values: initVal });
    setSubmitError('');
    setModalOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditing(a);
    formik.resetForm({
      values: {
        patientId: a.patientId.toString(), doctorId: a.doctorId?.toString() ?? '',
        appointmentDate: a.appointmentDate?.slice(0, 16) ?? '',
        visitType: a.visitType, status: a.status,
        chiefComplaint: a.chiefComplaint ?? '', notes: a.notes ?? '',
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await appointmentsApi.delete(deleteTarget.id); setDeleteTarget(null); fetchAll(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#EDE5D0' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Appointments</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>{totalElements} total appointments</p>
        </div>
        <button onClick={openAdd} className="btn-gold"><Plus size={17} />Book Appointment</button>
      </div>

      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search appointments..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select-field w-40">
          <option value="ALL">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<CalendarDays size={28} />} title="No appointments found"
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Book Appointment</button>} />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EDE5D0' }}>
                    <th className="th">Patient</th>
                    <th className="th">Doctor</th>
                    <th className="th">Date & Time</th>
                    <th className="th">Visit Type</th>
                    <th className="th">Chief Complaint</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt) => {
                    const cfg = statusConfig[apt.status] || statusConfig['PENDING'];
                    return (
                      <tr key={apt.id} className="tr">
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                 style={{ background: '#B8860B' }}>
                              {apt.patientName?.charAt(0)}
                            </div>
                            <span className="font-medium text-sm" style={{ color: '#2D1B00' }}>{apt.patientName}</span>
                          </div>
                        </td>
                        <td className="td text-sm" style={{ color: '#6B4C1E' }}>{apt.doctorName || '—'}</td>
                        <td className="td">
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#2D1B00' }}>
                              {format(new Date(apt.appointmentDate), 'dd MMM yyyy')}
                            </p>
                            <p className="text-xs" style={{ color: '#9C7040' }}>
                              {format(new Date(apt.appointmentDate), 'hh:mm a')}
                            </p>
                          </div>
                        </td>
                        <td className="td">
                          <span className="badge badge-gold text-xs">
                            {apt.visitType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="td">
                          <p className="text-sm truncate max-w-[180px]" style={{ color: '#6B4C1E' }}>
                            {apt.chiefComplaint || '—'}
                          </p>
                        </td>
                        <td className="td">
                          <span className={`badge text-xs ${cfg.badgeClass}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(apt)} className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors" title="Edit">
                              <Edit2 size={15} style={{ color: '#B8860B' }} />
                            </button>
                            <button onClick={() => setDeleteTarget(apt)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 size={15} style={{ color: '#dc2626' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={20} onPageChange={setPage} />
            )}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
             title={editing ? 'Edit Appointment' : 'Book Appointment'} size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {submitError && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{submitError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Patient *</label>
              <select name="patientId" value={formik.values.patientId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`select-field ${formik.touched.patientId && formik.errors.patientId ? 'error' : ''}`}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
              {formik.touched.patientId && formik.errors.patientId && <p className="error-msg">{formik.errors.patientId}</p>}
            </div>
            <div>
              <label className="label">Doctor</label>
              <select name="doctorId" value={formik.values.doctorId} onChange={formik.handleChange} onBlur={formik.handleBlur} className="select-field">
                <option value="">Select doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Appointment Date & Time *</label>
              <input type="datetime-local" name="appointmentDate"
                value={formik.values.appointmentDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.appointmentDate && formik.errors.appointmentDate ? 'error' : ''}`} />
              {formik.touched.appointmentDate && formik.errors.appointmentDate && (
                <p className="error-msg">{formik.errors.appointmentDate}</p>
              )}
            </div>
            <div>
              <label className="label">Visit Type *</label>
              <select name="visitType" value={formik.values.visitType} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`select-field ${formik.touched.visitType && formik.errors.visitType ? 'error' : ''}`}>
                {VISIT_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              {formik.touched.visitType && formik.errors.visitType && <p className="error-msg">{formik.errors.visitType}</p>}
            </div>
            <div>
              <label className="label">Status *</label>
              <select name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur} className="select-field">
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Chief Complaint *</label>
              <input type="text" name="chiefComplaint" placeholder="Patient's main concern"
                value={formik.values.chiefComplaint} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.chiefComplaint && formik.errors.chiefComplaint ? 'error' : ''}`} />
              {formik.touched.chiefComplaint && formik.errors.chiefComplaint && (
                <p className="error-msg">{formik.errors.chiefComplaint}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" placeholder="Additional notes" value={formik.values.notes}
                onChange={formik.handleChange} onBlur={formik.handleBlur} rows={2}
                className="input-field resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Cancel Appointment" message={`Cancel appointment for "${deleteTarget?.patientName}"?`} loading={deleting} confirmLabel="Cancel Appointment" />
    </div>
  );
}
