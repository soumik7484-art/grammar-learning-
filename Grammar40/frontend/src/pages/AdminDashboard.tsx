import { useEffect, useState } from 'react';
import api from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cls, setCls] = useState('');
  const [loading, setLoading] = useState(true);
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [tab, setTab] = useState<'students' | 'leaderboard' | 'announcements'>('students');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const [s, st, ann, lb] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/students'),
        api.get('/student/announcements'),
        api.get('/admin/leaderboard'),
      ]);
      setStats(s.data); setStudents(st.data); setAnnouncements(ann.data); setLeaderboard(lb.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteStudent = async (id: string) => {
    if (!confirm('Delete this student and all their progress?')) return;
    await api.delete(`/admin/students/${id}`);
    setStudents(prev => prev.filter(s => s._id !== id));
  };

  const resetStudent = async (id: string) => {
    if (!confirm("Reset this student's progress to Day 1?")) return;
    await api.post(`/admin/students/${id}/reset`);
    load();
  };

  const postAnnouncement = async () => {
    if (!annTitle || !annDesc) return;
    await api.post('/admin/announcements', { title: annTitle, description: annDesc });
    setAnnTitle(''); setAnnDesc('');
    const { data } = await api.get('/student/announcements');
    setAnnouncements(data);
  };

  const filteredStudents = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search)) &&
    (!cls || s.class === cls)
  );

  if (loading) return <SkeletonLoader rows={4} />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Header Stats */}
      <div className='glass-card p-6'>
        <h1 className='font-display text-2xl font-bold text-gradient mb-5'>📊 Admin Dashboard</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { label: 'Total Students', value: stats?.total, icon: '👨‍🎓', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-700' },
            { label: 'Active Today', value: stats?.activeToday, icon: '✅', bg: 'from-sky-50 to-blue-50', border: 'border-sky-200', text: 'text-sky-700' },
            { label: 'Completed CW', value: stats?.completedToday, icon: '📝', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-700' },
            { label: 'Avg Score', value: stats?.averageScore, icon: '⭐', bg: 'from-rose-50 to-pink-50', border: 'border-rose-200', text: 'text-rose-600' },
          ].map(s => (
            <div key={s.label} className={`text-center p-5 bg-gradient-to-br ${s.bg} rounded-2xl border ${s.border} hover-lift`}>
              <p className='text-3xl mb-2'>{s.icon}</p>
              <p className={`text-3xl font-bold ${s.text}`}>{s.value ?? '-'}</p>
              <p className='text-xs text-slate-400 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 flex-wrap'>
        {(['students', 'leaderboard', 'announcements'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-sm capitalize transition-all duration-200 ${
              tab === t
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}>
            {t === 'students' ? '👥 Students' : t === 'leaderboard' ? '🏆 Leaderboard' : '📢 Announcements'}
          </button>
        ))}
      </div>

      {/* Students Tab */}
      {tab === 'students' && (
        <div className='glass-card p-6'>
          <div className='flex flex-col sm:flex-row gap-3 mb-5'>
            <input className='input-field flex-1' placeholder='🔍 Search by name or roll number...' value={search} onChange={e => setSearch(e.target.value)} />
            <input className='input-field w-36' placeholder='Filter by class' value={cls} onChange={e => setCls(e.target.value)} />
          </div>
          <div className='overflow-x-auto rounded-2xl'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100'>
                  {['Name', 'Roll', 'Class', 'Day', 'Score', 'Streak', 'Actions'].map(h => (
                    <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={7} className='px-4 py-8 text-center text-slate-400'>No students found</td></tr>
                )}
                {filteredStudents.map(s => (
                  <tr key={s._id} className='border-b border-slate-50 hover:bg-emerald-50/40 transition-colors'>
                    <td className='px-4 py-3'>
                      <div>
                        <p className='font-semibold text-slate-800'>{s.name}</p>
                        <p className='text-xs text-slate-400'>{s.email}</p>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-slate-500 font-mono text-xs'>{s.rollNumber}</td>
                    <td className='px-4 py-3 text-slate-600'>{s.class}-{s.section}</td>
                    <td className='px-4 py-3'>
                      <span className='badge-green'>{s.currentDay}/40</span>
                    </td>
                    <td className='px-4 py-3 font-bold text-emerald-600'>{s.totalScore}</td>
                    <td className='px-4 py-3 text-amber-500 font-semibold'>🔥 {s.streak}</td>
                    <td className='px-4 py-3'>
                      <div className='flex gap-1.5 flex-wrap'>
                        <button onClick={() => resetStudent(s._id)}
                          className='text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors font-medium'>
                          ↺ Reset
                        </button>
                        <button onClick={() => deleteStudent(s._id)}
                          className='text-xs px-2.5 py-1 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors font-medium'>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='text-xs text-slate-400 mt-3'>{filteredStudents.length} student(s) shown</p>
        </div>
      )}

      {/* Leaderboard Tab */}
      {tab === 'leaderboard' && (
        <div className='glass-card p-6'>
          <h2 className='font-display font-bold text-xl text-slate-800 mb-5'>🏆 Full Leaderboard</h2>
          <div className='overflow-x-auto rounded-2xl'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100'>
                  {['Rank', 'Name', 'Roll', 'Class', 'Score', 'Streak', 'Day'].map(h => (
                    <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((s: any, i: number) => (
                  <tr key={s._id} className={`border-b border-slate-50 hover:bg-amber-50/30 transition-colors ${i < 3 ? 'font-semibold' : ''}`}>
                    <td className='px-4 py-3'>
                      <span className='text-xl'>{medals[i] || `#${s.rank}`}</span>
                    </td>
                    <td className='px-4 py-3 text-slate-800'>{s.name}</td>
                    <td className='px-4 py-3 text-slate-400 font-mono text-xs'>{s.rollNumber}</td>
                    <td className='px-4 py-3 text-slate-500'>{s.class}</td>
                    <td className='px-4 py-3 font-bold text-emerald-600 text-base'>{s.totalScore}</td>
                    <td className='px-4 py-3 text-amber-500'>🔥 {s.streak}</td>
                    <td className='px-4 py-3'><span className='badge-green'>{s.currentDay}/40</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {tab === 'announcements' && (
        <div className='space-y-5'>
          <div className='glass-card p-6'>
            <h2 className='font-display font-bold text-xl text-slate-800 mb-5'>📢 Post Announcement</h2>
            <input className='input-field mb-3' placeholder='Announcement Title...' value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
            <textarea className='input-field mb-4 h-28 resize-none' placeholder='Write your announcement here...' value={annDesc} onChange={e => setAnnDesc(e.target.value)} />
            <button onClick={postAnnouncement} disabled={!annTitle || !annDesc} className='btn-primary disabled:opacity-50'>
              📤 Publish Announcement
            </button>
          </div>

          <div className='space-y-3'>
            {announcements.length === 0 && (
              <div className='glass-card p-8 text-center text-slate-400'>No announcements yet</div>
            )}
            {announcements.map((a: any) => (
              <div key={a._id} className='glass-card p-5 flex items-start justify-between gap-4'>
                <div>
                  <p className='font-semibold text-slate-800'>{a.title}</p>
                  <p className='text-sm text-slate-500 mt-1 leading-relaxed'>{a.description}</p>
                  <p className='text-xs text-slate-300 mt-2'>{new Date(a.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={async () => {
                    await api.delete(`/admin/announcements/${a._id}`);
                    setAnnouncements(prev => prev.filter(x => x._id !== a._id));
                  }}
                  className='text-rose-400 hover:text-rose-600 text-lg transition-colors flex-shrink-0'>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
