'use client';

import { useEffect } from 'react';
import GridBackground from '@/components/ui/grid/GridBackground';
import CentralStar from '@/components/ui/stars/CentralStar';
import DroneLayer from '@/components/ui/drones/DroneLayer';
import InteractionCursor from '@/components/ui/cursor/InteractionCursor';
import PhotonLayer from '@/components/ui/photons/PhotonLayer';
import EnergyPanel from '@/components/ui/panels/EnergyPanel';
import SkillTreePanel from '@/components/ui/panels/SkillTreePanel';
import DevMenu from '@/components/ui/dev/DevMenu';
import { GameLoop } from '@/components/logic/GameLoop';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const setMouseMode = useGameStore(state => state.setMouseMode);
  // On récupère la fonction pour ouvrir/fermer le menu de recherche
  const toggleSkillTree = useGameStore(state => state.toggleSkillTree); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') {
        // Appuyer sur 1 alterne entre "Récolte" et "Souris normale"
        const currentMode = useGameStore.getState().mouseMode;
        setMouseMode(currentMode === 'COLLECT' ? 'IDLE' : 'COLLECT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMouseMode]);

  return (
    <main className="fixed inset-0 bg-white overflow-hidden select-none">
      
      <GameLoop />
      <GridBackground />
      
      {/* 1. Les photons tout au fond */}
      <PhotonLayer />
      
      {/* 2. L'étoile se dessine par-dessus les photons */}
      <CentralStar />
      
      {/* 3. Les drones volent au-dessus de l'étoile */}
      <DroneLayer />
      
      {/* 4. L'interface (Souris, Menus) passe en tout premier plan */}
      <InteractionCursor />
      <EnergyPanel />
      <SkillTreePanel />

      <button 
        onClick={toggleSkillTree}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-gray-100/95 backdrop-blur-md border border-gray-300 border-l-0 px-2 py-5 rounded-r-xl shadow-md flex flex-col items-center gap-3 group transition-all duration-300 hover:pr-4 hover:bg-gray-200 cursor-pointer"
      >
        <svg className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <span 
          className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-black transition-colors uppercase" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Recherche
        </span>
      </button>
      <DevMenu />

    </main>
  );
}