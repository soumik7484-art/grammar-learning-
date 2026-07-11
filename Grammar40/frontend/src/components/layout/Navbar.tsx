import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className='bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className='flex items-center gap-2'>
            <div className='w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow'>
              <span className='text-white font-display font-bold text-sm'>G</span>
            </div>
            <span className='font-display font-bold text-xl text-gradient'>Grammar40</span>
          </Link>

          <div className='hidden md:flex items-center gap-6'>
            {user?.role !== 'admin' && (
              <>
                <Link to='/dashboard' className='text-slate-600 hover:text-emerald-600 font-medium transition-colors'>Dashboard</Link>
                <Link to='/leaderboard' className='text-slate-600 hover:text-emerald-600 font-medium transition-colors'>Leaderboard</Link>
              </>
            )}
            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <p className='text-sm font-semibold text-slate-700'>{user?.name}</p>
                <p className='text-xs text-slate-400'>{user?.role === 'admin' ? 'Admin' : `Day ${user?.currentDay}/40`}</p>
              </div>
              <button onClick={handleLogout} className='btn-danger text-sm px-3 py-1.5'>Logout</button>
            </div>
          </div>

          <button className='md:hidden p-2' onClick={() => setOpen(!open)}>
            <div className='w-5 h-0.5 bg-slate-600 mb-1'></div>
            <div className='w-5 h-0.5 bg-slate-600 mb-1'></div>
            <div className='w-5 h-0.5 bg-slate-600'></div>
          </button>
        </div>
        {open && (
          <div className='md:hidden py-3 border-t border-emerald-50 flex flex-col gap-3'>
            <Link to='/dashboard' className='text-slate-600 font-medium px-2'>Dashboard</Link>
            <Link to='/leaderboard' className='text-slate-600 font-medium px-2'>Leaderboard</Link>
            <button onClick={handleLogout} className='text-rose-500 font-medium px-2 text-left'>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
