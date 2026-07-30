import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CandidateProfile = () => {
  const { token, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: '', headline: '', summary: '', phone: '', dob: '', location: '', salary_expectation: '', notice_period: ''
  });
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.data;
      if (data.profile) {
        setProfile({
          full_name: data.profile.full_name || '',
          headline: data.profile.headline || '',
          summary: data.profile.summary || '',
          phone: data.profile.phone || '',
          dob: data.profile.dob ? data.profile.dob.split('T')[0] : '',
          location: data.profile.location || '',
          salary_expectation: data.profile.salary_expectation || '',
          notice_period: data.profile.notice_period || ''
        });
      }
      setExperiences(data.experiences || []);
      setEducations(data.educations || []);
      setSkills(data.skills ? data.skills.map(s => s.skill_name) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveBasicInfo = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/candidate/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser({ name: profile.full_name });
      alert('Data Profil berhasil disimpan');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const saveExperiences = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/candidate/profile/experiences', { experiences }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pengalaman Kerja berhasil disimpan');
      fetchProfileData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pengalaman');
    } finally {
      setSaving(false);
    }
  };

  const saveEducations = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/candidate/profile/educations', { educations }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pendidikan berhasil disimpan');
      fetchProfileData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pendidikan');
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/candidate/profile/skills', { skills }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Silent save for skills to match "auto-save" feel
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-heading-lg font-semibold text-ink-700 mb-1">Edit Profil</h1>
        <p className="text-body-md text-ink-500 mb-2">Profil ini dipakai setiap kali kamu melamar lowongan baru.</p>
      </div>

      {/* Progress kelengkapan */}
      <div className="bg-white border border-canvas-border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-body-sm font-medium text-ink-700">Kelengkapan Profil</span>
              <span className="text-body-sm font-mono text-teal-700">85%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
        <p className="text-body-sm text-ink-500">Masih kosong: <a href="#preferensi" className="text-teal-700 hover:underline">Ekspektasi Gaji</a> · <a href="#preferensi" className="text-teal-700 hover:underline">Ketersediaan</a></p>
      </div>

      <form onSubmit={saveBasicInfo}>
        {/* Data Pribadi */}
        <div className="bg-white border border-canvas-border rounded-xl p-6 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-md font-semibold text-ink-700">Data Pribadi</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Nama Lengkap</label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Headline (mis. Frontend Engineer)</label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" value={profile.headline} onChange={e => setProfile({...profile, headline: e.target.value})} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">No. Telepon</label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Domisili</label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="bg-white border border-canvas-border rounded-xl p-6 mb-5 shadow-sm">
          <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Ringkasan Profesional</h2>
          <textarea rows="3" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" placeholder="Ceritakan singkat tentang dirimu..." value={profile.summary} onChange={e => setProfile({...profile, summary: e.target.value})}></textarea>
        </div>

        {/* Preferensi */}
        <div className="bg-white border border-canvas-border rounded-xl p-6 mb-5 shadow-sm" id="preferensi">
          <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Preferensi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Ekspektasi Gaji <span className="text-ink-300 font-normal">(opsional)</span></label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" placeholder="mis. Rp 15.000.000/bulan" value={profile.salary_expectation} onChange={e => setProfile({...profile, salary_expectation: e.target.value})} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Ketersediaan Mulai Bekerja</label>
              <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" placeholder="mis. 2 minggu setelah offer" value={profile.notice_period} onChange={e => setProfile({...profile, notice_period: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-body-md px-6 py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50">
            Simpan Data Profil
          </button>
        </div>
      </form>

      {/* Pengalaman Kerja */}
      <div className="bg-white border border-canvas-border rounded-xl p-6 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-md font-semibold text-ink-700">Pengalaman Kerja</h2>
          <button onClick={() => setExperiences([{ position: '', company_name: '', start_date: '', end_date: '', is_current: false, description: '' }, ...experiences])} className="text-body-sm text-teal-700 hover:underline font-medium">+ Tambah</button>
        </div>
        
        {experiences.length === 0 ? (
          <p className="text-body-sm text-ink-300">Belum ada pengalaman kerja ditambahkan.</p>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx} className="border border-canvas-border rounded-md p-4 bg-gray-50/50">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Posisi</label>
                    <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={exp.position || ''} onChange={e => { const newExp = [...experiences]; newExp[idx].position = e.target.value; setExperiences(newExp); }} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Perusahaan</label>
                    <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={exp.company_name || ''} onChange={e => { const newExp = [...experiences]; newExp[idx].company_name = e.target.value; setExperiences(newExp); }} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Mulai</label>
                    <input type="date" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={exp.start_date ? exp.start_date.split('T')[0] : ''} onChange={e => { const newExp = [...experiences]; newExp[idx].start_date = e.target.value; setExperiences(newExp); }} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Selesai</label>
                    <div className="flex flex-col gap-2">
                      <input type="date" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 disabled:bg-gray-100" value={exp.end_date ? exp.end_date.split('T')[0] : ''} onChange={e => { const newExp = [...experiences]; newExp[idx].end_date = e.target.value; setExperiences(newExp); }} disabled={exp.is_current} />
                      <label className="flex items-center text-[13px] text-ink-700 cursor-pointer">
                        <input type="checkbox" className="mr-2" checked={exp.is_current || false} onChange={e => { const newExp = [...experiences]; newExp[idx].is_current = e.target.checked; if(e.target.checked) newExp[idx].end_date = null; setExperiences(newExp); }} /> Masih bekerja di sini
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Deskripsi Singkat</label>
                  <textarea rows="2" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={exp.description || ''} onChange={e => { const newExp = [...experiences]; newExp[idx].description = e.target.value; setExperiences(newExp); }}></textarea>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-canvas-border">
                  <button onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))} className="text-body-sm text-coral-600 hover:underline">Hapus</button>
                  <button onClick={saveExperiences} className="text-body-sm text-teal-700 font-medium hover:underline">Simpan Pengalaman</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pendidikan */}
      <div className="bg-white border border-canvas-border rounded-xl p-6 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-md font-semibold text-ink-700">Pendidikan</h2>
          <button onClick={() => setEducations([{ institution: '', degree: '', major: '', start_year: '', end_year: '' }, ...educations])} className="text-body-sm text-teal-700 hover:underline font-medium">+ Tambah</button>
        </div>

        {educations.length === 0 ? (
          <p className="text-body-sm text-ink-300">Belum ada pendidikan ditambahkan.</p>
        ) : (
          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={idx} className="border border-canvas-border rounded-md p-4 bg-gray-50/50">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Institusi</label>
                    <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={edu.institution || ''} onChange={e => { const newEdu = [...educations]; newEdu[idx].institution = e.target.value; setEducations(newEdu); }} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Gelar / Jenjang</label>
                    <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={edu.degree || ''} onChange={e => { const newEdu = [...educations]; newEdu[idx].degree = e.target.value; setEducations(newEdu); }} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Bidang Studi (Jurusan)</label>
                    <input type="text" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={edu.major || ''} onChange={e => { const newEdu = [...educations]; newEdu[idx].major = e.target.value; setEducations(newEdu); }} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Tahun Masuk</label>
                      <input type="number" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={edu.start_year || ''} onChange={e => { const newEdu = [...educations]; newEdu[idx].start_year = e.target.value; setEducations(newEdu); }} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-ink-700 mb-1.5">Tahun Lulus</label>
                      <input type="number" className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600" value={edu.end_year || ''} onChange={e => { const newEdu = [...educations]; newEdu[idx].end_year = e.target.value; setEducations(newEdu); }} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-canvas-border">
                  <button onClick={() => setEducations(educations.filter((_, i) => i !== idx))} className="text-body-sm text-coral-600 hover:underline">Hapus</button>
                  <button onClick={saveEducations} className="text-body-sm text-teal-700 font-medium hover:underline">Simpan Pendidikan</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keahlian */}
      <div className="bg-white border border-canvas-border rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Keahlian (Skills)</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, idx) => (
            <span key={idx} className="flex items-center gap-1.5 text-body-sm px-3 py-1.5 rounded-full bg-teal-100 text-teal-700">
              {skill}
              <button onClick={() => {
                const newSkills = skills.filter((_, i) => i !== idx);
                setSkills(newSkills);
                // auto save
                axios.put('http://localhost:5000/api/candidate/profile/skills', { skills: newSkills }, { headers: { Authorization: `Bearer ${token}` } }).catch(console.error);
              }} className="hover:text-coral-600 leading-none mb-0.5">×</button>
            </span>
          ))}
        </div>
        <input 
          className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" 
          placeholder="Ketik skill lalu tekan Enter..." 
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const val = e.target.value.trim();
              if (val && !skills.includes(val)) {
                const newSkills = [...skills, val];
                setSkills(newSkills);
                e.target.value = '';
                axios.put('http://localhost:5000/api/candidate/profile/skills', { skills: newSkills }, { headers: { Authorization: `Bearer ${token}` } }).catch(console.error);
              }
            }
          }}
        />
      </div>
      
    </div>
  );
};

export default CandidateProfile;
