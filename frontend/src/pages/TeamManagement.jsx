import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import HRLayout from '../components/HRLayout';
import Modal from '../components/ui/Modal';

const TeamManagement = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'hr', password: '' });
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/dashboard/team');
      setMembers(res.data.data);
    } catch (err) {
      setError('Gagal memuat anggota tim');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      await api.patch(`/dashboard/team/${memberId}`, { isActive: !currentStatus });
      fetchMembers();
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      setInviteLoading(true);
      await api.post('/dashboard/team/invite', inviteForm);
      setIsModalOpen(false);
      setInviteForm({ name: '', email: '', role: 'hr', password: '' });
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengundang anggota');
    } finally {
      setInviteLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6">
            <h1 className="text-heading-lg font-semibold text-ink-700">Manajemen Tim</h1>
            {user?.role === 'admin' && (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                + Undang Anggota
              </button>
            )}
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-body-sm font-semibold text-ink-500">
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {loading ? (
                  <tr><td colSpan="5" className="px-5 py-8 text-center text-ink-300">Memuat data...</td></tr>
                ) : members.map((member) => (
                  <tr key={member.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!member.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-body-sm font-semibold ${member.is_active ? 'bg-teal-500' : 'bg-gray-400'}`}>
                        {getInitials(member.name)}
                      </div>
                      {member.name}
                    </td>
                    <td className="px-5 py-4 text-ink-500 font-mono">{member.email}</td>
                    <td className="px-5 py-4">
                      <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500 font-medium">
                        {member.role === 'admin' ? 'Admin' : 'HR/Recruiter'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-body-sm px-2.5 py-1 rounded-full font-medium ${member.is_active ? 'bg-moss-100 text-moss-700' : 'bg-gray-200 text-ink-500'}`}>
                        {member.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-body-sm">
                      {user.id === member.id ? (
                        <span className="text-ink-300">Kamu</span>
                      ) : user.role === 'admin' ? (
                        <button 
                          onClick={() => handleToggleStatus(member.id, member.is_active)}
                          className={`hover:underline ${member.is_active ? 'text-coral-600' : 'text-teal-700'}`}
                        >
                          {member.is_active ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

      {/* MODAL UNDANG ANGGOTA */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Undang Anggota Baru"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="field-label">Nama</label>
            <input required type="text" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="input-field" placeholder="Nama Anggota"/>
          </div>
          <div>
            <label className="field-label">Email</label>
            <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="input-field" placeholder="nama@perusahaan.com"/>
          </div>
          <div>
            <label className="field-label">Password Sementara</label>
            <input required type="password" value={inviteForm.password} onChange={e => setInviteForm({...inviteForm, password: e.target.value})} className="input-field" minLength={8} placeholder="Minimal 8 karakter"/>
          </div>
          <div>
            <label className="field-label">Role</label>
            <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="input-field">
              <option value="hr">HR/Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-ink-700 border border-gray-200 hover:bg-gray-50 font-medium py-2.5 rounded-md">Batal</button>
            <button type="submit" disabled={inviteLoading} className="flex-1 bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold py-2.5 rounded-md disabled:opacity-50">
              {inviteLoading ? 'Mengirim...' : 'Kirim Undangan'}
            </button>
          </div>
        </form>
      </Modal>
    </HRLayout>
  );
};

export default TeamManagement;
