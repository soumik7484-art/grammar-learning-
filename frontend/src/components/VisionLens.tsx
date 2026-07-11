"use client";

import React, { useRef, useEffect } from 'react';
import { Camera, StopCircle, Maximize } from 'lucide-react';

interface VisionLensProps {
  isSharing: boolean;
  setIsSharing: (val: boolean) => void;
  onCapture: (base64: string) => void;
  loading: boolean;
}

const VisionLens: React.FC<VisionLensProps> = ({ isSharing, setIsSharing, onCapture, loading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsSharing(true);
        
        // Setup frame capture every 2 seconds
        intervalRef.current = setInterval(captureFrame, 2000);
      }

      stream.getVideoTracks()[0].onended = stopSharing;
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const stopSharing = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSharing(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.6);
      onCapture(base64);
    }
  };

  return (
    <div className="relative w-full aspect-video glass rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
      {/* HUD Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-4 bg-blue-500/50 rounded-full"></div>
            <div className="w-1.5 h-2 bg-blue-500/20 rounded-full"></div>
          </div>
          <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isSharing ? 'bg-red-500 animate-pulse' : 'bg-gray-700'}`}></div>
            {isSharing ? 'Live Transmission' : 'Signal Lost'}
          </div>
        </div>

        {isSharing && (
          <div className="flex justify-center">
             <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_4s_linear_infinite] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="text-[10px] font-mono text-white/20">
            LENS_REF: 4492-X<br />
            ISO: 800 | 60FPS
          </div>
          <div className="w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-2xl"></div>
        </div>
      </div>

      {/* Main Video View */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`w-full h-full object-cover transition-all duration-1000 ${isSharing ? 'opacity-100 scale-100' : 'opacity-10 scale-110 blur-3xl'}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading & Scan Indicators */}
      {loading && isSharing && (
        <div className="absolute top-8 right-8 z-30">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400">AI Syncing</span>
          </div>
        </div>
      )}

      {/* Control Overlay */}
      {!isSharing && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-12 text-center bg-black/20 backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 animate-pulse">
            <Camera className="text-blue-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Initialize Lens</h2>
          <p className="text-gray-400 max-w-sm mb-8">
            Begin live screen capture to enable real-time AI analysis and context understanding.
          </p>
          <button 
            onClick={startSharing}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Start Scan System
          </button>
        </div>
      )}

      {/* Footer Controls */}
      {isSharing && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all hover:scale-105">
           <button onClick={stopSharing} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
             <StopCircle size={24} />
           </button>
           <div className="h-6 w-[1px] bg-white/10"></div>
           <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors">
             <Maximize size={20} />
           </button>
        </div>
      )}
    </div>
  );
};

export default VisionLens;
