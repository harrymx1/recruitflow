import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/axios';

const CompanyResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Password tidak cocok');
    }
    
    if (!token) {
      return setError('Token tidak ditemukan. Silakan request link reset baru.');
    }
    
    try {
      setLoading(true);
      const res = await api.post('/auth/company/reset-password', { token, newPassword: password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/company/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-heading-lg font-bold text-ink-700">
          Buat Password Baru
        </h2>
        <p className="mt-2 text-body-sm text-ink-500">
          Silakan masukkan password baru untuk akun Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          
          {message && <div className="mb-4 text-moss-700 bg-moss-100 p-3 rounded-md text-body-sm font-medium">{message}</div>}
          {error && <div className="mb-4 text-coral-600 bg-coral-100 p-3 rounded-md text-body-sm font-medium">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Password Baru</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Minimal 8 karakter" minLength={8} />
              </div>
            </div>
            
            <div>
              <label className="field-label">Konfirmasi Password Baru</label>
              <div className="mt-1">
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Ulangi password" minLength={8} />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading || !token} className="w-full btn-primary flex justify-center disabled:opacity-50">
                {loading ? 'Memproses...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyResetPassword;
