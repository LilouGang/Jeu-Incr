'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function DevMenu() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const energy = useGameStore(state => state.energy);

  // --- LOGIQUE DE DÉPLACEMENT ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // --- TRICHE ---
  const giveEnergy = (amount: number) => {
    // setState permet de forcer une valeur dans le store de l'extérieur !
    useGameStore.setState((state) => ({
      energy: state.energy + amount,
      hasCollectedFirst: true // Débloque l'UI principale automatiquement
    }));
  };

  return (
    <div 
      className="fixed z-[999] w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden font-mono text-xs select-none"
      style={{ left: position.x, top: position.y }}
    >
      {/* L'en-tête pour attraper le menu */}
      <div 
        className="bg-gray-800 text-gray-400 p-2 cursor-move border-b border-gray-700 flex justify-between items-center"
        onMouseDown={handleMouseDown}
      >
        <span className="font-bold text-yellow-500">DEV TOOLS</span>
        <span className="text-gray-500">≡</span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="text-white bg-black/50 p-1 text-center rounded">
          Solde: {Math.floor(energy)} ⚡
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            onClick={() => giveEnergy(100)}
            className="bg-blue-600 hover:bg-blue-500 text-white py-1 rounded transition-colors"
          >
            +100
          </button>
          <button 
            onClick={() => giveEnergy(1000)}
            className="bg-blue-700 hover:bg-blue-600 text-white py-1 rounded transition-colors"
          >
            +1k
          </button>
          <button 
            onClick={() => giveEnergy(10000)}
            className="bg-purple-600 hover:bg-purple-500 text-white py-1 rounded transition-colors col-span-2"
          >
            +10k
          </button>
        </div>
      </div>
    </div>
  );
}