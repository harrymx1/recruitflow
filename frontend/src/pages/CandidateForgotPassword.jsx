import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const CandidateForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      setLoading(true);
      const res = await api.post('/auth/candidate/forgot-password', { email });
      setMessage(res.data.message);
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
          Lupa Password (Kandidat)
        </h2>
        <p className="mt-2 text-body-sm text-ink-500">
          Masukkan email yang Anda gunakan untuk melamar pekerjaan.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          
          {message && <div className="mb-4 text-moss-700 bg-moss-100 p-3 rounded-md text-body-sm font-medium">{message}</div>}
          {error && <div className="mb-4 text-coral-600 bg-coral-100 p-3 rounded-md text-body-sm font-medium">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="field-label">
                Alamat Email
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="nama@email.com" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center disabled:opacity-50">
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/candidate/auth" className="font-medium text-teal-700 hover:text-teal-600 text-body-sm">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForgotPassword;
