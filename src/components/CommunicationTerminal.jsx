import React, { useState, useEffect, useRef } from 'react';
import { Send, Mail, Satellite, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommunicationTerminal() {
  const containerRef = useRef(null);
  const robotRef = useRef(null);
  const [robotOffset, setRobotOffset] = useState(0);
  const [isNearRobot, setIsNearRobot] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  
  // Submit animation states
  const [status, setStatus] = useState('idle'); // idle | sending | success
  const [beamActive, setBeamActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const rx = rect.left + rect.width / 2;
      const ry = rect.top + rect.height / 2;
      
      const dx = e.clientX - rx;
      const dy = e.clientY - ry;
      const distance = Math.hypot(dx, dy);
      
      const near = distance < 350;
      setIsNearRobot(near);

      if (near) {
        // Robot walks toward cursor (bounded offset -40px to +40px)
        const walk = Math.max(-40, Math.min(40, dx * 0.2));
        setRobotOffset(walk);
      } else {
        setRobotOffset(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');

    // Trigger robot button pressing and satellite animation sequence
    setTimeout(() => {
      setBeamActive(true); // Activate emerald space laser beam
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });

      setTimeout(() => {
        setStatus('success');
        setBeamActive(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 2000);
    }, 2000);
  };

  // Custom magnetic icon hover effect helper
  const handleSocialMouseMove = (e) => {
    const icon = e.currentTarget;
    const rect = icon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rx = e.clientX - centerX;
    const ry = e.clientY - centerY;

    // Apply 3D tilt and translate
    icon.style.transform = `translate(${rx * 0.35}px, ${ry * 0.35}px) rotateX(${-ry * 0.5}deg) rotateY(${rx * 0.5}deg)`;
  };

  const handleSocialMouseLeave = (e) => {
    const icon = e.currentTarget;
    icon.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020202] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-between items-center overflow-hidden grid-matrix"
    >
      {/* HUD Bar */}
      <div className="w-full max-w-6xl flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase select-none mb-12">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_09 // COMMUNICATION_TRANSMITTER_DISK</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch my-auto relative z-10">
        
        {/* Left Side: Space Transmitter Visual Module */}
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/20 flex flex-col justify-between items-center relative overflow-hidden min-h-[450px]">
          {/* Laser beam beam up vector */}
          {beamActive && (
            <div className="absolute top-0 w-2.5 h-[350px] bg-emerald-400 rounded-full shadow-[0_0_25px_#10b981,0_0_50px_#34d399] animate-[beamUp_1s_infinite] pointer-events-none" />
          )}

          {/* Satellite Dish SVG */}
          <div className="flex flex-col items-center justify-center relative">
            <div className={`p-4 rounded-full border border-emerald-500/10 bg-emerald-950/20 text-emerald-400 ${beamActive ? 'animate-ping' : ''}`}>
              <Satellite size={48} className={beamActive ? 'text-emerald-300' : 'text-emerald-400'} />
            </div>
            <div className="h-10 w-px bg-emerald-500/20" />
          </div>

          {/* Small Robot Assistant Walks & types */}
          <div
            ref={robotRef}
            style={{
              transform: `translateX(${robotOffset}px)`
            }}
            className="w-36 h-40 relative flex flex-col items-center justify-center transition-transform duration-300 ease-out"
          >
            {/* Robot visual layout SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
              {/* Helmet */}
              <rect x="30" y="20" width="40" height="35" rx="8" fill="#020403" stroke="currentColor" strokeWidth="2" />
              {/* Eyes */}
              <circle cx="43" cy="35" r="2.5" fill="currentColor" />
              <circle cx="57" cy="35" r="2.5" fill="currentColor" />
              {/* Mouth */}
              <line x1="45" y1="45" x2="55" y2="45" stroke="currentColor" strokeWidth="1.5" />
              {/* Body */}
              <rect x="36" y="55" width="28" height="25" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* Active keyboard presser arm */}
              {status === 'sending' ? (
                <line x1="60" y1="65" x2="75" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
              ) : (
                <line x1="60" y1="65" x2="70" y2="75" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
            <span className="text-[9px] font-mono text-emerald-500/50 uppercase mt-2 select-none">
              {status === 'sending' ? '⚡ PRESSING BUTTONS...' : isNearRobot ? '👣 WALKING NEAR' : '💤 STANDBY'}
            </span>
          </div>

          {/* Message Success Banner */}
          <div className="w-full text-center">
            {status === 'success' ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-400/50 rounded-xl text-emerald-300 font-mono text-xs animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                ✅ Message Delivered Successfully.
              </div>
            ) : status === 'sending' ? (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-xs animate-pulse">
                🚀 TRANSMITTING TO DEEP_SPACE...
              </div>
            ) : (
              <div className="p-3 bg-black/60 border border-slate-800 rounded-xl text-slate-500 font-mono text-xs select-none">
                SPACE TERMINAL: STANDBY LINK
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Communication Form Input */}
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/20 flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-mono text-lg font-bold text-white tracking-wide">CONNECT PROTOCOL</h3>
            <span className="text-[10px] font-mono text-emerald-500/60 uppercase">TRANSMITTER FORM NODE</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-emerald-500/60 uppercase mb-1">Full Name *</label>
              <input
                required
                type="text"
                name="name"
                data-interactive
                value={formData.name}
                onChange={handleChange}
                placeholder="Soumik Chatterjee"
                className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 placeholder-emerald-900/60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-emerald-500/60 uppercase mb-1">Email Address *</label>
              <input
                required
                type="email"
                name="email"
                data-interactive
                value={formData.email}
                onChange={handleChange}
                placeholder="soumik7484@gmail.com"
                className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 placeholder-emerald-900/60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-emerald-500/60 uppercase mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                data-interactive
                value={formData.subject}
                onChange={handleChange}
                placeholder="Interactive Collaboration"
                className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 placeholder-emerald-900/60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-emerald-500/60 uppercase mb-1">Message *</label>
              <textarea
                required
                rows={4}
                name="message"
                data-interactive
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your cosmic message here..."
                className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 placeholder-emerald-900/60 resize-none"
              />
            </div>

            <button
              type="submit"
              data-magnetic
              data-interactive
              disabled={status === 'sending'}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_#10b981] disabled:opacity-50"
            >
              <Send size={12} />
              Transmit Beam
            </button>
          </form>

          {/* Social Media and Tooltips Area */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-emerald-500/10">
            {/* GitHub */}
            <a
              href="https://github.com/soumik7484-art"
              target="_blank"
              rel="noreferrer"
              data-magnetic
              data-interactive
              onMouseMove={handleSocialMouseMove}
              onMouseLeave={handleSocialMouseLeave}
              className="group relative w-10 h-10 rounded-xl glass-panel border border-emerald-500/20 flex items-center justify-center hover:border-emerald-400 hover:text-emerald-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-md"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="pointer-events-none absolute -top-8 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                GitHub
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/soumik-chatterjee-810aa1386"
              target="_blank"
              rel="noreferrer"
              data-magnetic
              data-interactive
              onMouseMove={handleSocialMouseMove}
              onMouseLeave={handleSocialMouseLeave}
              className="group relative w-10 h-10 rounded-xl glass-panel border border-emerald-500/20 flex items-center justify-center hover:border-emerald-400 hover:text-emerald-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-md"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="pointer-events-none absolute -top-8 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                LinkedIn
              </span>
            </a>

            {/* Gmail */}
            <a
              href="mailto:soumik7484@gmail.com"
              data-magnetic
              data-interactive
              onMouseMove={handleSocialMouseMove}
              onMouseLeave={handleSocialMouseLeave}
              className="group relative w-10 h-10 rounded-xl glass-panel border border-emerald-500/20 flex items-center justify-center hover:border-emerald-400 hover:text-emerald-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-md"
            >
              <Mail size={18} />
              <span className="pointer-events-none absolute -top-8 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Gmail
              </span>
            </a>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-emerald-500/10 pt-6 mt-16 text-center select-none font-mono text-[9px] text-emerald-500/40 uppercase space-y-1">
        <p>© 2026 Soumik Chatterjee. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1">
          Designed & Developed by Soumik Chatterjee with <Heart size={8} className="text-emerald-500 animate-pulse" />
        </p>
      </footer>

      <style>{`
        @keyframes beamUp {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
