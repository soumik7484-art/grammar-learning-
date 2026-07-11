import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import SkeletonLoader from '../components/ui/SkeletonLoader';

export default function StudentDashboard() {
  const { user, updateUser } = useAuthStore();
  const [progress, setProgress] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/student/progress'),
      api.get('/student/announcements'),
      api.get('/student/profile'),
    ]).then(([p, a, prof]) => {
      setProgress(p.data);
      setAnnouncements(a.data);
      updateUser(prof.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader rows={4} />;

  const completed = progress.filter(p => p.completed).length;
  const pct = Math.round((completed / 40) * 100);
  const todayLesson = progress.find(p => p.dayNumber === user?.currentDay);
  const canStart = !todayLesson?.completed;

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Welcome */}
      <div className='glass-card p-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='font-display text-2xl font-bold text-slate-800'>
              Welcome back, <span className='text-gradient'>{user?.name?.split(' ')[0]}! 👋</span>
            </h1>
            <p className='text-slate-400 mt-1'>Class {user?.class} | Section {user?.section} | {user?.school}</p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='text-center px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200'>
              <p className='text-2xl font-bold text-amber-600'>🔥 {user?.streak}</p>
              <p className='text-xs text-amber-500'>Day Streak</p>
            </div>
            <div className='text-center px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200'>
              <p className='text-2xl font-bold text-emerald-600'>{user?.totalScore}</p>
              <p className='text-xs text-emerald-500'>Total Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='glass-card p-5 text-center hover-lift'>
          <ProgressRing value={completed} max={40} size={80} />
          <p className='text-sm text-slate-500 mt-2'>Days Done</p>
        </div>
        <div className='glass-card p-5 text-center hover-lift'>
          <p className='text-4xl font-bold text-emerald-600'>Day {user?.currentDay}</p>
          <p className='text-sm text-slate-500 mt-1'>Current Day</p>
        </div>
        <div className='glass-card p-5 text-center hover-lift'>
          <p className='text-4xl font-bold text-amber-500'>{user?.longestStreak ?? 0}</p>
          <p className='text-sm text-slate-500 mt-1'>Best Streak</p>
        </div>
        <div className='glass-card p-5 text-center hover-lift'>
          <p className='text-4xl font-bold text-sky-500'>{Math.max(0, 40 - (user?.currentDay || 1) + 1)}</p>
          <p className='text-sm text-slate-500 mt-1'>Days Left</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='glass-card p-6'>
        <div className='flex items-center justify-between mb-3'>
          <span className='font-semibold text-slate-700'>Overall Progress</span>
          <span className='text-emerald-600 font-bold'>{pct}%</span>
        </div>
        <div className='progress-bar-track'>
          <div className='progress-bar-fill' style={{ width: `${pct}%` }} />
        </div>
        <div className='flex justify-between mt-2 text-xs text-slate-400'>
          <span>Day 1</span>
          <span>{completed} / 40 completed</span>
          <span>Day 40</span>
        </div>
      </div>

      {/* Today's CTA */}
      {user?.currentDay && user.currentDay <= 40 && (
        <div className={`glass-card p-6 border-2 ${canStart ? 'border-emerald-300 shadow-glow' : 'border-slate-200'}`}>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <span className='badge-green mb-2 inline-block'>📅 Day {user.currentDay}</span>
              <h2 className='font-display text-xl font-bold text-slate-800'>Today's Challenge</h2>
              {!canStart && <p className='text-slate-400 text-sm mt-1'>✅ Already submitted today</p>}
              {canStart && <p className='text-slate-400 text-sm mt-1'>Ready to test your grammar skills?</p>}
            </div>
            {canStart ? (
              <button onClick={() => navigate(`/assessment/${user.currentDay}`)} className='btn-primary whitespace-nowrap'>
                🚀 Start Today's CW
              </button>
            ) : (
              <span className='badge badge-green text-base px-4 py-2'>Completed ✓</span>
            )}
          </div>
        </div>
      )}

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <div className='glass-card p-6'>
          <h3 className='font-display font-bold text-lg text-slate-700 mb-3'>🏅 Badges Earned</h3>
          <div className='flex flex-wrap gap-2'>
            {user.badges.map(b => <Badge key={b} name={b} />)}
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className='glass-card p-6'>
          <h3 className='font-display font-bold text-lg text-slate-700 mb-3'>📢 Announcements</h3>
          <div className='space-y-3'>
            {announcements.map((a: any) => (
              <div key={a._id} className='p-4 bg-amber-50 border border-amber-200 rounded-2xl'>
                <p className='font-semibold text-amber-800'>{a.title}</p>
                <p className='text-sm text-amber-600 mt-1'>{a.description}</p>
                <p className='text-xs text-amber-400 mt-1'>{new Date(a.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 40-Day Grid */}
      <div className='glass-card p-6'>
        <h3 className='font-display font-bold text-lg text-slate-700 mb-4'>📅 40-Day Grid</h3>
        <div className='grid grid-cols-8 sm:grid-cols-10 gap-2'>
          {Array.from({ length: 40 }, (_, i) => i + 1).map(day => {
            const p = progress.find(p => p.dayNumber === day);
            const isToday = day === user?.currentDay;
            const isDone = p?.completed;
            const isLocked = !isDone && day > (user?.currentDay || 1);
            return (
              <div key={day} title={`Day ${day}`}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110
                  ${isDone ? 'bg-emerald-500 text-white shadow-md' :
                    isToday ? 'bg-amber-400 text-white shadow-md animate-pulse-slow' :
                    isLocked ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                    'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                onClick={() => { if (isToday && canStart) navigate(`/assessment/${day}`); }}>
                {isDone ? '✓' : day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
