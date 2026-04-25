import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserRound, Plus, Search, Edit2, Trash2, Phone, Mail, BadgeCheck } from 'lucide-react';
import { doctorsApi } from '../services/api';
import { Doctor } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const schema = Yup.object({
  name: Yup.string().min(2).required('Name is required'),
  specialization: Yup.string().required('Specialization is required'),
  qualification: Yup.string().required('Qualification is required'),
  phone: Yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone number').required('Phone is required'),
  email: Yup.string().email('Invalid email').optional(),
  registrationNumber: Yup.string().optional(),
  available: Yup.boolean().required(),
});

const initialValues = {
  name: '', specialization: '', qualification: '', phone: '', email: '',
  registrationNumber: '', available: true,
};

const mockDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Arjun Sharma', specialization: 'Panchakarma & Detox', qualification: 'BAMS, MD (Ayu)', phone: '9876543210', email: 'arjun@ayurvedaa.com', registrationNumber: 'REG-001', available: true },
  { id: 2, name: 'Dr. Meena Verma', specialization: 'Women\'s Health', qualification: 'BAMS, MS (Prasuti)', phone: '9123456789', email: 'meena@ayurvedaa.com', registrationNumber: 'REG-002', available: true },
  { id: 3, name: 'Dr. Ravi Patel', specialization: 'Skin & Cosmetology', qualification: 'BAMS, Diploma in Cosmetology', phone: '9012345678', email: 'ravi@ayurvedaa.com', registrationNumber: 'REG-003', available: false },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchDoctors = useCallback(() => {
    setLoading(true);
    doctorsApi.getAll()
      .then((res) => setDoctors(res.data?.content ?? res.data ?? []))
      .catch(() => setDoctors(mockDoctors))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const filtered = doctors.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        if (editing) { await doctorsApi.update(editing.id, values); }
        else { await doctorsApi.create(values); }
        resetForm();
        setModalOpen(false);
        setEditing(null);
        fetchDoctors();
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
    formik.resetForm({ values: initialValues });
    setSubmitError('');
    setModalOpen(true);
  };

  const openEdit = (d: Doctor) => {
    setEditing(d);
    formik.resetForm({
      values: {
        name: d.name, specialization: d.specialization ?? '', qualification: d.qualification ?? '',
        phone: d.phone ?? '', email: d.email ?? '', registrationNumber: d.registrationNumber ?? '',
        available: d.available,
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await doctorsApi.delete(deleteTarget.id); setDeleteTarget(null); fetchDoctors(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  const F = ({ name, label, placeholder, type = 'text' }: { name: string; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type} name={name} placeholder={placeholder}
        value={(formik.values as Record<string, string | boolean>)[name] as string}
        onChange={formik.handleChange} onBlur={formik.handleBlur}
        className={`input-field ${(formik.touched as Record<string, boolean>)[name] && (formik.errors as Record<string, string>)[name] ? 'error' : ''}`}
      />
      {(formik.touched as Record<string, boolean>)[name] && (formik.errors as Record<string, string>)[name] && (
        <p className="error-msg">{(formik.errors as Record<string, string>)[name]}</p>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#EDE5D0' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Doctors</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>{doctors.length} doctors registered</p>
        </div>
        <button onClick={openAdd} className="btn-gold"><Plus size={17} />Add Doctor</button>
      </div>

      <div className="bg-white border-b px-6 py-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text" placeholder="Search doctors..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<UserRound size={28} />} title="No doctors found"
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Add Doctor</button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <div key={doc.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                         style={{ background: '#4A7C4E' }}>
                      {doc.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: '#2D1B00' }}>{doc.name}</h3>
                      <p className="text-xs" style={{ color: '#9C7040' }}>{doc.specialization}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${doc.available ? 'badge-green' : 'badge-gray'}`}>
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <p className="text-xs flex items-center gap-2" style={{ color: '#6B4C1E' }}>
                    <BadgeCheck size={13} style={{ color: '#B8860B' }} />{doc.qualification}
                  </p>
                  {doc.phone && <p className="text-xs flex items-center gap-2" style={{ color: '#6B4C1E' }}>
                    <Phone size={13} style={{ color: '#B8860B' }} />{doc.phone}
                  </p>}
                  {doc.email && <p className="text-xs flex items-center gap-2 truncate" style={{ color: '#6B4C1E' }}>
                    <Mail size={13} style={{ color: '#B8860B' }} />{doc.email}
                  </p>}
                  {doc.registrationNumber && <p className="text-xs font-mono" style={{ color: '#9C7040' }}>
                    Reg: {doc.registrationNumber}
                  </p>}
                </div>
                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: '#EDE5D0' }}>
                  <button onClick={() => openEdit(doc)} className="btn-outline flex-1 justify-center text-xs py-1.5">
                    <Edit2 size={13} />Edit
                  </button>
                  <button onClick={() => setDeleteTarget(doc)} className="btn-danger flex-1 justify-center text-xs py-1.5">
                    <Trash2 size={13} />Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
             title={editing ? 'Edit Doctor' : 'Add Doctor'} size="md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {submitError && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{submitError}</div>}
          <F name="name" label="Full Name *" placeholder="Dr. John Doe" />
          <F name="specialization" label="Specialization *" placeholder="e.g. Panchakarma & Detox" />
          <F name="qualification" label="Qualification *" placeholder="e.g. BAMS, MD (Ayu)" />
          <div className="grid grid-cols-2 gap-4">
            <F name="phone" label="Phone *" type="tel" placeholder="9876543210" />
            <F name="email" label="Email" type="email" placeholder="doctor@email.com" />
          </div>
          <F name="registrationNumber" label="Registration Number" placeholder="REG-001" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" name="available" checked={formik.values.available}
                   onChange={formik.handleChange}
                   className="w-4 h-4 rounded" style={{ accentColor: '#B8860B' }} />
            <label htmlFor="available" className="text-sm font-medium" style={{ color: '#6B4C1E' }}>
              Currently Available
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Doctor" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} loading={deleting} />
    </div>
  );
}
