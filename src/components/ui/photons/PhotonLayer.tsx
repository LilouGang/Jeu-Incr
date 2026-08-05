'use client';

import { useGameStore } from '@/store/gameStore';

const CONFIG = {
  size: "w-1.5 h-1.5",
  color: "bg-yellow-400",
  glow: "rgba(250, 204, 21, 0.6)",
  glowSize: "12px",
  popDuration: "1s",
  popCurve: "ease-out",
  deathDuration: "200ms", // 0.2 secondes pour disparaître
};

export default function PhotonLayer() {
  const photons = useGameStore(state => state.photons);

  return (
    <>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        /* La NOUVELLE animation dédiée à la disparition */
        @keyframes shrinkOut {
          0% { transform: scale(1); }
          100% { transform: scale(0); }
        }
      `}</style>

      <div className="absolute inset-0 z-20 pointer-events-none">
        {photons.map(photon => (
          <div
            key={photon.id}
            className="absolute"
            style={{
              left: `${photon.x}vw`,
              top: `${photon.y}vh`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 100ms linear, top 100ms linear' // Seulement le mouvement !
            }}
          >
            <div
              className={`rounded-full ${CONFIG.size} ${CONFIG.color}`}
              style={{
                boxShadow: `0 0 ${CONFIG.glowSize} 3px ${CONFIG.glow}`,
                
                // Le secret est ici : on bascule d'une animation à l'autre proprement
                animation: photon.isCollected 
                  ? `shrinkOut ${CONFIG.deathDuration} ease-out forwards` 
                  : `popIn ${CONFIG.popDuration} ${CONFIG.popCurve} forwards`
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}