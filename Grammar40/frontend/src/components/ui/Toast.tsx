import { useEffect } from 'react';

interface Props { message: string; type?: 'info' | 'warn' | 'success' | 'error'; onClose: () => void; }

export default function Toast({ message, type = 'info', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors: Record<string, string> = {
    info: 'bg-sky-500', warn: 'bg-amber-500', success: 'bg-emerald-500', error: 'bg-rose-500',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-5 py-3 rounded-2xl shadow-xl
      animate-slide-up flex items-center gap-3 max-w-sm`}>
      <span className='text-sm font-medium'>{message}</span>
      <button onClick={onClose} className='ml-2 opacity-70 hover:opacity-100'>✕</button>
    </div>
  );
}
