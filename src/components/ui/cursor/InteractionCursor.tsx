'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function InteractionCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mode = useGameStore(state => state.mouseMode);

  // Le CSS change automatiquement en fonction du "mode" choisi dans le store
  const getStyle = () => {
    switch (mode) {
      case 'COLLECT': return 'border-black border-dashed bg-transparent';
      case 'BUILD': return 'border-green-500 border-solid bg-green-500/10';
      case 'DESTROY': return 'border-red-500 border-solid bg-red-500/10';
      default: return 'border-black border-dashed';
    }
  };

  // On écoute la souris de manière optimisée sans faire lagger React
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // On déplace le cercle visuel
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 40}px, ${e.clientY - 40}px)`;
      }
      
      // On envoie discrètement la position au Cerveau (pour capter les photons)
      const vw = (e.clientX / window.innerWidth) * 100;
      const vh = (e.clientY / window.innerHeight) * 100;
      useGameStore.getState().setMousePosition(vw, vh);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-[80px] h-[80px] rounded-full border-[2px] pointer-events-none z-50 transition-colors duration-200 ${getStyle()}`}
      style={{ willChange: 'transform' }}
    />
  );
}