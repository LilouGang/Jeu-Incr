'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function InteractionCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mode = useGameStore(state => state.mouseMode);
  const isOpen = useGameStore(state => state.isSkillTreeOpen);
  const size = useGameStore(state => state.cursorSize); // <-- On lit la taille
  const [isVisible, setIsVisible] = useState(false);

  const getStyle = () => {
    switch (mode) {
      case 'COLLECT': return 'border-black border-dashed bg-transparent';
      case 'BUILD': return 'border-green-500 border-solid bg-green-500/10';
      case 'DESTROY': return 'border-red-500 border-solid bg-red-500/10';
      case 'IDLE': return 'border-transparent bg-transparent'; 
      default: return 'border-transparent bg-transparent';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      if (cursorRef.current) {
        // Le curseur reste parfaitement centré peu importe sa taille !
        cursorRef.current.style.transform = `translate(${e.clientX - (size / 2)}px, ${e.clientY - (size / 2)}px)`;
      }
      
      const vw = (e.clientX / window.innerWidth) * 100;
      const vh = (e.clientY / window.innerHeight) * 100;
      useGameStore.getState().setMousePosition(vw, vh);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, size]); // size est dans les dépendances

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 rounded-full border-[1px] pointer-events-none z-50 ${getStyle()}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        willChange: 'transform',
        opacity: (isVisible && !isOpen && mode !== 'IDLE') ? 1 : 0, 
        transition: 'opacity 150ms ease-out, background-color 200ms, border-color 200ms, width 300ms, height 300ms' // Transition fluide de la taille !
      }}
    />
  );
}