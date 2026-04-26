import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Upload, Trash2 } from 'lucide-react';
import { authApi } from '../services/api';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const CLINIC_TYPES = [
  'Ayurvedic Clinic', 'Panchakarma Centre', 'Wellness Centre', 'Naturopathy Clinic',
  'Herbal Medicine Clinic', 'Yoga & Ayurveda Centre', 'Multi-specialty Ayurvedic Hospital',
];

const signupSchema = Yup.object({
  clinicName: Yup.string().required('Clinic name is required'),
  clinicType: Yup.string().required('Clinic type is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pinCode: Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit PIN').required('PIN code is required'),
  addressLine1: Yup.string().required('Address is required'),
  addressLine2: Yup.string().optional(),
  registrationNumber: Yup.string().optional(),
  fullName: Yup.string().min(2).required('Full name is required'),
  mobileNumber: Yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number').required('Mobile number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  userId: Yup.string().min(3, 'User ID must be at least 3 characters').required('User ID is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

type UploadBoxProps = {
  label: string;
  sublabel: string;
  preview: string | null;
  onFile: (file: File) => void;
  onDelete: () => void;
};

function UploadBox({ label, sublabel, preview, onFile, onDelete }: UploadBoxProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (file: File) => {
    if (file && file.type.startsWith('image/')) onFile(file);
  };

  return (
    <div>
      {/* Current image row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden"
          style={{ background: preview ? 'transparent' : '#B8860B' }}
        >
          {preview
            ? <img src={preview} alt="" className="w-full h-full object-cover rounded-full" />
            : label.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: '#2D1B00' }}>Edit your {sublabel}</p>
          <div className="flex items-center gap-2 text-xs mt-0.5">
            {preview && (
              <button type="button" onClick={onDelete} className="hover:underline flex items-center gap-1" style={{ color: '#dc2626' }}>
                <Trash2 size={11} /> Delete
              </button>
            )}
            {preview && <span style={{ color: '#D4C0A0' }}>|</span>}
            <button type="button" onClick={() => ref.current?.click()} className="hover:underline" style={{ color: '#B8860B' }}>
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="rounded-xl flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-colors"
        style={{
          border: `2px dashed ${dragging ? '#B8860B' : '#D4C0A0'}`,
          background: dragging ? '#FFF9EE' : '#FDFAF5',
          minHeight: 120,
        }}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
      >
        {preview
          ? <img src={preview} alt="preview" className="max-h-24 max-w-full object-contain rounded-lg" />
          : <>
              <Upload size={22} style={{ color: '#B8860B' }} />
              <p className="text-xs text-center" style={{ color: '#6B4C1E' }}>
                <span className="font-semibold" style={{ color: '#B8860B' }}>Click to upload</span> or drag and drop<br />
                SVG, PNG, JPG or GIF<br />
                <span style={{ color: '#9C7040' }}>(max. 800×400px)</span>
              </p>
            </>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const toPreview = (file: File, setter: (s: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    initialValues: {
      clinicName: '', clinicType: '', state: '', city: '', pinCode: '',
      addressLine1: '', addressLine2: '', registrationNumber: '',
      fullName: '', mobileNumber: '', email: '', userId: '',
      password: '', confirmPassword: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      try {
        await authApi.register({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: 'ADMIN',
        });
        navigate('/login');
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setApiError(e?.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const field = (name: keyof typeof formik.values, label: string, placeholder?: string, type = 'text') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder ?? label}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`input-field ${formik.touched[name] && formik.errors[name] ? 'error' : ''}`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="error-msg">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#F5EFE0' }}>
      {/* Decorative corners */}
      <div className="fixed top-0 right-0 opacity-20 pointer-events-none select-none">
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
          <ellipse cx="160" cy="40" rx="40" ry="22" fill="#6aab6e" transform="rotate(-25 160 40)" />
          <ellipse cx="195" cy="20" rx="30" ry="16" fill="#4A7C4E" transform="rotate(-40 195 20)" />
          <ellipse cx="130" cy="65" rx="35" ry="18" fill="#6aab6e" transform="rotate(-10 130 65)" />
          <circle cx="150" cy="55" r="12" fill="#c0a0d0" opacity="0.6" />
          <path d="M110 0 Q140 30 120 60" stroke="#4A7C4E" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 opacity-20 pointer-events-none select-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <ellipse cx="40" cy="160" rx="38" ry="20" fill="#6aab6e" transform="rotate(15 40 160)" />
          <ellipse cx="15" cy="185" rx="30" ry="16" fill="#4A7C4E" transform="rotate(25 15 185)" />
          <ellipse cx="70" cy="145" rx="32" ry="16" fill="#8d6e3a" transform="rotate(5 70 145)" />
          <circle cx="55" cy="170" r="10" fill="#c0a0d0" opacity="0.5" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-3"
            style={{ borderColor: '#B8860B', background: '#FFF9EE' }}
          >
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <path d="M18 3 Q23 9 20 17 Q26 12 31 17 Q25 23 23 29 Q21 33 18 33 Q15 33 13 29 Q11 23 5 17 Q10 12 16 17 Q13 9 18 3Z" fill="#B8860B" opacity="0.9" />
              <path d="M18 7 Q20 13 18 19 Q16 13 18 7Z" fill="#8B6914" />
            </svg>
          </div>
          <h1 className="text-base font-bold tracking-widest" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.15em' }}>
            GANESHA AYURVEDAA
          </h1>
          <p className="text-xs font-medium italic mt-0.5" style={{ color: '#B8860B' }}>A Journey of Healing</p>
        </div>

        {/* Main heading */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Let's Begin</h2>
          <p className="text-sm mt-1" style={{ color: '#9C7040' }}>Enter your Credentials to create admin account</p>
        </div>

        {apiError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{apiError}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* ─── Clinic Information ─── */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #EDE5D0' }}>
            <div className="mb-5">
              <h3 className="text-base font-semibold" style={{ color: '#2D1B00' }}>Clinic Information</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Basic Information about your company</p>
            </div>

            <div className="flex gap-6">
              {/* Left: fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {field('clinicName', 'Clinic  Name', 'Clinic Name')}
                  <div>
                    <label className="label">Clinic Type</label>
                    <select name="clinicType" value={formik.values.clinicType} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`select-field ${formik.touched.clinicType && formik.errors.clinicType ? 'error' : ''}`}>
                      <option value="">Clinic Type</option>
                      {CLINIC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {formik.touched.clinicType && formik.errors.clinicType && <p className="error-msg">{formik.errors.clinicType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">State</label>
                    <select name="state" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`select-field ${formik.touched.state && formik.errors.state ? 'error' : ''}`}>
                      <option value="">Select State</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formik.touched.state && formik.errors.state && <p className="error-msg">{formik.errors.state}</p>}
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input type="text" name="city" placeholder="Select City" value={formik.values.city}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.city && formik.errors.city ? 'error' : ''}`} />
                    {formik.touched.city && formik.errors.city && <p className="error-msg">{formik.errors.city}</p>}
                  </div>
                  <div>
                    <label className="label">PIN Code</label>
                    <input type="text" name="pinCode" placeholder="PIN Code" value={formik.values.pinCode}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.pinCode && formik.errors.pinCode ? 'error' : ''}`} />
                    {formik.touched.pinCode && formik.errors.pinCode && <p className="error-msg">{formik.errors.pinCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {field('addressLine1', 'Address Line 1', 'Address Line 1')}
                  {field('addressLine2', 'Address Line 2', 'Address Line 2')}
                </div>

                {field('registrationNumber', 'Registration Number/ GST', 'Registration Number/ GST')}
              </div>

              {/* Right: logo upload */}
              <div className="w-56 flex-shrink-0">
                <p className="label mb-3">Your Logo</p>
                <UploadBox
                  label="Logo"
                  sublabel="Logo"
                  preview={logoPreview}
                  onFile={(f) => toPreview(f, setLogoPreview)}
                  onDelete={() => setLogoPreview(null)}
                />
              </div>
            </div>
          </div>

          {/* ─── Contact Information ─── */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #EDE5D0' }}>
            <div className="mb-5">
              <h3 className="text-base font-semibold" style={{ color: '#2D1B00' }}>Contact Information</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Primary contact information for your company</p>
            </div>

            <div className="flex gap-6">
              {/* Left: fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {field('fullName', 'Full Name', 'Full Name')}
                  {field('mobileNumber', 'Mobile Number', 'Mobile Number', 'tel')}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field('email', 'Email', 'Email', 'email')}
                  {field('userId', 'User ID', 'User ID')}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className={`input-field pr-10 ${formik.touched.password && formik.errors.password ? 'error' : ''}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9C7040' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && <p className="error-msg">{formik.errors.password}</p>}
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password"
                        value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className={`input-field pr-10 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9C7040' }}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="error-msg">{formik.errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Right: photo upload */}
              <div className="w-56 flex-shrink-0">
                <p className="label mb-3">Your Photo</p>
                <UploadBox
                  label="Photo"
                  sublabel="photo"
                  preview={photoPreview}
                  onFile={(f) => toPreview(f, setPhotoPreview)}
                  onDelete={() => setPhotoPreview(null)}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2 pb-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="btn-gold px-24 py-3 text-base justify-center"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                  Creating account...
                </span>
              ) : 'Signup'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-4 mb-10" style={{ color: '#6B4C1E' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#B8860B' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
