import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════
   CURSOR ORB — Violet/Pink glowing orb + lagging ring
═══════════════════════════════════════════════════ */
export function CursorOrb() {
  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const core  = useRef({ x: -200, y: -200 });
  const ring  = useRef({ x: -200, y: -200 });

  useEffect(() => {
    document.documentElement.classList.add('cursor-none');
    
    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty('--cx', e.clientX + 'px');
      document.documentElement.style.setProperty('--cy', e.clientY + 'px');

      if (e.target && typeof e.target.closest === 'function') {
        const mag = e.target.closest('[data-magnetic]');
        if (mag) {
          const r = mag.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = e.clientY - cy;
          mag.style.transform = `translate(${dx * 0.25}px,${dy * 0.25}px)`;
        }
      }
    };
    
    const resetMag = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const m = e.target.closest('[data-magnetic]');
        if (m) m.style.transform = '';
      }
    };

    // Synthetic mouse event generator for touch devices
    const handleTouch = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        
        // Directly update the cursor state coordinates for immediate orb response
        mouse.current = { x: touch.clientX, y: touch.clientY };
        document.documentElement.style.setProperty('--cx', touch.clientX + 'px');
        document.documentElement.style.setProperty('--cy', touch.clientY + 'px');

        // Dispatch synthetic mouse event directly on window so all window mousemove listeners get it
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(mouseEvent);
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', resetMag, true);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });

    let id;
    const tick = () => {
      core.current.x += (mouse.current.x - core.current.x) * 0.22;
      core.current.y += (mouse.current.y - core.current.y) * 0.22;
      ring.current.x += (mouse.current.x - ring.current.x) * 0.10;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.10;
      if (coreRef.current) coreRef.current.style.transform = `translate(${core.current.x - 6}px,${core.current.y - 6}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x - 20}px,${ring.current.y - 20}px)`;
      id = requestAnimationFrame(tick);
    };
    tick();
    
    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', resetMag, true);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <>
      <div ref={coreRef} className="hidden md:block fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999]"
        style={{ background: 'radial-gradient(circle,#00ff87,#00d4ff)', boxShadow: '0 0 12px #00ff87, 0 0 24px #00d4ff', mixBlendMode: 'screen' }} />
      <div ref={ringRef} className="hidden md:block fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] border border-violet-400/60"
        style={{ boxShadow: '0 0 8px rgba(167,139,250,0.3)', mixBlendMode: 'screen' }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PART 1 — LOADING SCREEN
   Emerald neon particles + hexagon logo + typewriter
   + glowing AI core + camera zoom out transition
═══════════════════════════════════════════════════ */
export function LoadingScreen({ visible, onDone }) {
  const canvasRef = useRef(null);
  const coreRef   = useRef(null);
  const logoRef   = useRef(null);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState('enter'); // enter | exit

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let W = cvs.width = window.innerWidth;
    let H = cvs.height = window.innerHeight;
    let aid;
    const resize = () => { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    class P {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 2 + .8;
        this.vx = (Math.random() - .5) * .6;
        this.vy = -(Math.random() * 1.2 + .3);
        this.a  = Math.random() * .6 + .2;
        this.life = Math.random() * 160 + 80;
        this.max  = this.life;
        const hue = 140 + Math.random() * 20; // green-emerald range
        this.col = `hsla(${hue},100%,${50 + Math.random()*15}%,`;
      }
      tick() {
        this.x += this.vx; this.y += this.vy; this.life--;
        if (this.life <= 0 || this.y < -10) this.init();
        const a = (this.life / this.max) * this.a;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.col + a + ')';
        ctx.shadowBlur = 10; ctx.shadowColor = this.col + '.7)';
        ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    const ps = Array.from({ length: 120 }, () => new P());
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, W, H);
      ps.forEach(p => p.tick());
      aid = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(aid); window.removeEventListener('resize', resize); };
  }, []);

  // Sequence
  useEffect(() => {
    const timers = [];
    const type = (text, setter, speed, start) => {
      let i = 0;
      const t = setTimeout(() => {
        const iv = setInterval(() => {
          i++;
          setter(text.slice(0, i));
          if (i >= text.length) clearInterval(iv);
        }, speed);
        timers.push(iv);
      }, start);
      timers.push(t);
    };

    // Logo appears
    const t1 = setTimeout(() => {
      if (logoRef.current) gsap.to(logoRef.current, { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' });
    }, 400);
    timers.push(t1);

    // Line 1 types
    type('Hello...', setLine1, 80, 1800);

    // Line 2 types
    type("I'm Soumik Chatterjee.", setLine2, 55, 2700);

    // Core forms
    const t2 = setTimeout(() => {
      if (coreRef.current) gsap.to(coreRef.current, { opacity: 1, scale: 1, duration: 2, ease: 'back.out(1.4)' });
    }, 4800);
    timers.push(t2);

    // Done → fade out
    const t3 = setTimeout(() => { setPhase('exit'); setTimeout(onDone, 1200); }, 7200);
    timers.push(t3);

    return () => timers.forEach(t => { clearTimeout(t); clearInterval(t); });
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[998] flex flex-col items-center justify-center overflow-hidden transition-all duration-[1200ms] ${
      phase === 'exit' ? 'opacity-0 scale-[1.08] pointer-events-none' : 'opacity-100 scale-100'
    }`} style={{ background: '#000' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* AI Core rings behind text */}
      <div ref={coreRef} className="absolute opacity-0 scale-50 w-[360px] h-[360px] pointer-events-none flex items-center justify-center">
        {[360, 290, 220].map((s, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: s, height: s,
            border: `1px solid rgba(0,255,135,${0.08 + i * 0.06})`,
            animation: `spin ${14 - i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }} />
        ))}
        <div className="w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle,rgba(0,255,135,0.25),transparent 70%)', boxShadow: '0 0 40px rgba(0,255,135,0.3)' }} />
        <div className="absolute w-10 h-10 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle,#00ff87,#00d4ff)', boxShadow: '0 0 20px #00ff87,0 0 40px #00d4ff' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Hexagon Logo */}
        <div ref={logoRef} className="opacity-0 scale-50 w-24 h-24" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,135,0.8))' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff87" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <polygon points="50,5 93,30 93,80 50,95 7,80 7,30" fill="none" stroke="url(#lg1)" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="11" fill="none" stroke="url(#lg1)" strokeWidth="2" />
            <line x1="50" y1="5"  x2="50" y2="39"  stroke="url(#lg1)" strokeWidth="2" />
            <line x1="7"  y1="80" x2="36" y2="59"  stroke="url(#lg1)" strokeWidth="2" />
            <line x1="93" y1="80" x2="64" y2="59"  stroke="url(#lg1)" strokeWidth="2" />
          </svg>
        </div>

        {/* Typography */}
        <div className="text-center font-mono select-none">
          <p className="text-lg tracking-[.25em] h-7 tg-emerald" style={{ color: '#00ff87' }}>{line1}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white mt-2 h-14">
            {line2}
            <span className="inline-block w-[3px] h-8 align-middle ml-2 animate-pulse rounded" style={{ background: '#00ff87', boxShadow: '0 0 8px #00ff87' }} />
          </h1>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PART 2 — HERO SECTION (AI Laboratory)
   Deep purple theme — floating holograms, drones,
   robotic arm, AI graphs, profile card, spotlight
═══════════════════════════════════════════════════ */
export function HeroSection() {
  const ref = useRef(null);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e) => {
      const r = el.getBoundingClientRect();
      setMx(e.clientX - r.left);
      setMy(e.clientY - r.top);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  const Drone = ({ top, left, delay }) => (
    <div className="absolute pointer-events-none" style={{ top, left, animation: `float ${5 + delay}s ease-in-out ${delay}s infinite` }}>
      <svg width="28" height="14" viewBox="0 0 28 14">
        <ellipse cx="14" cy="7" rx="10" ry="4" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
        <line x1="4" y1="7" x2="24" y2="7" stroke="#a78bfa" strokeWidth="1" />
        <circle cx="14" cy="7" r="2.5" fill="#a78bfa" style={{ filter: 'drop-shadow(0 0 4px #a78bfa)' }} />
      </svg>
      <div className="w-4 h-0.5 mx-auto mt-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.4)', filter: 'blur(2px)' }} />
    </div>
  );

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex flex-col overflow-hidden grid-bg"
      style={{
        background: `
          radial-gradient(circle 500px at ${mx}px ${my}px, rgba(124,58,237,0.06) 0%, transparent 80%),
          radial-gradient(ellipse at 75% 10%, rgba(99,102,241,0.14) 0%, transparent 55%),
          radial-gradient(ellipse at 5% 85%,  rgba(6,182,212,0.08)  0%, transparent 45%),
          linear-gradient(180deg,#050010 0%,#000 100%)`,
      }}>

      {/* Floating drones */}
      <Drone top="12%" left="8%"  delay={0} />
      <Drone top="18%" left="75%" delay={1.2} />
      <Drone top="65%" left="88%" delay={0.6} />
      <Drone top="75%" left="4%"  delay={2} />

      {/* Rotating hologram rings */}
      {[240, 180, 120].map((s, i) => (
        <div key={i} className="absolute top-16 right-16 rounded-full pointer-events-none hidden lg:block" style={{
          width: s, height: s,
          marginLeft: -s / 2, marginTop: -s / 2,
          border: `1px solid rgba(${[167, 99, 6][i]},${[139, 102, 182][i]},${[250, 241, 212][i]},0.${[15, 20, 25][i]})`,
          animation: `spin ${[24, 16, 10][i]}s linear infinite ${i % 2 ? 'reverse' : ''}`,
        }} />
      ))}

      {/* Robotic arm SVG (bottom-left, slow oscillation) */}
      <div className="absolute bottom-20 left-8 pointer-events-none hidden md:block"
        style={{ animation: 'float 8s ease-in-out infinite' }}>
        <svg width="80" height="100" viewBox="0 0 80 100">
          <line x1="10" y1="90" x2="30" y2="55" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
          <line x1="30" y1="55" x2="60" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="30" cy="55" r="6" fill="#6366f1" style={{ filter: 'drop-shadow(0 0 6px #6366f1)' }} />
          <polygon points="55,25 70,30 62,40" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
        </svg>
      </div>

      {/* Live AI graph widget */}
      <div className="absolute top-24 right-8 glass rounded-xl p-3 w-36 pointer-events-none hidden lg:block border border-violet-500/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-mono text-violet-400 uppercase">AI Metrics</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="flex items-end gap-0.5 h-12">
          {[40, 70, 55, 90, 60, 80, 45, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{
              height: `${h}%`,
              background: `hsl(${240 + i * 15},80%,65%)`,
              opacity: 0.8,
              animation: `pulse ${1 + i * 0.15}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: TEXT */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono w-fit"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa' }}>
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              FUTURISTIC AI LABORATORY — ONLINE
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
                <span className="text-white">SOUMIK</span><br />
                <span className="tg-violet" style={{
                  background: 'linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#00d4ff 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>CHATTERJEE</span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg mt-3 max-w-md font-light leading-relaxed">
                AI Engineer & Interactive Experience Architect.<br />Building the cinematic systems of tomorrow.
              </p>
            </div>

            {/* Terminal */}
            <div className="glass rounded-xl p-4 font-mono text-xs max-w-md relative overflow-hidden"
              style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
              <div className="scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(99,102,241,0.4),transparent)', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }} />
              <div className="flex gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-slate-600 text-[10px]">soumik@ai-lab:~$</span>
              </div>
              <p className="text-violet-300 mb-1">&gt; Initializing neural interface...</p>
              <p className="text-slate-500 mb-1">&gt; Loading ML, CV, Full-Stack modules...</p>
              <p className="text-violet-300">&gt; Status: <span className="text-green-400">ALL SYSTEMS OPERATIONAL ✓</span></p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button data-magnetic data-interactive
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider text-white transition-all neon-violet"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                🚀 Get In Touch
              </button>
              <button data-magnetic data-interactive
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider text-violet-300 transition-all glass"
                style={{ border: '1px solid rgba(139,92,246,0.35)' }}>
                Explore Projects
              </button>
            </div>
          </div>

          {/* RIGHT: Floating Profile / Hologram Card */}
          <div className="flex items-center justify-center relative h-80 md:h-96">
            {/* Orbit rings */}
            {[280, 220, 160].map((s, i) => (
              <div key={i} className="absolute rounded-full" style={{
                width: s, height: s,
                border: `1px solid rgba(${[167, 96, 6][i]},${[139, 165, 182][i]},${[250, 250, 212][i]},${[0.12, 0.18, 0.25][i]})`,
                animation: `spin ${[20, 12, 7][i]}s linear infinite ${i % 2 ? 'reverse' : ''}`,
              }} />
            ))}

            {/* Profile Card */}
            <div className="relative w-56 h-64 glass rounded-3xl flex flex-col items-center justify-center gap-4 animate-float neon-violet"
              style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
              {/* Avatar circle */}
              <div className="w-28 h-28 rounded-2xl relative overflow-hidden" style={{ border: '2px solid rgba(167,139,250,0.5)' }}>
                <img src="/avatar.png" alt="Soumik Chatterjee" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-bold text-white tracking-widest text-sm">S_CHATTERJEE</p>
                <p className="text-[10px] font-mono text-violet-400/70 uppercase mt-0.5">AI_ENGINEER</p>
              </div>
              {/* Live badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                <span className="text-[8px] font-mono text-green-400">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD strip */}
      <div className="px-8 pb-6 flex justify-between text-[10px] font-mono text-violet-500/40 select-none">
        <span>LAB_CORE: v4.2 // SHADERS_ACTIVE</span>
        <span>DESIGNED BY SOUMIK CHATTERJEE</span>
        <span>SYS: {new Date().toLocaleTimeString()}</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 3 — ABOUT (Hologram Room)
   CYAN — holographic figure, cursor tracking, wave
═══════════════════════════════════════════════════ */
export function AboutSection() {
  const figRef = useRef(null);
  const [near, setNear] = useState(false);
  const [eye, setEye]   = useState({ x: 0, y: 0 });
  const [slide, setSlide] = useState(0);
  const lines = [
    'Soumik Chatterjee — AI Engineer & Developer.',
    'Building ML pipelines, Neural Networks, Computer Vision.',
    'Full-Stack: React · Node.js · MongoDB · Python.',
    'Crafting beautiful, interactive, award-winning experiences.',
  ];

  useEffect(() => {
    const fn = (e) => {
      if (!figRef.current) return;
      const r = figRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const n = d < 360;
      setNear(n);
      if (n) { const a = Math.atan2(e.clientY - cy, e.clientX - cx); setEye({ x: Math.cos(a) * 8, y: Math.sin(a) * 8 }); }
      else setEye({ x: 0, y: 0 });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => {
    if (!near) { setSlide(0); return; }
    const iv = setInterval(() => setSlide(p => (p + 1) % lines.length), 3500);
    return () => clearInterval(iv);
  }, [near]);

  return (
    <section id="about" className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 30% 50%,rgba(0,212,255,0.07) 0%,transparent 60%),#00080a' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-cyan-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />SEC_02 · HOLOGRAM_IDENTITY
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Hologram Figure */}
        <div className="flex justify-center relative min-h-[480px] items-center">
          {/* Ground projector */}
          <div className="absolute bottom-6 w-56 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 30px rgba(0,212,255,0.15)' }}>
            <div className="w-28 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4ff', boxShadow: '0 0 16px #00d4ff' }} />
          </div>
          {/* Projection cone */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 h-52 pointer-events-none"
            style={{ background: 'linear-gradient(to top,rgba(0,212,255,0.12),transparent)', clipPath: 'polygon(20% 0%,80% 0%,100% 100%,0% 100%)' }} />

          {/* Figure */}
          <div ref={figRef}
            style={{ transform: `translate(${eye.x * .5}px,${eye.y * .5}px)`, filter: near ? 'drop-shadow(0 0 24px rgba(0,212,255,.7))' : 'drop-shadow(0 0 8px rgba(0,212,255,.3))' }}
            className="relative flex items-center justify-center transition-transform duration-200">
            <svg width="260" height="340" viewBox="0 0 260 340" style={{ color: '#00d4ff' }}>
              {/* Head */}
              <g transform={`translate(${eye.x},${eye.y})`} style={{ transition: 'transform 0.15s' }}>
                <circle cx="130" cy="85" r="36" fill="rgba(0,212,255,0.04)" stroke="currentColor" strokeWidth="2" />
                {/* Visor */}
                <path d="M108,80 Q130,74 152,80 L150,88 Q130,91 110,88 Z" fill="rgba(0,212,255,0.18)" stroke="currentColor" strokeWidth="1.2" />
                {/* Eyes */}
                <circle cx={119 + eye.x * .4} cy={83 + eye.y * .4} r="3" fill="currentColor" />
                <circle cx={141 + eye.x * .4} cy={83 + eye.y * .4} r="3" fill="currentColor" />
                {/* Mouth */}
                {near
                  ? <path d="M118,100 Q130,112 142,100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  : <line x1="120" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                {/* Antenna */}
                <line x1="130" y1="49" x2="130" y2="38" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="130" cy="35" r="3.5" fill="currentColor" className="animate-pulse" />
              </g>
              {/* Neck */}
              <line x1="130" y1="121" x2="130" y2="145" stroke="currentColor" strokeWidth="2.5" />
              {/* Torso */}
              <path d="M75,200 Q130,165 185,200 L175,310 L85,310 Z" fill="rgba(0,212,255,0.04)" stroke="currentColor" strokeWidth="1.8" />
              {/* Left arm */}
              <path d="M78,204 Q55,240 65,275" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              {/* Right arm — waves near cursor */}
              {near
                ? <path d="M182,204 Q215,165 205,128" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                    style={{ transformOrigin: '182px 204px', animation: 'wave 1.4s ease-in-out infinite' }} />
                : <path d="M182,204 Q205,240 195,275" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            </svg>
          </div>
        </div>

        {/* Text Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest" style={{ color: '#00d4ff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            HOLOGRAPHIC PROJECTION · IN RANGE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Meet <span className="tg-cyan" style={{ color: '#00d4ff' }}>Soumik</span></h2>

          {/* Speech panel */}
          <div className="glass-dark rounded-2xl p-6 relative overflow-hidden min-h-[120px]"
            style={{ border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 20px rgba(0,212,255,0.06)' }}>
            <div className="scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(0,212,255,0.35),transparent)', boxShadow: '0 0 8px rgba(0,212,255,0.4)' }} />
            <p className="font-mono text-sm leading-relaxed text-cyan-200 transition-all duration-500">{lines[slide]}</p>
            <div className="flex gap-1.5 mt-4">
              {lines.map((_, i) => (
                <div key={i} className="h-1 rounded-full transition-all duration-300"
                  style={{ width: slide === i ? 24 : 8, background: slide === i ? '#00d4ff' : 'rgba(0,212,255,0.2)' }} />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[['3+', 'Years Coding'], ['10+', 'Projects Built'], ['5+', 'AI Models']].map(([n, l]) => (
              <div key={l} className="glass rounded-xl p-3 text-center" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
                <p className="text-2xl font-extrabold" style={{ color: '#00d4ff' }}>{n}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">{l}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-cyan-500/40 uppercase">// HOVER NEAR HOLOGRAM TO INTERACT</p>
        </div>
      </div>

      <style>{`@keyframes wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-28deg)}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 4 — MEDICAL AI PROJECT
   BLUE + RED — Doctor + Patient, heartbeat monitor,
   stethoscope, floating pills, X-ray scans
═══════════════════════════════════════════════════ */
export function MedicalSection() {
  const docRef = useRef(null);
  const patRef = useRef(null);
  const [docEye, setDocEye] = useState({ x: 0, y: 0 });
  const [nearDoc, setNearDoc] = useState(false);
  const [nearPat, setNearPat] = useState(false);
  const [pills, setPills] = useState([]);
  const tickRef = useRef(0);

  useEffect(() => {
    const fn = (e) => {
      if (docRef.current) {
        const r = docRef.current.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const nd = Math.hypot(e.clientX - cx, e.clientY - cy) < 300;
        setNearDoc(nd);
        if (nd) { const a = Math.atan2(e.clientY - cy, e.clientX - cx); setDocEye({ x: Math.cos(a) * 6, y: Math.sin(a) * 6 }); }
        else setDocEye({ x: 0, y: 0 });
      }
      if (patRef.current) {
        const r = patRef.current.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        setNearPat(Math.hypot(e.clientX - cx, e.clientY - cy) < 250);
      }
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => {
    if (!nearPat) { setPills([]); return; }
    const iv = setInterval(() => {
      const icons = ['💊', '⚕️', '🧬', '🩺', '➕'];
      setPills(p => [...p.slice(-8), { id: Date.now(), icon: icons[Math.floor(Math.random() * icons.length)], x: 20 + Math.random() * 60 }]);
    }, 700);
    return () => clearInterval(iv);
  }, [nearPat]);

  return (
    <section className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 20% 30%,rgba(59,130,246,0.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(239,68,68,0.06) 0%,transparent 50%),#000a14' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-blue-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />SEC_03 · MEDAI — AI DIAGNOSTICS SYSTEM
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Monitors & Scans */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-white">MedAI <span className="tg-blue" style={{ color: '#60a5fa' }}>Diagnostics</span></h2>
          <p className="text-sm text-slate-400 leading-relaxed">AI-powered diagnostic assistant. Real-time analysis, anomaly detection, smart prescription generation.</p>

          {/* Heart rate monitor */}
          <div className="glass-dark rounded-2xl p-4 relative overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono uppercase text-red-400">PATIENT MONITOR</span>
              <span className="text-lg">❤️</span>
            </div>
            <div className="h-16 relative overflow-hidden rounded">
              <svg className="w-full h-full">
                <defs><linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient></defs>
                {nearPat
                  ? <path className="heartbeat-path" d="M0,32 L40,32 L50,10 L60,54 L70,22 L80,32 L120,32 L130,10 L140,54 L150,25 L160,32 L200,32" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  : <path d="M0,32 L200,32" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" strokeDasharray="4,4" />}
              </svg>
            </div>
            <div className="flex justify-between mt-2 font-mono text-[9px] text-slate-500">
              <span>HR: {nearPat ? '82 BPM' : '--'}</span>
              <span>SpO2: {nearPat ? '98%' : '--'}</span>
              <span>BP: {nearPat ? '120/80' : '--'}</span>
            </div>
          </div>

          {/* X-Ray panel */}
          <div className="glass-dark rounded-2xl p-4 relative overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase text-blue-400">X-RAY ANALYSIS</span>
              <div className={`w-2 h-2 rounded-full ${nearPat ? 'bg-blue-400 animate-ping' : 'bg-slate-700'}`} />
            </div>
            <div className="h-24 rounded relative overflow-hidden flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
              {nearPat ? (
                <>
                  <svg width="70" height="80" viewBox="0 0 70 80" style={{ color: 'rgba(96,165,250,0.5)' }}>
                    <line x1="35" y1="5"  x2="35" y2="75" stroke="currentColor" strokeWidth="3" />
                    <line x1="15" y1="25" x2="55" y2="25" stroke="currentColor" strokeWidth="2" />
                    <line x1="10" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="15" y1="55" x2="55" y2="55" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="absolute inset-0 scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(59,130,246,0.3),transparent)', boxShadow: '0 0 10px rgba(59,130,246,0.4)' }} />
                </>
              ) : <p className="text-[10px] font-mono text-slate-600 uppercase">MOVE CURSOR TO PATIENT AREA</p>}
            </div>
          </div>

          {/* Floating pills */}
          <div className="relative h-20 overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {pills.map(p => (
              <span key={p.id} className="absolute text-xl pointer-events-none"
                style={{ left: `${p.x}%`, bottom: 0, animation: 'float 2s ease-out forwards', fontSize: '1.2rem', opacity: 0.9 }}>
                {p.icon}
              </span>
            ))}
            {!nearPat && <p className="text-[10px] font-mono text-slate-700 uppercase text-center mt-6">HOVER NEAR PATIENT FOR EFFECTS</p>}
          </div>
        </div>

        {/* RIGHT: Doctor + Patient Scene */}
        <div className="lg:col-span-8 grid grid-cols-2 gap-6 items-center">

          {/* AI Doctor */}
          <div ref={docRef} className="glass-dark rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col items-center justify-between"
            style={{ border: `1px solid rgba(59,130,246,${nearDoc ? 0.5 : 0.2})`, boxShadow: nearDoc ? '0 0 30px rgba(59,130,246,0.15)' : 'none', transition: 'all 0.3s' }}>
            <div className="text-[9px] font-mono text-blue-400/60 uppercase">AI_DOCTOR_v9</div>

            <svg width="180" height="260" viewBox="0 0 180 260" style={{ color: '#60a5fa' }}>
              {/* White coat body */}
              <path d="M35,180 L145,180 L130,260 L50,260 Z" fill="rgba(59,130,246,0.06)" stroke="currentColor" strokeWidth="1.8" />
              {/* Stethoscope */}
              {nearPat && <path d="M90,180 Q120,195 130,230" fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeDasharray="4,3" className="animate-pulse" />}
              {nearPat && <circle cx="130" cy="232" r="7" fill="none" stroke="#00d4ff" strokeWidth="2" className="animate-pulse" />}
              {/* Head */}
              <g transform={`translate(${docEye.x * .5},${docEye.y * .5})`} style={{ transition: 'transform 0.12s' }}>
                <circle cx="90" cy="85" r="32" fill="rgba(59,130,246,0.06)" stroke="currentColor" strokeWidth="2" />
                {/* Glasses/visor */}
                <rect x="68" y="78" width="48" height="12" rx="3" fill="rgba(59,130,246,0.15)" stroke="currentColor" strokeWidth="1.2" />
                {/* Eyes */}
                <circle cx={80 + docEye.x} cy={84 + docEye.y} r="3" fill="currentColor" />
                <circle cx={100 + docEye.x} cy={84 + docEye.y} r="3" fill="currentColor" />
                {/* Mouth */}
                <path d={nearDoc ? "M80,103 Q90,112 100,103" : "M82,103 L98,103"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
              {/* Arms */}
              <path d="M37,183 Q18,215 28,248" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M143,183 Q162,215 152,248" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {/* Tablet */}
              <rect x="150" y="205" width="25" height="35" rx="3" fill="rgba(59,130,246,0.1)" stroke="currentColor" strokeWidth="1.5" />
              {nearPat && <>
                <line x1="153" y1="212" x2="172" y2="212" stroke="#60a5fa" strokeWidth="1" />
                <line x1="153" y1="218" x2="168" y2="218" stroke="#60a5fa" strokeWidth="1" />
                <line x1="153" y1="224" x2="170" y2="224" stroke="#60a5fa" strokeWidth="1" />
              </>}
            </svg>

            <div className="text-center font-mono">
              <p className="text-[10px] text-slate-500 uppercase">Doctor State</p>
              <p className="text-xs font-bold text-blue-300 mt-1 uppercase">
                {nearDoc ? '👁️ TRACKING YOU' : nearPat ? '🩺 EXAMINING PATIENT' : '💤 STANDBY'}
              </p>
            </div>
          </div>

          {/* Patient */}
          <div ref={patRef} className="glass-dark rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col items-center justify-between"
            style={{ border: `1px solid rgba(239,68,68,${nearPat ? 0.4 : 0.15})`, boxShadow: nearPat ? '0 0 25px rgba(239,68,68,0.12)' : 'none', transition: 'all 0.3s' }}>
            <div className="text-[9px] font-mono text-red-400/60 uppercase">PATIENT_DOCK</div>

            <svg width="180" height="260" viewBox="0 0 180 260" style={{ color: 'rgba(248,113,113,0.7)' }}>
              {/* Chair */}
              <path d="M35,160 L145,160 M45,160 L45,250 M135,160 L135,250 M30,250 L155,250" stroke="rgba(100,100,120,0.5)" strokeWidth="3" strokeLinecap="round" />
              <path d="M30,100 L30,165 M150,100 L150,165" stroke="rgba(100,100,120,0.4)" strokeWidth="2.5" />
              {/* Patient body */}
              <path d="M55,155 L125,155 L115,205 L65,205 Z" fill="rgba(239,68,68,0.05)" stroke="currentColor" strokeWidth="1.8" />
              {/* Head */}
              <circle cx="90" cy="80" r="28" fill="rgba(239,68,68,0.04)" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="82" cy="77" r="2.5" fill="currentColor" />
              <circle cx="98" cy="77" r="2.5" fill="currentColor" />
              {/* Patient looks a bit nervous near doctor */}
              <path d={nearPat ? "M82,92 Q90,85 98,92" : "M82,92 L98,92"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              {/* Legs */}
              <line x1="70"  y1="205" x2="65"  y2="245" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="110" y1="205" x2="115" y2="245" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="text-center font-mono">
              <p className="text-[10px] text-slate-500 uppercase">Patient State</p>
              <p className="text-xs font-bold text-red-300 mt-1 uppercase">{nearPat ? '⚡ BEING EXAMINED' : '😌 WAITING'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 5 — LEGAL AI (Detective Office)
   AMBER — Rain, dim office, binoculars tracking,
   evidence board, clue strings, magnifier
═══════════════════════════════════════════════════ */
export function DetectiveSection() {
  const ref = useRef(null);
  const detRef = useRef(null);
  const [moving, setMoving] = useState(false);
  const [angle, setAngle] = useState(0);
  const [evidence, setEvidence] = useState(false);
  const [rainDrops] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, dur: 1 + Math.random() * 1.2, delay: Math.random() * 2, height: 40 + Math.random() * 40,
  })));
  const timer = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (!detRef.current) return;
      const r  = detRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const a  = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
      setAngle(a);
      setMoving(true);
      setEvidence(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setMoving(false); setEvidence(true); }, 1100);
    };
    window.addEventListener('mousemove', fn);
    return () => { window.removeEventListener('mousemove', fn); clearTimeout(timer.current); };
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(120,80,0,0.08) 0%,transparent 60%),#07050a' }}>

      {/* Dim amber spotlight */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle 400px at 50% 50%,rgba(180,100,0,0.05),transparent 80%)' }} />

      <div className="absolute top-8 left-8 font-mono text-[10px] text-amber-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />SEC_04 · LEGALAI — INVESTIGATION_OFFICE
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Rain window + evidence board */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-white">LegalAI <span className="tg-amber" style={{ color: '#fbbf24' }}>Detective</span></h2>
          <p className="text-sm text-slate-400 leading-relaxed">AI-powered legal document analyser. Evidence mapping, contract review, anomaly detection.</p>

          {/* Rain window */}
          <div className="relative h-40 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(20,18,40,0.95)', border: '2px solid rgba(100,80,40,0.3)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)' }}>
            {rainDrops.map(d => (
              <div key={d.id} className="rain-drop" style={{ left: `${d.left}%`, height: d.height, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
            ))}
            <div className="absolute inset-0 grid grid-cols-3" style={{ borderLeft: '1px solid rgba(80,60,20,0.4)', borderRight: '1px solid rgba(80,60,20,0.4)' }}>
              <div style={{ borderRight: '1px solid rgba(80,60,20,0.4)' }} />
              <div style={{ borderRight: '1px solid rgba(80,60,20,0.4)' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-mono text-amber-600/60 uppercase tracking-widest">OUTSIDE · RAINY NIGHT</span>
            </div>
          </div>

          {/* Evidence Board */}
          <div className="glass-dark rounded-2xl p-4 relative overflow-hidden" style={{ border: `1px solid rgba(245,158,11,${evidence ? 0.4 : 0.15})` }}>
            <div className="flex justify-between mb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase">EVIDENCE BOARD</span>
              <span className={`text-[9px] font-mono ${evidence ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>{evidence ? '🔴 ACTIVE' : 'STANDBY'}</span>
            </div>
            <svg width="100%" height="110" viewBox="0 0 260 110">
              <circle cx="30"  cy="25"  r="8" fill={evidence ? '#f59e0b' : 'rgba(100,80,20,0.4)'} style={{ filter: evidence ? 'drop-shadow(0 0 6px #f59e0b)' : 'none' }} />
              <circle cx="130" cy="55"  r="9" fill={evidence ? '#ef4444' : 'rgba(100,80,20,0.4)'} style={{ filter: evidence ? 'drop-shadow(0 0 8px #ef4444)' : 'none' }} />
              <circle cx="230" cy="30"  r="7" fill={evidence ? '#f59e0b' : 'rgba(100,80,20,0.4)'} style={{ filter: evidence ? 'drop-shadow(0 0 6px #f59e0b)' : 'none' }} />
              <circle cx="70"  cy="90"  r="7" fill={evidence ? '#f59e0b' : 'rgba(100,80,20,0.4)'} style={{ filter: evidence ? 'drop-shadow(0 0 6px #f59e0b)' : 'none' }} />
              {evidence && <>
                <line x1="30" y1="25" x2="130" y2="55" stroke="#ef4444" strokeWidth="1.5" className="string-line" />
                <line x1="230" y1="30" x2="130" y2="55" stroke="#ef4444" strokeWidth="1.5" className="string-line" />
                <line x1="70" y1="90" x2="130" y2="55" stroke="#ef4444" strokeWidth="1.5" className="string-line" />
                <line x1="70" y1="90" x2="30" y2="25" stroke="#ef4444" strokeWidth="1" className="string-line" strokeOpacity="0.6" />
              </>}
            </svg>
            <p className="text-[9px] font-mono text-amber-500/60 uppercase">{evidence ? '// CLUES CONNECTED · CASE MAPPED' : '// STOP CURSOR TO REVEAL CONNECTIONS'}</p>
          </div>
        </div>

        {/* RIGHT: Detective character */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-6 items-center">

          {/* Detective */}
          <div ref={detRef} className="glass-dark rounded-3xl p-5 relative overflow-hidden min-h-[380px] flex flex-col items-center justify-between"
            style={{ border: `1px solid rgba(245,158,11,${moving ? 0.4 : 0.15})`, transition: 'border-color 0.3s' }}>
            <div className="text-[9px] font-mono text-amber-400/60 uppercase">SYS_INVESTIGATOR</div>

            <svg width="180" height="270" viewBox="0 0 180 270" style={{ color: '#fbbf24' }}>
              {/* Hat */}
              <path d="M50,60 L130,60 M55,60 L55,42 L125,42 L125,60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M42,60 L138,60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Head */}
              <circle cx="90" cy="88" r="26" fill="rgba(245,158,11,0.04)" stroke="currentColor" strokeWidth="2" />
              <circle cx="83" cy="85" r="2.5" fill="currentColor" />
              <circle cx="97" cy="85" r="2.5" fill="currentColor" />
              <path d={moving ? "M83,100 Q90,106 97,100" : "M84,100 L96,100"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Coat */}
              <path d="M40,180 L140,180 L128,265 L52,265 Z" fill="rgba(245,158,11,0.04)" stroke="currentColor" strokeWidth="1.8" />
              {/* Arms */}
              <path d="M42,184 Q22,215 35,250" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {moving
                /* Raised binoculars arm */
                ? <g style={{ transform: `rotate(${angle * .12}deg)`, transformOrigin: '138px 184px' }}>
                    <path d="M138,184 Q160,150 155,115" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="148" y="105" width="32" height="12" rx="3" fill="rgba(245,158,11,0.15)" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="154" cy="111" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="174" cy="111" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </g>
                /* Writing arm */
                : <path d="M138,184 Q158,215 148,250" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              }
              {/* Notes */}
              {!moving && <>
                <rect x="145" y="220" width="25" height="32" rx="2" fill="rgba(245,158,11,0.08)" stroke="currentColor" strokeWidth="1.2" />
                <line x1="148" y1="228" x2="167" y2="228" stroke="currentColor" strokeWidth="1" />
                <line x1="148" y1="233" x2="165" y2="233" stroke="currentColor" strokeWidth="1" />
                <line x1="148" y1="238" x2="166" y2="238" stroke="currentColor" strokeWidth="1" />
              </>}
            </svg>

            <p className="text-xs font-bold font-mono uppercase" style={{ color: '#fbbf24' }}>
              {moving ? '🔭 TRACKING CURSOR' : '✍️ RECORDING CLUES'}
            </p>
          </div>

          {/* Case Files Panel */}
          <div className="glass-dark rounded-3xl p-5 relative overflow-hidden min-h-[380px] flex flex-col justify-between"
            style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
            <div>
              <div className="text-[9px] font-mono text-amber-400/60 uppercase mb-3">CASE_LOG_FILE #2026-SC</div>
              {evidence ? (
                <div className="space-y-3 animate-pulse font-mono text-[11px]">
                  <p className="text-white font-bold">// FINGERPRINT MATCH:</p>
                  <div className="p-2.5 rounded-lg text-amber-300" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    ID: S_CHATTERJEE<br />CONF: 99.87%<br />CLASS: FULL_STACK_DEVELOPER
                  </div>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    · Web design excellence verified.<br />
                    · Magnetic physics patterns confirmed.<br />
                    · AI system telemetry logged.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-slate-600 font-mono text-[10px] gap-3">
                  <span className="text-3xl">🔍</span>
                  <span className="uppercase">STOP CURSOR TO DECRYPT FILES</span>
                </div>
              )}
            </div>
            <div className="border-t border-amber-500/10 pt-3 flex justify-between font-mono text-[8px] text-amber-500/40 uppercase">
              <span>CASE: OPEN</span><span>SECURE: YES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 6 — PRESCRIPTION OCR
   EMERALD — Hospital desk, laser scan, medicine highlights
═══════════════════════════════════════════════════ */
export function PrescriptionSection() {
  const [scanning, setScanning] = useState(false);
  const meds = ['Metformin 500mg','Amoxicillin 250mg','Atorvastatin 20mg'];

  return (
    <section className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 60% 40%,rgba(0,255,135,0.06) 0%,transparent 55%),#000c06' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-emerald-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />SEC_05 · PRESCRIPTION_OCR_ENGINE
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* RX Card */}
        <div className="flex flex-col items-center gap-4">
          {/* Scanner head above */}
          <div className="w-3/4 h-8 rounded-xl flex items-center justify-center relative"
            style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.2)' }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all duration-300 ${scanning ? 'animate-spin-med' : ''}`}
              style={{ color: scanning ? '#00ff87' : 'rgba(0,255,135,0.3)', filter: scanning ? 'drop-shadow(0 0 8px #00ff87)' : 'none' }}>
              ⊙
            </div>
            {scanning && <span className="ml-2 text-[9px] font-mono text-emerald-400 uppercase animate-pulse">SCANNING ACTIVE</span>}
          </div>

          {/* Prescription card */}
          <div
            onMouseEnter={() => setScanning(true)}
            onMouseLeave={() => setScanning(false)}
            className="w-full max-w-sm glass-dark rounded-2xl p-8 relative overflow-hidden cursor-pointer transition-all duration-300"
            style={{ border: `1px solid rgba(0,255,135,${scanning ? 0.5 : 0.15})`, boxShadow: scanning ? '0 0 40px rgba(0,255,135,0.12)' : 'none' }}>
            {scanning && <div className="scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(0,255,135,0.5),transparent)', boxShadow: '0 0 12px rgba(0,255,135,0.6)' }} />}

            <div className="border-b pb-4 mb-5 flex justify-between" style={{ borderColor: 'rgba(0,255,135,0.12)' }}>
              <div>
                <p className="font-bold text-white text-sm">Rx MEDICAL CARD</p>
                <p className="text-[9px] font-mono text-emerald-500/60 uppercase mt-0.5">CLOUD_RX · SOUMIK HEALTHCARE</p>
              </div>
              <span className="text-xl">💊</span>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-500">
              <p>PATIENT: Soumik Chatterjee</p>
              <p>DATE: 11-JUL-2026</p>
              <div className="mt-4 space-y-3 pt-3" style={{ borderTop: '1px solid rgba(0,255,135,0.08)' }}>
                {meds.map((m, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="transition-all duration-300 rounded px-1"
                      style={scanning ? { color: '#00ff87', background: 'rgba(0,255,135,0.08)', fontWeight: 700 } : { color: '#64748b' }}>
                      — {m}
                    </span>
                    {scanning && <span className="text-[9px] text-emerald-400 animate-pulse">{95 + i}%</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 text-center text-[9px] font-mono" style={{ borderTop: '1px solid rgba(0,255,135,0.08)', color: scanning ? 'rgba(0,255,135,0.6)' : 'rgba(100,116,139,0.5)' }}>
              {scanning ? '⚡ AI LASER SCAN ACTIVE' : '💡 HOVER TO SCAN'}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            OCR_ENGINE: {scanning ? 'SYNCED' : 'STANDBY'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Prescription <span className="tg-emerald" style={{ color: '#00ff87' }}>Parser</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Hover the prescription to activate the AI scanner. Unstructured medical text is parsed in real-time into structured digital data.
          </p>

          <div className="glass-dark rounded-2xl p-5 min-h-[220px] relative overflow-hidden"
            style={{ border: '1px solid rgba(0,255,135,0.2)', boxShadow: scanning ? '0 0 20px rgba(0,255,135,0.06)' : 'none' }}>
            {scanning && <div className="scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(0,255,135,0.3),transparent)' }} />}
            {scanning ? (
              <div className="space-y-3 font-mono text-xs">
                <p className="text-slate-500 text-[10px]">// PARSED OUTPUT</p>
                <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto">{`{
  "patient": "Soumik Chatterjee",
  "date": "2026-07-11",
  "compounds": [
    { "name": "Metformin",    "conf": 0.99, "dose": "500mg" },
    { "name": "Amoxicillin",  "conf": 0.98, "dose": "250mg" },
    { "name": "Atorvastatin", "conf": 0.96, "dose": "20mg"  }
  ],
  "status": "CLASSIFIED"
}`}</pre>
                {/* Floating hologram tags */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {meds.map((m, i) => (
                    <div key={i} className="px-2 py-1 rounded-full text-[9px] font-mono text-emerald-300 animate-float"
                      style={{ background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.3)', animationDelay: `${i * 0.4}s` }}>
                      💊 {m.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-600 font-mono text-[10px] text-center gap-2">
                <span className="text-2xl">📋</span>
                <span className="uppercase">HOVER PRESCRIPTION CARD TO PARSE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 7 — X-RAY ANALYZER
   STEEL BLUE — Dark radiology room, 3D tilt,
   bone hover detection, heatmap, doctor pointer
═══════════════════════════════════════════════════ */
export function RadiologySection() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bone, setBone] = useState(null);
  const bones = {
    skull:    { label: 'CRANIAL VAULT',   status: 'NOMINAL',      desc: 'No fractures. Intracranial pressure 12 mmHg. Optimal density.', cx: 100, cy: 35 },
    spine:    { label: 'CERVICAL SPINE',  status: 'NOMINAL',      desc: 'Correct alignment. Disk space preserved. No osteophyte signs.', cx: 100, cy: 95 },
    clavicle: { label: 'CLAVICLE GRID',   status: '⚠️ STRESS',   desc: 'Micro-stress detected in left clavicle. Recommend physiotherapy.', cx: 140, cy: 78 },
  };

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({ x: -((e.clientY - r.top - r.height / 2) / r.height) * 18, y: ((e.clientX - r.left - r.width / 2) / r.width) * 18 });
  };
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setBone(null); };

  return (
    <section className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 40% 50%,rgba(14,165,233,0.07) 0%,transparent 55%),#00080f' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-sky-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />SEC_06 · X-RAY_IMAGING_ANALYZER
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* 3D X-ray Display */}
        <div className="lg:col-span-7 flex justify-center">
          <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
            className="w-full max-w-md h-[460px] glass-dark rounded-3xl p-6 relative overflow-hidden cursor-crosshair"
            style={{
              border: '2px solid rgba(14,165,233,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.1s ease-out',
            }}>

            {/* Scan overlay */}
            <div className="scan-bar" style={{ background: 'linear-gradient(to bottom,transparent,rgba(14,165,233,0.3),transparent)', boxShadow: '0 0 10px rgba(14,165,233,0.4)' }} />

            {/* HUD corners */}
            {[['top-3 left-3','border-t border-l'],['top-3 right-3','border-t border-r'],['bottom-3 left-3','border-b border-l'],['bottom-3 right-3','border-b border-r']].map(([pos, brd]) => (
              <div key={pos} className={`absolute ${pos} w-5 h-5 ${brd} border-sky-400/50`} />
            ))}

            {/* Header info */}
            <div className="z-10 flex justify-between font-mono text-[9px] text-sky-400/60 mb-4">
              <div><p>ID: SC-9093</p><p>HIGH_RES_CT</p></div>
              <div className="text-right"><p>3D_ROT: ON</p><p className="animate-pulse">READY</p></div>
            </div>

            {/* X-ray SVG */}
            <div className="relative flex items-center justify-center flex-1 h-[320px]">
              <svg viewBox="0 0 200 280" className="w-48 h-72">
                {/* Skull */}
                <path d="M100,20 Q122,20 122,42 Q122,64 100,64 Q78,64 78,42 Q78,20 100,20 Z"
                  fill={bone === 'skull' ? 'rgba(14,165,233,0.25)' : 'none'}
                  stroke={bone === 'skull' ? '#38bdf8' : 'rgba(14,165,233,0.4)'}
                  strokeWidth="2.5" className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setBone('skull')} />

                {/* Spine */}
                <path d="M100,64 L100,180 M95,75 L105,75 M95,90 L105,90 M95,105 L105,105 M95,120 L105,120 M95,135 L105,135 M95,150 L105,150 M95,165 L105,165"
                  fill="none" stroke={bone === 'spine' ? '#38bdf8' : 'rgba(14,165,233,0.4)'}
                  strokeWidth="2.5" className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setBone('spine')} />

                {/* Clavicles */}
                <path d="M100,78 Q122,76 145,82"
                  fill="none" stroke={bone === 'clavicle' ? '#38bdf8' : 'rgba(14,165,233,0.4)'}
                  strokeWidth="2.5" className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setBone('clavicle')} />
                <path d="M100,78 Q78,76 55,82" fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="2" />

                {/* Ribcage */}
                <path d="M65,100 Q100,90 135,100 M60,117 Q100,106 140,117 M60,134 Q100,123 140,134" fill="none" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5" />

                {/* Heatmap glow on active bone */}
                {bone && <circle cx={bones[bone].cx} cy={bones[bone].cy} r="18" fill="rgba(239,68,68,0.15)" className="animate-pulse" />}

                {/* Doctor pointer arrow */}
                {bone && <path d={`M${bones[bone].cx + 30},${bones[bone].cy - 20} L${bones[bone].cx + 5},${bones[bone].cy}`}
                  stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />}
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 Z" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
            </div>

            <p className="text-[8px] font-mono text-sky-500/35 uppercase text-center">// HOVER OVER SKULL · SPINE · CLAVICLE</p>
          </div>
        </div>

        {/* Report Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            IMAGING DIAGNOSTICS
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Radiology <span style={{ color: '#38bdf8' }} className="tg-blue">AI</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Hover over skeletal structures to trigger automated bone density analytics, joint validation, and stress-fracture AI classification.
          </p>

          <div className="glass-dark rounded-2xl p-5 min-h-[200px] flex flex-col justify-between"
            style={{ border: '1px solid rgba(14,165,233,0.25)', boxShadow: bone ? '0 0 20px rgba(14,165,233,0.08)' : 'none' }}>
            {bone ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
                  <span className="text-white font-bold font-mono text-sm">{bones[bone].label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                    style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', color: '#7dd3fc' }}>
                    {bones[bone].status}
                  </span>
                </div>
                <p className="text-sky-200 text-[11px] leading-relaxed font-mono">{bones[bone].desc}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto text-center text-slate-600 font-mono text-[10px] gap-2">
                <span className="text-2xl">🦴</span>
                <span className="uppercase">SELECT A BONE ON THE X-RAY DISPLAY</span>
              </div>
            )}
            <div className="border-t border-sky-500/10 pt-2 flex justify-between font-mono text-[8px] text-sky-500/40 uppercase mt-4">
              <span>DOCTOR: {bone ? '🎯 POINTING' : '💤 IDLE'}</span>
              <span>AI: VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 8 — AI CHATBOT ROBOT
   PINK/VIOLET — Cute robot on futuristic chair,
   blinks, waves, speech bubble, live chat terminal
═══════════════════════════════════════════════════ */
export function ChatbotSection() {
  const botRef = useRef(null);
  const [near, setNear]   = useState(false);
  const [look, setLook]   = useState({ x: 0, y: 0 });
  const [msgs, setMsgs]   = useState([{ role: 'bot', text: "Hello! I'm Soumik's AI assistant. Ask me anything!" }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const fn = (e) => {
      if (!botRef.current) return;
      const r = botRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const n = d < 380;
      setNear(n);
      if (n) { const a = Math.atan2(e.clientY - cy, e.clientX - cx); setLook({ x: Math.cos(a) * 9, y: Math.sin(a) * 9 }); }
      else setLook({ x: 0, y: 0 });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs(p => [...p, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      let r = "Soumik is passionate about AI, design, and building premium experiences!";
      if (/how is soumik doing|what is soumik doing|how is he doing/i.test(q)) {
        r = "Soumik is doing fantastic! Currently, he is learning Python and building interactive 3D web applications.";
      } else if (/skill|tech|stack/i.test(q)) {
        r = "React, Node.js, Python, TensorFlow, MongoDB — all in Soumik's arsenal!";
      } else if (/contact|email|hire/i.test(q)) {
        r = "soumik7484@gmail.com — scroll to the Contact terminal below!";
      } else if (/project/i.test(q)) {
        r = "MedAI, LegalAI, PrescriptionOCR, X-Ray Analyzer — all interactive, all cinematic!";
      }
      setMsgs(p => [...p, { role: 'bot', text: r }]);
      setTyping(false);
    }, 1600);
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 30% 40%,rgba(236,72,153,0.07) 0%,transparent 55%),radial-gradient(ellipse at 70% 60%,rgba(124,58,237,0.06) 0%,transparent 50%),#0a0012' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-pink-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />SEC_07 · AI_COMPANION_ROBOT
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Robot on Chair */}
        <div className="flex flex-col items-center relative min-h-[480px] justify-center">

          {/* Speech bubble */}
          <div className={`absolute top-0 glass-dark rounded-2xl px-5 py-3 font-mono text-sm transition-all duration-500 ${
            near ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`} style={{ border: '1px solid rgba(236,72,153,0.35)', boxShadow: '0 0 20px rgba(236,72,153,0.1)', color: '#f9a8d4' }}>
            🤖 "Hello! Ask me anything."
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
              style={{ background: 'rgba(15,5,25,0.9)', border: '0 1px 1px rgba(236,72,153,0.35)' }} />
          </div>

          {/* Robot SVG */}
          <div ref={botRef} className="animate-float mt-16">
            <svg width="240" height="320" viewBox="0 0 240 320" style={{ color: '#f472b6' }}>
              {/* Futuristic Chair */}
              <path d="M50,220 Q120,205 190,220 L178,310 Q120,318 62,310 Z" fill="rgba(236,72,153,0.04)" stroke="rgba(167,139,250,0.4)" strokeWidth="2" />
              <line x1="120" y1="260" x2="120" y2="312" stroke="rgba(167,139,250,0.4)" strokeWidth="3" />
              <path d="M80,312 L160,312" stroke="rgba(167,139,250,0.4)" strokeWidth="3" strokeLinecap="round" />
              <path d="M45,120 L45,225 M195,120 L195,225" stroke="rgba(167,139,250,0.2)" strokeWidth="2.5" />

              {/* Robot Head (tracks cursor) */}
              <g transform={`translate(${look.x},${look.y})`} style={{ transition: 'transform 0.15s ease-out' }}>
                {/* Helmet */}
                <rect x="78" y="60" width="84" height="60" rx="18" fill="rgba(15,5,25,0.9)" stroke="currentColor" strokeWidth="2.5" />
                {/* Faceplate */}
                <rect x="86" y="70" width="68" height="40" rx="10" fill="rgba(236,72,153,0.08)" stroke="currentColor" strokeWidth="1.5" />
                {/* Eyes */}
                <circle cx={104 + look.x * .4} cy={87 + look.y * .4} r="5" fill="currentColor" style={{ filter: 'drop-shadow(0 0 4px #f472b6)' }}
                  className="animate-pulse" />
                <circle cx={136 + look.x * .4} cy={87 + look.y * .4} r="5" fill="currentColor" style={{ filter: 'drop-shadow(0 0 4px #f472b6)' }}
                  className="animate-pulse" />
                {/* Blink ring */}
                <circle cx={104 + look.x * .4} cy={87 + look.y * .4} r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                <circle cx={136 + look.x * .4} cy={87 + look.y * .4} r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                {/* Mouth */}
                {near
                  ? <path d="M104,108 Q120,120 136,108" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  : <line x1="106" y1="108" x2="134" y2="108" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                {/* Ear nodes */}
                <circle cx="75"  cy="90" r="5" fill="currentColor" />
                <circle cx="165" cy="90" r="5" fill="currentColor" />
                {/* Antenna */}
                <line x1="120" y1="60" x2="120" y2="44" stroke="currentColor" strokeWidth="2" />
                <circle cx="120" cy="40" r="4" fill="currentColor" className="animate-ping" />
              </g>

              {/* Torso */}
              <rect x="84" y="125" width="72" height="55" rx="14" fill="rgba(15,5,25,0.9)" stroke="currentColor" strokeWidth="2" />
              {/* Chest core */}
              <circle cx="120" cy="152" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" />
              <circle cx="120" cy="152" r="4" fill="currentColor" />

              {/* Left arm idle */}
              <path d="M86,130 Q62,160 72,195" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Right arm — waves if near */}
              {near
                ? <path d="M154,130 Q185,100 178,68" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    style={{ transformOrigin: '154px 130px', animation: 'wave 1.3s ease-in-out infinite' }} />
                : <path d="M154,130 Q178,160 168,195" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
            </svg>
          </div>
        </div>

        {/* Chat Terminal */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-pink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />AI COMPANION TERMINAL
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Talk to <span style={{ color: '#f472b6' }} className="tg-pink">the Bot</span>
          </h2>

          <div className="glass-dark rounded-2xl flex flex-col h-[380px]" style={{ border: '1px solid rgba(236,72,153,0.2)' }}>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {msgs.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl font-mono text-[11px] leading-relaxed max-w-[85%] ${
                  m.role === 'bot' ? 'mr-auto' : 'ml-auto text-right'
                }`} style={{
                  background: m.role === 'bot' ? 'rgba(236,72,153,0.08)' : 'rgba(124,58,237,0.1)',
                  border: `1px solid ${m.role === 'bot' ? 'rgba(236,72,153,0.2)' : 'rgba(124,58,237,0.2)'}`,
                  color: m.role === 'bot' ? '#fda4af' : '#c4b5fd',
                }}>
                  <span className="block text-[8px] uppercase mb-1" style={{ color: 'rgba(148,163,184,0.5)' }}>{m.role === 'bot' ? 'Robot' : 'You'}</span>
                  {m.text}
                </div>
              ))}
              {typing && <div className="p-3 rounded-xl font-mono text-[11px] mr-auto animate-pulse"
                style={{ background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.15)', color: 'rgba(253,164,175,0.6)' }}>
                typing...
              </div>}
            </div>

            {/* Input */}
            <form onSubmit={send} className="flex gap-2 p-3 border-t" style={{ borderColor: 'rgba(236,72,153,0.1)' }}>
              <input data-interactive value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about skills, projects, contact..."
                className="flex-1 bg-transparent text-xs font-mono text-pink-200 focus:outline-none placeholder-pink-900" />
              <button data-magnetic data-interactive type="submit"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black transition-all"
                style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', boxShadow: '0 0 10px rgba(236,72,153,0.4)' }}>
                ↑
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`@keyframes wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-26deg)}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 9 — SKILLS COMMAND CENTER
   MULTI-COLOR — React=blue, MongoDB=green, Python=yellow,
   TensorFlow=orange, Node=lime. Electric particles on hover.
═══════════════════════════════════════════════════ */
export function SkillsSection() {
  const [active, setActive] = useState(null);

  const skills = [
    {
      id:'react', name:'React.js', level:95, color:'#60a5fa', shadow:'rgba(96,165,250,0.4)',
      desc:'High-performance UI, custom hooks, state management, interactive graphics modules.',
      icon:(c)=>(
        <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ color: c }}>
          <ellipse cx="40" cy="40" rx="8" ry="25" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 8s linear infinite' }} />
          <ellipse cx="40" cy="40" rx="8" ry="25" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 8s linear infinite', transform:'rotate(60deg)',transformOrigin:'40px 40px' }} />
          <ellipse cx="40" cy="40" rx="8" ry="25" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 8s linear infinite', transform:'rotate(120deg)',transformOrigin:'40px 40px' }} />
          <circle cx="40" cy="40" r="5" fill="currentColor" className="animate-pulse" />
        </svg>
      ),
    },
    {
      id:'mongodb', name:'MongoDB', level:90, color:'#4ade80', shadow:'rgba(74,222,128,0.4)',
      desc:'NoSQL clustering, aggregation pipelines, index optimization, transactional logs.',
      icon:(c)=>(
        <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ color: c }}>
          <line x1="40" y1="75" x2="40" y2="35" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="40" y1="55" x2="20" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="45" x2="60" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="35" x2="20" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="35" r="5" fill="currentColor" className="animate-pulse" />
          <circle cx="20" cy="38" r="4" fill="currentColor" />
          <circle cx="60" cy="28" r="4" fill="currentColor" />
          <circle cx="20" cy="22" r="3.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id:'python', name:'Python', level:93, color:'#facc15', shadow:'rgba(250,204,21,0.4)',
      desc:'Machine learning, neural net training, data pipelines, backend microservices.',
      icon:(c)=>(
        <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ color: c }}>
          <path d="M20,40 Q32,20 40,40 Q48,60 60,40 Q48,20 40,40 Q32,60 20,40 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="60" cy="40" r="5" fill="currentColor" className="animate-bounce" />
        </svg>
      ),
    },
    {
      id:'tensorflow', name:'TensorFlow', level:88, color:'#fb923c', shadow:'rgba(251,146,60,0.4)',
      desc:'Deep CNNs, transformer architectures, model deployment, tensor matrix processing.',
      icon:(c)=>(
        <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ color: c }}>
          <line x1="40" y1="14" x2="20" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="14" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="40" x2="40" y2="66" stroke="currentColor" strokeWidth="1.5" />
          <line x1="60" y1="40" x2="40" y2="66" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="40" cy="14" r="7" fill="currentColor" />
          <circle cx="20" cy="40" r="7" fill="currentColor" className="animate-pulse" />
          <circle cx="60" cy="40" r="7" fill="currentColor" className="animate-pulse" />
          <circle cx="40" cy="66" r="7" fill="currentColor" />
        </svg>
      ),
    },
    {
      id:'node', name:'Node.js', level:92, color:'#86efac', shadow:'rgba(134,239,172,0.4)',
      desc:'Async event loops, REST APIs, WebSocket servers, microservice scaling.',
      icon:(c)=>(
        <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ color: c }}>
          <polygon points="40,10 72,28 72,62 40,70 8,62 8,28" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-pulse" />
          <polygon points="40,20 64,34 64,56 40,62 16,56 16,34" fill="rgba(134,239,172,0.06)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="7" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section id="skills" className="relative min-h-screen flex items-center py-20 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(99,102,241,0.06) 0%,transparent 55%),#030010' }}>

      <div className="absolute top-8 left-8 font-mono text-[10px] text-indigo-500/40 uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />SEC_08 · CORE_SKILLS_COMMAND_CENTER
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-14">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-400/70 mb-3">FLOATING SKILL HOLOGRAMS</p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            Technical <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Mastery</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto">Hover each hologram to inject energy and view detailed subsystem telemetry.</p>
        </div>

        {/* Skill Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full">
          {skills.map(sk => (
            <div key={sk.id} data-interactive
              onMouseEnter={() => setActive(sk.id)}
              onMouseLeave={() => setActive(null)}
              className="glass-dark rounded-2xl p-5 flex flex-col items-center gap-4 cursor-pointer transition-all duration-500 relative overflow-hidden"
              style={{
                border: `1px solid ${active === sk.id ? sk.color : 'rgba(255,255,255,0.06)'}`,
                boxShadow: active === sk.id ? `0 0 30px ${sk.shadow}` : 'none',
                transform: active === sk.id ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
              }}>
              {active === sk.id && <>
                <div className="scan-bar" style={{ background: `linear-gradient(to bottom,transparent,${sk.color}55,transparent)`, boxShadow: `0 0 8px ${sk.color}` }} />
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full animate-ping" style={{ background: sk.color }} />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full animate-ping" style={{ background: sk.color }} />
              </>}
              {sk.icon(sk.color)}
              <div className="w-full text-center">
                <p className="font-mono text-sm font-bold text-white uppercase">{sk.name}</p>
                <div className="w-full h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: active === sk.id ? `${sk.level}%` : '15%', background: sk.color, boxShadow: `0 0 6px ${sk.color}` }} />
                </div>
                <p className="text-[10px] font-mono mt-1.5" style={{ color: `${sk.color}99` }}>CAPACITY: {sk.level}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Telemetry panel */}
        <div className="w-full max-w-3xl glass-dark rounded-2xl p-6 min-h-[130px] flex flex-col justify-between relative overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-2 mb-3">
            <span style={{ color:'#818cf8' }} className="text-xs font-mono uppercase">TELEMETRY_LOG</span>
          </div>
          {active ? (
            <div className="font-mono text-xs animate-pulse">
              <span className="text-white font-bold block mb-1">&gt; ACTIVE: {skills.find(s=>s.id===active).name}</span>
              <p className="text-slate-400 leading-relaxed">{skills.find(s=>s.id===active).desc}</p>
            </div>
          ) : (
            <p className="text-slate-600 font-mono text-[10px] uppercase text-center my-auto">// SYSTEM IDLE · HOVER A SKILL HOLOGRAM TO VIEW TELEMETRY</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PART 10 — CONTACT TERMINAL
   INDIGO/SPACE — Robot walks, satellite transmits,
   emerald laser beam, success animation, interactive
   social character animations (Cat, Suited Man, Postman)
═══════════════════════════════════════════════════ */

function GithubCatCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="https://github.com/soumik7484-art" target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center p-3 rounded-2xl glass transition-all duration-300 hover:scale-105"
      style={{
        width: '130px',
        border: hovered ? '1px solid #00ff87' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 0 25px rgba(0,255,135,0.2)' : 'none',
      }}>
      <div className="w-20 h-24 relative flex items-center justify-center">
        <svg viewBox="0 0 100 120" className="w-full h-full text-emerald-400">
          <polygon points="25,35 15,12 36,28" fill="rgba(0,255,135,0.08)" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="75,35 85,12 64,28" fill="rgba(0,255,135,0.08)" stroke="currentColor" strokeWidth="1.8" />
          <rect x="26" y="26" width="48" height="40" rx="14" fill="rgba(10,30,20,0.9)" stroke="currentColor" strokeWidth="2" />
          <circle cx="40" cy="42" r="3.5" fill="currentColor" />
          <circle cx="60" cy="42" r="3.5" fill="currentColor" />
          <polygon points="50,49 47,46 53,46" fill="currentColor" />
          <line x1="20" y1="46" x2="32" y2="48" stroke="currentColor" strokeWidth="1.2" />
          <line x1="20" y1="52" x2="32" y2="51" stroke="currentColor" strokeWidth="1.2" />
          <line x1="80" y1="46" x2="68" y2="48" stroke="currentColor" strokeWidth="1.2" />
          <line x1="80" y1="52" x2="68" y2="51" stroke="currentColor" strokeWidth="1.2" />
          <path d="M34,66 L66,66 L74,105 L26,105 Z" fill="rgba(0,255,135,0.04)" stroke="currentColor" strokeWidth="1.8" />
          <path d="M74,100 Q88,95 84,75" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transformOrigin: '74px 100px', animation: hovered ? 'catTail 0.8s ease-in-out infinite' : 'none' }} />
          <path d="M28,74 Q12,82 22,92" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M72,74 Q88,82 78,92" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <g transform="translate(36, 74)">
            <rect x="0" y="0" width="28" height="28" rx="6" fill="#000" stroke="#00ff87" strokeWidth="1.5" className="animate-pulse" />
            <path d="M14,4 C8.5,4 4,8.5 4,14 C4,18.4 6.8,22.1 10.8,23.5 C11.3,23.6 11.5,23.3 11.5,23 C11.5,22.8 11.5,22 11.5,21.1 C8.7,21.7 8.1,19.8 8.1,19.8 C7.7,18.7 7,18.4 7,18.4 C6.1,17.8 7.1,17.8 7.1,17.8 C8.1,17.9 8.6,18.9 8.6,18.9 C9.5,20.4 10.9,20 11.5,19.7 C11.6,19 11.9,18.5 12.2,18.2 C10,17.9 7.7,17.1 7.7,13.2 C7.7,12.1 8.1,11.2 8.7,10.5 C8.6,10.2 8.3,9.2 8.8,7.9 C8.8,7.9 9.7,7.6 11.7,9 C12.5,8.8 13.4,8.7 14.3,8.7 C15.2,8.7 16.1,8.8 16.9,9 C18.9,7.6 19.8,7.9 19.8,7.9 C20.3,9.2 20,10.2 19.9,10.5 C20.5,11.2 20.9,12.1 20.9,13.2 C20.9,17.1 18.6,17.9 16.4,18.2 C16.8,18.5 17.1,19.1 17.1,20 C17.1,21.3 17.1,22.4 17.1,22.7 C17.1,23 17.3,23.3 17.8,23.2 C21.8,21.9 24.6,18.2 24.6,13.8 C24.5,8.5 20.1,4 14,4 Z" fill="#00ff87" />
          </g>
        </svg>
      </div>
      <span className="mt-2 text-xs font-mono uppercase text-emerald-300">GitHub</span>
      <span className="absolute -top-10 px-2 py-1 glass rounded text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-emerald-500/20">
        soumik7484-art
      </span>
      <style>{`
        @keyframes catTail { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-20deg)} }
      `}</style>
    </a>
  );
}

function LinkedInManCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="https://www.linkedin.com/in/soumik-chatterjee-810aa1386" target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center p-3 rounded-2xl glass transition-all duration-300 hover:scale-105"
      style={{
        width: '130px',
        border: hovered ? '1px solid #00d4ff' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 0 25px rgba(0,212,255,0.2)' : 'none',
      }}>
      <div className="w-20 h-24 relative flex items-center justify-center">
        <svg viewBox="0 0 100 120" className="w-full h-full text-cyan-400">
          <circle cx="50" cy="30" r="15" fill="rgba(0,212,255,0.08)" stroke="currentColor" strokeWidth="2" />
          <circle cx="45" cy="28" r="2" fill="currentColor" />
          <circle cx="55" cy="28" r="2" fill="currentColor" />
          <path d="M44,36 Q50,42 56,36" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M34,60 L66,60 L74,105 L26,105 Z" fill="rgba(0,212,255,0.04)" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="40,60 50,75 60,60" fill="#fff" stroke="currentColor" strokeWidth="1.2" />
          <polygon points="48,72 52,72 54,92 50,97 46,92" fill="#ef4444"
            style={{ transformOrigin: '50px 72px', animation: hovered ? 'tieWiggle 0.6s ease-in-out infinite' : 'none' }} />
          <path d="M26,68 L14,88" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M74,68 L86,88" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <g transform="translate(36, 76)">
            <rect x="0" y="0" width="28" height="28" rx="6" fill="#000" stroke="#00d4ff" strokeWidth="1.5" className="animate-pulse" />
            <text x="14" y="19" fill="#00d4ff" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">in</text>
          </g>
        </svg>
      </div>
      <span className="mt-2 text-xs font-mono uppercase text-cyan-300">LinkedIn</span>
      <span className="absolute -top-10 px-2 py-1 glass rounded text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-cyan-500/20">
        soumik-chatterjee
      </span>
      <style>{`
        @keyframes tieWiggle { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-15deg)} }
      `}</style>
    </a>
  );
}

function EmailPostmanCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="mailto:soumik7484@gmail.com" target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center p-3 rounded-2xl glass transition-all duration-300 hover:scale-105"
      style={{
        width: '130px',
        border: hovered ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 0 25px rgba(245,158,11,0.2)' : 'none',
      }}>
      <div className="w-20 h-24 relative flex items-center justify-center">
        <svg viewBox="0 0 100 120" className="w-full h-full text-amber-400">
          <path d="M30,30 L70,30 L64,18 L36,18 Z" fill="rgba(245,158,11,0.2)" stroke="currentColor" strokeWidth="1.8" />
          <line x1="28" y1="30" x2="72" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="24" r="2.5" fill="#ef4444" />
          <circle cx="50" cy="42" r="14" fill="rgba(245,158,11,0.08)" stroke="currentColor" strokeWidth="2" />
          <circle cx="45" cy="40" r="2" fill="currentColor" />
          <circle cx="55" cy="40" r="2" fill="currentColor" />
          <path d="M44,48 Q50,54 56,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M34,68 L66,68 L74,106 L26,106 Z" fill="rgba(245,158,11,0.04)" stroke="currentColor" strokeWidth="1.8" />
          <line x1="34" y1="68" x2="74" y2="106" stroke="#ef4444" strokeWidth="1.8" />
          <path d="M26,76 Q12,85 24,95" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M74,76 Q88,85 76,95" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <g transform="translate(32, 80)" style={{ animation: hovered ? 'envelopeFloat 1s ease-in-out infinite' : 'none' }}>
            <rect x="0" y="0" width="36" height="22" rx="3" fill="#000" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M2,2 L18,12 L34,2" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
      <span className="mt-2 text-xs font-mono uppercase text-amber-300">Gmail</span>
      <span className="absolute -top-10 px-2 py-1 glass rounded text-[10px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-amber-500/20">
        soumik7484@gmail.com
      </span>
      <style>{`
        @keyframes envelopeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </a>
  );
}

function InstagramCameramanCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="https://www.instagram.com/imsoumik8?igsh=MWY1cHpmd2JyZzIyaw==" target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center p-3 rounded-2xl glass transition-all duration-300 hover:scale-105"
      style={{
        width: '130px',
        border: hovered ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 0 25px rgba(244,63,94,0.2)' : 'none',
      }}>
      <div className="w-20 h-24 relative flex items-center justify-center">
        <svg viewBox="0 0 100 120" className="w-full h-full text-rose-400">
          <circle cx="50" cy="38" r="14" fill="rgba(244,63,94,0.08)" stroke="currentColor" strokeWidth="2" />
          <circle cx="45" cy="35" r="2" fill="currentColor" />
          <circle cx="55" cy="35" r="2" fill="currentColor" />
          <path d="M45,44 Q50,47 55,44" fill="none" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Cameraman Body */}
          <path d="M26,75 L74,75 L80,110 L20,110 Z" fill="rgba(244,63,94,0.04)" stroke="currentColor" strokeWidth="1.8" />
          
          {/* Arms holding Camera */}
          <path d="M28,78 L38,90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M72,78 L62,90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

          {/* Camera (with flashing lens on hover) */}
          <g transform="translate(36, 80)">
            <rect x="0" y="0" width="28" height="18" rx="3" fill="#000" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="14" cy="9" r="6" stroke="#f43f5e" strokeWidth="1" fill="none" />
            <circle cx="14" cy="9" r="3" fill="#f43f5e" className={hovered ? "animate-ping" : "animate-pulse"} />
            <rect x="8" y="-3" width="12" height="3" fill="#f43f5e" />
          </g>
        </svg>
      </div>
      <span className="mt-2 text-xs font-mono uppercase text-rose-300">Instagram</span>
      <span className="absolute -top-10 px-2 py-1 glass rounded text-[10px] font-mono text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-rose-500/20">
        imsoumik8
      </span>
    </a>
  );
}

export function ContactSection() {
  const botRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [near, setNear] = useState(false);
  const [form, setForm] = useState({ name:'',email:'',subject:'',message:'' });
  const [status, setStatus] = useState('idle'); // idle | sending | success
  const [beam, setBeam] = useState(false);

  useEffect(() => {
    const fn = (e) => {
      if (!botRef.current) return;
      const r = botRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const d  = Math.hypot(dx, e.clientY - cy);
      const n  = d < 350;
      setNear(n);
      setOffset(n ? Math.max(-50, Math.min(50, dx * 0.22)) : 0);
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    setTimeout(() => { setBeam(true); setTimeout(() => { setBeam(false); setStatus('success'); setForm({ name:'',email:'',subject:'',message:'' }); }, 2200); }, 1800);
  };

  return (
    <section id="contact" className="relative min-h-screen flex flex-col py-24 px-6 md:px-16 overflow-hidden grid-bg"
      style={{ background: 'radial-gradient(ellipse at 60% 30%,rgba(99,102,241,0.1) 0%,transparent 55%),#000008' }}>

      <div className="flex items-center gap-2 font-mono text-xs text-indigo-500/40 uppercase mb-12">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />SEC_09 · SPACE_COMMUNICATION_TERMINAL
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* LEFT: Satellite + Robot */}
        <div className="glass-dark rounded-3xl p-8 flex flex-col items-center justify-between min-h-[520px] relative overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.2)' }}>

          {/* Beam column */}
          {beam && <div className="absolute left-1/2 -translate-x-1/2 top-0 w-2 pointer-events-none"
            style={{ height: '100%', background: 'linear-gradient(to bottom,rgba(0,255,135,0.9),rgba(0,212,255,0.3),transparent)', boxShadow: '0 0 20px #00ff87, 0 0 50px #00d4ff', animation: 'float 0.5s ease-in-out infinite' }} />}

          {/* Satellite */}
          <div className="flex flex-col items-center">
            <div className={`p-5 rounded-full transition-all duration-300 ${beam ? 'animate-ping' : ''}`}
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: beam ? '0 0 30px rgba(0,255,135,0.5)' : 'none' }}>
              <span className="text-5xl">🛸</span>
            </div>
            <div className="w-px h-12 mt-2" style={{ background: 'linear-gradient(to bottom,rgba(99,102,241,0.4),transparent)' }} />
          </div>

          {/* Walking Robot */}
          <div ref={botRef} style={{ transform: `translateX(${offset}px)`, transition: 'transform 0.3s ease-out' }}
            className="flex flex-col items-center">
            <svg width="100" height="130" viewBox="0 0 100 130" style={{ color: '#a5b4fc' }}>
              <rect x="28" y="20" width="44" height="38" rx="10" fill="rgba(10,10,30,0.9)" stroke="currentColor" strokeWidth="2" />
              <circle cx="41" cy="37" r="4" fill="currentColor" style={{ filter:'drop-shadow(0 0 4px #a5b4fc)' }} />
              <circle cx="59" cy="37" r="4" fill="currentColor" style={{ filter:'drop-shadow(0 0 4px #a5b4fc)' }} />
              {status === 'sending'
                ? <path d="M40,50 Q50,47 60,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                : near
                  ? <path d="M40,50 Q50,56 60,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  : <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="1.5" />}
              <rect x="34" y="60" width="32" height="28" rx="7" fill="rgba(10,10,30,0.9)" stroke="currentColor" strokeWidth="2" />
              {status === 'sending'
                ? <line x1="66" y1="72" x2="84" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-bounce" />
                : <line x1="66" y1="72" x2="78" y2="84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />}
              <line x1="34" y1="72" x2="22" y2="84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="46" y1="88" x2="42" y2="115" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="54" y1="88" x2="58" y2="115" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-mono text-xs uppercase mt-2" style={{ color: 'rgba(165,180,252,0.5)' }}>
              {status === 'sending' ? '⚡ TRANSMITTING...' : near ? '👣 APPROACHING' : '💤 STANDBY'}
            </p>
          </div>

          {/* Status */}
          <div className="w-full text-center">
            {status === 'success'
              ? <div className="p-4 rounded-xl font-mono text-base animate-pulse" style={{ background:'rgba(0,255,135,0.08)',border:'1px solid rgba(0,255,135,0.3)',color:'#4ade80' }}>
                  ✅ Message Delivered Successfully to Soumik!
                </div>
              : status === 'sending'
              ? <div className="p-4 rounded-xl font-mono text-sm animate-pulse" style={{ background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.25)',color:'#a5b4fc' }}>
                  🚀 TRANSMITTING TO DEEP SPACE...
                </div>
              : <div className="p-4 rounded-xl font-mono text-xs font-bold" style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',color:'rgba(148,163,184,0.5)' }}>
                  SPACE TERMINAL: AWAITING SIGNAL
                </div>}
          </div>
        </div>

        {/* RIGHT: Social Telemetry */}
        <div className="glass-dark rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[520px] w-full"
          style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
          <h2 className="text-4xl font-extrabold text-white mb-1">Direct <span style={{ color:'#818cf8' }}>Transmission</span></h2>
          <p className="text-slate-500 text-sm font-mono mb-8 uppercase text-xs">TRANSMITTER_SOCIAL_NODE</p>

          <p className="text-slate-455 text-sm leading-relaxed max-w-sm mb-10" style={{ color: 'rgba(165,180,252,0.65)' }}>
            Hover over the specialized connection units below to establish direct orbital communications with my external logs and directories.
          </p>

          {/* Social Animated Characters */}
          <div className="flex flex-wrap justify-center gap-6">
            <GithubCatCard />
            <LinkedInManCard />
            <EmailPostmanCard />
            <InstagramCameramanCard />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto border-t pt-8 mt-12 text-center font-mono text-[10px] uppercase"
        style={{ borderColor:'rgba(99,102,241,0.1)', color:'rgba(99,102,241,0.3)' }}>
        <p>© 2026 Soumik Chatterjee. All Rights Reserved.</p>
        <p className="mt-1">Designed & Developed with 💜 by Soumik Chatterjee</p>
      </footer>
    </section>
  );
}
