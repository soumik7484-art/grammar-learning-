"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, Search, MessageSquare, Zap, Copy, Layers, Maximize, Mic } from 'lucide-react';
import AssistantOverlay from '../components/AssistantOverlay';
import VisionLens from '../components/VisionLens';

export default function Home() {
  const [isSharing, setIsSharing] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [status, setStatus] = useState("Ready to Scan");
  const [loading, setLoading] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket with dynamic hostname
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    socketRef.current = new WebSocket(`${protocol}//${host}:5001`);
    
    console.log('Connecting to WebSocket:', `${protocol}//${host}:5001`);
    
    socketRef.current.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'result') {
        setAiData(data);
        setLoading(false);
        setStatus("Live Sync Active");
      }
    };

    return () => socketRef.current?.close();
  }, []);

  const sendFrame = (base64Image: string, query?: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setLoading(true);
      socketRef.current.send(JSON.stringify({
        type: 'analyze',
        image: base64Image,
        query: query
      }));
    }
  };

  return (
    <main className="min-h-screen bg-[#020205] text-white overflow-hidden relative font-sans">
      {/* Background Animated Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Top Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">VisionAI <span className="text-blue-400">Live</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{status}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Analyzer</a>
            <a href="#" className="hover:text-white transition-colors">History</a>
            <a href="#" className="hover:text-white transition-colors">Settings</a>
          </div>
          <button className="bg-white/5 hover:bg-white/10 px-5 py-2 rounded-full text-sm font-semibold border border-white/10 transition-all">
            Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-12 px-6 pb-24">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Vision Lens */}
          <div className="lg:col-span-8 space-y-6">
            <VisionLens 
              isSharing={isSharing} 
              setIsSharing={setIsSharing} 
              onCapture={sendFrame} 
              loading={loading}
            />
          </div>

          {/* Right Column: Live Insights */}
          <div className="lg:col-span-4 space-y-6">
            <AnimatePresence mode="wait">
              {aiData ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl bg-white/5">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Zap size={14} /> Scene Summary
                    </h3>
                    <p className="text-lg font-medium leading-relaxed text-gray-200">
                      {aiData.summary}
                    </p>
                  </div>

                  {/* Detected Text Card */}
                  <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl bg-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare size={14} /> Detected Text
                      </h3>
                      <button className="text-gray-500 hover:text-white transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto text-sm text-gray-400 leading-relaxed custom-scrollbar">
                      {aiData.detected_text || "No text detected in current frame."}
                    </div>
                  </div>

                  {/* Smart Actions */}
                  <div className="grid grid-cols-1 gap-3">
                    {aiData.suggestions?.map((s: string, i: number) => (
                      <button key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{s}</span>
                        <Zap size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-[32px] border border-white/5 bg-white/2">
                   <Layers className="text-gray-700 mb-4" size={48} />
                   <h3 className="text-gray-500 font-medium">Insights will appear here once you start scanning.</h3>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Assistant Component */}
      <AssistantOverlay data={aiData} isSharing={isSharing} />
    </main>
  );
}
