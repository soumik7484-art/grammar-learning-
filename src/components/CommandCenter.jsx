import React, { useState } from 'react';
import { Cpu, Terminal, Zap, Share2 } from 'lucide-react';

export default function CommandCenter() {
  const [activeSkill, setActiveSkill] = useState(null);

  const skillsList = [
    {
      id: 'react',
      name: 'React.js',
      level: '95%',
      desc: 'High-performance UI rendering, state synchronization, custom hooks, and interactive graphic modules.',
      icon: (
        // Rotating Orbit/Atom
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400 animate-[spin_8s_linear_infinite] hover:animate-[spin_3s_linear_infinite]">
          <ellipse cx="50" cy="50" rx="10" ry="30" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="10" ry="30" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-[60deg]" />
          <ellipse cx="50" cy="50" rx="10" ry="30" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-[120deg]" />
          <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />
        </svg>
      )
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      level: '90%',
      desc: 'NoSQL clustering, index optimization, complex pipeline aggregation, and transactional logs processing.',
      icon: (
        // Growing Tree / Circuit Nodes
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400">
          <line x1="50" y1="90" x2="50" y2="40" stroke="currentColor" strokeWidth="3.5" />
          <line x1="50" y1="65" x2="25" y2="45" stroke="currentColor" strokeWidth="2.5" />
          <line x1="50" y1="55" x2="75" y2="35" stroke="currentColor" strokeWidth="2.5" />
          
          <circle cx="50" cy="40" r="5" fill="currentColor" className="animate-pulse" />
          <circle cx="25" cy="45" r="4" fill="currentColor" />
          <circle cx="75" cy="35" r="4" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'python',
      name: 'Python',
      level: '93%',
      desc: 'Machine learning scripts, data scraping pipelines, backend microservices, and neural net model training.',
      icon: (
        // Glowing Snake / Infinity Path
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400">
          {/* Infinity loop represents snake body */}
          <path
            d="M25,50 Q37.5,25 50,50 Q62.5,75 75,50 Q62.5,25 50,50 Q37.5,75 25,50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-[dash_6s_linear_infinite]"
          />
          <circle cx="75" cy="50" r="4.5" fill="currentColor" className="animate-bounce" />
        </svg>
      )
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      level: '88%',
      desc: 'Deep Neural Networks, training computer vision CNNs, deploying model graphs, and processing tensor matrices.',
      icon: (
        // Neural network brain structure
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400">
          {/* Synaptic nodes */}
          <line x1="50" y1="20" x2="25" y2="50" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="75" y2="50" stroke="currentColor" strokeWidth="1.5" />
          <line x1="25" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" />
          <line x1="75" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" />
          <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="1.5" />
          
          <circle cx="50" cy="20" r="6" fill="currentColor" />
          <circle cx="25" cy="50" r="6" fill="currentColor" className="animate-pulse" />
          <circle cx="75" cy="50" r="6" fill="currentColor" className="animate-pulse" />
          <circle cx="50" cy="80" r="6" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'node',
      name: 'Node.js',
      level: '92%',
      desc: 'Asynchronous event loops, REST API engines, WebSockets server management, and process scaling.',
      icon: (
        // Pulsing Hexagon
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400 animate-pulse-slow">
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="currentColor" strokeWidth="3" />
          <polygon points="50,25 72,38 72,62 50,75 28,62 28,38" fill="rgba(16, 185, 129, 0.15)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="skills"
      className="relative min-h-screen w-full bg-[#020202] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_08 // CORE_SKILLS_GRID_CENTER</span>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center gap-12 relative z-10 text-center">
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 rounded-full text-xs font-mono text-emerald-400 mb-4 select-none">
            <Zap size={12} className="animate-bounce" />
            <span>COMMAND CENTER GRAPH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Technical <span className="text-emerald-400 glow-text-emerald">Holograms</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
            Hover over the floating holograms to inject energy levels, check telemetry, and display subsystem analytics.
          </p>
        </div>

        {/* Floating Skills Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full justify-center mt-6">
          {skillsList.map((skill) => (
            <div
              key={skill.id}
              data-interactive
              onMouseEnter={() => setActiveSkill(skill.id)}
              onMouseLeave={() => setActiveSkill(null)}
              className={`glass-panel rounded-2xl p-6 border flex flex-col items-center gap-4 transition-all duration-500 cursor-pointer relative overflow-hidden ${
                activeSkill === skill.id
                  ? 'border-emerald-400 bg-emerald-950/20 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-emerald-500/20'
              }`}
            >
              {/* Electric particles on active hover */}
              {activeSkill === skill.id && (
                <>
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <div className="scanline" />
                </>
              )}

              {/* Skill Icon */}
              <div className="transition-transform duration-300 transform group-hover:scale-110">
                {skill.icon}
              </div>

              {/* Title and stats bar */}
              <div className="w-full text-center">
                <h3 className="font-mono text-sm font-bold text-white uppercase">{skill.name}</h3>
                
                {/* Micro level gauge */}
                <div className="w-full h-1.5 bg-emerald-950 rounded-full overflow-hidden mt-3 border border-emerald-500/10">
                  <div
                    style={{
                      width: activeSkill === skill.id ? skill.level : '20%',
                      transition: 'width 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)'
                    }}
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                  />
                </div>
                
                <span className="text-[10px] font-mono text-emerald-400/60 mt-1.5 block">
                  CAPACITY: {skill.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed telemetry information console at bottom */}
        <div className="w-full max-w-3xl glass-panel-heavy rounded-2xl p-6 border border-emerald-500/30 text-left min-h-[140px] flex flex-col justify-between relative overflow-hidden">
          <div className="scanline" />
          
          <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-2">
            <Cpu size={14} className="text-emerald-400" />
            <span className="text-[10px] font-mono uppercase text-emerald-400">TELEMETRY_LOGS</span>
          </div>

          <div className="my-4 font-mono text-xs text-emerald-300">
            {activeSkill ? (
              <div className="space-y-1 animate-in fade-in duration-300">
                <span className="text-white font-bold block mb-1">
                  &gt; ACTIVE_SUBSYSTEM: {skillsList.find((s) => s.id === activeSkill).name}
                </span>
                <p className="leading-relaxed text-slate-400">
                  {skillsList.find((s) => s.id === activeSkill).desc}
                </p>
              </div>
            ) : (
              <div className="text-slate-500 text-center uppercase tracking-widest text-[9px] py-4">
                // SYSTEM IDLE: RADAR IN STANDBY_MODE. SELECT ELEMENT TO INTERSECT TELEMETRY MODULE.
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase select-none">
            <span>INDEX: SECURE_CLUSTER</span>
            <span>LEVELS: SYNCHRONIZED</span>
          </div>
        </div>

      </div>
    </section>
  );
}
