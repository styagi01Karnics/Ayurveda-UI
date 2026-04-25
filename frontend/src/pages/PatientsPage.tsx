import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Users, Plus, Search, Edit2, Trash2, Eye,
  Phone, Mail, MapPin, Calendar,
} from 'lucide-react';
import { patientsApi } from '../services/api';
import { Patient, PaginatedResponse } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';

const DOSHAS = ['VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHA'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

const patientSchema = Yup.object({
  fullName: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  phone: Yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number').required('Phone is required'),
  email: Yup.string().email('Invalid email').optional(),
  age: Yup.number().min(1, 'Age must be at least 1').max(120, 'Invalid age').required('Age is required'),
  gender: Yup.string().oneOf(GENDERS, 'Select gender').required('Gender is required'),
  dosha: Yup.string().oneOf(DOSHAS, 'Select dosha').optional(),
  address: Yup.string().optional(),
  status: Yup.string().oneOf(['ACTIVE', 'INACTIVE']).required(),
});

const initialValues = {
  fullName: '', phone: '', email: '', age: '', gender: '', dosha: '', address: '', status: 'ACTIVE',
};

const doshaColors: Record<string, string> = {
  VATA: '#dbeafe', PITTA: '#fee2e2', KAPHA: '#dcfce7',
  VATA_PITTA: '#fef3c7', PITTA_KAPHA: '#ede9fe', VATA_KAPHA: '#e0f2fe', TRIDOSHA: '#fce7f3',
};
const doshaTextColors: Record<string, string> = {
  VATA: '#1e40af', PITTA: '#991b1b', KAPHA: '#166534',
  VATA_PITTA: '#92400e', PITTA_KAPHA: '#5b21b6', VATA_KAPHA: '#075985', TRIDOSHA: '#9d174d',
};

export default function PatientsPage() {
  const [data, setData] = useState<PaginatedResponse<Patient> | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchPatients = useCallback(() => {
    setLoading(true);
    patientsApi.getAll(page)
      .then((res) => {
        if (res.data?.content) {
          setData(res.data);
          setPatients(res.data.content);
        } else if (Array.isArray(res.data)) {
          setPatients(res.data);
          setData(null);
        }
      })
      .catch(() => {
        // Use mock data if API fails
        const mock: Patient[] = [
          { id: 1, patientId: 'P001', ganId: 'GAN-001', fullName: 'Priya Sharma', phone: '9876543210', email: 'priya@email.com', age: 35, gender: 'FEMALE', dosha: 'VATA', status: 'ACTIVE', createdAt: '2024-04-20', address: 'Mumbai, Maharashtra' },
          { id: 2, patientId: 'P002', ganId: 'GAN-002', fullName: 'Rahul Verma', phone: '9123456789', email: 'rahul@email.com', age: 42, gender: 'MALE', dosha: 'PITTA', status: 'ACTIVE', createdAt: '2024-04-19', address: 'Delhi, NCR' },
          { id: 3, patientId: 'P003', ganId: 'GAN-003', fullName: 'Sunita Patel', phone: '9012345678', email: 'sunita@email.com', age: 28, gender: 'FEMALE', dosha: 'KAPHA', status: 'ACTIVE', createdAt: '2024-04-18', address: 'Ahmedabad, Gujarat' },
          { id: 4, patientId: 'P004', ganId: 'GAN-004', fullName: 'Amit Kumar', phone: '8901234567', email: 'amit@email.com', age: 55, gender: 'MALE', dosha: 'VATA_PITTA', status: 'INACTIVE', createdAt: '2024-04-17', address: 'Bangalore, Karnataka' },
          { id: 5, patientId: 'P005', ganId: 'GAN-005', fullName: 'Kavya Nair', phone: '7890123456', email: 'kavya@email.com', age: 31, gender: 'FEMALE', dosha: 'PITTA_KAPHA', status: 'ACTIVE', createdAt: '2024-04-16', address: 'Kochi, Kerala' },
        ];
        setPatients(mock);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const filtered = patients.filter((p) => {
    const matchSearch = !search ||
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(search.toLowerCase()) ||
      p.ganId?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search);
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formik = useFormik({
    initialValues,
    validationSchema: patientSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        if (editing) {
          await patientsApi.update(editing.id, values);
        } else {
          await patientsApi.create(values);
        }
        resetForm();
        setModalOpen(false);
        setEditing(null);
        setPage(0);
        fetchPatients();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setSubmitError(e?.response?.data?.message || 'Failed to save patient');
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

  const openEdit = (p: Patient) => {
    setEditing(p);
    formik.resetForm({
      values: {
        fullName: p.fullName, phone: p.phone ?? '', email: p.email ?? '',
        age: p.age?.toString() ?? '', gender: p.gender ?? '', dosha: p.dosha ?? '',
        address: p.address ?? '', status: p.status,
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await patientsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setPage(0);
      fetchPatients();
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#EDE5D0' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
              Patients
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>
              {data?.totalElements ?? patients.length} total patients registered
            </p>
          </div>
          <button onClick={openAdd} className="btn-gold">
            <Plus size={17} /> Add Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select-field w-36"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <LoadingSpinner center />
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Users size={28} />}
              title="No patients found"
              description={search ? `No results for "${search}"` : 'Add your first patient to get started'}
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Add Patient</button>}
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EDE5D0' }}>
                    <th className="th">Patient</th>
                    <th className="th">GAN ID</th>
                    <th className="th">Contact</th>
                    <th className="th">Age / Gender</th>
                    <th className="th">Dosha</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient) => (
                    <tr key={patient.id} className="tr">
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: '#B8860B' }}
                          >
                            {patient.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: '#2D1B00' }}>{patient.fullName}</p>
                            <p className="text-xs" style={{ color: '#9C7040' }}>{patient.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td">
                        <span className="font-mono text-sm" style={{ color: '#6B4C1E' }}>{patient.ganId}</span>
                      </td>
                      <td className="td">
                        <div className="space-y-0.5">
                          {patient.phone && (
                            <p className="text-xs flex items-center gap-1.5" style={{ color: '#6B4C1E' }}>
                              <Phone size={12} />{patient.phone}
                            </p>
                          )}
                          {patient.email && (
                            <p className="text-xs flex items-center gap-1.5 truncate max-w-[160px]" style={{ color: '#6B4C1E' }}>
                              <Mail size={12} />{patient.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="td">
                        <p className="text-sm" style={{ color: '#2D1B00' }}>{patient.age} yrs</p>
                        <p className="text-xs" style={{ color: '#9C7040' }}>{patient.gender}</p>
                      </td>
                      <td className="td">
                        {patient.dosha ? (
                          <span
                            className="badge text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: doshaColors[patient.dosha] || '#f3f4f6',
                              color: doshaTextColors[patient.dosha] || '#374151',
                            }}
                          >
                            {patient.dosha.replace('_', '-')}
                          </span>
                        ) : <span className="text-xs" style={{ color: '#9C7040' }}>—</span>}
                      </td>
                      <td className="td">
                        <span className={`badge text-xs ${patient.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewPatient(patient)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye size={15} style={{ color: '#1e40af' }} />
                          </button>
                          <button
                            onClick={() => openEdit(patient)}
                            className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={15} style={{ color: '#B8860B' }} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(patient)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} style={{ color: '#dc2626' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && (
              <Pagination
                page={data.number}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                size={data.size}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {submitError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name *</label>
              <input type="text" name="fullName" placeholder="Patient's full name"
                value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.fullName && formik.errors.fullName ? 'error' : ''}`} />
              {formik.touched.fullName && formik.errors.fullName && <p className="error-msg">{formik.errors.fullName}</p>}
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input type="tel" name="phone" placeholder="9876543210"
                value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.phone && formik.errors.phone ? 'error' : ''}`} />
              {formik.touched.phone && formik.errors.phone && <p className="error-msg">{formik.errors.phone}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" name="email" placeholder="patient@email.com"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.email && formik.errors.email ? 'error' : ''}`} />
              {formik.touched.email && formik.errors.email && <p className="error-msg">{formik.errors.email}</p>}
            </div>
            <div>
              <label className="label">Age *</label>
              <input type="number" name="age" placeholder="35"
                value={formik.values.age} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`input-field ${formik.touched.age && formik.errors.age ? 'error' : ''}`} />
              {formik.touched.age && formik.errors.age && <p className="error-msg">{formik.errors.age}</p>}
            </div>
            <div>
              <label className="label">Gender *</label>
              <select name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`select-field ${formik.touched.gender && formik.errors.gender ? 'error' : ''}`}>
                <option value="">Select gender</option>
                {GENDERS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {formik.touched.gender && formik.errors.gender && <p className="error-msg">{formik.errors.gender}</p>}
            </div>
            <div>
              <label className="label">Prakriti (Dosha)</label>
              <select name="dosha" value={formik.values.dosha} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="select-field">
                <option value="">Select dosha</option>
                {DOSHAS.map((o) => <option key={o} value={o}>{o.replace('_', '-')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status *</label>
              <select name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="select-field">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <textarea name="address" placeholder="Patient's address"
                value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur}
                rows={2} className="input-field resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {viewPatient && (
        <Modal open={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient Details">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                   style={{ background: '#B8860B' }}>
                {viewPatient.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#2D1B00' }}>{viewPatient.fullName}</h3>
                <p className="text-sm" style={{ color: '#9C7040' }}>{viewPatient.ganId} · {viewPatient.patientId}</p>
                <span className={`badge text-xs mt-1 ${viewPatient.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                  {viewPatient.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone, label: 'Phone', value: viewPatient.phone },
                { icon: Mail, label: 'Email', value: viewPatient.email },
                { icon: Calendar, label: 'Age', value: viewPatient.age ? `${viewPatient.age} years` : undefined },
                { icon: Users, label: 'Gender', value: viewPatient.gender },
              ].map(({ icon: Icon, label, value }) => value ? (
                <div key={label} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#FAF6EE' }}>
                  <Icon size={15} style={{ color: '#B8860B' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#9C7040' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: '#2D1B00' }}>{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>
            {viewPatient.dosha && (
              <div className="p-3 rounded-lg" style={{ background: doshaColors[viewPatient.dosha] || '#f3f4f6' }}>
                <p className="text-xs mb-1" style={{ color: doshaTextColors[viewPatient.dosha] || '#374151' }}>Prakriti (Dosha)</p>
                <p className="font-semibold" style={{ color: doshaTextColors[viewPatient.dosha] || '#374151' }}>
                  {viewPatient.dosha.replace('_', '-')}
                </p>
              </div>
            )}
            {viewPatient.address && (
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#FAF6EE' }}>
                <MapPin size={15} style={{ color: '#B8860B' }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs" style={{ color: '#9C7040' }}>Address</p>
                  <p className="text-sm" style={{ color: '#2D1B00' }}>{viewPatient.address}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setViewPatient(null)} className="btn-outline">Close</button>
              <button onClick={() => { setViewPatient(null); openEdit(viewPatient); }} className="btn-gold">
                <Edit2 size={15} />Edit Patient
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
