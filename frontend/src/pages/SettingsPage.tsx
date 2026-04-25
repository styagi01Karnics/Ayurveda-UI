import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Lock, Bell, Building2, Save, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';

const profileSchema = Yup.object({
  fullName: Yup.string().min(2).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().optional(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(6, 'Minimum 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'clinic' | 'notifications'>('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const pf = useFormik({
    initialValues: { fullName: user?.fullName ?? '', email: user?.email ?? '', phone: '' },
    validationSchema: profileSchema,
    onSubmit: async (_values, { setSubmitting }) => {
      try {
        if (user?.id) await usersApi.update(user.id, _values);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } catch { /* ignore for demo */ } finally { setSubmitting(false); }
    },
  });

  const pwf = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (_values, { setSubmitting, resetForm }) => {
      try {
        await usersApi.changePassword(_values);
        setPasswordSuccess(true);
        resetForm();
        setTimeout(() => setPasswordSuccess(false), 3000);
      } catch { /* ignore for demo */ } finally { setSubmitting(false); }
    },
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'clinic', label: 'Clinic Info', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#EDE5D0' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>Manage your account and clinic preferences</p>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#F0E8D6' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === id ? 'white' : 'transparent',
                  color: activeTab === id ? '#B8860B' : '#6B4C1E',
                  boxShadow: activeTab === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card p-6 fade-in">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: '#EDE5D0' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                     style={{ background: '#B8860B' }}>
                  {user?.fullName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
                    {user?.fullName}
                  </h3>
                  <p className="text-sm" style={{ color: '#9C7040' }}>{user?.email}</p>
                  <span className="badge badge-gold text-xs mt-1">{user?.role?.replace('_', ' ')}</span>
                </div>
              </div>
              {profileSuccess && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                  <CheckCircle2 size={16} />Profile updated successfully!
                </div>
              )}
              <form onSubmit={pf.handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" name="fullName" placeholder="Your full name"
                    value={pf.values.fullName} onChange={pf.handleChange} onBlur={pf.handleBlur}
                    className={`input-field ${pf.touched.fullName && pf.errors.fullName ? 'error' : ''}`} />
                  {pf.touched.fullName && pf.errors.fullName && <p className="error-msg">{pf.errors.fullName}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" name="email" placeholder="your@email.com"
                    value={pf.values.email} onChange={pf.handleChange} onBlur={pf.handleBlur}
                    className={`input-field ${pf.touched.email && pf.errors.email ? 'error' : ''}`} />
                  {pf.touched.email && pf.errors.email && <p className="error-msg">{pf.errors.email}</p>}
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" name="phone" placeholder="9876543210"
                    value={pf.values.phone} onChange={pf.handleChange} onBlur={pf.handleBlur}
                    className="input-field" />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={pf.isSubmitting} className="btn-gold">
                    <Save size={16} />{pf.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card p-6 fade-in">
              <h3 className="font-semibold text-base mb-5" style={{ color: '#2D1B00' }}>Change Password</h3>
              {passwordSuccess && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                  <CheckCircle2 size={16} />Password changed successfully!
                </div>
              )}
              <form onSubmit={pwf.handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Current Password *</label>
                  <input type="password" name="currentPassword" placeholder="••••••••"
                    value={pwf.values.currentPassword} onChange={pwf.handleChange} onBlur={pwf.handleBlur}
                    className={`input-field ${pwf.touched.currentPassword && pwf.errors.currentPassword ? 'error' : ''}`} />
                  {pwf.touched.currentPassword && pwf.errors.currentPassword && <p className="error-msg">{pwf.errors.currentPassword}</p>}
                </div>
                <div>
                  <label className="label">New Password *</label>
                  <input type="password" name="newPassword" placeholder="••••••••"
                    value={pwf.values.newPassword} onChange={pwf.handleChange} onBlur={pwf.handleBlur}
                    className={`input-field ${pwf.touched.newPassword && pwf.errors.newPassword ? 'error' : ''}`} />
                  {pwf.touched.newPassword && pwf.errors.newPassword && <p className="error-msg">{pwf.errors.newPassword}</p>}
                </div>
                <div>
                  <label className="label">Confirm New Password *</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••"
                    value={pwf.values.confirmPassword} onChange={pwf.handleChange} onBlur={pwf.handleBlur}
                    className={`input-field ${pwf.touched.confirmPassword && pwf.errors.confirmPassword ? 'error' : ''}`} />
                  {pwf.touched.confirmPassword && pwf.errors.confirmPassword && <p className="error-msg">{pwf.errors.confirmPassword}</p>}
                </div>
                <div className="p-4 rounded-lg text-sm space-y-1" style={{ background: '#FAF6EE', color: '#6B4C1E' }}>
                  <p className="font-medium mb-2" style={{ color: '#2D1B00' }}>Password Requirements:</p>
                  <p>• Minimum 6 characters</p>
                  <p>• Mix of letters and numbers recommended</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={pwf.isSubmitting} className="btn-gold">
                    <Lock size={16} />{pwf.isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Clinic Info */}
          {activeTab === 'clinic' && (
            <div className="card p-6 fade-in">
              <h3 className="font-semibold text-base mb-5" style={{ color: '#2D1B00' }}>Clinic Information</h3>
              <div className="space-y-4">
                {[
                  { label: 'Clinic Name', defaultValue: 'Ganesha Ayurvedaa' },
                  { label: 'Registration Number', defaultValue: 'AYU-MH-2024-001' },
                  { label: 'Address', defaultValue: 'Mumbai, Maharashtra, India' },
                  { label: 'Phone', defaultValue: '+91 98765 43210' },
                  { label: 'Email', defaultValue: 'info@ganeshaayurvedaa.com' },
                  { label: 'Working Hours', defaultValue: '9:00 AM - 7:00 PM (Mon-Sat)' },
                ].map(({ label, defaultValue }) => (
                  <div key={label}>
                    <label className="label">{label}</label>
                    <input type="text" defaultValue={defaultValue} className="input-field" />
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button className="btn-gold"><Save size={16} />Save Clinic Info</button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card p-6 fade-in">
              <h3 className="font-semibold text-base mb-5" style={{ color: '#2D1B00' }}>Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Appointment Reminders', description: 'Get notified before upcoming appointments', enabled: true },
                  { label: 'Low Stock Alerts', description: 'Alert when medicine stock falls below threshold', enabled: true },
                  { label: 'Payment Reminders', description: 'Remind patients about pending bills', enabled: false },
                  { label: 'New Patient Registration', description: 'Notify when a new patient is added', enabled: true },
                  { label: 'Daily Summary', description: 'Receive daily clinic activity summary', enabled: false },
                ].map(({ label, description, enabled }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#FAF6EE' }}>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#2D1B00' }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>{description}</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                            style={{ background: enabled ? '#B8860B' : '#EDE5D0' }}>
                      <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                            style={{ transform: enabled ? 'translateX(22px)' : 'translateX(4px)' }} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button className="btn-gold"><Save size={16} />Save Preferences</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
