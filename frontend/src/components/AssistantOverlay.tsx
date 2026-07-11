"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Zap, Target } from 'lucide-react';

interface AssistantOverlayProps {
  data: any;
  isSharing: boolean;
}

const AssistantOverlay: React.FC<AssistantOverlayProps> = ({ data, isSharing }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isSharing) return null;

  return (
    <div className="fixed bottom-10 left-10 z-[100]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 1000, top: -1000, bottom: 0 }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="w-80 glass rounded-3xl p-6 shadow-2xl border border-white/10 bg-black/60 cursor-grab active:cursor-grabbing overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Target className="text-blue-500" size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Vision Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {data ? (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Live Sight</span>
                    <p className="text-xs text-gray-300 leading-relaxed truncate">
                      {data.summary}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Top Objects</span>
                    <div className="flex flex-wrap gap-2">
                      {data.objects?.slice(0, 3).map((obj: string, i: number) => (
                        <span key={i} className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/10">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Ask Follow-up
                  </button>
                </>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center gap-3">
                   <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] text-gray-500">Awaiting visual stream...</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-110 transition-transform"
          >
            <MessageCircle className="text-white" size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';

export default AssistantOverlay;
