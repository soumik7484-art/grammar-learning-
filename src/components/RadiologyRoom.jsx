import React, { useState, useRef } from 'react';
import { Eye, ShieldAlert, Thermometer, ShieldPlus } from 'lucide-react';

export default function RadiologyRoom() {
  const cardRef = useRef(null);
  const [rotateVal, setRotateVal] = useState({ x: 0, y: 0 });
  const [activeBone, setActiveBone] = useState(null);
  const [laserTarget, setLaserTarget] = useState({ x: 100, y: 100 });

  const boneData = {
    skull: {
      name: 'CRANIAL VAULT',
      status: 'NOMINAL',
      desc: 'No fractures detected. Intracranial pressure within normal limits (12 mmHg). Density optimal.',
      x: 100,
      y: 35
    },
    spine: {
      name: 'CERVICAL SPINE',
      status: 'NOMINAL',
      desc: 'Alignment correct. Intervertebral disk space is preserved. No osteophyte formation.',
      x: 100,
      y: 90
    },
    clavicle: {
      name: 'CLAVICLE GRID',
      status: 'STRESS SIGN',
      desc: 'Minor micro-stress detected in left clavicle zone. High physical load observed. Recommend rest.',
      x: 140,
      y: 75
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate 3D tilt (range -12 to 12 degrees)
    const rotateX = -((y - rect.height / 2) / rect.height) * 20;
    const rotateY = ((x - rect.width / 2) / rect.width) * 20;
    setRotateVal({ x: rotateX, y: rotateY });

    // Track laser pointer following the cursor
    setLaserTarget({ x, y });
  };

  const handleMouseLeave = () => {
    setRotateVal({ x: 0, y: 0 });
    setActiveBone(null);
  };

  return (
    <section
      className="relative min-h-screen w-full bg-[#020202] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_06 // IMAGING_RADIOLOGY_ROOM</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Massive 3D Rotatable X-Ray Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotateVal.x}deg) rotateY(${rotateVal.y}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
            className="w-full max-w-md h-[450px] glass-panel rounded-3xl p-6 border-2 border-emerald-500/20 relative overflow-hidden flex flex-col justify-between cursor-crosshair shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Green Scanning grids and X-ray details */}
            <div className="absolute inset-0 bg-[#020d06]/60 pointer-events-none" />
            <div className="scanline" />

            {/* Header info */}
            <div className="z-10 flex justify-between items-start font-mono text-[9px] text-emerald-400">
              <div>
                <p>PATIENT ID: SC-9093</p>
                <p>SCAN TYPE: HIGH_RES_CT</p>
              </div>
              <div className="text-right">
                <p>SCALE: 1.00 // 3D_ROT: ON</p>
                <p className="animate-pulse">SYSTEM READY</p>
              </div>
            </div>

            {/* Diagnostic Chest Image (SVG Vector) */}
            <div className="z-10 relative flex-1 flex items-center justify-center my-4">
              <svg viewBox="0 0 200 200" className="w-56 h-56 text-emerald-500/30">
                {/* Glowing Bone structures */}
                {/* Skull */}
                <path
                  d="M100,20 Q120,20 120,40 Q120,60 100,60 Q80,60 80,40 Q80,20 100,20 Z"
                  fill={activeBone === 'skull' ? 'rgba(16, 185, 129, 0.25)' : 'none'}
                  stroke={activeBone === 'skull' ? '#34d399' : 'currentColor'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveBone('skull')}
                />
                
                {/* Spine */}
                <path
                  d="M100,60 L100,160 M95,70 L105,70 M95,85 L105,85 M95,100 L105,100 M95,115 L105,115 M95,130 L105,130 M95,145 L105,145"
                  fill="none"
                  stroke={activeBone === 'spine' ? '#34d399' : 'currentColor'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveBone('spine')}
                />

                {/* Left Clavicle */}
                <path
                  d="M100,70 Q120,70 140,75"
                  fill="none"
                  stroke={activeBone === 'clavicle' ? '#34d399' : 'currentColor'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveBone('clavicle')}
                />

                {/* Right Clavicle */}
                <path
                  d="M100,70 Q80,70 60,75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                {/* Ribcage details */}
                <path d="M70,95 Q100,85 130,95 M65,110 Q100,100 135,110 M65,125 Q100,115 135,125" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              {/* Heatmap overlay (follows hovered bone) */}
              {activeBone && (
                <div
                  className="absolute w-16 h-16 rounded-full bg-red-500/20 blur-xl animate-pulse pointer-events-none"
                  style={{
                    top: `${boneData[activeBone].y}%`,
                    left: `${boneData[activeBone].x - 16}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}

              {/* Laser Line Pointer following the mouse coordinates inside card */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                {activeBone && (
                  <line
                    x1={laserTarget.x}
                    y1={laserTarget.y}
                    x2={boneData[activeBone].x * 2.2} // Map rough scale of coordinate
                    y2={boneData[activeBone].y * 2.2}
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                )}
              </svg>
            </div>

            {/* Diagnostics labels */}
            <div className="z-10 text-[8px] font-mono text-emerald-500/40 uppercase">
              // MOVE CURSOR OVER SKULL, SPINE OR CLAVICLE TO TEST ANOMALY REPORTING
            </div>
          </div>
        </div>

        {/* Right Side: AI Imaging Diagnostics Explanations */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-mono">
            <Thermometer size={14} className="animate-pulse" />
            <span>THERMOGRAPHIC_HEATMAP: ACTIVE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Radiology <span className="text-emerald-400 glow-text-emerald">Diagnostics</span>
          </h2>

          <p className="text-slate-400 text-sm max-w-lg">
            Hover over the skeletal structures to trigger automated deep-learning bone density analytics, joint space validation, and stress-fracture classifications.
          </p>

          {/* Interactive Report Box */}
          <div className="w-full glass-panel-heavy rounded-2xl p-6 border border-emerald-500/30 font-mono text-xs text-emerald-400 min-h-[200px] flex flex-col justify-between">
            {activeBone ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="font-bold text-white">{boneData[activeBone].name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    activeBone === 'clavicle' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/35'
                  }`}>
                    {boneData[activeBone].status}
                  </span>
                </div>
                <p className="text-emerald-300 leading-relaxed text-[11px]">{boneData[activeBone].desc}</p>
                <div className="flex items-center gap-2 text-[9px] text-slate-500">
                  <ShieldPlus size={10} />
                  <span>AI REPORT CODE: RX-HISP-SEC-9</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto text-slate-500 text-center gap-2">
                <Eye size={24} className="text-emerald-500/20 animate-pulse" />
                <span>INTERSECT CURSOR OVER X-RAY BONES TO DISPLAY REPORTS</span>
              </div>
            )}

            {/* Simulated mini doctor pointing indicator */}
            <div className="mt-4 border-t border-emerald-500/10 pt-3 flex justify-between items-center text-[10px] text-emerald-400/50">
              <span>DOCTOR POINTING: {activeBone ? '🎯 TARGETING BONE' : '💤 IDLE'}</span>
              <span>CORE STAT: VERIFIED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
