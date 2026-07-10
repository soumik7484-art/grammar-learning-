import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ isVisible, onComplete }) {
  const canvasRef  = useRef(null);
  const containerRef = useRef(null);
  const coreRef    = useRef(null);
  const logoRef    = useRef(null);

  const [typedText1, setTypedText1] = useState('');
  const [typedText2, setTypedText2] = useState('');

  const fullText1 = "Hello...";
  const fullText2 = "I'm Soumik Chatterjee.";

  useEffect(() => {
    const activeTimers = [];
    let tl, animId;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    // Multi-color particles — electric blue, violet, cyan
    const COLORS = ['rgba(59,130,246,', 'rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(99,102,241,'];
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2.5 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = -Math.random() * 1.2 - 0.4;
        this.life = Math.random() * 140 + 80;
        this.maxLife = this.life;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life--;
        const a = (this.life / this.maxLife) * 0.8;
        if (this.life <= 0 || this.y < 0 || this.x < 0 || this.x > W) this.reset();
        return a;
      }
      draw() {
        const a = this.update();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + a + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle());
    const loop = () => {
      ctx.fillStyle = 'rgba(2,2,8,0.18)';
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => p.draw());
      animId = requestAnimationFrame(loop);
    };
    loop();

    // Typing helper
    const typeText = (text, setter, speed, delay) => {
      setter('');
      const t = setTimeout(() => {
        let i = 0;
        const iv = setInterval(() => {
          setter(prev => prev + text.charAt(i));
          i++;
          if (i >= text.length) clearInterval(iv);
        }, speed);
        activeTimers.push(iv);
      }, delay);
      activeTimers.push(t);
    };

    tl = gsap.timeline({ onComplete: () => onComplete && onComplete() });

    tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' });
    tl.to({}, { duration: 0.8, onStart: () => typeText(fullText1, setTypedText1, 80, 0) });
    tl.to({}, { duration: 1.8, onStart: () => typeText(fullText2, setTypedText2, 50, 0) });
    tl.to(coreRef.current, { opacity: 1, scale: 1, rotate: 360, duration: 2.2, ease: 'back.out(1.2)' });
    tl.to({}, { duration: 1.0 });

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (tl) tl.kill();
      activeTimers.forEach(t => { clearTimeout(t); clearInterval(t); });
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden transition-all duration-[1400ms] ease-in-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-110'
      }`}
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #0d0a1f 0%, #020208 70%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Multi-ring AI Core */}
      <div ref={coreRef} className="absolute w-[400px] h-[400px] opacity-0 scale-50 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow" />
        <div className="absolute w-[85%] h-[85%] rounded-full border border-violet-400/25 border-dashed animate-[spin_10s_linear_infinite_reverse]" />
        <div className="absolute w-[68%] h-[68%] rounded-full border border-cyan-400/30 animate-pulse-slow" />
        <div className="absolute w-36 h-36 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)' }} />
        <div className="absolute w-20 h-20 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)' }} />
        <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, #a78bfa, #3b82f6)', boxShadow: '0 0 20px #8b5cf6, 0 0 40px #3b82f6' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo */}
        <div ref={logoRef} className="w-24 h-24 opacity-0 scale-50 mb-2"
          style={{ filter: 'drop-shadow(0 0 18px rgba(139,92,246,0.7))' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <polygon points="50,5 93,30 93,80 50,95 7,80 7,30"
              fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="url(#logoGrad)" strokeWidth="2" />
            <line x1="50" y1="5" x2="50" y2="38" stroke="url(#logoGrad)" strokeWidth="2.5" />
            <line x1="7"  y1="80" x2="38" y2="58" stroke="url(#logoGrad)" strokeWidth="2.5" />
            <line x1="93" y1="80" x2="62" y2="58" stroke="url(#logoGrad)" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center font-mono">
          <h2 className="text-xl tracking-[0.3em] h-8" style={{ color: '#60a5fa', textShadow: '0 0 12px rgba(96,165,250,0.6)' }}>
            {typedText1}
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider h-12 mt-2 text-white">
            {typedText2}
            <span className="inline-block w-1.5 h-6 align-middle ml-1 animate-pulse" style={{ background: 'linear-gradient(#60a5fa, #a78bfa)' }} />
          </h1>
        </div>
      </div>
    </div>
  );
}
