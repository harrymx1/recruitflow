import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { companyLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await companyLogin(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* KIRI - BRAND */}
      <div className="hidden lg:flex flex-col justify-between bg-ink-700 text-white p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
              <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
              <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
              <circle cx="4" cy="16" r="3.5" fill="#7EC1C7"/>
              <circle cx="14" cy="8" r="3.5" fill="#7EC1C7"/>
              <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
            </svg>
            <span className="italic font-medium text-[20px]">RecruitFlow</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="font-bold text-display-lg mb-4">Selamat datang kembali.</h2>
          <p className="text-body-lg text-ink-300">Lanjutkan memantau pipeline, menjadwalkan interview, dan membuat keputusan rekrutmen untuk tim Anda.</p>
        </div>

        <div className="relative z-10">
          <svg width="320" height="70" viewBox="0 0 320 70" fill="none">
            <line x1="10" y1="35" x2="90" y2="20" stroke="#294152" strokeWidth="3"/>
            <line x1="90" y1="20" x2="170" y2="45" stroke="#294152" strokeWidth="3"/>
            <line x1="170" y1="45" x2="250" y2="15" stroke="#294152" strokeWidth="3"/>
            <line x1="250" y1="15" x2="310" y2="30" stroke="#294152" strokeWidth="3"/>
            <circle cx="10" cy="35" r="7" fill="#7EC1C7"/>
            <circle cx="90" cy="20" r="7" fill="#7EC1C7"/>
            <circle cx="170" cy="45" r="7" fill="#7EC1C7"/>
            <circle cx="250" cy="15" r="8" fill="#E8A23D" className="origin-center animate-pulse-node"/>
            <circle cx="310" cy="30" r="7" fill="none" stroke="#5B6C85" strokeWidth="2"/>
          </svg>
          <p className="text-body-sm text-ink-300 mt-3 font-mono">Applied → Screening → Interview → Offer → Hired</p>
        </div>
      </div>

      {/* KANAN - FORM */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
            <line x1="4" y1="16" x2="14" y2="8" stroke="#1F6F78" strokeWidth="2"/>
            <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
            <circle cx="4" cy="16" r="3.5" fill="#1F6F78"/>
            <circle cx="14" cy="8" r="3.5" fill="#1F6F78"/>
            <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
          </svg>
          <span className="italic font-medium text-[19px] text-ink-700">RecruitFlow</span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="text-heading-lg font-semibold text-ink-700 mb-2">Masuk ke workspace Anda</h1>
          <p className="text-body-md text-ink-500 mb-8">Belum punya akun? <Link to="/company/register" className="text-teal-700 font-medium hover:underline">Daftarkan perusahaan</Link></p>

          {error && <div className="mb-4 text-coral-600 text-body-sm font-medium">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Email Kerja</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="nama@perusahaan.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label !mb-0">Password</label>
                <Link to="/company/forgot-password" className="text-body-sm text-teal-700 hover:underline">Lupa password?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="input-field pr-10" placeholder="Masukkan password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500">
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-body-sm text-ink-500">
              <input type="checkbox" className="w-4 h-4 rounded-sm border-ink-300 text-teal-600 focus:ring-teal-500" />
              <span>Ingat saya di perangkat ini</span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-3 rounded-md transition-colors disabled:opacity-50">
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-body-sm text-ink-300 text-center mt-8">
            Mencari pekerjaan, bukan merekrut? <Link to="/candidate/auth" className="text-teal-700 hover:underline">Masuk sebagai kandidat →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
