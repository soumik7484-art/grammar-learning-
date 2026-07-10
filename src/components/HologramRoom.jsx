import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

// HOLOGRAM ROOM — Color: Cyan
export default function HologramRoom() {
  const characterRef = useRef(null);
  const [isNear, setIsNear]       = useState(false);
  const [look,   setLook]         = useState({ x: 0, y: 0 });
  const [speech, setSpeech]       = useState(0);

  const speeches = [
    "LOG: Hologram projection initialized. Running identity scan...",
    "Hello! I'm Soumik — I build intelligent, beautiful software systems.",
    "Hover closer to explore my portfolio across AI, web, and design.",
    "My focus: Neural Networks, Computer Vision & Full-Stack Engineering."
  ];

  useEffect(() => {
    const onMove = (e) => {
      if (!characterRef.current) return;
      const r   = characterRef.current.getBoundingClientRect();
      const cx  = r.left + r.width / 2;
      const cy  = r.top  + r.height / 2;
      const d   = Math.hypot(e.clientX - cx, e.clientY - cy);
      const near = d < 380;
      setIsNear(near);
      if (near) {
        const a = Math.atan2(e.clientY - cy, e.clientX - cx);
        setLook({ x: Math.cos(a) * 10, y: Math.sin(a) * 10 });
      } else setLook({ x: 0, y: 0 });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!isNear) { setSpeech(0); return; }
    const iv = setInterval(() => setSpeech(p => (p + 1) % speeches.length), 3500);
    return () => clearInterval(iv);
  }, [isNear]);

  return (
    <section id="about"
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 border-b overflow-hidden grid-matrix"
      style={{ borderColor: 'rgba(6,182,212,0.08)', background: 'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.06) 0%, transparent 60%), #020208' }}>

      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono uppercase"
        style={{ color: 'rgba(6,182,212,0.5)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        <span>SEC_02 // NEURAL_IDENTITY_STREAM</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Hologram Projection */}
        <div className="flex flex-col items-center justify-center relative min-h-[420px]">
          {/* Projector base glow */}
          <div className="absolute bottom-4 w-52 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <div className="w-24 h-2 rounded-full blur-md animate-pulse" style={{ background: '#06b6d4', boxShadow: '0 0 20px #06b6d4' }} />
            <div className="absolute -top-44 w-48 h-44 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(6,182,212,0.15), transparent)', clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }} />
          </div>

          {/* Hologram Character */}
          <div ref={characterRef}
            style={{ transform: `translate3d(${look.x * 0.7}px, ${look.y * 0.7}px, 0)`, filter: isNear ? 'drop-shadow(0 0 22px rgba(6,182,212,0.65))' : 'drop-shadow(0 0 8px rgba(6,182,212,0.3))' }}
            className="w-64 h-80 relative flex items-center justify-center transition-all duration-200">
            <div className="absolute inset-0 pointer-events-none animate-pulse opacity-30"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.12), transparent)' }} />
            <svg viewBox="0 0 200 250" className="w-full h-full" style={{ color: '#22d3ee' }}>
              {/* Head */}
              <g style={{ transform: `translate(${look.x}px, ${look.y}px)` }} className="transition-transform duration-150">
                <circle cx="100" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={isNear ? 'none' : '5,5'} />
                <path d="M78,75 Q100,70 122,75 L120,83 Q100,85 80,83 Z" fill="rgba(6,182,212,0.2)" stroke="currentColor" strokeWidth="1.5" />
                <circle cx={92 + look.x * 0.4} cy={78 + look.y * 0.4} r="2.5" fill="currentColor" />
                <circle cx={108 + look.x * 0.4} cy={78 + look.y * 0.4} r="2.5" fill="currentColor" />
                {isNear
                  ? <path d="M90,95 Q100,105 110,95" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  : <line x1="92" y1="96" x2="108" y2="96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                }
                <line x1="100" y1="50" x2="100" y2="40" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="38" r="3" fill="currentColor" className="animate-ping" />
              </g>
              {/* Body */}
              <path d="M60,180 Q100,150 140,180 L130,240 L70,240 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="150" x2="100" y2="240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5" />
              {/* Left arm */}
              <path d="M60,180 Q45,210 55,230" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Right arm — waves if near */}
              {isNear
                ? <path d="M140,180 Q170,140 160,110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="origin-[140px_180px] animate-[wave_1.5s_ease-in-out_infinite]" />
                : <path d="M140,180 Q155,210 145,230" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              }
            </svg>
            <div className="absolute w-60 h-60 rounded-full border border-cyan-500/15 blur-[2px] animate-pulse" />
          </div>
        </div>

        {/* Narrative Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono" style={{ color: '#22d3ee' }}>
            <Sparkles size={14} className="animate-pulse" />
            <span>IDENTITY_PROJECTION: ACTIVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Meet the{' '}
            <span className="glow-cyan" style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Hologram
            </span>
          </h2>

          {/* Speech bubble */}
          <div className="w-full glass-panel-heavy rounded-2xl p-6 border relative overflow-hidden min-h-[110px]"
            style={{ borderColor: 'rgba(6,182,212,0.3)', boxShadow: '0 0 20px rgba(6,182,212,0.08)' }}>
            <div className="scanline scanline-cyan" />
            <p className="font-mono text-sm leading-relaxed" style={{ color: '#67e8f9' }}>{speeches[speech]}</p>
            <div className="flex gap-1.5 mt-4">
              {speeches.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: speech === i ? '20px' : '10px', background: speech === i ? '#06b6d4' : 'rgba(6,182,212,0.2)' }} />
              ))}
            </div>
          </div>

          <p className="text-xs font-mono uppercase select-none" style={{ color: 'rgba(6,182,212,0.4)' }}>
            // DEPLOYMENT: INTEL_SYSTEMS // GRAPHICS: SVG_INTERACTIVE
          </p>
        </div>
      </div>

      <style>{`
        @keyframes wave { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-25deg)} }
      `}</style>
    </section>
  );
}
