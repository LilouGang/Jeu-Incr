'use client';

import { useGameStore } from '@/store/gameStore';

export default function EnergyPanel() {
  const energy = useGameStore(state => state.energy);
  const energyPerSecond = useGameStore(state => state.energyPerSecond);
  const hasCollectedFirst = useGameStore(state => state.hasCollectedFirst);

  if (!hasCollectedFirst) return null; // Ne s'affiche pas au tout début

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 px-12 py-4 rounded-2xl shadow-lg flex flex-col items-center animate-in fade-in slide-in-from-top-4">
      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
        Énergie
      </span>
      <span className="text-4xl font-black text-black tracking-tighter">
        {energy.toLocaleString()}
      </span>
      <span className="text-xs font-semibold text-gray-500 mt-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
        + {energyPerSecond} / sec
      </span>
    </div>
  );
}