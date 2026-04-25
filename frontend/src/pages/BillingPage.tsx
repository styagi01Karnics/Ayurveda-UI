import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Receipt, Plus, Search, Edit2, Trash2, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { billsApi, patientsApi } from '../services/api';
import { Bill, Patient } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { format } from 'date-fns';

const PAYMENT_MODES = ['CASH', 'UPI', 'CARD', 'NET_BANKING', 'INSURANCE'];

const schema = Yup.object({
  patientId: Yup.number().required('Patient is required'),
  totalAmount: Yup.number().min(1, 'Amount must be positive').required('Total amount is required'),
  paidAmount: Yup.number().min(0, 'Paid amount cannot be negative').required('Paid amount is required'),
  paymentMode: Yup.string().optional(),
  paymentStatus: Yup.string().oneOf(['PENDING', 'PARTIAL', 'PAID']).required(),
});

const initVal = {
  patientId: '', totalAmount: '', paidAmount: '', paymentMode: 'CASH', paymentStatus: 'PENDING',
};

const mockBills: Bill[] = [
  { id: 1, billNumber: 'BILL-001', patientId: 1, patientName: 'Priya Sharma', totalAmount: 5000, paidAmount: 5000, pendingAmount: 0, paymentStatus: 'PAID', paymentMode: 'UPI', createdAt: '2024-04-20' },
  { id: 2, billNumber: 'BILL-002', patientId: 2, patientName: 'Rahul Verma', totalAmount: 8500, paidAmount: 4000, pendingAmount: 4500, paymentStatus: 'PARTIAL', paymentMode: 'CASH', createdAt: '2024-04-19' },
  { id: 3, billNumber: 'BILL-003', patientId: 3, patientName: 'Sunita Patel', totalAmount: 3200, paidAmount: 0, pendingAmount: 3200, paymentStatus: 'PENDING', createdAt: '2024-04-18' },
  { id: 4, billNumber: 'BILL-004', patientId: 4, patientName: 'Amit Kumar', totalAmount: 12000, paidAmount: 12000, pendingAmount: 0, paymentStatus: 'PAID', paymentMode: 'CARD', createdAt: '2024-04-17' },
  { id: 5, billNumber: 'BILL-005', patientId: 5, patientName: 'Kavya Nair', totalAmount: 6500, paidAmount: 2000, pendingAmount: 4500, paymentStatus: 'PARTIAL', paymentMode: 'NET_BANKING', createdAt: '2024-04-16' },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; badge: string }> = {
  PAID: { label: 'Paid', icon: CheckCircle2, badge: 'badge-green' },
  PARTIAL: { label: 'Partial', icon: Clock, badge: 'badge-yellow' },
  PENDING: { label: 'Pending', icon: Clock, badge: 'badge-red' },
};

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      billsApi.getAll(page).catch(() => ({ data: null })),
      patientsApi.getAll(0, 100).catch(() => ({ data: null })),
    ]).then(([bRes, pRes]) => {
      const bData = bRes.data;
      if (bData?.content) { setBills(bData.content); setTotalPages(bData.totalPages); setTotalElements(bData.totalElements); }
      else if (Array.isArray(bData)) { setBills(bData); setTotalElements(bData.length); }
      else { setBills(mockBills); setTotalElements(mockBills.length); }
      const pData = pRes.data;
      setPatients(pData?.content ?? (Array.isArray(pData) ? pData : []));
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = bills.filter((b) => {
    const matchSearch = !search ||
      b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      b.billNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || b.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalPending = bills.reduce((sum, b) => sum + b.pendingAmount, 0);

  const formik = useFormik({
    initialValues: initVal,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        const payload = {
          ...values,
          pendingAmount: Number(values.totalAmount) - Number(values.paidAmount),
        };
        if (editing) { await billsApi.update(editing.id, payload); }
        else { await billsApi.create(payload); }
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

  const openEdit = (b: Bill) => {
    setEditing(b);
    formik.resetForm({
      values: {
        patientId: b.patientId?.toString() ?? '', totalAmount: b.totalAmount.toString(),
        paidAmount: b.paidAmount.toString(), paymentMode: b.paymentMode ?? 'CASH',
        paymentStatus: b.paymentStatus,
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await billsApi.delete(deleteTarget.id); setDeleteTarget(null); fetchAll(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#EDE5D0' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Billing</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>{totalElements} bills generated</p>
        </div>
        <button onClick={openAdd} className="btn-gold"><Plus size={17} />Create Bill</button>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Collected', amount: totalRevenue, color: '#166534', bg: '#dcfce7' },
          { label: 'Total Pending', amount: totalPending, color: '#991b1b', bg: '#fee2e2' },
          { label: 'Total Bills', amount: bills.length, color: '#1e40af', bg: '#dbeafe', isCount: true },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: '#9C7040' }}>{item.label}</p>
            <p className="text-2xl font-bold" style={{ color: item.color, fontFamily: 'Cormorant Garamond, serif' }}>
              {item.isCount ? item.amount : `₹${item.amount.toLocaleString('en-IN')}`}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search bills..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select-field w-40">
          <option value="ALL">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<Receipt size={28} />} title="No bills found"
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Create Bill</button>} />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EDE5D0' }}>
                    <th className="th">Bill #</th>
                    <th className="th">Patient</th>
                    <th className="th">Total Amount</th>
                    <th className="th">Paid</th>
                    <th className="th">Pending</th>
                    <th className="th">Payment Mode</th>
                    <th className="th">Date</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((bill) => {
                    const cfg = statusConfig[bill.paymentStatus] || statusConfig['PENDING'];
                    return (
                      <tr key={bill.id} className="tr">
                        <td className="td">
                          <span className="font-mono text-sm font-medium" style={{ color: '#B8860B' }}>{bill.billNumber}</span>
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                 style={{ background: '#4A7C4E' }}>
                              {bill.patientName?.charAt(0)}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#2D1B00' }}>{bill.patientName}</span>
                          </div>
                        </td>
                        <td className="td font-semibold text-sm" style={{ color: '#2D1B00' }}>
                          ₹{bill.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="td text-sm" style={{ color: '#166534' }}>
                          ₹{bill.paidAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="td text-sm" style={{ color: bill.pendingAmount > 0 ? '#991b1b' : '#166534' }}>
                          ₹{bill.pendingAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="td">
                          {bill.paymentMode ? (
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B4C1E' }}>
                              <CreditCard size={12} />{bill.paymentMode}
                            </div>
                          ) : <span className="text-xs" style={{ color: '#9C7040' }}>—</span>}
                        </td>
                        <td className="td text-sm" style={{ color: '#6B4C1E' }}>
                          {bill.createdAt ? format(new Date(bill.createdAt), 'dd MMM yyyy') : '—'}
                        </td>
                        <td className="td">
                          <span className={`badge text-xs ${cfg.badge}`}>{cfg.label}</span>
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(bill)} className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                              <Edit2 size={15} style={{ color: '#B8860B' }} />
                            </button>
                            <button onClick={() => setDeleteTarget(bill)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
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
             title={editing ? 'Edit Bill' : 'Create Bill'} size="md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {submitError && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{submitError}</div>}
          <div>
            <label className="label">Patient *</label>
            <select name="patientId" value={formik.values.patientId}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              className={`select-field ${formik.touched.patientId && formik.errors.patientId ? 'error' : ''}`}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
            {formik.touched.patientId && formik.errors.patientId && <p className="error-msg">{formik.errors.patientId}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(['totalAmount', 'paidAmount'] as const).map((field) => (
              <div key={field}>
                <label className="label">{field === 'totalAmount' ? 'Total Amount (₹) *' : 'Paid Amount (₹) *'}</label>
                <input type="number" name={field} placeholder="0" value={formik.values[field]}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  className={`input-field ${formik.touched[field] && formik.errors[field] ? 'error' : ''}`} />
                {formik.touched[field] && formik.errors[field] && <p className="error-msg">{formik.errors[field]}</p>}
              </div>
            ))}
          </div>
          {formik.values.totalAmount && formik.values.paidAmount && (
            <div className="px-4 py-3 rounded-lg" style={{ background: '#F0E8D6' }}>
              <p className="text-sm" style={{ color: '#6B4C1E' }}>
                Pending amount: <strong style={{ color: '#B8860B' }}>
                  ₹{Math.max(0, Number(formik.values.totalAmount) - Number(formik.values.paidAmount)).toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Payment Mode</label>
              <select name="paymentMode" value={formik.values.paymentMode} onChange={formik.handleChange} className="select-field">
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Status *</label>
              <select name="paymentStatus" value={formik.values.paymentStatus}
                onChange={formik.handleChange} onBlur={formik.handleBlur} className="select-field">
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Bill' : 'Create Bill'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Bill" message={`Delete bill "${deleteTarget?.billNumber}"?`} loading={deleting} />
    </div>
  );
}
