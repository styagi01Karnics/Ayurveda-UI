import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Stethoscope, Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { treatmentsApi, patientsApi, doctorsApi } from '../services/api';
import { Treatment, Patient, Doctor } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { format } from 'date-fns';

const TREATMENT_TYPES = [
  'Panchakarma', 'Abhyanga', 'Shirodhara', 'Nasya', 'Basti', 'Virechana', 'Vamana',
  'Raktamokshana', 'Kativasti', 'Janu Basti', 'Netra Tarpana', 'Greeva Basti', 'Other'
];

const schema = Yup.object({
  patientId: Yup.number().required('Patient is required'),
  doctorId: Yup.number().optional().nullable(),
  treatmentType: Yup.string().required('Treatment type is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().optional(),
  status: Yup.string().oneOf(['ONGOING', 'COMPLETED', 'PAUSED']).required(),
  description: Yup.string().optional(),
  medicines: Yup.string().optional(),
  notes: Yup.string().optional(),
});

const initVal = {
  patientId: '', doctorId: '', treatmentType: '', startDate: '', endDate: '',
  status: 'ONGOING', description: '', medicines: '', notes: '',
};

const mockTreatments: Treatment[] = [
  { id: 1, patientId: 1, patientName: 'Priya Sharma', doctorId: 1, doctorName: 'Dr. Arjun Sharma', treatmentType: 'Panchakarma', startDate: '2024-04-01', endDate: '2024-04-21', status: 'ONGOING', description: 'Full Panchakarma detox program', medicines: 'Triphala, Ashwagandha, Brahmi', notes: '21-day detox program' },
  { id: 2, patientId: 2, patientName: 'Rahul Verma', doctorId: 2, doctorName: 'Dr. Meena Verma', treatmentType: 'Shirodhara', startDate: '2024-04-10', status: 'ONGOING', description: 'Stress and anxiety management', medicines: 'Brahmi oil, Shankhpushpi' },
  { id: 3, patientId: 3, patientName: 'Sunita Patel', doctorId: 1, doctorName: 'Dr. Arjun Sharma', treatmentType: 'Abhyanga', startDate: '2024-03-15', endDate: '2024-04-15', status: 'COMPLETED', description: 'Full body oil massage therapy', medicines: 'Sesame oil, Dhanvantaram Taila' },
];

const statusBadge: Record<string, string> = {
  ONGOING: 'badge-blue', COMPLETED: 'badge-green', PAUSED: 'badge-yellow',
};

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Treatment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      treatmentsApi.getAll().catch(() => ({ data: null })),
      patientsApi.getAll(0, 100).catch(() => ({ data: null })),
      doctorsApi.getAll(0, 100).catch(() => ({ data: null })),
    ]).then(([tRes, pRes, dRes]) => {
      const tData = tRes.data;
      setTreatments(tData?.content ?? (Array.isArray(tData) ? tData : mockTreatments));
      const pData = pRes.data;
      setPatients(pData?.content ?? (Array.isArray(pData) ? pData : []));
      const dData = dRes.data;
      setDoctors(dData?.content ?? (Array.isArray(dData) ? dData : []));
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = treatments.filter((t) => {
    const matchSearch = !search ||
      t.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      t.treatmentType?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formik = useFormik({
    initialValues: initVal,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        if (editing) { await treatmentsApi.update(editing.id, values); }
        else { await treatmentsApi.create(values); }
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

  const openEdit = (t: Treatment) => {
    setEditing(t);
    formik.resetForm({
      values: {
        patientId: t.patientId.toString(), doctorId: t.doctorId?.toString() ?? '',
        treatmentType: t.treatmentType, startDate: t.startDate?.slice(0, 10) ?? '',
        endDate: t.endDate?.slice(0, 10) ?? '', status: t.status,
        description: t.description ?? '', medicines: t.medicines ?? '', notes: t.notes ?? '',
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await treatmentsApi.delete(deleteTarget.id); setDeleteTarget(null); fetchAll(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#EDE5D0' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Treatments</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>{treatments.length} treatment records</p>
        </div>
        <button onClick={openAdd} className="btn-gold"><Plus size={17} />Add Treatment</button>
      </div>

      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search treatments..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select-field w-40">
          <option value="ALL">All Status</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="PAUSED">Paused</option>
        </select>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<Stethoscope size={28} />} title="No treatments found"
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Add Treatment</button>} />
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((t) => (
              <div key={t.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background: '#F0E8D6' }}>
                      <Stethoscope size={20} style={{ color: '#B8860B' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>{t.treatmentType}</h3>
                        <span className={`badge text-xs ${statusBadge[t.status] || 'badge-gray'}`}>{t.status}</span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#6B4C1E' }}>
                        Patient: <strong>{t.patientName}</strong> · Doctor: {t.doctorName || 'Not assigned'}
                      </p>
                      {t.description && <p className="text-sm" style={{ color: '#9C7040' }}>{t.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                      <Edit2 size={15} style={{ color: '#B8860B' }} />
                    </button>
                    <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={15} style={{ color: '#dc2626' }} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#EDE5D0' }}>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9C7040' }}>
                    <Calendar size={13} />
                    Start: {format(new Date(t.startDate), 'dd MMM yyyy')}
                  </div>
                  {t.endDate && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9C7040' }}>
                      <Calendar size={13} />
                      End: {format(new Date(t.endDate), 'dd MMM yyyy')}
                    </div>
                  )}
                  {t.medicines && (
                    <div className="text-xs" style={{ color: '#9C7040' }}>
                      Medicines: <span style={{ color: '#6B4C1E' }}>{t.medicines}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
             title={editing ? 'Edit Treatment' : 'Add Treatment'} size="lg">
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
              <label className="label">Treatment Type *</label>
              <select name="treatmentType" value={formik.values.treatmentType} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`select-field ${formik.touched.treatmentType && formik.errors.treatmentType ? 'error' : ''}`}>
                <option value="">Select type</option>
                {TREATMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {formik.touched.treatmentType && formik.errors.treatmentType && <p className="error-msg">{formik.errors.treatmentType}</p>}
            </div>
            <div>
              <label className="label">Status *</label>
              <select name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur} className="select-field">
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="PAUSED">Paused</option>
              </select>
            </div>
            <div>
              <label className="label">Start Date *</label>
              <input type="date" name="startDate" value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`input-field ${formik.touched.startDate && formik.errors.startDate ? 'error' : ''}`} />
              {formik.touched.startDate && formik.errors.startDate && <p className="error-msg">{formik.errors.startDate}</p>}
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" name="endDate" value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea name="description" placeholder="Treatment description" value={formik.values.description}
                onChange={formik.handleChange} onBlur={formik.handleBlur} rows={2}
                className="input-field resize-none" />
            </div>
            <div className="col-span-2">
              <label className="label">Medicines Prescribed</label>
              <input type="text" name="medicines" placeholder="e.g. Triphala, Ashwagandha"
                value={formik.values.medicines} onChange={formik.handleChange} className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea name="notes" placeholder="Additional notes" value={formik.values.notes}
                onChange={formik.handleChange} rows={2} className="input-field resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add Treatment'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Treatment" message={`Delete this treatment record for "${deleteTarget?.patientName}"?`} loading={deleting} />
    </div>
  );
}
