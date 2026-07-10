import React, { useState, useRef } from 'react';
import { Scan, Cpu, Layers, BarChart2 } from 'lucide-react';

export default function HospitalDesk() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const prescriptionRef = useRef(null);

  const medicines = [
    { name: 'Metformin', confidence: '99%', dose: '500mg', usage: 'Daily' },
    { name: 'Amoxicillin', confidence: '98%', dose: '250mg', usage: 'TID' },
    { name: 'Atorvastatin', confidence: '96%', dose: '20mg', usage: 'QPM' }
  ];

  const handleMouseEnter = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const handleMouseLeave = () => {
    setIsScanning(false);
  };

  return (
    <section
      className="relative min-h-screen w-full bg-[#010302] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix-dense"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_05 // CLINICAL_DESK_DESERIALIZER</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Prescription Desk & Scanning laser */}
        <div className="flex flex-col items-center justify-center">
          <div
            ref={prescriptionRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-sm glass-panel rounded-2xl p-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
          >
            {/* Hologram Grid scanner lines */}
            {isScanning && (
              <>
                <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none animate-pulse" />
                <div className="scanline" />
              </>
            )}

            <div className="flex justify-between items-start border-b border-emerald-500/20 pb-4 mb-6">
              <div>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">RX MEDICAL CARD</h3>
                <span className="text-[9px] font-mono text-emerald-500/60 uppercase">SOUMIK HEALTHCARE // CLOUD_RX</span>
              </div>
              <Scan className={`text-emerald-400 ${isScanning ? 'animate-spin-slow' : ''}`} size={20} />
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-400">
              <p>PATIENT NAME: Soumik Chatterjee</p>
              <p>AGE: 22 // DATE: 11-JULY-2026</p>
              <div className="h-px bg-emerald-500/20 my-4" />
              
              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span
                      className={`transition-colors duration-500 px-1 rounded ${
                        isScanning ? 'bg-emerald-500/10 text-emerald-300 font-bold glow-text-emerald' : 'text-slate-400'
                      }`}
                    >
                      - {med.name}
                    </span>
                    <span className={`text-[10px] ${isScanning ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {med.dose}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-emerald-500/10 pt-4 text-center">
              <span className="text-[9px] font-mono text-emerald-500/40 uppercase">
                {isScanning ? '⚡ AI LASER SCANNING ACTIVE...' : '💡 HOVER TO COMMENCE SCAN'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Data deserializer output (shows json structure + confidence metrics) */}
        <div className="flex flex-col gap-6 text-left">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-mono">
            <Cpu size={14} className="animate-pulse" />
            <span>DESERIALIZED_JSON: {isScanning ? 'SYNCED' : 'STANDBY'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Prescription <span className="text-emerald-400 glow-text-emerald">Parser</span>
          </h2>

          <p className="text-slate-400 text-sm max-w-lg">
            This module represents digital record deserialization. By parsing medical prescriptions using AI, unstructured text transforms instantly into high-fidelity data models.
          </p>

          {/* Structured Output display */}
          <div className="w-full glass-panel-heavy rounded-2xl p-6 border border-emerald-500/30 font-mono text-xs text-emerald-400 min-h-[220px] relative overflow-hidden">
            <div className="scanline" />
            
            {isScanning ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="text-[10px] text-slate-500">// OUTPUT STRUCTURED DATA</div>
                <pre className="text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "patient": "Soumik Chatterjee",
  "diagnosed_at": "2026-07-11T02:43:00Z",
  "extracted_compounds": [
    { "name": "Metformin", "conf": 0.99, "dose": "500mg" },
    { "name": "Amoxicillin", "conf": 0.98, "dose": "250mg" },
    { "name": "Atorvastatin", "conf": 0.96, "dose": "20mg" }
  ],
  "status": "CLASSIFIED"
}`}
                </pre>

                {/* Floating holographic floating pills representation */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {medicines.map((med, i) => (
                    <div
                      key={i}
                      style={{
                        animation: `float-slow ${3 + i}s ease-in-out infinite`
                      }}
                      className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-400/40 rounded-full text-[9px] text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    >
                      💊 {med.name} ({med.confidence})
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                <BarChart2 size={24} className="text-emerald-500/20" />
                <span>SYNC WITH RX RECORD BY HOVERING OVER THE RX CARD</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
