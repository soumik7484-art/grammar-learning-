import { useEffect, useState } from 'react';
import api from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useAuthStore } from '../store/authStore';

export default function Leaderboard() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/student/leaderboard').then(r => setList(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader rows={6} />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className='animate-fade-in'>
      <div className='glass-card p-6 mb-6'>
        <h1 className='font-display text-2xl font-bold text-gradient mb-1'>🏆 Leaderboard</h1>
        <p className='text-slate-400 text-sm'>Top students ranked by total score</p>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-emerald-50 border-b border-emerald-100'>
                {['Rank', 'Student', 'Class', 'Score', 'Streak', 'Progress'].map(h => (
                  <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {list.map((s: any, idx: number) => {
                const isMe = s._id === user?._id;
                return (
                  <tr key={s._id} className={`transition-colors ${isMe ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
                    <td className='px-4 py-3'>
                      <span className='font-bold text-lg'>{medals[idx] || `#${idx + 1}`}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold'>
                          {s.name?.[0]}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isMe ? 'text-emerald-700' : 'text-slate-700'}`}>
                            {s.name} {isMe && <span className='text-xs'>(You)</span>}
                          </p>
                          <p className='text-xs text-slate-400'>{s.school}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-slate-500'>{s.class} - {s.section}</td>
                    <td className='px-4 py-3'>
                      <span className='font-bold text-emerald-600'>{s.totalScore}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <span className='text-amber-500 font-semibold'>🔥 {s.streak}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-20 bg-emerald-100 rounded-full h-2'>
                          <div className='bg-emerald-500 h-2 rounded-full' style={{ width: `${((s.currentDay - 1) / 40) * 100}%` }} />
                        </div>
                        <span className='text-xs text-slate-400'>Day {s.currentDay}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
