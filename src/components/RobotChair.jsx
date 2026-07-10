import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, Send, RefreshCw } from 'lucide-react';

export default function RobotChair() {
  const containerRef = useRef(null);
  const robotRef = useRef(null);
  const [isNear, setIsNear] = useState(false);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Greeting protocol loaded. I am Soumik\'s robotic assistant.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
      setIsNear(near);

      // Track cursor position to translate head/eyes
      const angle = Math.atan2(dy, dx);
      const strength = 12;
      setRobotPos({
        x: Math.cos(angle) * strength,
        y: Math.sin(angle) * strength
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = inputText;
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "That sounds fascinating! Soumik specializes in designing highly responsive frameworks.";
      if (userMsg.toLowerCase().includes('skill') || userMsg.toLowerCase().includes('tech')) {
        botResponse = "Soumik Chatterjee commands expertise in Python, TensorFlow, React, Node.js, and MongoDB!";
      } else if (userMsg.toLowerCase().includes('contact') || userMsg.toLowerCase().includes('email')) {
        botResponse = "You can contact Soumik via the satellite terminal below or at soumik7484@gmail.com.";
      }
      setChatMessages((prev) => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section
      className="relative min-h-screen w-full bg-[#020202] py-20 px-6 border-b border-emerald-500/10 flex flex-col justify-center items-center overflow-hidden grid-matrix-dense"
    >
      {/* HUD Bar */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-mono text-emerald-500/60 uppercase">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>SEC_07 // AI_COMPANION_ROBOT</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Floating Cute AI Robot on Chair */}
        <div className="flex flex-col items-center justify-center relative min-h-[400px]">
          {/* Holographic Speech Bubble */}
          <div
            className={`absolute top-0 glass-panel border border-emerald-400/40 rounded-2xl p-4 font-mono text-xs text-emerald-300 max-w-xs transition-all duration-500 ${
              isNear ? 'opacity-100 translate-y-0 scale-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <div className="scanline" />
            <span>🤖 "Hello! Ask me anything."</span>
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-950 border-r border-b border-emerald-500/40 rotate-45" />
          </div>

          {/* Chair & Robot Container */}
          <div className="w-64 h-80 relative flex items-center justify-center animate-float-slow mt-12">
            <svg viewBox="0 0 200 250" className="w-full h-full text-emerald-400">
              {/* Sci-Fi Chair (Gaming style) */}
              <path d="M50,170 Q100,160 150,170 L140,240 Q100,250 60,240 Z" fill="rgba(16, 185, 129, 0.05)" stroke="currentColor" strokeWidth="2.5" />
              <path d="M40,110 L40,170 M160,110 L160,170" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="200" x2="100" y2="245" stroke="currentColor" strokeWidth="3" />
              <path d="M70,245 L130,245" stroke="currentColor" strokeWidth="3" />

              {/* Robot Head (looks at cursor) */}
              <g style={{ transform: `translate(${robotPos.x}px, ${robotPos.y}px)` }} className="transition-transform duration-200 ease-out">
                {/* Robot Helmet */}
                <rect x="70" y="60" width="60" height="50" rx="15" fill="#020503" stroke="currentColor" strokeWidth="2.5" />
                {/* Screen face */}
                <rect x="78" y="68" width="44" height="34" rx="8" fill="rgba(16, 185, 129, 0.1)" stroke="currentColor" strokeWidth="1.5" />
                
                {/* Glowing Eyes (Blinking animation + tracking cursor) */}
                <g className="animate-[blink_4s_infinite]">
                  <circle cx={88 + robotPos.x * 0.4} cy={82 + robotPos.y * 0.4} r="3.5" fill="currentColor" />
                  <circle cx={112 + robotPos.x * 0.4} cy={82 + robotPos.y * 0.4} r="3.5" fill="currentColor" />
                </g>

                {/* Mouth: straight line vs curve smile */}
                {isNear ? (
                  <path d="M92,95 Q100,102 108,95" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <line x1="94" y1="96" x2="106" y2="96" stroke="currentColor" strokeWidth="1.5" />
                )}

                {/* Ears */}
                <circle cx="67" cy="85" r="4" fill="currentColor" />
                <circle cx="133" cy="85" r="4" fill="currentColor" />

                {/* Antenna */}
                <line x1="100" y1="60" x2="100" y2="45" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="42" r="3.5" fill="currentColor" className="animate-pulse" />
              </g>

              {/* Robot Torso */}
              <rect x="78" y="115" width="44" height="40" rx="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="135" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ping" />

              {/* Arms (Left arm idle, Right arm waves if hovered near) */}
              <path d="M72,120 Q55,140 65,160" fill="none" stroke="currentColor" strokeWidth="2" />

              {isNear ? (
                // Right arm waves
                <path
                  d="M128,120 Q150,100 145,75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="origin-[128px_120px] animate-[wave_1.2s_ease-in-out_infinite]"
                />
              ) : (
                // Right arm idle
                <path d="M128,120 Q145,140 135,160" fill="none" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </div>
        </div>

        {/* Right Side: Chatbot Console Terminal */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl border border-emerald-500/20 p-5 min-h-[350px] flex flex-col justify-between overflow-hidden relative">
            <div className="scanline" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <MessageSquare size={14} />
                <span>ASSISTANT_TERM_v1.0</span>
              </div>
              
              {/* Microphone glows active if bot is answering or user hovers */}
              <div className={`p-1.5 rounded-full border ${isNear ? 'border-red-500/35 bg-red-950/20 text-red-400 animate-pulse' : 'border-emerald-500/20 text-emerald-400'}`}>
                <Mic size={12} />
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-2 font-mono text-[11px] text-left leading-relaxed">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-xl border ${
                    msg.role === 'bot'
                      ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300 mr-8'
                      : 'bg-black/60 border-slate-800 text-white ml-8'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                    {msg.role === 'bot' ? 'Robot' : 'You'}
                  </span>
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="p-2.5 bg-emerald-950/10 border border-emerald-500/20 rounded-xl mr-8 text-emerald-400 animate-pulse">
                  <span>Robot is typing...</span>
                </div>
              )}
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 border-t border-emerald-500/10 pt-3">
              <input
                type="text"
                data-interactive
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about Soumik's skills or contact..."
                className="flex-1 bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 placeholder-emerald-900"
              />
              <button
                type="submit"
                data-magnetic
                data-interactive
                className="p-2 bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>
    </section>
  );
}
