import React, { useState, useEffect, useRef } from 'react';
import { Search, PenTool, GitBranch, Layers, HelpCircle, Eye, FileText } from 'lucide-react';

export default function DetectiveOffice() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [evidenceActive, setEvidenceActive] = useState(false);
  const [trackingAngle, setTrackingAngle] = useState(0);
  const movementTimeout = useRef(null);

  // Generate rain drops falling outside window
  const [rainDrops, setRainDrops] = useState([]);

  useEffect(() => {
    // Generate rain particles
    const drops = Array.from({ length: 25 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      duration: Math.random() * 1.5 + 1.0,
      delay: Math.random() * 2.0
    }));
    setRainDrops(drops);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      setIsMoving(true);
      setEvidenceActive(false);

      // Compute tracking angle for binoculars
      const charCenterX = rect.width * 0.75; // Approx detective location
      const charCenterY = rect.height * 0.5;
      const angle = Math.atan2(e.clientY - charCenterY, e.clientX - charCenterX) * (180 / Math.PI);
      setTrackingAngle(angle);

      // Reset stopped timer
      if (movementTimeout.current) clearTimeout(movementTimeout.current);
      movementTimeout.current = setTimeout(() => {
        setIsMoving(false);
        setEvidenceActive(true);
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (movementTimeout.current) clearTimeout(movementTimeout.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#030305] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_04 // INVESTIGATION_OFFICE_DOCK</span>
      </div>

      {/* Dim overlay spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08) 0%, rgba(2, 2, 4, 0.95) 90%)`
        }}
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Window with rain & Evidence Board */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Rain Window */}
          <div className="relative w-full h-[180px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Raindrops overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {rainDrops.map((drop) => (
                <div
                  key={drop.id}
                  style={{
                    left: `${drop.left}%`,
                    animationDuration: `${drop.duration}s`,
                    animationDelay: `${drop.delay}s`
                  }}
                  className="rain-drop"
                />
              ))}
            </div>
            {/* Window Pane grids */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 border-t border-b border-slate-900 pointer-events-none">
              <div className="border-r border-slate-900" />
              <div className="border-r border-slate-900" />
              <div />
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase select-none z-10">OUTSIDE CURRENT</span>
          </div>

          {/* Evidence Board Section */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 relative">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2 mb-3">
              <span className="text-xs font-mono uppercase text-emerald-400">EVIDENCE CONNECT</span>
              <Layers size={14} className="text-emerald-500" />
            </div>

            {/* Evidence nodes and strings */}
            <div className="w-full h-36 border border-emerald-500/10 rounded-lg bg-[#020503]/50 relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full text-emerald-500">
                {/* Connecting Clue Strings */}
                {evidenceActive && (
                  <>
                    <line x1="20" y1="20" x2="100" y2="50" stroke="#ef4444" strokeWidth="1.5" className="animate-[pulse_1s_infinite]" />
                    <line x1="100" y1="50" x2="180" y2="80" stroke="#ef4444" strokeWidth="1.5" className="animate-[pulse_1s_infinite]" />
                    <line x1="100" y1="50" x2="60" y2="80" stroke="#ef4444" strokeWidth="1.5" className="animate-[pulse_1.5s_infinite]" />
                    <line x1="60" y1="80" x2="20" y2="20" stroke="#ef4444" strokeWidth="1.5" />
                  </>
                )}
                {/* Node Points */}
                <circle cx="20" cy="20" r="5" fill="#10b981" />
                <circle cx="100" cy="50" r="6" fill={evidenceActive ? "#ef4444" : "#10b981"} />
                <circle cx="180" cy="80" r="5" fill="#10b981" />
                <circle cx="60" cy="80" r="5" fill="#10b981" />
              </svg>

              {!evidenceActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-mono text-emerald-500/40 uppercase">
                  WAITING FOR INVESTIGATION SCAN
                </div>
              )}
            </div>
            
            <div className="mt-3 font-mono text-[9px] text-emerald-500/60 uppercase">
              {evidenceActive ? '✅ THREAD MAP ACTIVE - CLUES SYNCHRONIZED' : '// STANDBY: MOVE CURSOR TO SPOT'}
            </div>
          </div>
        </div>

        {/* Center/Right Side: Detective Rig and Clue Analysis */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Detective Card */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 flex flex-col items-center relative min-h-[360px]">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400">
              SYS_INVESTIGATOR
            </div>

            {/* Detective Body representation */}
            <div className="w-48 h-60 relative flex items-center justify-center">
              <svg viewBox="0 0 150 200" className="w-full h-full text-emerald-400">
                {/* Detective Hat & Coat */}
                <path d="M40,150 L110,150 L100,200 L50,200 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M40,65 L110,65 M50,65 L50,45 L100,45 L100,65" stroke="currentColor" strokeWidth="2.5" /> {/* Hat */}

                {/* Head */}
                <circle cx="75" cy="85" r="20" fill="none" stroke="currentColor" strokeWidth="2" />

                {/* Binoculars Arm tracking */}
                {isMoving ? (
                  // Raised Binoculars
                  <g style={{ transform: `rotate(${trackingAngle * 0.15}deg)`, transformOrigin: '75px 120px' }} className="transition-transform duration-200">
                    <line x1="75" y1="120" x2="65" y2="85" stroke="currentColor" strokeWidth="3" />
                    <line x1="75" y1="120" x2="85" y2="85" stroke="currentColor" strokeWidth="3" />
                    <rect x="58" y="77" width="34" height="10" fill="currentColor" rx="2" />
                    <circle cx="65" cy="82" r="3.5" fill="#020202" stroke="currentColor" />
                    <circle cx="85" cy="82" r="3.5" fill="#020202" stroke="currentColor" />
                  </g>
                ) : (
                  // Lowered Binoculars, holding pen to write
                  <g className="transition-all duration-300">
                    {/* Binoculars around neck */}
                    <path d="M60,110 Q75,130 90,110" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="70" y="112" width="10" height="6" fill="currentColor" />
                    
                    {/* Hand writing notes */}
                    <line x1="75" y1="120" x2="95" y2="140" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="95" y1="140" x2="110" y2="135" stroke="currentColor" strokeWidth="1.5" />
                  </g>
                )}
              </svg>

              {/* Floating Magnifying Glass overlay scanner tracking cursor */}
              {evidenceActive && (
                <div
                  className="absolute w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-500/10 flex items-center justify-center animate-ping"
                  style={{
                    top: '25%',
                    left: '40%'
                  }}
                >
                  <Search size={14} className="text-emerald-400" />
                </div>
              )}
            </div>

            <div className="font-mono text-center">
              <span className="text-[10px] uppercase text-emerald-400/50">DETECTIVE STATE</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">
                {isMoving ? '👀 WATCHING CURSOR' : '✍️ RECORDING CLUES'}
              </h3>
            </div>
          </div>

          {/* Case File Board Diagnostics */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 relative flex flex-col justify-between min-h-[360px]">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400">
              CASE_LOG_FILE
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                <FileText size={14} className="text-emerald-400" />
                <span className="text-[10px] font-mono uppercase text-emerald-400">INVESTIGATION NOTES</span>
              </div>

              {evidenceActive ? (
                <div className="font-mono text-[10px] text-emerald-400 space-y-2 animate-[pulse_2s_infinite]">
                  <p className="text-white font-bold">// FINGERPRINT MATCH:</p>
                  <p className="bg-emerald-950/40 p-2 border border-emerald-500/20 rounded">
                    ID: S_CHATTERJEE<br />
                    CONFIDENCE: 99.87%<br />
                    CLASS: FULL_STACK_DEV
                  </p>
                  <p className="text-slate-400 mt-2">// EVIDENCE LOGGED:</p>
                  <p className="text-emerald-300">
                    - Clues point to outstanding web design.<br />
                    - Custom magnetic physics verified.<br />
                    - System status logged.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 font-mono text-[10px]">
                  <HelpCircle size={24} className="text-emerald-500/30 mb-2 animate-bounce" />
                  <span>STOP CURSOR MOVEMENT TO ANOMALOUS ZONE TO DECYPHER CASE FILES</span>
                </div>
              )}
            </div>

            <div className="border-t border-emerald-500/10 pt-3 flex items-center justify-between font-mono text-[8px] text-emerald-500/50 uppercase">
              <span>CASE: #2026-SOUMIK</span>
              <span>SECURE_DATA: YES</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
