import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  CursorOrb,
  LoadingScreen,
  HeroSection,
  AboutSection,
  MedicalSection,
  DetectiveSection,
  PrescriptionSection,
  RadiologySection,
  ChatbotSection,
  SkillsSection,
  ContactSection,
} from './portfolio';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { id:'hero',    label:'Home'    },
    { id:'about',   label:'About'   },
    { id:'skills',  label:'Skills'  },
    { id:'contact', label:'Contact' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[990] transition-all duration-500">
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-500"
        style={{ background: scrolled ? 'rgba(5,5,20,0.88)' : 'rgba(5,5,20,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.15)', boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none' }}>
        {/* Logo */}
        <div className="w-7 h-7 mr-3" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,135,0.5))' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff87" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <polygon points="50,5 93,30 93,80 50,95 7,80 7,30" fill="none" stroke="url(#navGrad)" strokeWidth="3" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="url(#navGrad)" strokeWidth="2" />
          </svg>
        </div>

        {links.map(l => (
          <button key={l.id} data-magnetic
            onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-all duration-200"
            style={{ '--hover-bg': 'rgba(99,102,241,0.12)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#a5b4fc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative bg-black">
      {/* Custom AI Cursor Orb */}
      <CursorOrb />

      {/* PART 1: Loading Screen */}
      <LoadingScreen visible={!loaded} onDone={handleDone} />

      {/* Navigation */}
      {loaded && <NavBar />}

      {/* MAIN CONTENT (only shown after loading) */}
      <main className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {/* PART 2: Hero AI Lab — Violet/Blue */}
        <div id="hero"><HeroSection /></div>

        {/* PART 3: About Hologram Room — Cyan */}
        <AboutSection />

        {/* PART 4: Medical AI — Blue/Red */}
        <MedicalSection />

        {/* PART 5: Legal AI Detective — Amber */}
        <DetectiveSection />

        {/* PART 6: Prescription OCR — Emerald */}
        <PrescriptionSection />

        {/* PART 7: X-Ray Analyzer — Steel Blue */}
        <RadiologySection />

        {/* PART 8: AI Chatbot Robot — Pink */}
        <ChatbotSection />

        {/* PART 9: Skills Command Center — Multi-color */}
        <SkillsSection />

        {/* PART 10: Contact Space Terminal — Indigo */}
        <ContactSection />
      </main>
    </div>
  );
}
