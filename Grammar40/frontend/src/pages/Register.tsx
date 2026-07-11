import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', rollNumber: '', class: '', section: '', school: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.token, data.student);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Anita Roy' },
    { key: 'rollNumber', label: 'Roll Number', type: 'text', placeholder: 'ROLL001' },
    { key: 'class', label: 'Class', type: 'text', placeholder: 'Class 10' },
    { key: 'section', label: 'Section', type: 'text', placeholder: 'A' },
    { key: 'school', label: 'School', type: 'text', placeholder: 'Delhi Public School' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@school.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ] as const;

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-100 flex items-center justify-center p-4'>
      <div className='glass-card p-8 w-full max-w-lg animate-fade-in'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200'>
            <span className='text-white font-display font-black text-2xl'>G</span>
          </div>
          <h1 className='font-display text-3xl font-bold text-gradient'>Join Grammar40</h1>
          <p className='text-slate-400 mt-1 text-sm'>Start your 40-day grammar journey</p>
        </div>

        {error && (
          <div className='bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl mb-4 text-sm'>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handle} className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {fields.map(f => (
            <div key={f.key} className={f.key === 'email' || f.key === 'password' ? 'sm:col-span-2' : ''}>
              <label className='block text-sm font-medium text-slate-600 mb-1'>{f.label}</label>
              <input type={f.type} className='input-field' placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
            </div>
          ))}
          <div className='sm:col-span-2'>
            <button type='submit' disabled={loading} className='btn-primary w-full disabled:opacity-60'>
              {loading ? '⏳ Creating account...' : '🎓 Create Account'}
            </button>
          </div>
        </form>

        <p className='text-center text-slate-400 text-sm mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-emerald-600 font-semibold hover:underline'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
