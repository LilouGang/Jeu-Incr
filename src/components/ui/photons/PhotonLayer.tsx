'use client';

import { useGameStore } from '@/store/gameStore';

export default function PhotonLayer() {
  // On récupère uniquement la liste des photons depuis le store
  const photons = useGameStore(state => state.photons);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {photons.map(photon => (
        <div
          key={photon.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_12px_3px_rgba(250,204,21,0.6)]"
          style={{
            left: `${photon.x}vw`,
            top: `${photon.y}vh`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 100ms linear, top 100ms linear' // Mouvement fluide
          }}
        />
      ))}
    </div>
  );
}