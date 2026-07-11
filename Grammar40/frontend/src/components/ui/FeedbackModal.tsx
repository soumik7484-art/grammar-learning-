import { useEffect, useRef } from 'react';

interface Props {
  type: 'success' | 'failure';
  score: number;
  maxScore: number;
  onClose: () => void;
}

const HAPPY_DOLL = `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width="160" height="180">
  <!-- Body -->
  <ellipse cx="100" cy="170" rx="40" ry="35" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
  <!-- Dress -->
  <path d="M60 155 Q100 200 140 155 L135 185 Q100 210 65 185Z" fill="#34d399" stroke="#059669" stroke-width="1.5"/>
  <!-- Head -->
  <circle cx="100" cy="100" r="42" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
  <!-- Hair -->
  <ellipse cx="100" cy="62" rx="38" ry="16" fill="#92400e"/>
  <path d="M62 70 Q50 85 55 100" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M138 70 Q150 85 145 100" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Eyes happy -->
  <path d="M82 98 Q87 92 92 98" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M108 98 Q113 92 118 98" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Blush -->
  <ellipse cx="80" cy="108" rx="9" ry="6" fill="#fca5a5" opacity="0.6"/>
  <ellipse cx="120" cy="108" rx="9" ry="6" fill="#fca5a5" opacity="0.6"/>
  <!-- Smile -->
  <path d="M84 114 Q100 128 116 114" stroke="#b45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Arms up -->
  <path d="M60 155 Q40 130 50 110" stroke="#fde68a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M140 155 Q160 130 150 110" stroke="#fde68a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <!-- Stars -->
  <text x="28" y="105" font-size="18" fill="#fbbf24">✦</text>
  <text x="155" y="100" font-size="14" fill="#34d399">✦</text>
  <text x="90" y="50" font-size="12" fill="#f59e0b">✦</text>
</svg>
`;

const SAD_DOLL = `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width="160" height="180">
  <!-- Body -->
  <ellipse cx="100" cy="170" rx="40" ry="35" fill="#bfdbfe" stroke="#93c5fd" stroke-width="2"/>
  <!-- Dress -->
  <path d="M60 155 Q100 200 140 155 L135 185 Q100 210 65 185Z" fill="#60a5fa" stroke="#3b82f6" stroke-width="1.5"/>
  <!-- Head -->
  <circle cx="100" cy="100" r="42" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
  <!-- Hair -->
  <ellipse cx="100" cy="62" rx="38" ry="16" fill="#92400e"/>
  <path d="M62 70 Q50 85 55 100" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M138 70 Q150 85 145 100" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Eyes sad -->
  <path d="M82 96 Q87 102 92 96" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M108 96 Q113 102 118 96" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Eyebrows sad -->
  <path d="M80 86 Q87 82 94 86" stroke="#92400e" stroke-width="2" fill="none"/>
  <path d="M106 86 Q113 82 120 86" stroke="#92400e" stroke-width="2" fill="none"/>
  <!-- Tears -->
  <ellipse cx="84" cy="110" rx="3" ry="5" fill="#93c5fd" opacity="0.8"/>
  <ellipse cx="116" cy="110" rx="3" ry="5" fill="#93c5fd" opacity="0.8"/>
  <!-- Frown -->
  <path d="M84 122 Q100 112 116 122" stroke="#b45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Arms down -->
  <path d="M60 155 Q42 175 50 190" stroke="#fde68a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M140 155 Q158 175 150 190" stroke="#fde68a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <!-- Rain drops -->
  <text x="30" y="115" font-size="16" fill="#93c5fd" opacity="0.7">💧</text>
  <text x="155" y="108" font-size="13" fill="#93c5fd" opacity="0.7">💧</text>
</svg>
`;

export default function FeedbackModal({ type, score, maxScore, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div ref={overlayRef} className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className='glass-card p-8 max-w-sm w-full text-center animate-slide-up'>
        {/* Doll */}
        <div className={`flex justify-center mb-4 ${isSuccess ? 'animate-bounce-slow' : 'animate-pulse-slow'}`}
          dangerouslySetInnerHTML={{ __html: isSuccess ? HAPPY_DOLL : SAD_DOLL }} />

        <h2 className={`font-display text-2xl font-bold mb-2 ${
          isSuccess ? 'text-emerald-600' : 'text-blue-500'
        }`}>
          {isSuccess ? '🎉 Great Job!' : '😢 Better Luck Next Time!'}
        </h2>

        <p className='text-slate-500 mb-4 text-sm'>
          {isSuccess
            ? 'You completed today\'s grammar challenge. Keep the streak going!'
            : 'Don\'t give up! Practice makes perfect. Try again tomorrow.'}
        </p>

        <div className={`inline-block px-8 py-3 rounded-2xl font-bold text-3xl mb-6 ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200'
            : 'bg-blue-50 text-blue-500 border-2 border-blue-200'
        }`}>
          {score} <span className='text-base font-normal text-slate-400'>/ {maxScore}</span>
        </div>

        <button onClick={onClose} className={isSuccess ? 'btn-primary w-full' : 'btn-secondary w-full'}>
          {isSuccess ? '🚀 Continue' : '📚 Back to Dashboard'}
        </button>
      </div>
    </div>
  );
}
