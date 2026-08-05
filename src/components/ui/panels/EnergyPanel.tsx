'use client';

import { useGameStore } from '@/store/gameStore';

export default function EnergyPanel() {
  const energy = useGameStore(state => state.energy);
  const energyPerSecond = useGameStore(state => state.energyPerSecond);
  const hasCollectedFirst = useGameStore(state => state.hasCollectedFirst);

  if (!hasCollectedFirst) return null; 

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 bg-gray-100/95 backdrop-blur-md border-b border-x border-gray-300 px-6 py-2 rounded-b-xl shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-full duration-500">
      
      {/* L'éclair brut, sans fioritures */}
      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
      
      <div className="flex items-baseline gap-2 ml-1">
        <span className="text-2xl font-black text-black tracking-tight">
          {energy.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-gray-500">
          +{energyPerSecond}/s
        </span>
      </div>

    </div>
  );
}