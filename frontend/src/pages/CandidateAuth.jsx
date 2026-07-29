import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CandidateAuth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const { candidateLogin, candidateRegister } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await candidateLogin(loginForm.email, loginForm.password);
      // As per E13, candidates go to Dashboard
      navigate('/candidate/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      // For this MVP candidate register just needs email/password for DB (name could be in candidate_profiles later)
      // but the API takes email and password.
      await candidateRegister({
        email: registerForm.email,
        password: registerForm.password
      });
      // automatically login after register
      await candidateLogin(registerForm.email, registerForm.password);
      navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
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
          <h2 className="font-bold text-display-lg mb-4">Satu profil, untuk melamar ke perusahaan manapun.</h2>
          <p className="text-body-lg text-ink-300">Isi profilmu sekali, lalu lamar ke banyak lowongan tanpa mengulang dari awal. Pantau semua status lamaranmu di satu dashboard.</p>
        </div>

        <div className="relative z-10">
          <svg width="320" height="70" viewBox="0 0 320 70" fill="none">
            <line x1="10" y1="35" x2="90" y2="20" stroke="#294152" strokeWidth="3"/>
            <line x1="90" y1="20" x2="170" y2="45" stroke="#294152" strokeWidth="3"/>
            <line x1="170" y1="45" x2="250" y2="15" stroke="#294152" strokeWidth="3"/>
            <line x1="250" y1="15" x2="310" y2="30" stroke="#294152" strokeWidth="3"/>
            <circle cx="10" cy="35" r="8" fill="#E8A23D" className="origin-center animate-pulse-node"/>
            <circle cx="90" cy="20" r="7" fill="none" stroke="#5B6C85" strokeWidth="2"/>
            <circle cx="170" cy="45" r="7" fill="none" stroke="#5B6C85" strokeWidth="2"/>
            <circle cx="250" cy="15" r="7" fill="none" stroke="#5B6C85" strokeWidth="2"/>
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
          {/* Tabs */}
          <div className="flex gap-6 border-b border-canvas-border mb-8">
            <button 
              className={`pb-3 text-body-lg tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Masuk
            </button>
            <button 
              className={`pb-3 text-body-lg tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              Daftar
            </button>
          </div>

          {error && <div className="mb-4 text-coral-600 text-body-sm font-medium">{error}</div>}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div>
                <label className="field-label">Email</label>
                <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required className="input-field" placeholder="nama@email.com" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="field-label !mb-0">Password</label>
                  <Link to="/candidate/forgot-password" className="text-body-sm text-teal-700 hover:underline">Lupa password?</Link>
                </div>
                <div className="relative">
                  <input type={showLoginPassword ? "text" : "password"} name="password" value={loginForm.password} onChange={handleLoginChange} required className="input-field w-full pr-10" placeholder="Masukkan password" />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500">
                    {showLoginPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-3 rounded-md transition-colors disabled:opacity-50">
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {activeTab === 'register' && (
            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="field-label">Nama Lengkap</label>
                <input type="text" name="name" value={registerForm.name} onChange={handleRegisterChange} required className="input-field" placeholder="Nama sesuai identitas" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} required className="input-field" placeholder="nama@email.com" />
              </div>
              <div>
                <label className="field-label block mb-1">Password</label>
                <div className="relative">
                  <input type={showRegisterPassword ? "text" : "password"} name="password" value={registerForm.password} onChange={handleRegisterChange} required minLength={8} className="input-field w-full pr-10" placeholder="Minimal 8 karakter" />
                  <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500">
                    {showRegisterPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-3 rounded-md transition-colors disabled:opacity-50">
                {loading ? 'Memproses...' : 'Buat Akun'}
              </button>
              <p className="text-body-sm text-ink-300">Dengan mendaftar, kamu menyetujui <a href="#" className="text-teal-700 hover:underline">Syarat & Ketentuan</a> RecruitFlow.</p>
            </form>
          )}

          <p className="text-body-sm text-ink-300 text-center mt-8">
            Merekrut, bukan mencari kerja? <Link to="/company/login" className="text-teal-700 hover:underline">Masuk sebagai perusahaan →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateAuth;
