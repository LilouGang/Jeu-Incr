'use client';

import GridBackground from '@/components/ui/grid/GridBackground';
import InteractionCursor from '@/components/ui/cursor/InteractionCursor';
import PhotonLayer from '@/components/ui/photons/PhotonLayer';
import EnergyPanel from '@/components/ui/panels/EnergyPanel';
import { GameLoop } from '@/components/logic/GameLoop';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const setMouseMode = useGameStore(state => state.setMouseMode);

  return (
    <main className="relative w-screen h-screen bg-white overflow-hidden cursor-none select-none">
      {/* 1. Le Moteur Logique (invisible) */}
      <GameLoop />

      {/* 2. Le Fond et la grille */}
      <GridBackground />

      {/* 3. Les Entités */}
      <PhotonLayer />

      {/* 4. Le Curseur */}
      <InteractionCursor />

      {/* 5. L'Interface UI */}
      <EnergyPanel />

      {/* Boutons de test temporaires */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button className="text-sm bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50" onClick={() => setMouseMode('COLLECT')}>Collecter</button>
        <button className="text-sm bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50 text-green-600" onClick={() => setMouseMode('BUILD')}>Construire</button>
        <button className="text-sm bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50 text-red-600" onClick={() => setMouseMode('DESTROY')}>Détruire</button>
      </div>
    </main>
  );
}