import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      try {
        const res = await authApi.login(values);
        const { token, email, fullName, role, id } = res.data;
        login({ id, email, fullName, role, active: true }, token);
        navigate('/dashboard');
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setApiError(error?.response?.data?.message || 'Invalid email or password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF6EE' }}>
      {/* Left Panel - Decorative */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2D1B00 0%, #4A2C0A 40%, #6B4C1E 100%)' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: '#B8860B',
                width: 120 + i * 80,
                height: 120 + i * 80,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.5 - i * 0.07,
              }}
            />
          ))}
        </div>

        {/* Decorative leaves */}
        <div className="absolute top-8 right-10 opacity-40">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <path d="M80 10 Q100 5 110 20 Q95 15 85 25" stroke="#6aab6e" strokeWidth="1.5" fill="none" />
            <ellipse cx="95" cy="18" rx="10" ry="6" fill="#6aab6e" transform="rotate(-20 95 18)" />
            <ellipse cx="108" cy="12" rx="8" ry="5" fill="#4A7C4E" transform="rotate(-30 108 12)" />
            <ellipse cx="85" cy="28" rx="9" ry="5" fill="#6aab6e" transform="rotate(-10 85 28)" />
            <circle cx="87" cy="22" r="4" fill="#c0a0d0" opacity="0.7" />
            <circle cx="100" cy="15" r="3" fill="#c0a0d0" opacity="0.7" />
          </svg>
        </div>
        <div className="absolute bottom-8 left-8 opacity-40">
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
            <path d="M20 80 Q10 60 15 40" stroke="#4A7C4E" strokeWidth="2" fill="none" />
            <ellipse cx="12" cy="55" rx="12" ry="7" fill="#6aab6e" transform="rotate(20 12 55)" />
            <ellipse cx="18" cy="42" rx="10" ry="6" fill="#4A7C4E" transform="rotate(-10 18 42)" />
            <circle cx="30" cy="70" r="6" fill="#8d6e3a" opacity="0.7" />
          </svg>
        </div>

        {/* Center logo & text */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Dosha triangle */}
          <div className="relative mb-10" style={{ width: 220, height: 220 }}>
            <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
              {/* Outer glow */}
              <circle cx="110" cy="110" r="105" stroke="#B8860B" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
              {/* Triangle */}
              <polygon
                points="110,20 200,175 20,175"
                stroke="#B8860B"
                strokeWidth="1.5"
                fill="rgba(184,134,11,0.08)"
              />
              {/* Inner triangle */}
              <polygon
                points="110,55 175,155 45,155"
                stroke="#D4A017"
                strokeWidth="1"
                fill="rgba(212,160,23,0.06)"
              />
              {/* Center lotus */}
              <g transform="translate(110,115)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <ellipse
                    key={i}
                    cx={0} cy={-14}
                    rx={5} ry={10}
                    fill="#B8860B"
                    opacity={0.6 + (i % 2) * 0.2}
                    transform={`rotate(${angle})`}
                  />
                ))}
                <circle cx="0" cy="0" r="8" fill="#D4A017" />
                <circle cx="0" cy="0" r="4" fill="#FAF6EE" />
              </g>
              {/* Vertex labels */}
              <text x="110" y="14" textAnchor="middle" fill="#D4A017" fontSize="11" fontFamily="Cormorant Garamond, serif" fontWeight="600">VATA</text>
              <text x="208" y="186" textAnchor="middle" fill="#D4A017" fontSize="11" fontFamily="Cormorant Garamond, serif" fontWeight="600">PITTA</text>
              <text x="12" y="186" textAnchor="middle" fill="#D4A017" fontSize="11" fontFamily="Cormorant Garamond, serif" fontWeight="600">KAPHA</text>
            </svg>
          </div>

          <h1
            className="text-4xl font-bold mb-3 tracking-wide"
            style={{ color: '#F0E8D6', fontFamily: 'Cormorant Garamond, serif' }}
          >
            Ganesha Ayurvedaa
          </h1>
          <div className="w-16 h-0.5 mb-4" style={{ background: '#B8860B' }} />
          <p className="text-lg font-medium mb-2" style={{ color: '#D4A017' }}>
            A Journey of Healing
          </p>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#C4A882' }}>
            Holistic Ayurvedic care management — bringing ancient wisdom to modern healthcare.
          </p>

          {/* Bottom pillars */}
          <div className="flex gap-8 mt-10">
            {['Vata', 'Pitta', 'Kapha'].map((dosha) => (
              <div key={dosha} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(184,134,11,0.2)', border: '1px solid rgba(184,134,11,0.4)' }}
                >
                  <Leaf size={16} style={{ color: '#D4A017' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#C4A882' }}>{dosha}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3"
              style={{ borderColor: '#B8860B', background: '#FFF9EE' }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 3 Q23 9 20 17 Q26 12 31 17 Q25 23 23 29 Q21 33 18 33 Q15 33 13 29 Q11 23 5 17 Q10 12 16 17 Q13 9 18 3Z" fill="#B8860B" opacity="0.9" />
                <path d="M18 7 Q20 13 18 19 Q16 13 18 7Z" fill="#8B6914" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
              Ganesha Ayurvedaa
            </h1>
          </div>

          <div className="card p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
                Welcome Back
              </h2>
              <p className="text-sm" style={{ color: '#9C7040' }}>Sign in to your clinic account</p>
            </div>

            {apiError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@ganesha.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`input-field ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="error-msg">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`input-field pr-10 ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#9C7040' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="error-msg">{formik.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="btn-gold w-full justify-center py-3 text-base"
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-t-transparent spinner" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: '#EDE5D0' }}>
              <p className="text-xs text-center mb-3" style={{ color: '#9C7040' }}>Demo Credentials</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Admin', email: 'admin@ganesha.com', password: 'admin123' },
                  { label: 'Doctor', email: 'dr.sheekha@ganesha.com', password: 'doctor123' },
                ].map((cred) => (
                  <button
                    key={cred.label}
                    type="button"
                    onClick={() => {
                      formik.setFieldValue('email', cred.email);
                      formik.setFieldValue('password', cred.password);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-colors border text-center"
                    style={{ borderColor: '#EDE5D0', color: '#6B4C1E', background: '#FAF6EE' }}
                  >
                    {cred.label}<br />
                    <span style={{ color: '#9C7040', fontSize: 10 }}>{cred.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#9C7040' }}>
            © 2024 Ganesha Ayurvedaa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
