import { useState, useEffect } from 'react';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardAnalytics() {
  const [funnel, setFunnel] = useState({ pipeline_stages: [], status_distribution: {} });
  const [source, setSource] = useState([]);
  const [timeToHire, setTimeToHire] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [funnelRes, sourceRes, tthRes] = await Promise.all([
        api.get('/dashboard/analytics/funnel'),
        api.get('/dashboard/analytics/source'),
        api.get('/dashboard/analytics/time-to-hire')
      ]);
      setFunnel(funnelRes.data.data);
      setSource(sourceRes.data.data);
      setTimeToHire(tthRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFunnelWidth = (count, maxCount) => {
    if (maxCount === 0) return '0%';
    return `${Math.max(15, (count / maxCount) * 100)}%`;
  };

  const totalApplicants = source.reduce((sum, item) => sum + item.count, 0) || 1;

  // Prepare Pie Chart data
  const COLORS = ['#14B8A6', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];
  const pieData = source.map(s => ({
    name: s.source,
    value: s.count
  }));

  // Prepare Line Chart Data
  const lineData = timeToHire.map(item => ({
    name: item.job_title,
    'Avg Days to Hire': item.avg_days_to_hire,
    hires: item.hires_count
  }));

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-heading-lg font-semibold text-ink-700">Analytics & Laporan</h1>
          <p className="text-body-md text-ink-500">Analisis mendalam mengenai proses rekrutmen Anda.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Funnel Konversi Lanjutan */}
            <div className="bg-white rounded-lg border border-canvas-border shadow-xs p-6">
              <h3 className="font-semibold text-body-lg text-ink-700 mb-4">Recruitment Funnel</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right text-body-sm text-ink-500 font-medium">Semua Pelamar</div>
                  <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                    <div className="h-full bg-teal-500" style={{ width: '100%' }}></div>
                    <span className="absolute left-3 text-white text-body-sm font-medium">{totalApplicants}</span>
                  </div>
                </div>

                {funnel.pipeline_stages.map(stage => (
                  <div key={stage.stage_id} className="flex items-center gap-4">
                    <div className="w-32 text-right text-body-sm text-ink-500 font-medium">{stage.stage_name}</div>
                    <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                      <div className="h-full bg-teal-400" style={{ width: calculateFunnelWidth(stage.applicant_count, totalApplicants) }}></div>
                      <span className={`absolute left-3 text-body-sm font-medium ${stage.applicant_count > 0 ? 'text-white' : 'text-ink-500'}`}>{stage.applicant_count}</span>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center gap-4 pt-2 mt-2 border-t border-canvas-border border-dashed">
                  <div className="w-32 text-right text-body-sm text-moss-600 font-semibold">Berhasil Direkrut</div>
                  <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                    <div className="h-full bg-moss-500" style={{ width: calculateFunnelWidth(funnel.status_distribution?.hired || 0, totalApplicants) }}></div>
                    <span className={`absolute left-3 text-body-sm font-medium ${(funnel.status_distribution?.hired || 0) > 0 ? 'text-white' : 'text-ink-500'}`}>
                      {funnel.status_distribution?.hired || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sumber Kandidat */}
            <div className="bg-white rounded-lg border border-canvas-border shadow-xs p-6">
              <h3 className="font-semibold text-body-lg text-ink-700 mb-4">Distribusi Sumber Pelamar</h3>
              {pieData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded border border-dashed border-canvas-border text-ink-400">
                  Tidak ada data sumber
                </div>
              )}
            </div>

          </div>

          {/* Tren Time to Hire */}
          <div className="bg-white rounded-lg border border-canvas-border shadow-xs p-6">
            <h3 className="font-semibold text-body-lg text-ink-700 mb-6">Waktu Perekrutan (Time-to-Hire) per Lowongan</h3>
            {timeToHire.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Line Chart */}
                <div className="col-span-2 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="Avg Days to Hire" stroke="#1F6F78" strokeWidth={3} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="col-span-1 overflow-auto max-h-72 border border-canvas-border rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-canvas sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase">Posisi</th>
                        <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase text-right">Rata-rata Hari</th>
                        <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase text-right">Hires</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-border">
                      {timeToHire.map(item => (
                        <tr key={item.job_id} className="hover:bg-ink-50 transition-colors">
                          <td className="px-4 py-3 text-body-sm font-medium text-ink-700">{item.job_title}</td>
                          <td className="px-4 py-3 text-body-sm text-ink-500 text-right">{item.avg_days_to_hire} hari</td>
                          <td className="px-4 py-3 text-body-sm text-ink-500 text-right">{item.hires_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-gray-50 rounded border border-dashed border-canvas-border text-ink-400">
                Belum ada data perekrutan (hired)
              </div>
            )}
          </div>
        </div>
      )}
    </HRLayout>
  );
}
