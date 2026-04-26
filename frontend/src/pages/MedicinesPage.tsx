import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Pill, Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { medicinesApi } from '../services/api';
import { Medicine } from '../types';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';

const MED_TYPES = ['TABLET', 'SYRUP', 'POWDER', 'OIL', 'CAPSULE', 'CHURNA', 'KADHA'];

const schema = Yup.object({
  name: Yup.string().required('Medicine name is required'),
  type: Yup.string().oneOf(MED_TYPES).required('Type is required'),
  quantity: Yup.number().min(0, 'Quantity cannot be negative').required('Quantity is required'),
  lowStockThreshold: Yup.number().min(1).required('Low stock threshold is required'),
  price: Yup.number().min(0).optional().nullable(),
  manufacturer: Yup.string().optional(),
  batchNumber: Yup.string().optional(),
});

const initVal = {
  name: '', type: 'CHURNA', quantity: '', lowStockThreshold: '10',
  price: '', manufacturer: '', batchNumber: '',
};

const mockMedicines: Medicine[] = [
  { id: 1, name: 'Triphala Churna', type: 'CHURNA', quantity: 45, lowStockThreshold: 20, price: 180, manufacturer: 'Dabur', batchNumber: 'B001', stockStatus: 'IN_STOCK' },
  { id: 2, name: 'Ashwagandha Tablet', type: 'TABLET', quantity: 8, lowStockThreshold: 15, price: 350, manufacturer: 'Himalaya', batchNumber: 'B002', stockStatus: 'LOW_STOCK' },
  { id: 3, name: 'Brahmi Oil', type: 'OIL', quantity: 0, lowStockThreshold: 5, price: 250, manufacturer: 'Patanjali', batchNumber: 'B003', stockStatus: 'OUT_OF_STOCK' },
  { id: 4, name: 'Chyawanprash', type: 'CHURNA', quantity: 30, lowStockThreshold: 10, price: 450, manufacturer: 'Dabur', batchNumber: 'B004', stockStatus: 'IN_STOCK' },
  { id: 5, name: 'Neem Capsule', type: 'CAPSULE', quantity: 120, lowStockThreshold: 30, price: 200, manufacturer: 'Himalaya', batchNumber: 'B005', stockStatus: 'IN_STOCK' },
  { id: 6, name: 'Trikatu Kadha', type: 'KADHA', quantity: 5, lowStockThreshold: 10, price: 150, manufacturer: 'Patanjali', batchNumber: 'B006', stockStatus: 'LOW_STOCK' },
];

const stockColors: Record<string, { badge: string; row?: string }> = {
  IN_STOCK: { badge: 'badge-green' },
  LOW_STOCK: { badge: 'badge-yellow', row: '#fffbeb' },
  OUT_OF_STOCK: { badge: 'badge-red', row: '#fff1f2' },
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchMedicines = useCallback(() => {
    setLoading(true);
    medicinesApi.getAll(page)
      .then((res) => {
        const d = res.data;
        if (d?.content) { setMedicines(d.content); setTotalPages(d.totalPages); setTotalElements(d.totalElements); }
        else if (Array.isArray(d)) { setMedicines(d); setTotalElements(d.length); }
        else { setMedicines(mockMedicines); setTotalElements(mockMedicines.length); }
      })
      .catch(() => { setMedicines(mockMedicines); setTotalElements(mockMedicines.length); })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const filtered = medicines.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase());
    const matchStock = filterStock === 'ALL' || m.stockStatus === filterStock;
    const matchType = filterType === 'ALL' || m.type === filterType;
    return matchSearch && matchStock && matchType;
  });

  const lowStockCount = medicines.filter((m) => m.stockStatus === 'LOW_STOCK' || m.stockStatus === 'OUT_OF_STOCK').length;

  const formik = useFormik({
    initialValues: initVal,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      try {
        if (editing) { await medicinesApi.update(editing.id, values); }
        else { await medicinesApi.create(values); }
        resetForm();
        setModalOpen(false);
        setEditing(null);
        fetchMedicines();
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

  const openEdit = (m: Medicine) => {
    setEditing(m);
    formik.resetForm({
      values: {
        name: m.name, type: m.type, quantity: m.quantity.toString(),
        lowStockThreshold: m.lowStockThreshold.toString(), price: m.price?.toString() ?? '',
        manufacturer: m.manufacturer ?? '', batchNumber: m.batchNumber ?? '',
      },
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await medicinesApi.delete(deleteTarget.id); setDeleteTarget(null); fetchMedicines(); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#EDE5D0' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Medicines</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>{medicines.length} medicines in inventory</p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#FEF9C3', color: '#854d0e' }}>
              <AlertTriangle size={14} />
              <span className="text-xs font-medium">{lowStockCount} need reorder</span>
            </div>
          )}
          <button onClick={openAdd} className="btn-gold"><Plus size={17} />Add Medicine</button>
        </div>
      </div>

      <div className="bg-white border-b px-6 py-3 flex flex-wrap gap-3" style={{ borderColor: '#EDE5D0' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search medicines..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="select-field w-36">
          <option value="ALL">All Types</option>
          {MED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="select-field w-40">
          <option value="ALL">All Stock</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      <div className="flex-1 p-6">
        {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
          <div className="card">
            <EmptyState icon={<Pill size={28} />} title="No medicines found"
              action={<button onClick={openAdd} className="btn-gold"><Plus size={16} />Add Medicine</button>} />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EDE5D0' }}>
                    <th className="th">Medicine</th>
                    <th className="th">Type</th>
                    <th className="th">Quantity</th>
                    <th className="th">Low Stock At</th>
                    <th className="th">Price</th>
                    <th className="th">Manufacturer</th>
                    <th className="th">Batch</th>
                    <th className="th">Stock Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((med) => {
                    const sc = stockColors[med.stockStatus] || { badge: 'badge-gray' };
                    return (
                      <tr key={med.id} className="tr" style={{ background: sc.row || undefined }}>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                 style={{ background: '#F0E8D6' }}>
                              <Pill size={15} style={{ color: '#B8860B' }} />
                            </div>
                            <span className="font-medium text-sm" style={{ color: '#2D1B00' }}>{med.name}</span>
                          </div>
                        </td>
                        <td className="td"><span className="badge badge-gold text-xs">{med.type}</span></td>
                        <td className="td">
                          <span className="font-semibold text-sm" style={{ color: med.quantity === 0 ? '#dc2626' : med.quantity <= med.lowStockThreshold ? '#854d0e' : '#166534' }}>
                            {med.quantity}
                          </span>
                        </td>
                        <td className="td text-sm" style={{ color: '#9C7040' }}>{med.lowStockThreshold}</td>
                        <td className="td text-sm" style={{ color: '#6B4C1E' }}>
                          {med.price ? `₹${med.price}` : '—'}
                        </td>
                        <td className="td text-sm" style={{ color: '#6B4C1E' }}>{med.manufacturer || '—'}</td>
                        <td className="td text-xs font-mono" style={{ color: '#9C7040' }}>{med.batchNumber || '—'}</td>
                        <td className="td">
                          <span className={`badge text-xs ${sc.badge}`}>
                            {med.stockStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(med)} className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                              <Edit2 size={15} style={{ color: '#B8860B' }} />
                            </button>
                            <button onClick={() => setDeleteTarget(med)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
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
             title={editing ? 'Edit Medicine' : 'Add Medicine'} size="md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {submitError && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{submitError}</div>}
          <div>
            <label className="label">Medicine Name *</label>
            <input type="text" name="name" placeholder="e.g. Triphala Churna" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`input-field ${formik.touched.name && formik.errors.name ? 'error' : ''}`} />
            {formik.touched.name && formik.errors.name && <p className="error-msg">{formik.errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type *</label>
              <select name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`select-field ${formik.touched.type && formik.errors.type ? 'error' : ''}`}>
                {MED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {formik.touched.type && formik.errors.type && <p className="error-msg">{formik.errors.type}</p>}
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input type="number" name="quantity" placeholder="50" value={formik.values.quantity} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`input-field ${formik.touched.quantity && formik.errors.quantity ? 'error' : ''}`} />
              {formik.touched.quantity && formik.errors.quantity && <p className="error-msg">{formik.errors.quantity}</p>}
            </div>
            <div>
              <label className="label">Low Stock Threshold *</label>
              <input type="number" name="lowStockThreshold" placeholder="10" value={formik.values.lowStockThreshold} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`input-field ${formik.touched.lowStockThreshold && formik.errors.lowStockThreshold ? 'error' : ''}`} />
              {formik.touched.lowStockThreshold && formik.errors.lowStockThreshold && <p className="error-msg">{formik.errors.lowStockThreshold}</p>}
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" name="price" placeholder="200" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Manufacturer</label>
            <input type="text" name="manufacturer" placeholder="e.g. Dabur, Himalaya" value={formik.values.manufacturer} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input-field" />
          </div>
          <div>
            <label className="label">Batch Number</label>
            <input type="text" name="batchNumber" placeholder="e.g. B001" value={formik.values.batchNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="btn-outline">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-gold">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Medicine' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Medicine" message={`Delete "${deleteTarget?.name}" from inventory?`} loading={deleting} />
    </div>
  );
}
