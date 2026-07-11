interface Props { value: number; max: number; size?: number; stroke?: number; label?: string; }

export default function ProgressRing({ value, max, size = 100, stroke = 8, label }: Props) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <div className='relative inline-flex items-center justify-center'>
      <svg width={size} height={size} className='-rotate-90'>
        <circle cx={size/2} cy={size/2} r={r} stroke='#d1fae5' strokeWidth={stroke} fill='none' />
        <circle cx={size/2} cy={size/2} r={r} stroke='url(#grad)' strokeWidth={stroke} fill='none'
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap='round' style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        <defs>
          <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#34d399' />
            <stop offset='100%' stopColor='#059669' />
          </linearGradient>
        </defs>
      </svg>
      <div className='absolute flex flex-col items-center'>
        <span className='font-bold text-lg text-emerald-700'>{value}</span>
        {label && <span className='text-xs text-slate-400'>{label}</span>}
      </div>
    </div>
  );
}
