import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.token, data.student);
      navigate(data.student.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-100 flex items-center justify-center p-4'>
      <div className='glass-card p-8 w-full max-w-md animate-fade-in'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200'>
            <span className='text-white font-display font-black text-2xl'>G</span>
          </div>
          <h1 className='font-display text-3xl font-bold text-gradient'>Grammar40</h1>
          <p className='text-slate-400 mt-1 text-sm'>40 Days to Grammar Mastery</p>
        </div>

        {error && (
          <div className='bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl mb-4 text-sm'>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handle} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-600 mb-1'>Email</label>
            <input type='email' className='input-field' placeholder='you@school.com'
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-600 mb-1'>Password</label>
            <input type='password' className='input-field' placeholder='••••••••'
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type='submit' disabled={loading} className='btn-primary w-full mt-2 disabled:opacity-60'>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p className='text-center text-slate-400 text-sm mt-6'>
          New student?{' '}
          <Link to='/register' className='text-emerald-600 font-semibold hover:underline'>Register here</Link>
        </p>

        <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700'>
          <strong>Admin:</strong> admin@grammar40.com / Admin@123
        </div>
      </div>
    </div>
  );
}
