import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Cpu, Activity, Radio, Server } from 'lucide-react';

// HERO SECTION — Color: Electric Blue + Violet
export default function HeroLab() {
  const containerRef = useRef(null);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setSpotPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between py-10 px-6 md:px-12 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle 380px at ${spotPos.x}px ${spotPos.y}px, rgba(59,130,246,0.07) 0%, transparent 80%),
          radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 10% 80%, rgba(6,182,212,0.08) 0%, transparent 50%),
          #020208`,
        backgroundImage: `
          radial-gradient(circle 380px at ${spotPos.x}px ${spotPos.y}px, rgba(59,130,246,0.07) 0%, transparent 80%),
          radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 10% 80%, rgba(6,182,212,0.08) 0%, transparent 50%),
          linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
      }}
    >
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between border-b border-blue-500/10 pb-4 z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-[0.3em] font-mono" style={{ color: '#60a5fa' }}>
            SYS STATUS: OPTIMAL // CORE_ONLINE
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] text-blue-400/50">
          <span>LATENCY: 12ms</span>
          <span>HOST: SOUMIK.AI</span>
          <span>GRID: SEC_C</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10 w-full max-w-7xl mx-auto">

        {/* Left: Title & Console */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border"
            style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.25)', color: '#60a5fa' }}>
            <Cpu size={12} className="animate-spin-slow" />
            <span>FUTURISTIC AI LABORATORY</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
              <span className="text-white">SOUMIK </span>
              <span className="glow-blue" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CHATTERJEE</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 font-mono max-w-xl">
              AI Engineer & Interactive Experience Architect. Building the systems of tomorrow.
            </p>
          </div>

          {/* Console Window — blue/violet theme */}
          <div className="w-full max-w-xl glass-panel rounded-xl p-4 font-mono text-xs relative overflow-hidden border"
            style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div className="scanline scanline-blue" />
            <div className="flex items-center gap-2 border-b pb-2 mb-3 text-slate-400" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(99,102,241,0.5)' }} />
              <span className="ml-1 text-[10px] uppercase text-slate-500">soumik@core-lab:~$ diagnostics</span>
            </div>
            <div className="space-y-1.5">
              <p style={{ color: '#60a5fa' }}><span className="text-slate-600">&gt;</span> Initializing neural link...</p>
              <p className="text-slate-500"><span className="text-slate-600">&gt;</span> Loading: Machine Learning, Computer Vision, Full-Stack...</p>
              <p style={{ color: '#60a5fa' }}><span className="text-slate-600">&gt;</span> Status: <span className="px-1 border rounded text-[10px]" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.4)' }}>READY</span></p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button data-magnetic data-interactive
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 font-mono font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all group"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              <Terminal size={14} className="group-hover:rotate-12 transition-transform" />
              Initialize Terminal
            </button>
            <button data-magnetic data-interactive
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 font-mono font-bold text-xs uppercase tracking-widest rounded-lg border transition-all text-slate-300 hover:text-white"
              style={{ borderColor: 'rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.06)' }}>
              Explore Lab
            </button>
          </div>
        </div>

        {/* Right: Holographic Avatar Core */}
        <div className="lg:col-span-5 relative h-[400px] flex items-center justify-center select-none">
          {/* Rings */}
          <div className="absolute w-[310px] h-[310px] rounded-full border animate-spin-slow" style={{ borderColor: 'rgba(59,130,246,0.12)' }} />
          <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed animate-[spin_8s_linear_infinite_reverse]" style={{ borderColor: 'rgba(139,92,246,0.2)' }} />
          <div className="absolute w-[200px] h-[200px] rounded-full border animate-pulse-slow" style={{ borderColor: 'rgba(6,182,212,0.25)' }} />

          {/* Avatar Card */}
          <div className="relative w-56 h-56 rounded-2xl glass-panel p-4 flex flex-col items-center justify-center border animate-float-slow hover:scale-105 transition-transform duration-500"
            style={{ borderColor: 'rgba(99,102,241,0.35)', boxShadow: '0 0 40px rgba(99,102,241,0.15)' }}>
            <div className="w-36 h-36 rounded-full flex items-center justify-center p-2 relative overflow-hidden border"
              style={{ borderColor: 'rgba(99,102,241,0.4)' }}>
              <div className="absolute inset-0 animate-pulse opacity-40"
                style={{ background: 'radial-gradient(circle at 50% 60%, rgba(99,102,241,0.3), transparent)' }} />
              <svg viewBox="0 0 100 100" className="w-28 h-28" style={{ color: '#818cf8' }}>
                <circle cx="50" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M15,82 C15,62 30,55 50,55 C70,55 85,62 85,82" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M50,10 L50,17 M10,50 L17,50 M83,50 L90,50" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="mt-4 font-mono text-center">
              <div className="text-[10px] uppercase" style={{ color: 'rgba(129,140,248,0.6)' }}>OPERATOR_ID</div>
              <div className="text-sm font-bold text-white tracking-widest">S_CHATTERJEE</div>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
              style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' }}>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
              <span className="text-[8px] font-mono text-blue-400">LIVE</span>
            </div>
          </div>

          {/* Drones */}
          <div className="absolute top-8 left-12 animate-[float_4s_ease-in-out_infinite] flex flex-col items-center">
            <Radio size={14} style={{ color: '#a78bfa' }} className="animate-pulse" />
            <div className="w-3 h-0.5 mt-0.5 rounded-full blur-[1px]" style={{ background: 'rgba(167,139,250,0.5)' }} />
          </div>
          <div className="absolute bottom-8 right-12 animate-[float_5s_ease-in-out_infinite_reverse] flex flex-col items-center">
            <Server size={14} style={{ color: '#67e8f9' }} className="animate-pulse" />
            <div className="w-3 h-0.5 mt-0.5 rounded-full blur-[1px]" style={{ background: 'rgba(103,232,249,0.5)' }} />
          </div>

          {/* Live Graph widget */}
          <div className="absolute top-1/4 right-0 w-24 h-12 glass-panel rounded p-1 flex items-end justify-between overflow-hidden border"
            style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            {[20, 60, 40, 80, 55].map((h, i) => (
              <div key={i} className="w-1.5 rounded-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s`, background: `hsl(${220 + i * 15}, 80%, 65%)` }} />
            ))}
            <Activity className="absolute top-1 right-1 text-blue-400/70" size={9} />
          </div>
        </div>
      </div>

      {/* Footer HUD strip */}
      <div className="w-full flex flex-wrap justify-between gap-4 border-t pt-4 z-10 text-[10px] font-mono select-none"
        style={{ borderColor: 'rgba(59,130,246,0.1)', color: 'rgba(96,165,250,0.4)' }}>
        <span>CORE MODULES LOADED: v4.2.1 // SHADERS: ACTIVE</span>
        <span>DESIGNED BY SOUMIK CHATTERJEE</span>
        <span>SYS_TIME: {new Date().toLocaleTimeString()}</span>
      </div>
    </section>
  );
}
