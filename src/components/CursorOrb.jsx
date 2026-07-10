import React, { useEffect, useState, useRef } from 'react';

export default function CursorOrb() {
  const orbRef  = useRef(null);
  const ringRef = useRef(null);
  const [isHovered,  setIsHovered]  = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const orbPos   = useRef({ x: -100, y: -100 });
  const ringPos  = useRef({ x: -100, y: -100 });

  useEffect(() => {
    document.body.classList.add('custom-cursor-active');

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      const target = e.target;
      setIsHovered(!!target.closest('button, a, input, textarea, [data-interactive]'));

      const mag = target.closest('[data-magnetic]');
      if (mag) {
        const r = mag.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        mousePos.current = { x: cx + (e.clientX - cx) * 0.35, y: cy + (e.clientY - cy) * 0.35 };
        mag.style.transform = `translate(${(e.clientX - cx) * 0.2}px, ${(e.clientY - cy) * 0.2}px)`;
      }
    };
    const onMouseOut = (e) => {
      const mag = e.target.closest('[data-magnetic]');
      if (mag) mag.style.transform = '';
    };
    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseout', onMouseOut);

    let id;
    const tick = () => {
      orbPos.current.x  += (mousePos.current.x - orbPos.current.x)  * 0.28;
      orbPos.current.y  += (mousePos.current.y - orbPos.current.y)  * 0.28;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      if (orbRef.current)  orbRef.current.style.transform  = `translate3d(${orbPos.current.x}px,${orbPos.current.y}px,0) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringPos.current.x}px,${ringPos.current.y}px,0) translate(-50%,-50%)`;
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <>
      {/* Core orb — violet/blue gradient */}
      <div ref={orbRef} className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-screen"
        style={{
          width: isHovered ? '18px' : '10px',
          height: isHovered ? '18px' : '10px',
          background: isClicking
            ? 'radial-gradient(circle, #f43f5e, #ec4899)'
            : 'radial-gradient(circle, #a78bfa, #60a5fa)',
          boxShadow: isClicking
            ? '0 0 14px #f43f5e, 0 0 28px #ec4899'
            : '0 0 10px #8b5cf6, 0 0 20px #3b82f6',
          transition: 'width 0.15s, height 0.15s, box-shadow 0.15s',
        }}
      />
      {/* Outer ring — cyan, lags behind */}
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full mix-blend-screen"
        style={{
          width: isHovered ? '52px' : '32px',
          height: isHovered ? '52px' : '32px',
          border: isHovered ? '1.5px dashed #06b6d4' : '1px solid rgba(99,102,241,0.5)',
          boxShadow: '0 0 8px rgba(99,102,241,0.25)',
          animation: isHovered ? 'spin 4s linear infinite' : 'none',
          transition: 'width 0.25s, height 0.25s',
        }}
      />
    </>
  );
}
