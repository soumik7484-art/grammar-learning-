import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, ShieldPlus, FileText, Smartphone } from 'lucide-react';

export default function HospitalDoctor() {
  const containerRef = useRef(null);
  const doctorRef = useRef(null);
  const patientRef = useRef(null);

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [doctorEyeOffset, setDoctorEyeOffset] = useState({ x: 0, y: 0 });
  
  // Interactive States
  const [isNearDoctor, setIsNearDoctor] = useState(false);
  const [isNearPatient, setIsNearPatient] = useState(false);
  const [diagnosticsActive, setDiagnosticsActive] = useState(false);
  const [floaterIcons, setFloaterIcons] = useState([]);

  // Tablet diagnostics text
  const [tabletText, setTabletText] = useState('SYSTEM READY - WAITING FOR INPUT');

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !doctorRef.current || !patientRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      setMouseCoord({ x: relativeX, y: relativeY });

      // Doctor position
      const docRect = doctorRef.current.getBoundingClientRect();
      const docCenterX = docRect.left + docRect.width / 2;
      const docCenterY = docRect.top + docRect.height / 2;
      
      const distToDoctor = Math.hypot(e.clientX - docCenterX, e.clientY - docCenterY);
      const nearDoc = distToDoctor < 300;
      setIsNearDoctor(nearDoc);

      if (nearDoc) {
        // Calculate eye offset tracking the mouse
        const angle = Math.atan2(e.clientY - docCenterY, e.clientX - docCenterX);
        setDoctorEyeOffset({
          x: Math.cos(angle) * 5,
          y: Math.sin(angle) * 5
        });
      } else {
        setDoctorEyeOffset({ x: 0, y: 0 });
      }

      // Patient position
      const patRect = patientRef.current.getBoundingClientRect();
      const patCenterX = patRect.left + patRect.width / 2;
      const patCenterY = patRect.top + patRect.height / 2;

      const distToPatient = Math.hypot(e.clientX - patCenterX, e.clientY - patCenterY);
      const nearPat = distToPatient < 220;
      setIsNearPatient(nearPat);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Diagnostic sequence when cursor is near the patient
  useEffect(() => {
    if (isNearPatient) {
      setDiagnosticsActive(true);
      setTabletText('ANALYST LOGS:\n- HEART RATE: 82 BPM\n- LUNG EXPANSION: NORMAL\n- AI DIAGNOSIS: SYNCED');

      // Generate floating medicine icons
      const interval = setInterval(() => {
        setFloaterIcons((prev) => [
          ...prev.slice(-10), // Keep last 10 max
          {
            id: Math.random(),
            x: Math.random() * 80 + 10,
            y: 100,
            text: ['💊', '⚕️', '🧬', '➕', '🌡️'][Math.floor(Math.random() * 5)]
          }
        ]);
      }, 600);

      return () => clearInterval(interval);
    } else {
      setDiagnosticsActive(false);
      setTabletText('SYSTEM IDLE - INACTIVE LINK');
      setFloaterIcons([]);
    }
  }, [isNearPatient]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020202] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_03 // BIO_HOSPITAL_SIMULATOR</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Cinematic Medical Holograms and Scans */}
        <div className="lg:col-span-4 flex flex-col gap-6 relative">
          {/* Heartbeat Monitor Display */}
          <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2 mb-3">
              <span className="text-xs font-mono uppercase text-emerald-400">PATIENT MONITOR</span>
              <Heart size={14} className={diagnosticsActive ? "text-red-500 animate-pulse" : "text-emerald-500/50"} />
            </div>
            
            {/* Medical pulse line */}
            <div className="h-24 w-full bg-emerald-950/20 rounded relative overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full text-emerald-400">
                {diagnosticsActive ? (
                  // Active heartbeat pulse SVG path
                  <path
                    d="M0,50 L40,50 L50,20 L60,80 L70,40 L80,50 L120,50 L130,20 L140,80 L150,45 L160,50 L200,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-[pulse-flow_2s_linear_infinite]"
                  />
                ) : (
                  // Stable heartbeat
                  <path d="M0,50 L200,50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5" />
                )}
              </svg>
            </div>
            
            <div className="flex justify-between items-center mt-3 font-mono text-[10px]">
              <span className="text-emerald-400/60">HEART RATE: {diagnosticsActive ? '82 BPM' : '--'}</span>
              <span className="text-emerald-400/60">SYS/DIA: {diagnosticsActive ? '120/80' : '--'}</span>
            </div>
          </div>

          {/* Holographic X-Ray scanner */}
          <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 relative h-[180px] flex flex-col justify-between overflow-hidden">
            <span className="text-xs font-mono uppercase text-emerald-400">X-RAY DIAGNOSTICS</span>
            
            <div className="w-full h-28 border border-emerald-500/10 rounded bg-[#010a05]/40 flex items-center justify-center relative overflow-hidden">
              {diagnosticsActive ? (
                <>
                  {/* Glowing skeleton chest representation */}
                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400/40">
                    <path d="M50,10 L50,80 M30,30 Q50,40 70,30 M25,45 Q50,55 75,45 M30,60 Q50,70 70,60" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent scanline" />
                </>
              ) : (
                <div className="text-[10px] font-mono text-emerald-500/30 uppercase">PROXIMITY SYNC REQUIRED</div>
              )}
            </div>

            {/* Float up pills and medical icons */}
            {floaterIcons.map((icon) => (
              <span
                key={icon.id}
                style={{
                  left: `${icon.x}%`,
                  bottom: `10%`,
                  animation: 'floatUp 2s ease-out forwards'
                }}
                className="absolute text-lg pointer-events-none select-none"
              >
                {icon.text}
              </span>
            ))}
          </div>
        </div>

        {/* Center/Right Side: Interactive Doctor & Patient Scene */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* AI Doctor Box */}
          <div
            ref={doctorRef}
            className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-emerald-500/20 relative"
          >
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400">
              AI_PHY_SYS_v9
            </div>

            {/* Doctor Character Visual representation */}
            <div className="w-48 h-64 relative flex items-center justify-center">
              <svg viewBox="0 0 150 200" className="w-full h-full text-emerald-400">
                {/* Doctor Body */}
                <path d="M40,150 L110,150 L95,200 L55,200 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M30,150 L120,150 L130,190 L20,190 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                
                {/* Doctor Head (with eye offsets) */}
                <g transform={`translate(${doctorEyeOffset.x * 0.5}, ${doctorEyeOffset.y * 0.5})`}>
                  <circle cx="75" cy="80" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                  {/* Tech visor/glasses */}
                  <rect x="58" y="73" width="34" height="8" rx="2" fill="rgba(16, 185, 129, 0.2)" stroke="currentColor" strokeWidth="1" />
                  {/* Glowing Eyes */}
                  <circle cx={67 + doctorEyeOffset.x} cy={77 + doctorEyeOffset.y} r="2" fill="currentColor" />
                  <circle cx={83 + doctorEyeOffset.x} cy={77 + doctorEyeOffset.y} r="2" fill="currentColor" />
                </g>

                {/* Stethoscope projection line if active */}
                {diagnosticsActive && (
                  <path
                    d="M75,110 Q110,120 135,160"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    className="animate-[pulse_1s_infinite]"
                  />
                )}
              </svg>

              {/* Digital Stethoscope Hub */}
              {diagnosticsActive && (
                <div className="absolute bottom-12 right-0 w-8 h-8 rounded-full border border-emerald-400 bg-emerald-950/80 flex items-center justify-center animate-ping">
                  <Activity size={12} className="text-emerald-400" />
                </div>
              )}
            </div>

            <div className="mt-4 font-mono text-center">
              <span className="text-[10px] uppercase text-emerald-400/50">DOCTOR STATE</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">
                {isNearDoctor ? '📡 TRACKING CURSOR' : diagnosticsActive ? '🔍 EXAMINING PATIENT' : '💤 STANDBY'}
              </h3>
            </div>
          </div>

          {/* Patient Diagnostics Seat */}
          <div
            ref={patientRef}
            className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-emerald-500/20 relative"
          >
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 rounded text-[9px] font-mono text-emerald-400">
              PATIENT_DOCK_B
            </div>

            {/* Patient Character Representation */}
            <div className="w-48 h-64 relative flex items-center justify-center">
              <svg viewBox="0 0 150 200" className="w-full h-full text-emerald-400/50">
                {/* Chair Outline */}
                <path d="M30,190 L120,190 M40,110 L40,190 M110,110 L110,190" stroke="currentColor" strokeWidth="2.5" />
                
                {/* Patient Body (Sitting) */}
                <path d="M50,110 L100,110 L90,160 L60,160 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M90,160 L120,175" stroke="currentColor" strokeWidth="2" />
                
                {/* Patient Head */}
                <circle cx="75" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="mt-4 font-mono text-center w-full">
              <span className="text-[10px] uppercase text-emerald-400/50">PATIENT ANOMALIES</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">
                {diagnosticsActive ? '⚡ INTERACTIVE PULSE SCAN...' : '😴 STANDBY IDLE'}
              </h3>

              {/* Tablet analysis diagnostics box */}
              <div className="mt-4 p-3 bg-black/60 rounded-xl border border-emerald-500/10 text-left font-mono text-[10px] text-emerald-400 whitespace-pre-line leading-relaxed">
                {tabletText}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -400; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
